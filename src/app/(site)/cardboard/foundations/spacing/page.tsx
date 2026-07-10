"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeftIcon, LightBulbIcon } from "@heroicons/react/24/outline";
import { ContentCard } from "@/components/content-card";
import { CopyToken } from "@/components/copy-token";
import { cn } from "@/lib/utils";

/* Living reference — each bar renders the ACTUAL spacing var, so the widths on
   this page are the real scale (they'd shift if a token changed). */

// Small guidance line shown under a section's description — how/when to use.
function UsageHint({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2 rounded-lg bg-muted/60 px-3 py-2 text-body-sm text-muted-foreground">
      <LightBulbIcon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
      <p>{children}</p>
    </div>
  );
}

/* Primitives — the raw spacing scale (Polaris-style numeric naming: the number
   ≈ px × 100, so --space-400 = 16px). */
const PRIM_SPACE = [
  { v: "--space-0", px: "0", rem: "0" },
  { v: "--space-025", px: "1", rem: "0.0625rem" },
  { v: "--space-050", px: "2", rem: "0.125rem" },
  { v: "--space-100", px: "4", rem: "0.25rem" },
  { v: "--space-150", px: "6", rem: "0.375rem" },
  { v: "--space-200", px: "8", rem: "0.5rem" },
  { v: "--space-300", px: "12", rem: "0.75rem" },
  { v: "--space-400", px: "16", rem: "1rem" },
  { v: "--space-500", px: "20", rem: "1.25rem" },
  { v: "--space-600", px: "24", rem: "1.5rem" },
  { v: "--space-800", px: "32", rem: "2rem" },
  { v: "--space-1000", px: "40", rem: "2.5rem" },
  { v: "--space-1200", px: "48", rem: "3rem" },
  { v: "--space-1600", px: "64", rem: "4rem" },
  { v: "--space-2000", px: "80", rem: "5rem" },
  { v: "--space-2400", px: "96", rem: "6rem" },
  { v: "--space-2800", px: "112", rem: "7rem" },
  { v: "--space-3200", px: "128", rem: "8rem" },
];

// Layout widths — not on the spacing scale; caps for content columns.
const PRIM_WIDTHS = [
  { v: "--size-content", value: "42rem", px: "672", use: "Readable text column" },
  { v: "--size-wide", value: "72rem", px: "1152", use: "Wide layout cap" },
];

// Semantic spacing — layout roles that resolve to a primitive rung and expose
// a Tailwind utility. token = the utility; v = the live var the bar renders.
const SEM_SPACE = [
  { token: "p-section", v: "--spacing-section", px: "96", feeds: "--space-2400", use: "Vertical rhythm between major page sections." },
  { token: "px-gutter", v: "--spacing-gutter", px: "24", feeds: "--space-600", use: "Horizontal page gutters and container padding." },
];

// Semantic container widths — max-width caps for layout.
const SEM_WIDTHS = [
  { token: "max-w-content", v: "--container-content", value: "42rem", px: "672", feeds: "--size-content", use: "Constrains long-form text to a readable measure." },
  { token: "max-w-wide", v: "--container-wide", value: "72rem", px: "1152", feeds: "--size-wide", use: "Caps wide, multi-column layouts." },
];

// A spacing row: a bar sized to the actual var + copyable token + px note.
function SpaceRow({ token, v, px, rem, feeds }: { token: string; v: string; px: string; rem?: string; feeds?: string }) {
  return (
    <div className="flex items-center gap-4 py-3">
      <div className="w-56 shrink-0 max-sm:w-40">
        <CopyToken value={token} className="-ml-1.5" />
        {rem && <div className="px-1.5 font-mono text-[0.65rem] text-muted-foreground">{rem}</div>}
      </div>
      {/* The bar — width IS the token, so it's a true visual of the value. */}
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <div className="h-4 shrink-0 rounded-sm bg-fill-brand" style={{ width: `var(${v})` }} />
        <span className="font-mono text-[0.65rem] text-muted-foreground">{px}px</span>
      </div>
      {feeds && (
        <div className="ml-auto flex shrink-0 items-center gap-1.5">
          <span className="text-body-xs text-muted-foreground">Feeds</span>
          <span className="font-mono text-body-xs text-muted-foreground">{feeds}</span>
        </div>
      )}
    </div>
  );
}

