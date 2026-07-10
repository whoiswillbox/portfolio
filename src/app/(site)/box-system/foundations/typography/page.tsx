"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeftIcon, ChevronRightIcon, LightBulbIcon } from "@heroicons/react/24/outline";
import { ContentCard } from "@/components/content-card";
import { CopyToken } from "@/components/copy-token";
import { cn } from "@/lib/utils";

// Small guidance line shown under a section's description — how/when to use.
function UsageHint({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2 rounded-lg bg-muted/60 px-3 py-2 text-body-sm text-muted-foreground">
      <LightBulbIcon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
      <p>{children}</p>
    </div>
  );
}

/* Living reference — every sample is rendered with the ACTUAL type utility, so
   this page always reflects the real scale (size, weight, tracking, leading). */

/* Each semantic text token composes four primitives — a family, a size, a
   line-height, and a weight. We surface all four so the row shows exactly what
   the token resolves to (and links back to the primitives view). */
type TypeToken = {
  token: string;
  family: string; // primitive family label (--font-family-*)
  size: string; // primitive size var suffix (--font-size-*)
  px: string; // px for the size, for reference
  lh: string; // line-height primitive suffix (--line-height-*)
  weight: string; // weight primitive label
  use: string; // per-token usage note
  sample?: string;
};

// Display — oversized, for hero moments. (font-heading = EB Garamond)
const DISPLAY: TypeToken[] = [
  { token: "text-display-lg", family: "heading", size: "7xl", px: "72", lh: "none", weight: "bold", use: "Landing hero — one per page." },
  { token: "text-display", family: "heading", size: "6xl", px: "56", lh: "none", weight: "semibold", use: "Section intros and splash headings." },
  { token: "text-display-sm", family: "heading", size: "5xl", px: "40", lh: "tight", weight: "semibold", use: "Smaller feature headings." },
];

// Headings — section titles. (font-heading = EB Garamond)
const HEADINGS: TypeToken[] = [
  { token: "text-h1", family: "heading", size: "4xl", px: "36", lh: "tight", weight: "bold", use: "Page title." },
  { token: "text-h2", family: "heading", size: "3xl", px: "30", lh: "snug", weight: "semibold", use: "Major section heading." },
  { token: "text-h3", family: "heading", size: "2xl", px: "24", lh: "snug", weight: "semibold", use: "Subsection heading." },
  { token: "text-h4", family: "heading", size: "xl", px: "20", lh: "snug", weight: "semibold", use: "Card and group titles." },
  { token: "text-h5", family: "heading", size: "lg", px: "18", lh: "normal", weight: "semibold", use: "Minor headings." },
  { token: "text-h6", family: "heading", size: "base", px: "16", lh: "normal", weight: "semibold", use: "Smallest heading / eyebrow." },
];

// Body — running text. (font-sans = Plus Jakarta Sans)
const BODY: TypeToken[] = [
  { token: "text-body-lg", family: "sans", size: "lg", px: "18", lh: "loose", weight: "regular", use: "Intros and lead paragraphs.", sample: "The quick brown fox jumps over the lazy dog." },
  { token: "text-body-md", family: "sans", size: "base", px: "16", lh: "relaxed", weight: "regular", use: "Default reading size.", sample: "The quick brown fox jumps over the lazy dog." },
  { token: "text-body-sm", family: "sans", size: "sm", px: "14", lh: "normal", weight: "regular", use: "Secondary text and captions.", sample: "The quick brown fox jumps over the lazy dog." },
  { token: "text-body-xs", family: "sans", size: "xs", px: "12", lh: "normal", weight: "regular", use: "Fine print and dense UI labels.", sample: "The quick brown fox jumps over the lazy dog." },
];

const FONTS = [
  { token: "font-sans", name: "Plus Jakarta Sans", role: "UI and body copy.", cls: "font-sans" },
  { token: "font-heading", name: "EB Garamond", role: "Headings and display.", cls: "font-heading" },
  { token: "font-mono", name: "Geist Mono", role: "Labels, code, and token names.", cls: "font-mono" },
];

const WEIGHTS = [
  { token: "font-normal", name: "Regular", use: "Body copy and running text.", cls: "font-normal" },
  { token: "font-medium", name: "Medium", use: "UI labels and light emphasis.", cls: "font-medium" },
  { token: "font-semibold", name: "Semibold", use: "Headings and buttons.", cls: "font-semibold" },
  { token: "font-bold", name: "Bold", use: "Page titles and display.", cls: "font-bold" },
];

