"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeftIcon, LightBulbIcon } from "@heroicons/react/24/outline";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/cardboard/accordion";
import { ContentCard } from "@/components/content-card";
import { CopyToken } from "@/components/copy-token";
import { SegmentedControl, SegmentedControlItem } from "@/components/cardboard/segmented-control";

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
  lh: string; // line-height primitive suffix (--line-height-*) or a literal
  weight: string; // weight primitive label
  tracking?: string; // letter-spacing primitive suffix (--letter-spacing-*)
  clamp?: string; // literal clamp() value for fluid (size === "fluid") tokens
  use: string; // per-token usage note
  sample?: string;
};

// Display — oversized, for hero moments. (font-display = Signifier serif)
const DISPLAY: TypeToken[] = [
  { token: "text-display-lg", family: "display", size: "fluid", px: "48–112", lh: "1.05", weight: "regular", tracking: "tighter", clamp: "clamp(3rem, 7vw, 7rem)", use: "Landing / splash hero — fluid, one per page." },
  { token: "text-display", family: "display", size: "fluid", px: "40–72", lh: "1.05", weight: "regular", tracking: "tight", clamp: "clamp(2.5rem, 5.5vw, 4.5rem)", use: "Section intros and splash / hero headings." },
  { token: "text-display-sm", family: "display", size: "5xl", px: "40", lh: "tight", weight: "regular", tracking: "snug", use: "Smaller feature headings." },
];

// Headings — section titles. (font-heading = Söhne)
const HEADINGS: TypeToken[] = [
  { token: "text-h1", family: "heading", size: "fluid", px: "28–36", lh: "tight", weight: "medium", tracking: "normal", clamp: "clamp(1.75rem, 4vw, 2.25rem)", use: "Page title." },
  { token: "text-h2", family: "heading", size: "fluid", px: "24–30", lh: "snug", weight: "medium", tracking: "normal", clamp: "clamp(1.5rem, 3.5vw, 1.875rem)", use: "Major section heading." },
  { token: "text-h3", family: "heading", size: "fluid", px: "20–24", lh: "snug", weight: "medium", tracking: "normal", clamp: "clamp(1.25rem, 2.5vw, 1.5rem)", use: "Subsection heading." },
  { token: "text-h4", family: "heading", size: "fluid", px: "18–20", lh: "snug", weight: "medium", tracking: "normal", clamp: "clamp(1.125rem, 2vw, 1.25rem)", use: "Card and group titles." },
  { token: "text-h5", family: "heading", size: "lg", px: "18", lh: "normal", weight: "medium", tracking: "normal", use: "Minor headings." },
  { token: "text-h6", family: "heading", size: "base", px: "16", lh: "normal", weight: "medium", tracking: "normal", use: "Smallest heading / eyebrow." },
];

// Eyebrow — the kicker/label above a heading. Composed: text-eyebrow token +
// uppercase + a serif family. (font-serif = Signifier.)
const EYEBROW: TypeToken = {
  token: "text-eyebrow", family: "serif", size: "sm", px: "14", lh: "none", weight: "medium", tracking: "wider",
  use: "Kicker / label above a heading.", sample: "Case study —",
};

// Body — running text. (font-sans = Plus Jakarta Sans)
const BODY: TypeToken[] = [
  { token: "text-body-lg", family: "sans", size: "lg", px: "18", lh: "loose", weight: "regular", tracking: "normal", use: "Intros and lead paragraphs.", sample: "The quick brown fox jumps over the lazy dog." },
  { token: "text-body-md", family: "sans", size: "base", px: "16", lh: "relaxed", weight: "regular", tracking: "normal", use: "Default reading size.", sample: "The quick brown fox jumps over the lazy dog." },
  { token: "text-body-sm", family: "sans", size: "sm", px: "14", lh: "normal", weight: "regular", tracking: "normal", use: "Secondary text and captions.", sample: "The quick brown fox jumps over the lazy dog." },
  { token: "text-body-xs", family: "sans", size: "xs", px: "12", lh: "normal", weight: "regular", tracking: "normal", use: "Fine print and dense UI labels.", sample: "The quick brown fox jumps over the lazy dog." },
];

