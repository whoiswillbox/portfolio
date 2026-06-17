/* Spotify library — top tracks/artists, recently played, and playlists in one
   call for the Music page. Read-only. See docs/spotify.md for scopes. */

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

export async function GET() {
  if (!spotifyConfigured()) return Response.json({ configured: false });

  const payload = await cached("library", 60_000, async () => {
  const token = await getAccessToken();
  if (!token) return { configured: true, error: "auth" };

  const [topT, topA, recent, playlists] = await Promise.all([
    spotifyGet("/me/top/tracks?limit=10&time_range=long_term", token).then(json),
    spotifyGet("/me/top/artists?limit=8&time_range=short_term", token).then(json),
    spotifyGet("/me/player/recently-played?limit=10", token).then(json),
    spotifyGet("/me/playlists?limit=12", token).then(json),
  ]);

  return {
    configured: true,
    topTracks: (topT?.items ?? []).map((t: any) => ({
      name: t.name,
      artist: artists(t.artists),
      image: t.album?.images?.[t.album.images.length - 1]?.url ?? null,
      url: t.external_urls?.spotify ?? null,
    })),
    topArtists: (topA?.items ?? []).map((a: any) => ({
      name: a.name,
      image: a.images?.[a.images.length - 1]?.url ?? null,
      url: a.external_urls?.spotify ?? null,
    })),
    recent: (recent?.items ?? []).map((i: any) => ({
      name: i.track?.name,
      artist: artists(i.track?.artists),
      image: i.track?.album?.images?.[i.track.album.images.length - 1]?.url ?? null,
      url: i.track?.external_urls?.spotify ?? null,
    })),
    playlists: (playlists?.items ?? [])
      .filter((p: any) => p && !HIDDEN_PLAYLIST_IDS.has(p.id))
      .map((p: any) => ({
      id: p.id,
      name: p.name,
      image: p.images?.[0]?.url ?? null,
      url: p.external_urls?.spotify ?? null,
      // Spotify renamed the simplified playlist's `tracks` summary to `items`;
      // support both so the count stays correct.
      tracks: p.items?.total ?? p.tracks?.total ?? 0,
    })),
  };
  });

  return Response.json(payload);
}
