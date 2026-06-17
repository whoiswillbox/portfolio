"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";

/**
 * Shared Spotify IFrame-API player. `enabled` controls whether a controller is
 * created (so it can be torn down when its host isn't rendered). Clicking a
 * track calls `play()` — a real user gesture, so playback is allowed: full
 * track for visitors signed into Spotify, 30s preview otherwise.
 */
export function useSpotifyPlayer(enabled: boolean, initialId?: string, autoplayId?: string) {
  const hostRef = React.useRef<HTMLDivElement | null>(null);
  const controllerRef = React.useRef<any>(null);
  const [currentId, setCurrentId] = React.useState<string | null>(autoplayId ?? null);
  const [hasPlayed, setHasPlayed] = React.useState(!!autoplayId);

  React.useEffect(() => {
    if (!enabled || !initialId) return;
    let cancelled = false;

    const create = (api: any) => {
      if (cancelled || !hostRef.current || controllerRef.current) return;
      api.createController(
        hostRef.current,
        { width: "100%", height: 80, uri: `spotify:track:${autoplayId ?? currentId ?? initialId}` },
        (c: any) => {
          controllerRef.current = c;
          // Arrived from a track link (?track=): start it automatically.
          if (autoplayId) c.play();
        }
      );
    };

    if ((window as any).__spotifyIframeAPI) {
      create((window as any).__spotifyIframeAPI);
    } else {
      (window as any).onSpotifyIframeApiReady = (api: any) => {
        (window as any).__spotifyIframeAPI = api;
        create(api);
      };
      if (!document.getElementById("spotify-iframe-api")) {
        const s = document.createElement("script");
        s.id = "spotify-iframe-api";
        s.src = "https://open.spotify.com/embed/iframe-api/v1";
        s.async = true;
        document.body.appendChild(s);
      }
    }

    return () => {
      cancelled = true;
      controllerRef.current?.destroy?.();
      controllerRef.current = null;
    };
    // currentId intentionally omitted: changing tracks shouldn't recreate the
    // controller (we loadUri instead).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, initialId, autoplayId]);

  const play = React.useCallback((id: string) => {
    setCurrentId(id);
    setHasPlayed(true);
    const c = controllerRef.current;
    if (c) {
      c.loadUri(`spotify:track:${id}`);
      c.play();
    }
  }, []);

  return { hostRef, currentId, hasPlayed, play };
}

/** The sticky player chrome (rounded frame; iframe gets matching radius so no
    white corner pokes through). The IFrame API renders into the inner div. */
export function SpotifyPlayerBar({
  hostRef,
}: {
  hostRef: React.RefObject<HTMLDivElement | null>;
}) {
  return (
    <div className="overflow-hidden rounded-[12px] bg-background shadow-lg ring-1 ring-border [&_iframe]:block [&_iframe]:rounded-[12px] [&_iframe]:bg-transparent">
      <div ref={hostRef} />
    </div>
  );
}
