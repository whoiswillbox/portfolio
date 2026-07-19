import { Redis } from "@upstash/redis";

/* Append-only chat log in Upstash. Records each AI chat exchange so the owner
   can see what visitors ask (and roughly who). No-ops if Upstash isn't set. */

const redis =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? Redis.fromEnv()
    : null;

const KEY = "chat:log";
const MAX = 500; // keep the most recent N entries

const FEEDBACK_KEY = "chat:feedback";
const FEEDBACK_MAX = 500;

export type ChatLogEntry = {
  t: string; // ISO timestamp
  q: string; // visitor's question
  a: string; // bot's reply
  country?: string;
  city?: string;
  region?: string; // x-vercel-ip-country-region — state/province code (e.g. "CA")
  lat?: string; // x-vercel-ip-latitude — approximate (ISP-node precision), for a map link
  lon?: string; // x-vercel-ip-longitude
  ip?: string; // short hash, not the raw IP
  c?: string; // conversation id — groups a visitor's back-and-forth into a thread
  page?: string; // pathname the visitor was on when they sent this message
  device?: "Desktop" | "Mobile" | "Tablet";
  os?: string; // coarse OS name (e.g. "iOS", "Mac", "Windows", "Android")
  referrer?: string; // where the visitor came from — a hostname (e.g. "linkedin.com"), "Direct", or "Search" for known search engines
};

/** SHA-256 the IP so we can count unique visitors without storing the raw IP. */
export async function hashIp(ip: string): Promise<string> {
  const data = new TextEncoder().encode(`v1:${ip}`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
    .slice(0, 12);
}

/** Coarse device/OS classification from the User-Agent header — enough to
    bucket like Vercel Analytics' Devices/OS panels, not a full UA parse. */
export function parseUserAgent(ua: string | null): { device: ChatLogEntry["device"]; os?: string } {
  if (!ua) return { device: undefined, os: undefined };
  const isTablet = /iPad|Tablet(?!.*Mobile)/i.test(ua);
  const isMobile = !isTablet && /Mobi|iPhone|Android.*Mobile/i.test(ua);
  const device = isTablet ? "Tablet" : isMobile ? "Mobile" : "Desktop";

  let os: string | undefined;
  if (/iPhone|iPad|iPod/i.test(ua)) os = "iOS";
  else if (/Mac OS X/i.test(ua)) os = "Mac";
  else if (/Android/i.test(ua)) os = "Android";
  else if (/Windows/i.test(ua)) os = "Windows";
  else if (/Linux/i.test(ua)) os = "Linux";

  return { device, os };
}

const SEARCH_ENGINES = ["google.", "bing.", "duckduckgo.", "yahoo.", "baidu.", "yandex."];

/** Coarse referrer classification — a bare hostname for external sites (e.g.
    "linkedin.com"), "Search" for known search engines, "Direct" when there's
    no referrer at all (typed URL, bookmark, or a link that stripped it). */
export function parseReferrer(referrer: string | undefined): string | undefined {
  if (!referrer) return "Direct";
  try {
    const host = new URL(referrer).hostname.replace(/^www\./, "");
    if (SEARCH_ENGINES.some((s) => host.includes(s))) return "Search";
    return host;
  } catch {
    return undefined;
  }
}

export async function logChat(entry: ChatLogEntry): Promise<void> {
  if (!redis) return;
  try {
    await redis.lpush(KEY, entry); // Upstash serializes the object
    await redis.ltrim(KEY, 0, MAX - 1);
  } catch {
    /* logging must never break the chat */
  }
}

export async function getChatLog(limit = 200): Promise<ChatLogEntry[]> {
  if (!redis) return [];
  try {
    return await redis.lrange<ChatLogEntry>(KEY, 0, limit - 1);
  } catch {
    return [];
  }
}

/** Delete one thread from the log — either every entry sharing a
    conversation id (a real multi-message conversation), or a single entry
    identified by its exact timestamp (a one-off "solo" message, which has no
    conversation id of its own).

    Redis lists have no delete-by-index that's safe under concurrent writers,
    so this reads the whole list, filters out the target thread, and
    rewrites it in one transaction. Safe here because chat-log has exactly
    one writer (logChat, append-only) besides this — no risk of a push racing
    the rewrite and getting silently dropped mid-transaction is acceptable at
    this log's scale (capped at MAX entries, admin-only, low frequency). */
export async function deleteChatThread(target: { conversationId: string } | { timestamp: string }): Promise<void> {
  if (!redis) return;
  try {
    const all = await redis.lrange<ChatLogEntry>(KEY, 0, -1);
    const kept = all.filter((e) =>
      "conversationId" in target ? e.c !== target.conversationId : e.t !== target.timestamp
    );
    if (kept.length === all.length) return; // nothing matched, don't touch the list
    const tx = redis.multi();
    tx.del(KEY);
    if (kept.length > 0) tx.rpush(KEY, ...kept);
    await tx.exec();
  } catch {
    /* best-effort — a failed delete just leaves the thread in place */
  }
}

export type FeedbackEntry = {
  t: string; // ISO timestamp
  c?: string; // conversation id
  q?: string; // the question that prompted the rated answer
  a?: string; // the rated answer
  rating: "up" | "down";
  feedback?: string; // optional text from the feedback modal
  country?: string;
  city?: string;
  ip?: string; // short hash, not the raw IP
};

/** Record a thumbs up/down on an AI answer. No-ops if Upstash isn't set. */
export async function logFeedback(entry: FeedbackEntry): Promise<void> {
  if (!redis) return;
  try {
    await redis.lpush(FEEDBACK_KEY, entry);
    await redis.ltrim(FEEDBACK_KEY, 0, FEEDBACK_MAX - 1);
  } catch {
    /* feedback logging must never break the chat */
  }
}

export async function getFeedback(limit = 200): Promise<FeedbackEntry[]> {
  if (!redis) return [];
  try {
    return await redis.lrange<FeedbackEntry>(FEEDBACK_KEY, 0, limit - 1);
  } catch {
    return [];
  }
}
