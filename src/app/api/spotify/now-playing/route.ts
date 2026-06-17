/* Spotify "now playing" — current track, falling back to most recently played.
   Returns { configured: false } when the SPOTIFY_* env vars are absent so the
   UI can degrade gracefully. See docs/spotify.md. */

import { spotifyConfigured, getAccessToken, spotifyGet } from "@/lib/spotify";

export const dynamic = "force-dynamic"; // live state, never cache

/* eslint-disable @typescript-eslint/no-explicit-any */
function normalize(item: any, isPlaying: boolean) {
  return {
    configured: true,
    isPlaying,
    title: item.name,
    artist: (item.artists ?? []).map((a: any) => a.name).join(", "),
    album: item.album?.name ?? "",
    albumImageUrl: item.album?.images?.[0]?.url ?? null,
    songUrl: item.external_urls?.spotify ?? null,
  };
}

export async function GET() {
  if (!spotifyConfigured()) return Response.json({ configured: false });

  try {
    const token = await getAccessToken();
    if (!token) return Response.json({ configured: true, isPlaying: false, title: null });

    const now = await spotifyGet("/me/player/currently-playing", token);
    if (now.status === 200) {
      const data = await now.json();
      if (data?.item && data.currently_playing_type === "track") {
        return Response.json(normalize(data.item, data.is_playing));
      }
    }

    const recent = await spotifyGet("/me/player/recently-played?limit=1", token);
    if (recent.ok) {
      const data = await recent.json();
      const item = data?.items?.[0]?.track;
      if (item) return Response.json(normalize(item, false));
    }

    return Response.json({ configured: true, isPlaying: false, title: null });
  } catch {
    return Response.json({ configured: true, isPlaying: false, title: null });
  }
}
