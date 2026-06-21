import Anthropic from "@anthropic-ai/sdk";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { buildSystemPrompt } from "@/lib/chat/knowledge";
import { logChat, hashIp } from "@/lib/chat/log";
import { getMusicSummary } from "@/lib/spotify";

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
    const musicSummary = await getMusicSummary().catch(() => null);
    const system = buildSystemPrompt(musicSummary);
    const client = new Anthropic();

    const stream = await client.messages.stream({
      model: MODEL,
      max_tokens: 400,
      system,
      messages,
    });

    const ipRaw = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
    const city = request.headers.get("x-vercel-ip-city");
    const question = messages[messages.length - 1].content.slice(0, 300);

    const readable = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        let fullText = "";

        for await (const event of stream) {
          if (
            event.type === "content_block_delta" &&
            event.delta.type === "text_delta"
          ) {
            const chunk = event.delta.text;
            fullText += chunk;
            controller.enqueue(encoder.encode(chunk));
          }
        }

        const finalMessage = await stream.finalMessage();
        console.log("chat usage:", {
          input_tokens: finalMessage.usage.input_tokens,
          output_tokens: finalMessage.usage.output_tokens,
        });

        // Generate follow-up suggestions based on the conversation
        try {
          const suggestionMsg = await client.messages.create({
            model: MODEL,
            max_tokens: 80,
            system: "You generate short follow-up question suggestions. Reply with ONLY a JSON array of 2-3 short questions (under 8 words each) the user might want to ask next, based on the conversation. No explanation, just the JSON array.",
            messages: [
              ...messages,
              { role: "assistant", content: fullText },
              { role: "user", content: "Give me 2-3 short follow-up questions I might ask." },
            ],
          });
          const raw = suggestionMsg.content[0].type === "text" ? suggestionMsg.content[0].text.trim() : "[]";
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) {
            controller.enqueue(encoder.encode(`\n\n__SUGGESTIONS__${JSON.stringify(parsed)}`));
          }
        } catch {
          // suggestions are best-effort
        }

        await logChat({
          t: new Date().toISOString(),
          q: question,
          a: fullText.slice(0, 300),
          country: request.headers.get("x-vercel-ip-country") ?? undefined,
          city: city ? decodeURIComponent(city) : undefined,
          ip: ipRaw ? await hashIp(ipRaw) : undefined,
          c: conversationId,
        });

        controller.close();
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "X-Content-Type-Options": "nosniff",
        "Transfer-Encoding": "chunked",
      },
    });
  } catch (err) {
    console.error("chat api error:", err);
    return Response.json({ error: "upstream" }, { status: 502 });
  }
}
