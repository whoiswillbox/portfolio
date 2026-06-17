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

/* eslint-disable @typescript-eslint/no-explicit-any */
const names = (a: any[]) => (a ?? []).map((x) => x.name).join(", ");

/**
 * A compact, plain-text summary of my real listening (top artists/tracks,
 * recently played, playlists, what's playing now) for grounding Box AI's
 * music answers. Cached ~5m so a chat session doesn't re-hit Spotify per turn.
 * Returns null when Spotify isn't configured.
 */
export async function getMusicSummary(): Promise<string | null> {
  if (!spotifyConfigured()) return null;
  return cached("music-summary", 300_000, async () => {
    const token = await getAccessToken();
    if (!token) return null;

    const get = (p: string) => spotifyGet(p, token).then((r) => (r.ok ? r.json() : null));
    const [topT, topA, topAMid, topALong, topTLong, recent, playlists, now] = await Promise.all([
      get("/me/top/tracks?limit=10&time_range=short_term"),
      get("/me/top/artists?limit=10&time_range=short_term"),
      get("/me/top/artists?limit=10&time_range=medium_term"),
      get("/me/top/artists?limit=15&time_range=long_term"),
      get("/me/top/tracks?limit=10&time_range=long_term"),
      get("/me/player/recently-played?limit=10"),
      get("/me/playlists?limit=20"),
      get("/me/player/currently-playing"),
    ]);

    const lines: string[] = [];
    const topArtists = (topA?.items ?? []).map((a: any) => a.name);
    if (topArtists.length) lines.push(`Top artists in the last ~4 weeks: ${topArtists.join(", ")}.`);

    const topTracks = (topT?.items ?? []).map((t: any) => `"${t.name}" by ${names(t.artists)}`);
    if (topTracks.length) lines.push(`Top tracks in the last ~4 weeks: ${topTracks.join("; ")}.`);

    const topArtistsMid = (topAMid?.items ?? []).map((a: any) => a.name);
    if (topArtistsMid.length) lines.push(`Top artists over the last ~6 months: ${topArtistsMid.join(", ")}.`);

    // long_term ≈ several years / all-time — the closest API equivalent to a
    // "last year" / Wrapped-style answer (Spotify has no Wrapped API).
    const topArtistsLong = (topALong?.items ?? []).map((a: any) => a.name);
    if (topArtistsLong.length)
      lines.push(`Top artists of all time (past year and beyond): ${topArtistsLong.join(", ")}.`);

    const topTracksLong = (topTLong?.items ?? []).map((t: any) => `"${t.name}" by ${names(t.artists)}`);
    if (topTracksLong.length)
      lines.push(`Top tracks of all time (past year and beyond): ${topTracksLong.join("; ")}.`);

    const recentTracks = (recent?.items ?? [])
      .map((i: any) => i.track)
      .filter(Boolean)
      .map((t: any) => `"${t.name}" by ${names(t.artists)}`);
    if (recentTracks.length) lines.push(`Recently played: ${recentTracks.join("; ")}.`);

    const playlistNames = (playlists?.items ?? [])
      .filter((p: any) => p && !HIDDEN_PLAYLIST_IDS.has(p.id))
      .map((p: any) => p.name);
    if (playlistNames.length) lines.push(`My playlists: ${playlistNames.join(", ")}.`);

    if (now?.item && now.currently_playing_type === "track") {
      lines.push(`Right now I'm playing "${now.item.name}" by ${names(now.item.artists)}.`);
    }

    return lines.length ? lines.join("\n") : null;
  });
}
