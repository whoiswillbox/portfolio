import { ContentCard } from "@/components/content-card";
import { SpotifyNowPlaying } from "@/components/spotify-now-playing";

export default function Music() {
  return (
    <ContentCard className="h-full overflow-auto">
      <article className="mx-auto w-full max-w-4xl px-6 pb-10 pt-28">
        <header className="flex flex-col gap-3">
          <h1 className="text-h1 font-bold tracking-tight">Music</h1>
          <p className="max-w-xl text-body-lg text-muted-foreground">
            A constant in the background of everything I make. Here&apos;s what&apos;s
            on rotation.
          </p>
        </header>

        <div className="mt-8">
          <SpotifyNowPlaying />
        </div>
      </article>
    </ContentCard>
  );
}
