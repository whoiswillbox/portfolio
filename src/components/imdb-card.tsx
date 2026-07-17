import { FilmIcon } from "@heroicons/react/24/outline";
import { IMDB_URL } from "@/lib/contact";

/** A compact card linking to IMDb — shown under the stunt-double easter egg
    answer. Same shape as ContactCard, single row. */
export function IMDbCard() {
  return (
    <div className="flex flex-col gap-1 rounded-xl border bg-card p-1.5 shadow-sm">
      <a
        href={IMDB_URL}
        target="_blank"
        rel="noreferrer"
        className="flex items-center gap-3 rounded-lg px-2.5 py-2 transition-colors hover:bg-muted"
      >
        <span className="flex size-9 shrink-0 items-center justify-center rounded-md border bg-background">
          <FilmIcon className="size-5 text-muted-foreground" />
        </span>
        <span className="flex min-w-0 flex-col">
          <span className="font-mono text-body-xs font-medium uppercase tracking-wide text-foreground">
            IMDb
          </span>
          <span className="truncate text-body-xs text-muted-foreground">William Box</span>
        </span>
      </a>
    </div>
  );
}
