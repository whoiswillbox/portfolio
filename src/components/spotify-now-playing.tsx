"use client";

import * as React from "react";
import Image from "next/image";

type NowPlaying = {
  configured: boolean;
  isPlaying?: boolean;
  title?: string | null;
  artist?: string;
  album?: string;
  albumImageUrl?: string | null;
  songUrl?: string | null;
};

/** Spotify "now playing" card. Polls the API route; degrades gracefully when
    Spotify isn't configured (e.g. localhost without creds). */
export function SpotifyNowPlaying() {
  const [data, setData] = React.useState<NowPlaying | null>(null);

  React.useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const res = await fetch("/api/spotify/now-playing", { cache: "no-store" });
        const json = (await res.json()) as NowPlaying;
        if (active) setData(json);
      } catch {
        /* keep last state */
      }
    };
    load();
    const id = setInterval(load, 30_000); // refresh every 30s
    return () => {
      active = false;
      clearInterval(id);
    };
  }, []);

  // Loading
  if (!data) {
    return (
      <div className="h-[88px] w-full max-w-md animate-pulse rounded-xl border bg-muted/40" />
    );
  }

  // Not configured / nothing to show
  if (!data.configured || !data.title) {
    return (
      <div className="flex w-full max-w-md items-center gap-3 rounded-xl border bg-muted/40 px-4 py-3">
        <SpotifyMark className="size-6 shrink-0 text-muted-foreground" />
        <p className="text-body-sm text-muted-foreground">
          {data.configured
            ? "Not playing anything right now."
            : "Spotify isn’t connected yet."}
        </p>
      </div>
    );
  }

  const card = (
    <div className="flex w-full max-w-md items-center gap-4 rounded-xl border bg-muted/40 p-3 transition-colors hover:bg-muted/70">
      {data.albumImageUrl ? (
        <Image
          src={data.albumImageUrl}
          alt={data.album ?? ""}
          width={56}
          height={56}
          className="size-14 shrink-0 rounded-md object-cover"
          unoptimized
        />
      ) : (
        <div className="size-14 shrink-0 rounded-md bg-muted" />
      )}
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="flex items-center gap-2 font-mono text-body-xs uppercase tracking-wide text-muted-foreground">
          <SpotifyMark className="size-3.5 text-[#1DB954]" />
          {data.isPlaying ? <Equalizer /> : null}
          {data.isPlaying ? "Now playing" : "Last played"}
        </span>
        <span className="truncate text-body-sm font-semibold text-foreground">
          {data.title}
        </span>
        <span className="truncate text-body-xs text-muted-foreground">
          {data.artist}
        </span>
      </div>
    </div>
  );

  return data.songUrl ? (
    <a href={data.songUrl} target="_blank" rel="noopener noreferrer" className="block w-fit">
      {card}
    </a>
  ) : (
    card
  );
}

/** Three little animated bars to signal active playback. */
function Equalizer() {
  return (
    <span className="flex items-end gap-0.5" aria-hidden>
      {[0, 0.2, 0.4].map((d) => (
        <span
          key={d}
          className="w-0.5 animate-bounce rounded-full bg-[#1DB954]"
          style={{ height: 8, animationDelay: `${d}s`, animationDuration: "0.8s" }}
        />
      ))}
    </span>
  );
}

function SpotifyMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.5 17.32c-.22.36-.68.46-1.03.24-2.82-1.72-6.37-2.11-10.55-1.16-.41.1-.82-.16-.91-.57-.1-.41.16-.82.57-.91 4.57-1.04 8.5-.59 11.66 1.34.36.22.47.68.26 1.06zm1.47-3.27c-.27.44-.85.58-1.3.31-3.23-1.98-8.15-2.56-11.97-1.4-.5.15-1.03-.13-1.18-.63-.15-.5.13-1.03.63-1.18 4.37-1.33 9.79-.68 13.5 1.6.44.27.58.85.32 1.3zm.13-3.4C15.36 8.28 8.7 8.06 4.85 9.23c-.6.18-1.23-.16-1.41-.76-.18-.6.16-1.23.76-1.41 4.42-1.34 11.78-1.08 16.43 1.68.54.32.71 1.01.39 1.55-.32.53-1.02.71-1.56.39z" />
    </svg>
  );
}
