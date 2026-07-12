/* eslint-disable @next/next/no-img-element */
import { ContentCard } from "@/components/content-card";
import { PlaylistTracks, type PlaylistTrack } from "@/components/playlist-tracks";
import { RegisterBoxSeed } from "@/components/box-seed";
import { playlistSeed } from "@/lib/case-studies";
import { getAccessToken, spotifyGet, cached } from "@/lib/spotify";

export const dynamic = "force-dynamic";

/* eslint-disable @typescript-eslint/no-explicit-any */
function fmt(ms: number) {
  const m = Math.floor(ms / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  return `${m}:${String(s).padStart(2, "0")}`;
}

async function getTracks(id: string, token: string): Promise<any[]> {
  // /items is the current endpoint (older /tracks 403s for some apps).
  for (const ep of ["items", "tracks"]) {
    const r = await spotifyGet(`/playlists/${id}/${ep}?limit=100`, token);
    if (r.ok) {
      const d = await r.json();
      if (d?.items) return d.items;
    }
  }
  return [];
}

export default async function PlaylistPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ track?: string }>;
}) {
  const { id } = await params;
  const { track: autoplayId } = await searchParams;

  // Cache the (rarely-changing) playlist data so revisits are instant.
  const data = await cached(`playlist:${id}`, 120_000, async () => {
    const token = await getAccessToken();
    if (!token) return null;

    const metaRes = await spotifyGet(
      `/playlists/${id}?fields=name,description,images,owner(display_name),external_urls,items.total,tracks.total`,
      token
    );
    const meta = metaRes.ok ? await metaRes.json() : null;
    const rawTracks = await getTracks(id, token);
    const tracks: PlaylistTrack[] = rawTracks
      .map((i) => i.track ?? i.item) // /items nests it as `item`, /tracks as `track`
      .filter(Boolean)
      .map((t: any) => ({
        id: t.id,
        name: t.name,
        artist: (t.artists ?? []).map((a: any) => a.name).join(", "),
        image: t.album?.images?.[t.album.images.length - 1]?.url ?? null,
        duration: t.duration_ms ? fmt(t.duration_ms) : "",
      }));
    const total = meta?.items?.total ?? meta?.tracks?.total ?? tracks.length;
    return { meta, tracks, total };
  });

  if (!data) {
    return (
      <ContentCard className="h-full overflow-auto">
        <div className="mx-auto w-full max-w-3xl px-6 pb-10 pt-16 max-sm:pt-28 max-sm:[@media(display-mode:standalone)]:pt-36">
          <p className="text-body-sm text-muted-foreground">Spotify isn’t connected.</p>
        </div>
      </ContentCard>
    );
  }
  const { meta, tracks, total } = data;

  return (
    <ContentCard className="h-full overflow-auto">
      {/* Seed Box AI to talk about this specific playlist when opened here. */}
      <RegisterBoxSeed seed={playlistSeed(meta?.name ?? "this playlist", id)} />
      <article className="mx-auto w-full max-w-3xl px-6 pb-10 pt-16 max-sm:pt-28 max-sm:[@media(display-mode:standalone)]:pt-36">
        {/* Header */}
        <header className="flex items-end gap-5">
          {meta?.images?.[0]?.url ? (
            <img
              src={meta.images[0].url}
              alt={meta.name}
              className="size-32 shrink-0 rounded-lg object-cover shadow-lg ring-1 ring-border"
            />
          ) : (
            <div className="size-32 shrink-0 rounded-lg bg-muted" />
          )}
          <div className="flex flex-col gap-2">
            <span className="font-mono text-body-xs uppercase tracking-[0.2em] text-muted-foreground">
              Playlist
            </span>
            <h1 className="text-h1 tracking-tight">{meta?.name ?? "Playlist"}</h1>
            <span className="text-body-sm text-muted-foreground">
              {meta?.owner?.display_name ? `${meta.owner.display_name} · ` : ""}
              {total} tracks
            </span>
          </div>
        </header>

        {/* Track list + sticky click-to-play Spotify player */}
        <PlaylistTracks tracks={tracks} autoplayId={autoplayId} />
      </article>
    </ContentCard>
  );
}
