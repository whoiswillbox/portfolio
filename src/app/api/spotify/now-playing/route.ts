/* ============================================================================
   Spotify "now playing" — returns what Will is currently listening to, falling
   back to the most recently played track.

   Env vars (set in Vercel / .env.local):
     SPOTIFY_CLIENT_ID       — required
     SPOTIFY_CLIENT_SECRET   — required
     SPOTIFY_REFRESH_TOKEN   — required (one-time OAuth; see docs/spotify.md)

   Without them the route returns { configured: false } and the UI shows a
   graceful placeholder (same pattern as the chat route on localhost).
   ========================================================================== */

export const dynamic = "force-dynamic"; // never cache; this is live state

const TOKEN_URL = "https://accounts.spotify.com/api/token";
const NOW_PLAYING_URL = "https://api.spotify.com/v1/me/player/currently-playing";
const RECENT_URL = "https://api.spotify.com/v1/me/player/recently-played?limit=1";

type Track = {
  isPlaying: boolean;
  title: string;
  artist: string;
  album: string;
  albumImageUrl: string | null;
  songUrl: string | null;
};

async function getAccessToken(id: string, secret: string, refreshToken: string) {
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
  if (!res.ok) throw new Error("token");
  const data = await res.json();
  return data.access_token as string;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
function normalize(item: any, isPlaying: boolean): Track {
  return {
    isPlaying,
    title: item.name,
    artist: (item.artists ?? []).map((a: any) => a.name).join(", "),
    album: item.album?.name ?? "",
    albumImageUrl: item.album?.images?.[0]?.url ?? null,
    songUrl: item.external_urls?.spotify ?? null,
  };
}

export async function GET() {
  const id = process.env.SPOTIFY_CLIENT_ID;
  const secret = process.env.SPOTIFY_CLIENT_SECRET;
  const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN;

  if (!id || !secret || !refreshToken) {
    return Response.json({ configured: false });
  }

  try {
    const token = await getAccessToken(id, secret, refreshToken);
    const auth = { Authorization: `Bearer ${token}` };

    // Currently playing — 204 (nothing playing) falls through to recent.
    const now = await fetch(NOW_PLAYING_URL, { headers: auth, cache: "no-store" });
    if (now.status === 200) {
      const data = await now.json();
      if (data?.item && data.currently_playing_type === "track") {
        return Response.json({ configured: true, ...normalize(data.item, data.is_playing) });
      }
    }

    const recent = await fetch(RECENT_URL, { headers: auth, cache: "no-store" });
    if (recent.ok) {
      const data = await recent.json();
      const item = data?.items?.[0]?.track;
      if (item) return Response.json({ configured: true, ...normalize(item, false) });
    }

    return Response.json({ configured: true, isPlaying: false, title: null });
  } catch {
    return Response.json({ configured: true, isPlaying: false, title: null }, { status: 200 });
  }
}