/* Primitives — the raw type values the semantic tokens map to. Reference-only.
   `feeds` is the semantic token(s) each primitive resolves into (composition,
   not usage — you never apply a primitive directly). */
const PRIM_FAMILIES = [
  { v: "--font-family-heading", value: "EB Garamond", feeds: "text-display, text-h*" },
  { v: "--font-family-sans", value: "Plus Jakarta Sans", feeds: "text-body-*" },
  { v: "--font-family-mono", value: "Geist Mono", feeds: "font-mono" },
];
const PRIM_SIZES = [
  { v: "--font-size-7xl", value: "4.5rem", px: "72", feeds: "text-display-lg" },
  { v: "--font-size-6xl", value: "3.5rem", px: "56", feeds: "text-display" },
  { v: "--font-size-5xl", value: "2.5rem", px: "40", feeds: "text-display-sm" },
  { v: "--font-size-4xl", value: "2.25rem", px: "36", feeds: "text-h1" },
  { v: "--font-size-3xl", value: "1.875rem", px: "30", feeds: "text-h2" },
  { v: "--font-size-2xl", value: "1.5rem", px: "24", feeds: "text-h3" },
  { v: "--font-size-xl", value: "1.25rem", px: "20", feeds: "text-h4" },
  { v: "--font-size-lg", value: "1.125rem", px: "18", feeds: "text-h5, text-body-lg" },
  { v: "--font-size-base", value: "1rem", px: "16", feeds: "text-h6, text-body-md" },
  { v: "--font-size-sm", value: "0.875rem", px: "14", feeds: "text-body-sm" },
  { v: "--font-size-xs", value: "0.75rem", px: "12", feeds: "text-body-xs" },
];
const PRIM_WEIGHTS = [
  { v: "--font-weight-regular", value: "400", feeds: "text-body-*" },
  { v: "--font-weight-medium", value: "500", feeds: "—" },
  { v: "--font-weight-semibold", value: "600", feeds: "text-h2–h6, display" },
  { v: "--font-weight-bold", value: "700", feeds: "text-h1, display-lg" },
];
// Line heights — named tight→loose ramp, matches Tailwind's leading-* scale.
const PRIM_LINE_HEIGHTS = [
  { v: "--line-height-none", value: "1", feeds: "display, display-lg" },
  { v: "--line-height-tight", value: "1.1", feeds: "display-sm, h1" },
  { v: "--line-height-snug", value: "1.2", feeds: "h2–h4" },
  { v: "--line-height-normal", value: "1.4", feeds: "h5–h6, body-sm/xs" },
  { v: "--line-height-relaxed", value: "1.5", feeds: "body-md" },
  { v: "--line-height-loose", value: "1.6", feeds: "body-lg" },
];

// A plain reference row: copyable var name + its value. `note` renders as a px
// hint next to the value; `feeds` is a right-aligned composition mapping showing
// the semantic token(s) this primitive resolves into (not usage — you never
// apply a primitive directly).
function VarRow({ v, value, note, feeds }: { v: string; value: string; note?: string; feeds?: string }) {
  return (
    <div className="flex items-center gap-4 py-3">
      <div className="w-72 shrink-0 max-sm:w-44">
        <CopyToken value={v} className="-ml-1.5" />
      </div>
      <div className="font-mono text-body-sm text-foreground">{value}</div>
      {note && <div className="font-mono text-[0.65rem] text-muted-foreground">{note}px</div>}
      {feeds && (
        <div className="ml-auto flex items-center gap-1.5 text-right">
          <span className="text-body-xs text-muted-foreground">Feeds</span>
          <span className="font-mono text-body-xs text-muted-foreground">{feeds}</span>
        </div>
      )}
    </div>
  );
}

// One composing-primitive row inside the spec panel: dim label + copyable var.
function Spec({ label, v }: { label: string; v: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-body-xs text-muted-foreground">{label}</span>
      <CopyToken value={v} />
    </div>
  );
}

