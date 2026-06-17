"use client";

/* eslint-disable @next/next/no-img-element */
import * as React from "react";
import { cn } from "@/lib/utils";
import { useSpotifyPlayer, SpotifyPlayerBar } from "@/components/spotify-player";

export type PlaylistTrack = {
  id: string;
  name: string;
  artist: string;
  image: string | null;
  duration: string;
};

/**
 * Playlist track list with a sticky Spotify player. Clicking a track loads and
 * plays it: full track for visitors signed into Spotify, 30s preview otherwise.
 */
export function PlaylistTracks({
  tracks,
  autoplayId,
}: {
  tracks: PlaylistTrack[];
  autoplayId?: string;
}) {
  const { hostRef, currentId, hasPlayed, play } = useSpotifyPlayer(
    tracks.length > 0,
    tracks[0]?.id,
    autoplayId
  );

  return (
    <>
      <div className="mt-8 flex flex-col pb-28">
        {tracks.map((t, idx) => (
          <button
            key={`${t.id}-${idx}`}
            type="button"
            onClick={() => play(t.id)}
            className={cn(
              "flex items-center gap-3 rounded-lg px-2 py-2 text-left transition-colors hover:bg-muted/60",
              currentId === t.id && "bg-muted/60"
            )}
          >
            <span className="w-5 shrink-0 text-right font-mono text-body-xs text-muted-foreground">
              {idx + 1}
            </span>
            {t.image ? (
              <img src={t.image} alt="" className="size-10 shrink-0 rounded object-cover" />
            ) : (
              <div className="size-10 shrink-0 rounded bg-muted" />
            )}
            <div className="flex min-w-0 flex-1 flex-col">
              <span className="truncate text-body-sm font-medium text-foreground">{t.name}</span>
              <span className="truncate text-body-xs text-muted-foreground">{t.artist}</span>
            </div>
            <span className="shrink-0 font-mono text-body-xs text-muted-foreground">
              {t.duration}
            </span>
          </button>
        ))}
      </div>

      <div
        className={cn(
          "sticky bottom-4 z-20 transition-opacity duration-300",
          hasPlayed ? "opacity-100" : "pointer-events-none h-0 overflow-hidden opacity-0"
        )}
      >
        <SpotifyPlayerBar hostRef={hostRef} />
      </div>
    </>
  );
}
