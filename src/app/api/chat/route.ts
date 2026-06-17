import Anthropic from "@anthropic-ai/sdk";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { qaEntries } from "@/lib/chat/repository";
import { logChat, hashIp } from "@/lib/chat/log";
import { getMusicSummary } from "@/lib/spotify";
import { EMAIL, LINKEDIN_URL, SITE_URL, CONTACT_MARKER } from "@/lib/contact";

/* ============================================================================
   Chat API — grounded LLM replies as Will, with per-IP rate limiting.

   Env vars (set in Vercel / .env.local):
     ANTHROPIC_API_KEY         — required. Without it this route returns 501
                                  and the client falls back to local matching.
     UPSTASH_REDIS_REST_URL    — optional. If both Upstash vars are set, per-IP
     UPSTASH_REDIS_REST_TOKEN    rate limiting is enforced (20 messages/day).

   Also set a monthly spend cap in the Anthropic console as the hard ceiling.
   ========================================================================== */

const MODEL = "claude-haiku-4-5";
const MAX_INPUT_CHARS = 500; // reject overly long visitor messages
const MAX_HISTORY = 12; // only send the last N turns to bound token cost

// Build the knowledge base from the curated repository so it stays in sync.
const KNOWLEDGE_BASE = qaEntries
  .map((e) => {
    const answer = Array.isArray(e.answer) ? e.answer[0] : e.answer;
    return `Q: ${e.question}\nA: ${answer}`;
  })
  .join("\n\n");

const SYSTEM_PROMPT = `You are Will Box, a product designer turned vibe coder, answering questions about yourself on your personal portfolio site. Always speak in the first person ("I", "my").

Use ONLY the facts in the knowledge base below (plus the MY MUSIC section when present). If a question isn't covered there, say you're not sure and point them to your email (${EMAIL}) or LinkedIn (${LINKEDIN_URL}). Never invent facts about yourself.

For music questions (favorite artists, genres, what I'm into or listening to), ground your answer in the MY MUSIC section if it's present — it's my real, live Spotify data. Pull out specifics (name actual artists, tracks, or playlists) rather than speaking generically, but keep it to 1-3 conversational sentences and don't just dump the whole list.

Keep replies short, warm, and conversational — usually 1-3 sentences. Match the friendly, slightly playful tone of the knowledge base. It's fine to use the occasional emoji.

CONTACT: My email is ${EMAIL}, my LinkedIn is ${LINKEDIN_URL}, and my site is ${SITE_URL}. When someone asks how to reach me (or for my email, LinkedIn, or site), reply with one short friendly sentence like "Here are some ways you can reach me!" and end your reply with the exact token ${CONTACT_MARKER}. Do NOT type out the email, links, or URLs yourself — a contact card showing them is rendered automatically whenever that token is present.

FAVORITE PROJECT: When someone asks about my favorite project (or my proudest/best work), my answer is Next Gen Bar Prep — the adaptive bar-exam platform I led at BARBRI. Reply with one short friendly sentence and end your reply with the exact token [[case-study:next-gen-bar]]. A detailed case-study card is rendered automatically when that token is present, so don't list the details yourself.

KNOWLEDGE BASE:
${KNOWLEDGE_BASE}`;

// Per-IP rate limit — only active when Upstash is configured.
const ratelimit =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Ratelimit({
        redis: Redis.fromEnv(),
        limiter: Ratelimit.fixedWindow(20, "1 d"),
        prefix: "chat",
      })
    : null;

type ClientMessage = { role: "user" | "assistant"; content: string };

export async function POST(request: Request) {
  // No API key configured → tell the client to fall back to local matching.
  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json({ error: "not_configured" }, { status: 501 });
  }

  // Per-IP rate limiting.
  if (ratelimit) {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "anonymous";
    const { success } = await ratelimit.limit(ip);
    if (!success) {
      return Response.json({ error: "rate_limited" }, { status: 429 });
    }
  }

  let body: { messages?: ClientMessage[]; conversationId?: string };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "bad_request" }, { status: 400 });
  }
  const conversationId =
    typeof body.conversationId === "string" ? body.conversationId.slice(0, 64) : undefined;

  const messages = (body.messages ?? [])
    .filter((m) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
    .slice(-MAX_HISTORY)
    .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_INPUT_CHARS) }));

  if (messages.length === 0 || messages[messages.length - 1].role !== "user") {
    return Response.json({ error: "bad_request" }, { status: 400 });
  }

  try {
    // Ground music answers in real, live Spotify data when it's configured.
    const musicSummary = await getMusicSummary().catch(() => null);
    const system = musicSummary
      ? `${SYSTEM_PROMPT}\n\nMY MUSIC (live from my Spotify):\n${musicSummary}`
      : SYSTEM_PROMPT;

    const client = new Anthropic();
    const response = await client.messages.create({
      model: MODEL,
      max_tokens: 400,
      system,
      messages,
    });
    const reply = response.content
      .filter((b): b is Anthropic.TextBlock => b.type === "text")
      .map((b) => b.text)
      .join("")
      .trim();
    // Track token usage server-side (not shown to visitors).
    console.log("chat usage:", {
      input_tokens: response.usage.input_tokens,
      output_tokens: response.usage.output_tokens,
    });

    // Log the exchange (question, reply, rough location, hashed IP).
    const ipRaw = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
    const city = request.headers.get("x-vercel-ip-city");
    await logChat({
      t: new Date().toISOString(),
      q: messages[messages.length - 1].content.slice(0, 300),
      a: reply.slice(0, 300),
      country: request.headers.get("x-vercel-ip-country") ?? undefined,
      city: city ? decodeURIComponent(city) : undefined,
      ip: ipRaw ? await hashIp(ipRaw) : undefined,
      c: conversationId,
    });

    return Response.json({ reply, usage: response.usage });
  } catch (err) {
    console.error("chat api error:", err);
    return Response.json({ error: "upstream" }, { status: 502 });
  }
}