const FONTS = [
  { token: "font-display", name: "Signifier", role: "Oversized hero display type.", cls: "font-display" },
  { token: "font-heading", name: "Söhne", role: "Headings (h1–h6) and UI.", cls: "font-heading" },
  { token: "font-sans", name: "Söhne", role: "UI and body copy.", cls: "font-sans" },
  { token: "font-serif", name: "Signifier", role: "Long-form reading body and eyebrows.", cls: "font-serif" },
  { token: "font-mono", name: "Signifier", role: "Token names and metadata labels.", cls: "font-mono" },
];

// Only the weights we've licensed real cuts for: Söhne Buch (400) + Kräftig
// (500), and Signifier Regular (400) + Medium (500). No 600/700 — the browser
// would synthesize those, so we don't advertise them.
const WEIGHTS = [
  { token: "font-normal", name: "Regular · 400", use: "Body copy and running text.", cls: "font-normal" },
  { token: "font-medium", name: "Medium · 500", use: "Headings, display, and UI emphasis.", cls: "font-medium" },
];

/* Primitives — the raw type values the semantic tokens map to. Reference-only.
   `feeds` is the semantic token(s) each primitive resolves into (composition,
   not usage — you never apply a primitive directly). */
const PRIM_FAMILIES = [
  { v: "--font-family-display", value: "Signifier", feeds: "text-display*" },
  { v: "--font-family-heading", value: "Söhne", feeds: "text-h*" },
  { v: "--font-family-sans", value: "Söhne", feeds: "text-body-*" },
  { v: "--font-family-serif", value: "Signifier", feeds: "font-serif" },
  { v: "--font-family-mono", value: "Signifier", feeds: "font-mono" },
];
const PRIM_SIZES = [
  { v: "--font-size-7xl", value: "4.5rem", px: "72", feeds: "— (display-lg is fluid)" },
  { v: "--font-size-6xl", value: "3.5rem", px: "56", feeds: "— (display is fluid)" },
  { v: "--font-size-5xl", value: "2.5rem", px: "40", feeds: "text-display-sm" },
  { v: "--font-size-4xl", value: "2.25rem", px: "36", feeds: "— (h1 is fluid)" },
  { v: "--font-size-3xl", value: "1.875rem", px: "30", feeds: "— (h2 is fluid)" },
  { v: "--font-size-2xl", value: "1.5rem", px: "24", feeds: "— (h3 is fluid)" },
  { v: "--font-size-xl", value: "1.25rem", px: "20", feeds: "— (h4 is fluid)" },
  { v: "--font-size-lg", value: "1.125rem", px: "18", feeds: "text-h5, text-body-lg" },
  { v: "--font-size-base", value: "1rem", px: "16", feeds: "text-h6, text-body-md" },
  { v: "--font-size-sm", value: "0.875rem", px: "14", feeds: "text-body-sm" },
  { v: "--font-size-xs", value: "0.75rem", px: "12", feeds: "text-body-xs" },
];
const PRIM_WEIGHTS = [
  { v: "--font-weight-regular", value: "400", feeds: "text-body-*, text-display*" },
  { v: "--font-weight-medium", value: "500", feeds: "text-h*" },
  { v: "--font-weight-semibold", value: "600", feeds: "unused (no cut)" },
  { v: "--font-weight-bold", value: "700", feeds: "unused (no cut)" },
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
// Letter spacing (tracking) — named tight→wide ramp. Large display is tracked
// tight; eyebrows wide.
const PRIM_LETTER_SPACING = [
  { v: "--letter-spacing-tighter", value: "-0.03em", feeds: "display-lg" },
  { v: "--letter-spacing-tight", value: "-0.025em", feeds: "display" },
  { v: "--letter-spacing-snug", value: "-0.01em", feeds: "display-sm" },
  { v: "--letter-spacing-normal", value: "0em", feeds: "—" },
  { v: "--letter-spacing-wide", value: "0.01em", feeds: "h1–h3" },
  { v: "--letter-spacing-wider", value: "0.05em", feeds: "eyebrow" },
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

function TypeRow({ token, family, size, px, lh, weight, tracking, clamp, use, sample, variant = "body" }: TypeToken & { variant?: "body" | "heading" | "display" | "eyebrow" }) {
  const fontClass =
    variant === "display" ? "font-display"
    : variant === "heading" ? "font-heading"
    : variant === "eyebrow" ? "font-serif uppercase text-tertiary"
    : "font-sans";
  return (
    <div className="flex flex-col gap-3 py-6">
      {/* Token name + live sample */}
      <CopyToken value={token} className="-ml-1.5 self-start" />
      <div className="flex items-baseline justify-between gap-4">
        <p className={`${token} ${fontClass} min-w-0 truncate text-foreground`}>
          {sample ?? "The quick brown fox"}
        </p>
        <p className="shrink-0 text-body-sm text-muted-foreground">{use}</p>
      </div>

      {/* Composition — the primitives this token resolves to, in the inline
          Accordion (the Cardboard component this disclosure style is a variant of). */}
      <Accordion variant="inline" type="single" collapsible>
        <AccordionItem value="primitives" className="rounded-lg bg-muted/50 px-3">
          <AccordionTrigger>Primitives</AccordionTrigger>
          <AccordionContent className="flex flex-col gap-1.5 pl-5">
            <Spec label="Family" v={`--font-family-${family}`} />
            {size === "fluid" ? (
              <Spec label={`Size · ${px}px`} v={clamp ?? "clamp(...)"} />
            ) : (
              <Spec label={`Size · ${px}px`} v={`--font-size-${size}`} />
            )}
            {/* named ramp key vs literal (fluid tokens use a raw line-height) */}
            {/^[a-z]+$/.test(lh) ? (
              <Spec label="Leading" v={`--line-height-${lh}`} />
            ) : (
              <Spec label="Leading" v={lh} />
            )}
            <Spec label="Tracking" v={`--letter-spacing-${tracking ?? "normal"}`} />
            <Spec label="Weight" v={`--font-weight-${weight}`} />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}

type View = "primitives" | "semantics";

export default function Typography() {
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
            <h1 className="text-h1">Typography</h1>
            <p className="text-body-lg text-muted-foreground">
              Type sets hierarchy and rhythm — a small, deliberate scale keeps the
              interface legible and consistent.
            </p>
          </div>
          {/* Primitives / Semantics toggle */}
          <SegmentedControl value={view} onValueChange={(v) => setView(v as View)}>
            <SegmentedControlItem value="primitives">Primitives</SegmentedControlItem>
            <SegmentedControlItem value="semantics">Semantics</SegmentedControlItem>
          </SegmentedControl>
        </div>

        {view === "semantics" && (
        <>
        {/* Fonts */}
        <section className="mb-14 flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-h3">Fonts</h2>
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
            <h2 className="text-h3">Display</h2>
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
              <TypeRow key={t.token} {...t} variant="display" />
            ))}
          </div>
        </section>

        {/* Eyebrow */}
        <section className="mb-14 flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-h3">Eyebrow</h2>
            <p className="text-body-sm text-muted-foreground">
              The kicker/label above a heading. The{" "}
              <span className="font-mono text-body-xs">text-eyebrow</span> token
              carries the size, wide tracking, and tight leading; pair it with{" "}
              <span className="font-mono text-body-xs">uppercase</span> and{" "}
              <span className="font-mono text-body-xs">font-serif</span> in markup.
            </p>
            <UsageHint>
              <span className="font-mono text-body-xs">text-transform</span> can&apos;t
              live on a <span className="font-mono text-body-xs">text-*</span> token,
              so the <span className="font-mono text-body-xs">uppercase</span> comes
              from the utility. Typically set in{" "}
              <span className="font-mono text-body-xs">text-tertiary</span> above a
              display or heading.
            </UsageHint>
          </div>
          <div className="flex flex-col divide-y divide-border">
            <TypeRow {...EYEBROW} variant="eyebrow" />
          </div>
        </section>

        {/* Headings */}
        <section className="mb-14 flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-h3">Headings</h2>
            <p className="text-body-sm text-muted-foreground">
              Section titles, <span className="font-mono text-body-xs">text-h1</span> →{" "}
              <span className="font-mono text-body-xs">text-h6</span>. Set in{" "}
              <span className="font-mono text-body-xs">font-heading</span>.
            </p>
            <UsageHint>
              Pick heading levels by hierarchy, not by size — keep the order
              intact even when a lower level would &quot;look right,&quot; so the
              document outline stays meaningful. <span className="font-mono text-body-xs">h1</span>–
              <span className="font-mono text-body-xs">h4</span> are fluid (they
              shrink on mobile via <span className="font-mono text-body-xs">clamp()</span>);
              body sizes stay fixed for readability.
            </UsageHint>
          </div>
          <div className="flex flex-col divide-y divide-border">
            {HEADINGS.map((t) => (
              <TypeRow key={t.token} {...t} variant="heading" />
            ))}
          </div>
        </section>

        {/* Body */}
        <section className="mb-14 flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-h3">Body</h2>
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
            <h2 className="text-h3">Weights</h2>
            <p className="text-body-sm text-muted-foreground">
              Two licensed cuts:{" "}
              <span className="font-mono text-body-xs">font-normal</span> (400) and{" "}
              <span className="font-mono text-body-xs">font-medium</span> (500).
            </p>
            <UsageHint>
              Söhne and Signifier are licensed at Regular (400) and Medium (500)
              only. Avoid <span className="font-mono text-body-xs">font-semibold</span>{" "}
              and <span className="font-mono text-body-xs">font-bold</span> — there&apos;s
              no real cut, so the browser synthesizes a faux weight.
            </UsageHint>
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
        )}

        {view === "primitives" && (
        <>
        {/* Font families */}
        <section className="mb-14 flex flex-col gap-4">
          <h2 className="text-h3">Font families</h2>
          <div className="flex flex-col divide-y divide-border">
            {PRIM_FAMILIES.map((f) => (
              <VarRow key={f.v} {...f} />
            ))}
          </div>
        </section>

        {/* Font sizes */}
        <section className="mb-14 flex flex-col gap-4">
          <h2 className="text-h3">Font sizes</h2>
          <div className="flex flex-col divide-y divide-border">
            {PRIM_SIZES.map((s) => (
              <VarRow key={s.v} v={s.v} value={s.value} note={s.px} feeds={s.feeds} />
            ))}
          </div>
        </section>

        {/* Line heights */}
        <section className="mb-14 flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-h3">Line heights</h2>
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

        {/* Letter spacing */}
        <section className="mb-14 flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-h3">Letter spacing</h2>
            <p className="text-body-sm text-muted-foreground">
              A named tight→wide tracking ramp. Large display type is set tight;
              eyebrows and small caps are set wide. The semantic{" "}
              <span className="font-mono text-body-xs">text-*</span> tokens
              reference these.
            </p>
          </div>
          <div className="flex flex-col divide-y divide-border">
            {PRIM_LETTER_SPACING.map((l) => (
              <VarRow key={l.v} v={l.v} value={l.value} feeds={l.feeds} />
            ))}
          </div>
        </section>

        {/* Font weights */}
        <section className="mb-14 flex flex-col gap-4">
          <h2 className="text-h3">Font weights</h2>
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
