/* Playlists with a short preview of each one's tracks, for the Music page's
   "browse" (list) view. One token refresh, playlist track fetches in parallel. */

import {
  spotifyConfigured,
  getAccessToken,
  spotifyGet,
  cached,
  HIDDEN_PLAYLIST_IDS,
} from "@/lib/spotify";

export const dynamic = "force-dynamic";

/* eslint-disable @typescript-eslint/no-explicit-any */
const json = async (r: Response) => (r.ok ? r.json() : null);
const artists = (a: any[]) => (a ?? []).map((x) => x.name).join(", ");
const PREVIEW_COUNT = 6;

function fmt(ms: number) {
  const m = Math.floor(ms / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  return `${m}:${String(s).padStart(2, "0")}`;
}

async function tracksFor(id: string, token: string) {
  // /items is the current endpoint (nests track under `item`); /tracks (under
  // `track`) is the older one and 403s for some apps — try both.
  for (const ep of ["items", "tracks"]) {
    const r = await spotifyGet(`/playlists/${id}/${ep}?limit=${PREVIEW_COUNT}`, token);
    if (r.ok) {
      const d = await r.json();
      if (d?.items) {
        return d.items
          .map((i: any) => i.track ?? i.item)
          .filter(Boolean)
          .map((t: any) => ({
            id: t.id,
            name: t.name,
            artist: artists(t.artists),
            image: t.album?.images?.[t.album.images.length - 1]?.url ?? null,
            duration: t.duration_ms ? fmt(t.duration_ms) : "",
          }));
      }
    }
  }
  return [];
}

export async function GET() {
  if (!spotifyConfigured()) return Response.json({ configured: false, playlists: [] });

  const payload = await cached("playlist-previews", 120_000, async () => {
    const token = await getAccessToken();
    if (!token) return { configured: true, playlists: [] };

    const pl = await spotifyGet("/me/playlists?limit=12", token).then(json);
    const items = (pl?.items ?? []).filter((p: any) => p && !HIDDEN_PLAYLIST_IDS.has(p.id));

    const playlists = await Promise.all(
      items.map(async (p: any) => ({
        id: p.id,
        name: p.name,
        image: p.images?.[0]?.url ?? null,
        url: p.external_urls?.spotify ?? null,
        total: p.items?.total ?? p.tracks?.total ?? 0,
        tracks: await tracksFor(p.id, token),
      }))
    );

    return { configured: true, playlists };
  });

  return Response.json(payload);
}