// A width row: the token + its value/use, right-aligned metadata.
function WidthRow({ token, value, px, use, feeds }: { token: string; value: string; px: string; use?: string; feeds?: string }) {
  return (
    <div className="flex items-center gap-4 py-4">
      <div className="flex shrink-0 flex-col gap-0.5">
        <CopyToken value={token} className="-ml-1.5 self-start" />
        <span className="px-1.5 font-mono text-[0.65rem] text-muted-foreground">
          {value} · {px}px{feeds ? ` · ${feeds}` : ""}
        </span>
      </div>
      {use && <p className="ml-auto shrink-0 text-right text-body-sm text-muted-foreground">{use}</p>}
    </div>
  );
}

type View = "primitives" | "semantics";

export default function Spacing() {
  const [view, setView] = React.useState<View>("semantics");

  return (
    <ContentCard className="h-full overflow-auto">
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
            <h1 className="text-h1 font-semibold">Spacing</h1>
            <p className="text-body-lg text-muted-foreground">
              A consistent scale gives the interface rhythm — even spacing makes
              layouts feel calm and intentional.
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
        <>
        {/* Spacing roles */}
        <section className="mb-14 flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-h3 font-semibold">Spacing roles</h2>
            <p className="text-body-sm text-muted-foreground">
              Named layout tokens for page-level rhythm —{" "}
              <span className="font-mono text-body-xs">p-section</span> and{" "}
              <span className="font-mono text-body-xs">px-gutter</span>.
            </p>
            <UsageHint>
              Reach for these for structural, page-level spacing. Everything else —
              gaps between elements, component padding — uses Tailwind&apos;s default
              numeric scale (<span className="font-mono text-body-xs">gap-2</span>,{" "}
              <span className="font-mono text-body-xs">p-4</span>…).
            </UsageHint>
          </div>
          <div className="flex flex-col divide-y divide-border">
            {SEM_SPACE.map((s) => (
              <SpaceRow key={s.token} token={s.token} v={s.v} px={s.px} feeds={s.feeds} />
            ))}
          </div>
        </section>

        {/* Container widths */}
        <section className="mb-14 flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-h3 font-semibold">Container widths</h2>
            <p className="text-body-sm text-muted-foreground">
              Max-width caps —{" "}
              <span className="font-mono text-body-xs">max-w-content</span> and{" "}
              <span className="font-mono text-body-xs">max-w-wide</span>.
            </p>
            <UsageHint>
              Wrap long-form copy in <span className="font-mono text-body-xs">max-w-content</span>{" "}
              so lines stay a comfortable measure; use{" "}
              <span className="font-mono text-body-xs">max-w-wide</span> for full,
              multi-column layouts.
            </UsageHint>
          </div>
          <div className="flex flex-col divide-y divide-border">
            {SEM_WIDTHS.map((w) => (
              <WidthRow key={w.token} token={w.token} value={w.value} px={w.px} use={w.use} feeds={w.feeds} />
            ))}
          </div>
        </section>
        </>
        ) : (
        <>
        {/* Spacing scale */}
        <section className="mb-14 flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-h3 font-semibold">Spacing scale</h2>
            <p className="text-body-sm text-muted-foreground">
              The raw scale. Numeric naming, Polaris-style — the number is roughly
              px × 100, so <span className="font-mono text-body-xs">--space-400</span>{" "}
              is 16px.
            </p>
          </div>
          <div className="flex flex-col divide-y divide-border">
            {PRIM_SPACE.map((s) => (
              <SpaceRow key={s.v} token={s.v} v={s.v} px={s.px} rem={s.rem} />
            ))}
          </div>
        </section>

        {/* Layout widths */}
        <section className="mb-14 flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-h3 font-semibold">Layout widths</h2>
            <p className="text-body-sm text-muted-foreground">
              Column caps — not on the spacing scale. The semantic{" "}
              <span className="font-mono text-body-xs">max-w-*</span> tokens
              reference these.
            </p>
          </div>
          <div className="flex flex-col divide-y divide-border">
            {PRIM_WIDTHS.map((w) => (
              <WidthRow key={w.v} token={w.v} value={w.value} px={w.px} use={w.use} />
            ))}
          </div>
        </section>
        </>
        )}
      </div>
    </ContentCard>
  );
}