function TypeRow({ token, family, size, px, lh, weight, use, sample, heading }: TypeToken & { heading?: boolean }) {
  return (
    <div className="flex flex-col gap-3 py-6">
      {/* Token name + live sample */}
      <CopyToken value={token} className="-ml-1.5 self-start" />
      <div className="flex items-baseline justify-between gap-4">
        <p className={`${token} ${heading ? "font-heading font-semibold" : "font-sans"} min-w-0 truncate text-foreground`}>
          {sample ?? "The quick brown fox"}
        </p>
        <p className="shrink-0 text-body-sm text-muted-foreground">{use}</p>
      </div>

      {/* Composition — the primitives this token resolves to, in a disclosure. */}
      <details className="group/spec rounded-lg bg-muted/50 [&[open]]:pb-2.5">
        <summary className="flex cursor-pointer list-none items-center gap-1.5 px-3 py-2 text-body-xs text-muted-foreground transition-colors hover:text-foreground">
          <ChevronRightIcon className="size-3.5 transition-transform group-open/spec:rotate-90" />
          Primitives
        </summary>
        <div className="flex flex-col gap-1.5 px-3">
          <Spec label="Family" v={`--font-family-${family}`} />
          <Spec label={`Size · ${px}px`} v={`--font-size-${size}`} />
          <Spec label="Leading" v={`--line-height-${lh}`} />
          <Spec label="Weight" v={`--font-weight-${weight}`} />
        </div>
      </details>
    </div>
  );
}

type View = "primitives" | "semantics";

