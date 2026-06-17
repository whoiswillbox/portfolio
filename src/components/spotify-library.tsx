"use client";

/* eslint-disable @next/next/no-img-element */
import * as React from "react";
import Link from "next/link";
import { Squares2X2Icon, ListBulletIcon } from "@heroicons/react/24/outline";
import { MusicLibrarySkeleton, BrowseSkeleton } from "@/components/music-skeletons";
import { cn } from "@/lib/utils";

type Track = { name: string; artist: string; image: string | null; url: string | null };
type Artist = { name: string; image: string | null; url: string | null };
type Playlist = { id: string; name: string; image: string | null; url: string | null; tracks: number };
type PreviewTrack = {
  id: string;
  name: string;
  artist: string;
  image: string | null;
  duration: string;
};
type PlaylistPreview = {
  id: string;
  name: string;
  image: string | null;
  total: number;
  tracks: PreviewTrack[];
};
type Library = {
  configured: boolean;
  topTracks?: Track[];
  topArtists?: Artist[];
  recent?: Track[];
  playlists?: Playlist[];
};

export function SpotifyLibrary() {
  const [data, setData] = React.useState<Library | null>(null);
  const [playlistView, setPlaylistView] = React.useState<"grid" | "list">("grid");
  const [previews, setPreviews] = React.useState<PlaylistPreview[] | null>(null);

  React.useEffect(() => {
    fetch("/api/spotify/library", { cache: "no-store" })
      .then((r) => r.json())
      .then(setData)
      .catch(() => setData({ configured: false }));
  }, []);

  // The list ("browse") view shows each playlist with a few of its tracks —
  // fetched once, the first time the visitor switches to it.
  React.useEffect(() => {
    if (playlistView === "list" && previews === null) {
      fetch("/api/spotify/playlist-previews", { cache: "no-store" })
        .then((r) => r.json())
        .then((d) => setPreviews(d.playlists ?? []))
        .catch(() => setPreviews([]));
    }
  }, [playlistView, previews]);

  if (!data) {
    return <MusicLibrarySkeleton />;
  }
  if (!data.configured) return null;

  const playlists = data.playlists ?? [];
  const topTracks = data.topTracks ?? [];
  const topArtists = data.topArtists ?? [];
  const recent = data.recent ?? [];

  return (
    <div className="mt-12 flex flex-col gap-12">
      {/* Embedded player for the first playlist */}
      {topArtists.length > 0 && (
        <Section title="Top artists">
          <div className="flex flex-wrap gap-5">
            {topArtists.map((a) => (
              <a
                key={a.name}
                href={a.url ?? "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-20 flex-col items-center gap-2 text-center"
              >
                <img
                  src={a.image ?? ""}
                  alt={a.name}
                  className="size-20 rounded-full object-cover ring-1 ring-border transition-transform hover:scale-105"
                />
                <span className="truncate text-body-xs text-muted-foreground">{a.name}</span>
              </a>
            ))}
          </div>
        </Section>
      )}

      {(topTracks.length > 0 || recent.length > 0) && (
        <div className="grid gap-12 md:grid-cols-2">
          {topTracks.length > 0 && (
            <Section title="Top tracks">
              <TrackList tracks={topTracks} numbered />
            </Section>
          )}
          {recent.length > 0 && (
            <Section title="Recently played">
              <TrackList tracks={recent} />
            </Section>
          )}
        </div>
      )}

      {playlists.length > 0 && (
        <Section
          title="Playlists"
          action={
            <div className="flex items-center gap-0.5 rounded-lg border p-0.5">
              {(
                [
                  ["grid", Squares2X2Icon, "Grid view"],
                  ["list", ListBulletIcon, "List view"],
                ] as const
              ).map(([mode, Icon, label]) => (
                <button
                  key={mode}
                  type="button"
                  aria-label={label}
                  aria-pressed={playlistView === mode}
                  onClick={() => setPlaylistView(mode)}
                  className={cn(
                    "rounded p-1 transition-colors",
                    playlistView === mode
                      ? "bg-muted text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Icon className="size-4" />
                </button>
              ))}
            </div>
          }
        >
          {playlistView === "grid" ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {playlists.map((p) => (
                <Link key={p.id} href={`/extracurriculars/music/${p.id}`} className="group flex flex-col gap-2">
                  <div className="aspect-square overflow-hidden rounded-lg ring-1 ring-border transition duration-200 group-hover:scale-[1.04] group-hover:shadow-2xl">
                    {p.image ? (
                      <img src={p.image} alt={p.name} className="size-full object-cover" />
                    ) : (
                      <div className="size-full bg-muted" />
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="truncate text-body-sm font-medium text-foreground">{p.name}</span>
                    <span className="text-body-xs text-muted-foreground">{p.tracks} tracks</span>
                  </div>
                </Link>
              ))}
            </div>
          ) : previews === null ? (
            <BrowseSkeleton />
          ) : (
            <div className="flex flex-col gap-8">
              {previews.map((p) => (
                <div key={p.id} className="flex flex-col gap-3">
                  <Link
                    href={`/extracurriculars/music/${p.id}`}
                    className="group flex items-center gap-3"
                  >
                    {p.image ? (
                      <img
                        src={p.image}
                        alt={p.name}
                        className="size-14 shrink-0 rounded-lg object-cover ring-1 ring-border"
                      />
                    ) : (
                      <div className="size-14 shrink-0 rounded-lg bg-muted" />
                    )}
                    <div className="flex min-w-0 flex-col">
                      <span className="truncate text-body-md font-semibold text-foreground group-hover:underline">
                        {p.name}
                      </span>
                      <span className="text-body-xs text-muted-foreground">{p.total} tracks</span>
                    </div>
                  </Link>

                  <div className="flex flex-col">
                    {p.tracks.map((t, i) => (
                      <Link
                        key={`${t.id}-${i}`}
                        href={`/extracurriculars/music/${p.id}?track=${t.id}`}
                        className="flex w-full items-center gap-3 rounded-lg px-2 py-1.5 transition-colors hover:bg-muted/60"
                      >
                        <span className="w-5 shrink-0 text-right font-mono text-body-xs text-muted-foreground">
                          {i + 1}
                        </span>
                        {t.image ? (
                          <img src={t.image} alt="" className="size-9 shrink-0 rounded object-cover" />
                        ) : (
                          <div className="size-9 shrink-0 rounded bg-muted" />
                        )}
                        <div className="flex min-w-0 flex-1 flex-col">
                          <span className="truncate text-body-sm text-foreground">{t.name}</span>
                          <span className="truncate text-body-xs text-muted-foreground">{t.artist}</span>
                        </div>
                        <span className="shrink-0 font-mono text-body-xs text-muted-foreground">
                          {t.duration}
                        </span>
                      </Link>
                    ))}
                  </div>

                  {p.total > p.tracks.length && (
                    <Link
                      href={`/extracurriculars/music/${p.id}`}
                      className="self-start px-2 font-mono text-body-xs uppercase tracking-wide text-muted-foreground transition-colors hover:text-foreground"
                    >
                      See all {p.total} →
                    </Link>
                  )}
                </div>
              ))}
            </div>
          )}
        </Section>
      )}
    </div>
  );
}

function Section({
  title,
  action,
  children,
}: {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-2">
        <h2 className="font-mono text-body-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
          {title}
        </h2>
        {action}
      </div>
      {children}
    </section>
  );
}

function TrackList({ tracks, numbered }: { tracks: Track[]; numbered?: boolean }) {
  return (
    <div className="flex flex-col">
      {tracks.map((t, i) => (
        <a
          key={`${t.name}-${i}`}
          href={t.url ?? "#"}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-muted/60"
        >
          {numbered && (
            <span className="w-4 shrink-0 text-right font-mono text-body-xs text-muted-foreground">
              {i + 1}
            </span>
          )}
          {t.image ? (
            <img src={t.image} alt="" className="size-10 shrink-0 rounded object-cover" />
          ) : (
            <div className="size-10 shrink-0 rounded bg-muted" />
          )}
          <div className="flex min-w-0 flex-col">
            <span className="truncate text-body-sm font-medium text-foreground">{t.name}</span>
            <span className="truncate text-body-xs text-muted-foreground">{t.artist}</span>
          </div>
        </a>
      ))}
    </div>
  );
}
