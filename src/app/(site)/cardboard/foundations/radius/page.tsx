"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeftIcon, LightBulbIcon } from "@heroicons/react/24/outline";
import { ContentCard } from "@/components/content-card";
import { CopyToken } from "@/components/copy-token";
import { cn } from "@/lib/utils";

/* Living reference — each swatch renders the ACTUAL radius utility, so the
   corners on this page are the real scale (they shift if a token changes). */

// Small guidance line shown under a section's description — how/when to use.
function UsageHint({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2 rounded-lg bg-muted/60 px-3 py-2 text-body-sm text-muted-foreground">
      <LightBulbIcon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
      <p>{children}</p>
    </div>
  );
}

/* Primitive — a single base radius; every semantic step is a multiple of it. */
const PRIM_RADIUS = [
  { v: "--radius-base", value: "0.625rem", px: "10", feeds: "the whole --radius-* scale" },
];

/* Derivation — every semantic step is base × N. Shown in the primitive view so
   the parametric design (one seed, multiplied) is visible. */
const DERIVATION = [
  { step: "rounded-sm", mult: "0.2", px: "2" },
  { step: "rounded-md", mult: "0.4", px: "4" },
  { step: "rounded / -lg", mult: "0.6", px: "6" },
  { step: "rounded-xl", mult: "0.8", px: "8" },
  { step: "rounded-2xl", mult: "1.0", px: "10" },
  { step: "rounded-3xl", mult: "1.4", px: "14" },
  { step: "rounded-4xl", mult: "1.8", px: "18" },
];

/* Semantic scale — Tailwind rounded-* utilities. Each is a multiple of the base
   (rounded-md ≈ base × 0.4). token = utility; cls = the class the swatch uses. */
const SEM_RADIUS = [
  { token: "rounded-none", cls: "rounded-none", px: "0", note: "×0", use: "Flush edges — tables, full-bleed media." },
  { token: "rounded-sm", cls: "rounded-sm", px: "2", note: "base × 0.2", use: "Tight corners — chips, small tags." },
  { token: "rounded-md", cls: "rounded-md", px: "4", note: "base × 0.4", use: "Inputs and compact controls." },
  { token: "rounded", cls: "rounded", px: "6", note: "base × 0.6 (default)", use: "The default — buttons and most elements." },
  { token: "rounded-lg", cls: "rounded-lg", px: "6", note: "base × 0.6", use: "Cards and raised surfaces." },
  { token: "rounded-xl", cls: "rounded-xl", px: "8", note: "base × 0.8", use: "Larger panels and sheets." },
  { token: "rounded-2xl", cls: "rounded-2xl", px: "10", note: "base × 1", use: "Prominent containers." },
  { token: "rounded-3xl", cls: "rounded-3xl", px: "14", note: "base × 1.4", use: "Hero cards and feature blocks." },
  { token: "rounded-4xl", cls: "rounded-4xl", px: "18", note: "base × 1.8", use: "The softest corners — large media." },
  { token: "rounded-full", cls: "rounded-full", px: "9999", note: "pill", use: "Pills, avatars, and icon buttons." },
];

// A radius row: a swatch with the actual radius applied + copyable token + note.
// `cls` applies a rounded-* utility; `styleVar` renders a raw var directly (for
// primitives, whose value isn't one of the rounded-* utility steps).
function RadiusRow({ token, cls, styleVar, px, note, use, feeds }: { token: string; cls?: string; styleVar?: string; px: string; note?: string; use?: string; feeds?: string }) {
  return (
    <div className="flex items-center gap-4 py-4">
      {/* Swatch — the corner IS the token, so it's a true visual. */}
      <div
        className={cn("size-14 shrink-0 border border-border bg-surface-secondary", cls)}
        style={styleVar ? { borderRadius: `var(${styleVar})` } : undefined}
      />
      <div className="flex shrink-0 flex-col gap-0.5">
        <CopyToken value={token} className="-ml-1.5 self-start" />
        <span className="px-1.5 font-mono text-[0.65rem] text-muted-foreground">
          {px}px{note ? ` · ${note}` : ""}
        </span>
      </div>
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

export default function Radius() {
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
            <h1 className="text-h1 font-semibold">Radius</h1>
            <p className="text-body-lg text-muted-foreground">
              Corner radius softens the interface. A shared scale keeps every
              surface feeling like it belongs to the same family.
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
        <section className="mb-14 flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-h3 font-semibold">Radius scale</h2>
            <p className="text-body-sm text-muted-foreground">
              Tailwind <span className="font-mono text-body-xs">rounded-*</span>{" "}
              utilities, from <span className="font-mono text-body-xs">rounded-none</span>{" "}
              to <span className="font-mono text-body-xs">rounded-full</span>.
            </p>
            <UsageHint>
              <span className="font-mono text-body-xs">rounded</span> is the default for
              most elements; step up to <span className="font-mono text-body-xs">rounded-lg</span>{" "}
              for cards and <span className="font-mono text-body-xs">rounded-xl</span>+ for
              large surfaces. Keep nested corners consistent — a rounded child inside a
              rounded parent should use a smaller step.
            </UsageHint>
          </div>
          <div className="flex flex-col divide-y divide-border">
            {SEM_RADIUS.map((r) => (
              <RadiusRow key={r.token} token={r.token} cls={r.cls} px={r.px} note={r.note} use={r.use} />
            ))}
          </div>
        </section>
        ) : (
        <section className="mb-14 flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-h3 font-semibold">Base radius</h2>
            <p className="text-body-sm text-muted-foreground">
              A single primitive. Every semantic step is a multiple of it, so
              retuning <span className="font-mono text-body-xs">--radius-base</span>{" "}
              rescales the whole system at once.
            </p>
          </div>
          <div className="flex flex-col divide-y divide-border">
            {PRIM_RADIUS.map((r) => (
              <RadiusRow key={r.v} token={r.v} styleVar={r.v} px={r.px} feeds={r.feeds} />
            ))}
          </div>

          {/* Derivation — makes the parametric (one seed × N) design visible. */}
          <div className="mt-2 flex flex-col gap-3">
            <p className="text-body-sm text-muted-foreground">
              The scale is <span className="font-medium text-foreground">parametric</span> —
              each step is <span className="font-mono text-body-xs">--radius-base</span> × a
              multiplier, so there&apos;s one value to tune, not a ramp to maintain.
            </p>
            <div className="overflow-x-auto rounded-lg border border-border">
              <table className="w-full min-w-[20rem] text-left text-body-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/50 font-mono text-body-xs text-muted-foreground">
                    <th className="px-4 py-2 font-normal">Step</th>
                    <th className="px-4 py-2 font-normal">Multiplier</th>
                    <th className="px-4 py-2 text-right font-normal">Result</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {DERIVATION.map((d) => (
                    <tr key={d.step}>
                      <td className="px-4 py-2 font-mono text-body-xs text-foreground">{d.step}</td>
                      <td className="px-4 py-2 font-mono text-body-xs text-muted-foreground">base × {d.mult}</td>
                      <td className="px-4 py-2 text-right font-mono text-body-xs text-muted-foreground">{d.px}px</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
        )}
      </div>
    </ContentCard>
  );
}
