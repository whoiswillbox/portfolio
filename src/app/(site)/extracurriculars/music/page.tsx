import { ContentCard } from "@/components/content-card";
import { SpotifyNowPlaying } from "@/components/spotify-now-playing";
import { SpotifyLibrary } from "@/components/spotify-library";

export default function Music() {
  return (
    <ContentCard className="relative h-full overflow-hidden">
      {/* Scrollable content */}
      <div className="h-full overflow-auto">
        <article className="mx-auto w-full max-w-4xl px-6 pb-32 pt-16 max-sm:pt-28 max-sm:[@media(display-mode:standalone)]:pt-36">
          <header className="flex flex-col gap-3">
            <h1 className="text-h1 tracking-tight">Music</h1>
            <p className="max-w-xl text-body-lg text-muted-foreground">
              A constant in the background of everything I make. Here&apos;s
              what&apos;s on rotation.
            </p>
          </header>

          <SpotifyLibrary />
        </article>
      </div>

      {/* Now Playing — floats bottom-left of the content card, anchored as you
          scroll. */}
      <div className="pointer-events-none absolute bottom-4 left-4 z-20 w-[min(340px,calc(100%-2rem))]">
        <div className="pointer-events-auto">
          <SpotifyNowPlaying />
        </div>
      </div>
    </ContentCard>
  );
}
