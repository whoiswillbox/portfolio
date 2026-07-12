"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeftIcon, LightBulbIcon } from "@heroicons/react/24/outline";
import { ContentCard } from "@/components/content-card";
import { CopyToken } from "@/components/copy-token";
import { cn } from "@/lib/utils";

/* Living reference — each card renders the ACTUAL shadow utility, so the depth
   on this page is the real ramp (and it re-tunes with the theme). */

// Small guidance line shown under a section's description — how/when to use.
function UsageHint({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2 rounded-lg bg-muted/60 px-3 py-2 text-body-sm text-muted-foreground">
      <LightBulbIcon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
      <p>{children}</p>
    </div>
  );
}

/* Primitives — the raw shadow ramp, 0 (flat) → 500 (deep). Every semantic
   shadow-* utility resolves to one of these. Theme-aware. */
const PRIM_ELEVATION = [
  { v: "--elevation-0", styleVar: "--elevation-0", feeds: "shadow-none" },
  { v: "--elevation-100", styleVar: "--elevation-100", feeds: "shadow-xs, shadow-2xs" },
  { v: "--elevation-200", styleVar: "--elevation-200", feeds: "shadow-sm, shadow" },
  { v: "--elevation-300", styleVar: "--elevation-300", feeds: "shadow-md" },
  { v: "--elevation-400", styleVar: "--elevation-400", feeds: "shadow-lg" },
  { v: "--elevation-500", styleVar: "--elevation-500", feeds: "shadow-xl, shadow-2xl" },
];

// Semantic t-shirt scale — Tailwind shadow-* utilities.
const SEM_SCALE = [
  { token: "shadow-none", cls: "shadow-none", use: "Flat — flush with the surface." },
  { token: "shadow-sm", cls: "shadow-sm", use: "Subtle lift — inputs, small controls." },
  { token: "shadow-md", cls: "shadow-md", use: "Cards and raised panels." },
  { token: "shadow-lg", cls: "shadow-lg", use: "Dropdowns, sheets, floating UI." },
  { token: "shadow-xl", cls: "shadow-xl", use: "Modals and dialogs." },
];

// A card sample carrying the actual shadow, plus token + metadata.
function ElevationRow({ token, cls, styleVar, feeds, use }: { token: string; cls?: string; styleVar?: string; feeds?: string; use?: string }) {
  return (
    <div className="flex items-center gap-6 py-5">
      {/* Sample — the shadow IS the token, so it's a true visual. Sits on the
          page bg (not the card surface) so the shadow reads. */}
      <div
        className={cn("grid size-16 shrink-0 place-items-center rounded-lg border border-border bg-surface", cls)}
        style={styleVar ? { boxShadow: `var(${styleVar})` } : undefined}
      />
      <CopyToken value={token} className="-ml-1.5 shrink-0" />
      <div className="ml-auto flex min-w-0 flex-col items-end gap-0.5 text-right">
        {use && <p className="text-body-sm text-muted-foreground">{use}</p>}
        {feeds && (
          <span className="font-mono text-[0.65rem] text-muted-foreground">Feeds {feeds}</span>
        )}
      </div>
    </div>
  );
}

type View = "primitives" | "semantics";

export default function Elevation() {
  const [view, setView] = React.useState<View>("semantics");

  return (
    <ContentCard flush className="h-full overflow-auto">
      <div className="mx-auto w-full max-w-4xl px-6 pt-16 max-sm:pt-28 max-sm:[@media(display-mode:standalone)]:pt-36 pb-10">
        <Link
          href="/cardboard/foundations"
          className="mb-6 inline-flex items-center gap-1.5 text-body-sm text-muted-foreground transition-colors hover:text-foreground max-sm:hidden"
        >
          <ArrowLeftIcon className="size-4" />
          Foundations
        </Link>

        <div className="flex flex-col gap-4 mb-12">
          <div className="flex flex-col gap-3">
            <h1 className="text-h1">Elevation</h1>
            <p className="text-body-lg text-muted-foreground">
              Shadow lifts an element off the page. Higher elevation signals more
              importance — and that a surface floats above the rest.
            </p>
          </div>
          {/* Primitives / Semantics toggle */}
          <div className="inline-flex w-fit items-center gap-1 rounded-lg bg-muted p-1 ring-1 ring-border">
            {(["primitives", "semantics"] as const).map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setView(v)}
                className={cn(
                  "rounded-md px-3 py-1.5 text-body-sm font-medium capitalize transition-colors",
                  view === v
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {v}
              </button>
            ))}
          </div>
        </div>

        {view === "semantics" ? (
        /* T-shirt scale */
        <section className="mb-14 flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-h3">Elevation scale</h2>
            <p className="text-body-sm text-muted-foreground">
              Tailwind <span className="font-mono text-body-xs">shadow-*</span>{" "}
              utilities, from <span className="font-mono text-body-xs">shadow-none</span>{" "}
              to <span className="font-mono text-body-xs">shadow-xl</span>.
            </p>
            <UsageHint>
              Match elevation to how far a surface floats: <span className="font-mono text-body-xs">shadow-sm</span>{" "}
              for a hint of lift, <span className="font-mono text-body-xs">shadow-md</span> for
              cards, and <span className="font-mono text-body-xs">shadow-lg</span>+ for floating
              UI. Shadows are theme-aware — they deepen in dark mode to stay legible.
            </UsageHint>
          </div>
          <div className="flex flex-col divide-y divide-border">
            {SEM_SCALE.map((s) => (
              <ElevationRow key={s.token} token={s.token} cls={s.cls} use={s.use} />
            ))}
          </div>
        </section>
        ) : (
        <section className="mb-14 flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-h3">Shadow ramp</h2>
            <p className="text-body-sm text-muted-foreground">
              The raw ramp, <span className="font-mono text-body-xs">--elevation-0</span> (flat)
              → <span className="font-mono text-body-xs">--elevation-500</span> (deep). Every
              semantic <span className="font-mono text-body-xs">shadow-*</span> utility resolves
              to one of these.
            </p>
          </div>
          <div className="flex flex-col divide-y divide-border">
            {PRIM_ELEVATION.map((e) => (
              <ElevationRow key={e.v} token={e.v} styleVar={e.styleVar} feeds={e.feeds} />
            ))}
          </div>
        </section>
        )}
      </div>
    </ContentCard>
  );
}