export default function Typography() {
  const [view, setView] = React.useState<View>("semantics");

  return (
    <ContentCard className="h-full overflow-auto">
      <div className="mx-auto w-full max-w-4xl px-6 pt-16 max-sm:pt-28 max-sm:[@media(display-mode:standalone)]:pt-36 pb-10">
        <Link
          href="/box-system/foundations"
          className="mb-6 inline-flex items-center gap-1.5 text-body-sm text-muted-foreground transition-colors hover:text-foreground max-sm:hidden"
        >
          <ArrowLeftIcon className="size-4" />
          Foundations
        </Link>

        <div className="flex flex-col gap-4 mb-12">
          <div className="flex flex-col gap-3">
            <h1 className="text-h1 font-semibold">Typography</h1>
            <p className="text-body-lg text-muted-foreground">
              Type sets hierarchy and rhythm — a small, deliberate scale keeps the
              interface legible and consistent.
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
        {/* Fonts */}
        <section className="mb-14 flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-h3 font-semibold">Fonts</h2>
            <p className="text-body-sm text-muted-foreground">
              Three families — <span className="font-mono text-body-xs">font-sans</span>,{" "}
              <span className="font-mono text-body-xs">font-heading</span>, and{" "}
              <span className="font-mono text-body-xs">font-mono</span>.
            </p>
            <UsageHint>
              <span className="font-mono text-body-xs">font-sans</span> is the default —
              it&apos;s applied globally, so you rarely set it.{" "}
              <span className="font-mono text-body-xs">font-heading</span> is baked into the
              display and heading tokens; reach for{" "}
              <span className="font-mono text-body-xs">font-mono</span> for token names, code,
              and metadata labels.
            </UsageHint>
          </div>
          <div className="flex flex-col divide-y divide-border">
            {FONTS.map((f) => (
              <div key={f.token} className="flex flex-col gap-2 py-4">
                <CopyToken value={f.token} className="-ml-1.5 self-start" />
                <div className="flex items-baseline justify-between gap-4">
                  <p className={`${f.cls} min-w-0 truncate text-h4 text-foreground`}>{f.name} — Ag 123</p>
                  <p className="shrink-0 text-body-sm text-muted-foreground">{f.role}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Display */}
        <section className="mb-14 flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-h3 font-semibold">Display</h2>
            <p className="text-body-sm text-muted-foreground">
              Oversized type for hero moments. Set in{" "}
              <span className="font-mono text-body-xs">font-heading</span>.
            </p>
            <UsageHint>
              Reserve display sizes for landing pages and section intros — one per
              view, at most. Their tight leading (1–1.1) is tuned for a single line;
              don&apos;t use them for multi-line running text.
            </UsageHint>
          </div>
          <div className="flex flex-col divide-y divide-border">
            {DISPLAY.map((t) => (
              <TypeRow key={t.token} {...t} heading />
            ))}
          </div>
        </section>

        {/* Headings */}
        <section className="mb-14 flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-h3 font-semibold">Headings</h2>
            <p className="text-body-sm text-muted-foreground">
              Section titles, <span className="font-mono text-body-xs">text-h1</span> →{" "}
              <span className="font-mono text-body-xs">text-h6</span>. Set in{" "}
              <span className="font-mono text-body-xs">font-heading</span>.
            </p>
            <UsageHint>
              Pick heading levels by hierarchy, not by size — keep the order
              intact even when a lower level would &quot;look right,&quot; so the
              document outline stays meaningful.
            </UsageHint>
          </div>
          <div className="flex flex-col divide-y divide-border">
            {HEADINGS.map((t) => (
              <TypeRow key={t.token} {...t} heading />
            ))}
          </div>
        </section>

        {/* Body */}
        <section className="mb-14 flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-h3 font-semibold">Body</h2>
            <p className="text-body-sm text-muted-foreground">
              Running text, <span className="font-mono text-body-xs">text-body-lg</span> →{" "}
              <span className="font-mono text-body-xs">text-body-xs</span>. Set in{" "}
              <span className="font-mono text-body-xs">font-sans</span>.
            </p>
            <UsageHint>
              <span className="font-mono text-body-xs">text-body-md</span> is the
              default reading size. Body tokens carry looser leading (1.45–1.6) for
              comfortable multi-line text — the smaller sizes suit captions and
              dense UI, not long-form copy.
            </UsageHint>
          </div>
          <div className="flex flex-col divide-y divide-border">
            {BODY.map((t) => (
              <TypeRow key={t.token} {...t} />
            ))}
          </div>
        </section>

        {/* Weights */}
        <section className="mb-14 flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-h3 font-semibold">Weights</h2>
            <p className="text-body-sm text-muted-foreground">
              <span className="font-mono text-body-xs">font-normal</span> →{" "}
              <span className="font-mono text-body-xs">font-bold</span>.
            </p>
          </div>
          <div className="flex flex-col divide-y divide-border">
            {WEIGHTS.map((w) => (
              <div key={w.token} className="flex flex-col gap-2 py-4">
                <CopyToken value={w.token} className="-ml-1.5 self-start" />
                <div className="flex items-baseline justify-between gap-4">
                  <p className={`${w.cls} min-w-0 truncate text-h4 text-foreground`}>{w.name}</p>
                  <p className="shrink-0 text-body-sm text-muted-foreground">{w.use}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
        </>
        ) : (
        <>
        {/* Font families */}
        <section className="mb-14 flex flex-col gap-4">
          <h2 className="text-h3 font-semibold">Font families</h2>
          <div className="flex flex-col divide-y divide-border">
            {PRIM_FAMILIES.map((f) => (
              <VarRow key={f.v} {...f} />
            ))}
          </div>
        </section>

        {/* Font sizes */}
        <section className="mb-14 flex flex-col gap-4">
          <h2 className="text-h3 font-semibold">Font sizes</h2>
          <div className="flex flex-col divide-y divide-border">
            {PRIM_SIZES.map((s) => (
              <VarRow key={s.v} v={s.v} value={s.value} note={s.px} feeds={s.feeds} />
            ))}
          </div>
        </section>

        {/* Line heights */}
        <section className="mb-14 flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-h3 font-semibold">Line heights</h2>
            <p className="text-body-sm text-muted-foreground">
              A named tight→loose ramp. The semantic{" "}
              <span className="font-mono text-body-xs">text-*</span> tokens reference
              these, and they match Tailwind&apos;s{" "}
              <span className="font-mono text-body-xs">leading-*</span> utilities.
            </p>
          </div>
          <div className="flex flex-col divide-y divide-border">
            {PRIM_LINE_HEIGHTS.map((l) => (
              <VarRow key={l.v} v={l.v} value={l.value} feeds={l.feeds} />
            ))}
          </div>
        </section>

        {/* Font weights */}
        <section className="mb-14 flex flex-col gap-4">
          <h2 className="text-h3 font-semibold">Font weights</h2>
          <div className="flex flex-col divide-y divide-border">
            {PRIM_WEIGHTS.map((w) => (
              <VarRow key={w.v} {...w} />
            ))}
          </div>
        </section>
        </>
        )}
      </div>
    </ContentCard>
  );
}
