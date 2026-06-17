import { Skeleton } from "@/components/ui/skeleton";

/* Loading-state skeletons that mirror the real Music-page layouts, so a
   navigation shows structure immediately instead of a blank/gray flash while
   Spotify data is fetched. */

function SectionLabel() {
  return <Skeleton className="h-3 w-24 rounded" />;
}

function TrackRowSkeleton({ numbered }: { numbered?: boolean }) {
  return (
    <div className="flex items-center gap-3 px-2 py-2">
      {numbered && <Skeleton className="h-3 w-4 shrink-0 rounded" />}
      <Skeleton className="size-10 shrink-0 rounded" />
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <Skeleton className="h-3.5 w-2/3 rounded" />
        <Skeleton className="h-3 w-1/3 rounded" />
      </div>
    </div>
  );
}

/** Mirrors <SpotifyLibrary>: top artists, two track columns, playlist grid. */
export function MusicLibrarySkeleton() {
  return (
    <div className="mt-12 flex flex-col gap-12">
      {/* Top artists — row of circles */}
      <section className="flex flex-col gap-4">
        <SectionLabel />
        <div className="flex flex-wrap gap-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex w-20 flex-col items-center gap-2">
              <Skeleton className="size-20 rounded-full" />
              <Skeleton className="h-3 w-14 rounded" />
            </div>
          ))}
        </div>
      </section>

      {/* Top tracks | Recently played */}
      <div className="grid gap-12 md:grid-cols-2">
        {[true, false].map((numbered, col) => (
          <section key={col} className="flex flex-col gap-4">
            <SectionLabel />
            <div className="flex flex-col">
              {Array.from({ length: 6 }).map((_, i) => (
                <TrackRowSkeleton key={i} numbered={numbered} />
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Playlists grid */}
      <section className="flex flex-col gap-4">
        <SectionLabel />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-2">
              <Skeleton className="aspect-square w-full rounded-lg" />
              <Skeleton className="h-3.5 w-3/4 rounded" />
              <Skeleton className="h-3 w-1/3 rounded" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

/** Mirrors the playlists "browse" (list) view: each playlist header + a few
    track rows. */
export function BrowseSkeleton() {
  return (
    <div className="flex flex-col gap-8">
      {Array.from({ length: 3 }).map((_, p) => (
        <div key={p} className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <Skeleton className="size-14 shrink-0 rounded-lg" />
            <div className="flex min-w-0 flex-col gap-1.5">
              <Skeleton className="h-4 w-40 rounded" />
              <Skeleton className="h-3 w-20 rounded" />
            </div>
          </div>
          <div className="flex flex-col">
            {Array.from({ length: 4 }).map((_, i) => (
              <TrackRowSkeleton key={i} numbered />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/** Mirrors the playlist [id] page: cover + meta header, then a track list. */
export function PlaylistSkeleton() {
  return (
    <article className="mx-auto w-full max-w-3xl px-6 pb-10 pt-28">
      <header className="flex items-end gap-5">
        <Skeleton className="size-32 shrink-0 rounded-lg" />
        <div className="flex flex-col gap-2.5">
          <Skeleton className="h-3 w-16 rounded" />
          <Skeleton className="h-9 w-56 rounded" />
          <Skeleton className="h-4 w-32 rounded" />
        </div>
      </header>

      <div className="mt-10 flex flex-col">
        {Array.from({ length: 10 }).map((_, i) => (
          <TrackRowSkeleton key={i} numbered />
        ))}
      </div>
    </article>
  );
}
