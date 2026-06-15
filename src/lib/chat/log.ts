import { Redis } from "@upstash/redis";

/* Append-only chat log in Upstash. Records each AI chat exchange so the owner
   can see what visitors ask (and roughly who). No-ops if Upstash isn't set. */

const redis =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? Redis.fromEnv()
    : null;

const KEY = "chat:log";
const MAX = 500; // keep the most recent N entries

export type ChatLogEntry = {
  t: string; // ISO timestamp
  q: string; // visitor's question
  a: string; // bot's reply
  country?: string;
  city?: string;
  ip?: string; // short hash, not the raw IP
  c?: string; // conversation id — groups a visitor's back-and-forth into a thread
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
