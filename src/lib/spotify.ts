/* Shared Spotify helpers for the API routes. Auth is the refresh-token flow;
   see docs/spotify.md for the one-time setup. */

const TOKEN_URL = "https://accounts.spotify.com/api/token";

/** Playlists to hide from the Music page (by id). */
export const HIDDEN_PLAYLIST_IDS = new Set<string>(["4VvcVAl8ecM2D8lrVbJQSO"]);

export function spotifyConfigured(): boolean {
  return Boolean(
    process.env.SPOTIFY_CLIENT_ID &&
      process.env.SPOTIFY_CLIENT_SECRET &&
      process.env.SPOTIFY_REFRESH_TOKEN
  );
}

// Access tokens are valid ~1h; cache in memory so we don't re-auth on every
// request (each Music-page navigation hits several routes).
let cachedToken: { value: string; expiresAt: number } | null = null;

/** Exchange the stored refresh token for a fresh access token (cached). */
export async function getAccessToken(): Promise<string | null> {
  if (cachedToken && Date.now() < cachedToken.expiresAt) return cachedToken.value;

  const id = process.env.SPOTIFY_CLIENT_ID;
  const secret = process.env.SPOTIFY_CLIENT_SECRET;
  const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN;
  if (!id || !secret || !refreshToken) return null;

  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${id}:${secret}`).toString("base64")}`,
      "content-type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }),
    cache: "no-store",
  });
  if (!res.ok) return null;
  const data = await res.json();
  const token = (data.access_token as string) ?? null;
  if (token) {
    const ttl = (data.expires_in ?? 3600) * 1000 - 60_000; // refresh 1m early
    cachedToken = { value: token, expiresAt: Date.now() + ttl };
  }
  return token;
}

// Short-lived in-memory cache for the (rarely-changing) library/playlist data,
// so navigating around the Music page doesn't re-hit Spotify every time.
const responseCache = new Map<string, { value: unknown; expiresAt: number }>();

/** Memoize an async result for `ttlMs` by key (per server instance). */
export async function cached<T>(key: string, ttlMs: number, fn: () => Promise<T>): Promise<T> {
  const hit = responseCache.get(key);
  if (hit && Date.now() < hit.expiresAt) return hit.value as T;
  const value = await fn();
  responseCache.set(key, { value, expiresAt: Date.now() + ttlMs });
  return value;
}

/** GET a Spotify Web API path with the given access token. */
export function spotifyGet(path: string, token: string): Promise<Response> {
  return fetch(`https://api.spotify.com/v1${path}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
}
