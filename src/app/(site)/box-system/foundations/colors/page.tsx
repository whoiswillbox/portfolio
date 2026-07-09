import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { ContentCard } from "@/components/content-card";

/* Living reference — swatches render the ACTUAL CSS variables the app uses, so
   this page always reflects the real tokens (and updates with the theme). */

// Semantic role tokens (shadcn vocabulary). Rendered via their CSS var so they
// are theme-aware. `fg` is the paired foreground for showing legible text.
const SEMANTIC: { name: string; varName: string; fg?: string }[] = [
  { name: "background", varName: "--background", fg: "--foreground" },
  { name: "foreground", varName: "--foreground", fg: "--background" },
  { name: "card", varName: "--card", fg: "--card-foreground" },
  { name: "popover", varName: "--popover", fg: "--popover-foreground" },
  { name: "primary", varName: "--primary", fg: "--primary-foreground" },
  { name: "secondary", varName: "--secondary", fg: "--secondary-foreground" },
  { name: "muted", varName: "--muted", fg: "--muted-foreground" },
  { name: "accent", varName: "--accent", fg: "--accent-foreground" },
  { name: "destructive", varName: "--destructive", fg: "--background" },
  { name: "border", varName: "--border", fg: "--foreground" },
  { name: "input", varName: "--input", fg: "--foreground" },
  { name: "ring", varName: "--ring", fg: "--background" },
  { name: "sidebar", varName: "--sidebar", fg: "--sidebar-foreground" },
  { name: "sidebar-accent", varName: "--sidebar-accent", fg: "--sidebar-accent-foreground" },
  { name: "sidebar-border", varName: "--sidebar-border", fg: "--sidebar-foreground" },
];

// Neutral surfaces — PatternFly prominence system. `bg-surface` is the highest
// prominence (a card); each has interaction states. token = the Tailwind utility;
// v = the live CSS var the swatch renders (theme-aware).
const SURFACES: { token: string; v: string; description: string }[] = [
  { token: "bg-p-bg", v: "--p-bg", description: "The default page background." },
  { token: "bg-p-bg-inverse", v: "--p-bg-inverse", description: "High-contrast inverse background." },
  { token: "bg-p-bg-surface", v: "--p-bg-surface", description: "Highest prominence surface, like a card." },
  { token: "bg-p-bg-surface-hover", v: "--p-bg-surface-hover", description: "Hover state for the highest-prominence surface." },
  { token: "bg-p-bg-surface-active", v: "--p-bg-surface-active", description: "Active (on-press) state for the highest-prominence surface." },
  { token: "bg-p-bg-surface-selected", v: "--p-bg-surface-selected", description: "Selected state for the highest-prominence surface." },
  { token: "bg-p-bg-surface-disabled", v: "--p-bg-surface-disabled", description: "Disabled state for elements." },
  { token: "bg-p-bg-surface-secondary", v: "--p-bg-surface-secondary", description: "Second level of prominence." },
  { token: "bg-p-bg-surface-secondary-hover", v: "--p-bg-surface-secondary-hover", description: "Hover state for the second level of prominence." },
  { token: "bg-p-bg-surface-secondary-active", v: "--p-bg-surface-secondary-active", description: "Active (on-press) state for the second level of prominence." },
  { token: "bg-p-bg-surface-secondary-selected", v: "--p-bg-surface-secondary-selected", description: "Selected state for the second level of prominence." },
  { token: "bg-p-bg-surface-tertiary", v: "--p-bg-surface-tertiary", description: "Third level of prominence." },
  { token: "bg-p-bg-surface-tertiary-hover", v: "--p-bg-surface-tertiary-hover", description: "Hover state for the third level of prominence." },
  { token: "bg-p-bg-surface-tertiary-active", v: "--p-bg-surface-tertiary-active", description: "Active (on-press) state for the third level of prominence." },
];

// Text tokens — the swatch shows the color as a filled chip (text colors are
// hard to read as a pale swatch, so we fill a chip with the text color).
const TEXTS: { token: string; v: string; description: string }[] = [
  { token: "text-p-text", v: "--p-text", description: "Default, highest-contrast text." },
  { token: "text-p-text-secondary", v: "--p-text-secondary", description: "Secondary text, slightly reduced prominence." },
  { token: "text-p-text-subtle", v: "--p-text-subtle", description: "Subtle / muted text and captions." },
  { token: "text-p-text-disabled", v: "--p-text-disabled", description: "Disabled text." },
  { token: "text-p-text-on-inverse", v: "--p-text-on-inverse", description: "Text on top of an inverse background." },
];

const BORDERS: { token: string; v: string; description: string }[] = [
  { token: "border-p-border", v: "--p-border", description: "Default border for separating elements." },
  { token: "border-p-border-subtle", v: "--p-border-subtle", description: "Subtle, low-contrast divider." },
  { token: "border-p-border-strong", v: "--p-border-strong", description: "Stronger, higher-contrast border." },
];

function SurfaceRow({ token, v, description, swatch }: { token: string; v: string; description: string; swatch?: React.ReactNode }) {
  return (
    <div className="flex items-center gap-4 py-3">
      {swatch ?? (
        <div className="size-12 shrink-0 rounded-lg border border-border" style={{ background: `var(${v})` }} />
      )}
      <div className="w-72 shrink-0 max-sm:w-40">
        <div className="font-mono text-body-xs text-foreground">{token}</div>
        <div className="font-mono text-[0.65rem] text-muted-foreground">var({v})</div>
      </div>
      <div className="flex-1 text-left text-body-sm text-muted-foreground">{description}</div>
    </div>
  );
}

// Intent tokens (PatternFly-style `p-` scheme). Each intent has a pale surface
// (+hover/active), a saturated accent (text/border), and a solid fill. Swatches
// render the live internal vars these map to, so they stay in sync + theme-aware.
const INTENTS = ["brand", "info", "success", "caution", "critical"] as const;
function IntentRow({ intent }: { intent: (typeof INTENTS)[number] }) {
  const surfaces = [
    { token: `p-surface-${intent}`, v: `--surface-${intent}` },
    { token: `p-surface-${intent}-hover`, v: `--surface-${intent}-hover` },
    { token: `p-surface-${intent}-active`, v: `--surface-${intent}-active` },
  ];
  return (
    <div className="flex flex-col gap-2">
      <h3 className="font-mono text-body-xs font-medium uppercase tracking-wide text-muted-foreground">
        {intent}
      </h3>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
        {surfaces.map((s) => (
          <Swatch key={s.token} token={`bg-${s.token}`} v={s.v} />
        ))}
        <Swatch token={`text-p-${intent}`} v={`--accent-${intent}`} />
        <Swatch token={`bg-p-fill-${intent}`} v={`--fill-${intent}`} />
      </div>
    </div>
  );
}

function Swatch({ token, v }: { token: string; v: string }) {
  return (
    <div className="flex flex-col gap-1">
      <div className="h-12 rounded-lg border border-border" style={{ background: `var(${v})` }} />
      <span className="font-mono text-[0.6rem] leading-tight text-muted-foreground break-all">{token}</span>
    </div>
  );
}

// Primitive ramps — raw palette values (context-free). Var names match colors.css.
const STEPS = ["50", "100", "200", "300", "400", "500", "600", "700", "800", "900"] as const;
const RAMPS: { name: string; prefix: string; steps: readonly string[] }[] = [
  { name: "Neutral (taupe)", prefix: "--neutral", steps: ["0", "50", "100", "200", "300", "400", "500", "600", "700", "800", "900", "950", "1000"] },
  { name: "Brand", prefix: "--brand", steps: [...STEPS, "950"] },
  { name: "Blue — info", prefix: "--blue", steps: STEPS },
  { name: "Green — success", prefix: "--green", steps: STEPS },
  { name: "Amber — caution", prefix: "--amber", steps: STEPS },
  { name: "Red — critical", prefix: "--red", steps: STEPS },
];

function SemanticSwatch({ name, varName, fg }: { name: string; varName: string; fg?: string }) {
  return (
    <div className="flex flex-col gap-2">
      <div
        className="flex h-20 items-end rounded-xl border border-border p-2"
        style={{ background: `var(${varName})`, color: fg ? `var(${fg})` : undefined }}
      >
        <span className="font-mono text-body-xs">{name}</span>
      </div>
      <div className="px-0.5">
        <div className="font-mono text-body-xs text-foreground">{name}</div>
        <div className="font-mono text-[0.65rem] text-muted-foreground">var({varName})</div>
      </div>
    </div>
  );
}

function RampRow({ name, prefix, steps }: { name: string; prefix: string; steps: readonly string[] }) {
  return (
    <div className="flex flex-col gap-2">
      <h3 className="font-mono text-body-xs font-medium uppercase tracking-wide text-muted-foreground">
        {name}
      </h3>
      <div className="grid grid-cols-6 gap-1.5 sm:grid-cols-10">
        {steps.map((step) => (
          <div key={step} className="flex flex-col gap-1">
            <div
              className="h-12 rounded-lg border border-border"
              style={{ background: `var(${prefix}-${step})` }}
            />
            <span className="text-center font-mono text-[0.6rem] text-muted-foreground">{step}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Colors() {
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

        <div className="flex flex-col gap-3 mb-12">
          <h1 className="text-h1 font-semibold">Colors</h1>
          <p className="text-body-lg text-muted-foreground">
            The live color tokens Cardboard uses. Swatches render the actual CSS
            variables, so this page stays in sync and reflects the current theme.
          </p>
        </div>

        {/* Semantic tokens */}
        <section className="mb-14 flex flex-col gap-5">
          <div className="flex flex-col gap-1">
            <h2 className="text-h3 font-semibold">Semantic roles</h2>
            <p className="text-body-sm text-muted-foreground">
              Theme-aware role tokens consumed by components. Always use these in
              the UI — never a raw ramp value.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {SEMANTIC.map((t) => (
              <SemanticSwatch key={t.name} {...t} />
            ))}
          </div>
        </section>

        {/* Neutral surfaces (PatternFly prominence system) */}
        <section className="mb-14 flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-h3 font-semibold">Surfaces</h2>
            <p className="text-body-sm text-muted-foreground">
              Neutral backgrounds by prominence, with interaction states —{" "}
              <span className="font-mono text-body-xs">bg-p-bg-surface</span> and friends.
            </p>
          </div>
          <div className="flex flex-col divide-y divide-border">
            {SURFACES.map((s) => (
              <SurfaceRow key={s.token} {...s} />
            ))}
          </div>
        </section>

        {/* Text tokens */}
        <section className="mb-14 flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-h3 font-semibold">Text</h2>
            <p className="text-body-sm text-muted-foreground">
              Foreground text by prominence —{" "}
              <span className="font-mono text-body-xs">text-p-text</span> and friends.
            </p>
          </div>
          <div className="flex flex-col divide-y divide-border">
            {TEXTS.map((t) => (
              <SurfaceRow
                key={t.token}
                {...t}
                swatch={
                  <div
                    className="flex size-12 shrink-0 items-center justify-center rounded-lg border border-border bg-p-bg-surface"
                    style={{ color: `var(${t.v})` }}
                  >
                    <span className="font-heading text-body-lg">Aa</span>
                  </div>
                }
              />
            ))}
          </div>
        </section>

        {/* Border tokens */}
        <section className="mb-14 flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-h3 font-semibold">Borders</h2>
            <p className="text-body-sm text-muted-foreground">
              Dividers and outlines by prominence —{" "}
              <span className="font-mono text-body-xs">border-p-border</span> and friends.
            </p>
          </div>
          <div className="flex flex-col divide-y divide-border">
            {BORDERS.map((b) => (
              <SurfaceRow
                key={b.token}
                {...b}
                swatch={
                  <div
                    className="size-12 shrink-0 rounded-lg bg-p-bg-surface"
                    style={{ border: `2px solid var(${b.v})` }}
                  />
                }
              />
            ))}
          </div>
        </section>

        {/* Intent tokens */}
        <section className="mb-14 flex flex-col gap-6">
          <div className="flex flex-col gap-1">
            <h2 className="text-h3 font-semibold">Intents</h2>
            <p className="text-body-sm text-muted-foreground">
              Status colors — <span className="font-mono text-body-xs">p-surface-*</span> (pale
              bg), <span className="font-mono text-body-xs">p-*</span> (accent text/border), and{" "}
              <span className="font-mono text-body-xs">p-fill-*</span> (solid).
            </p>
          </div>
          {INTENTS.map((intent) => (
            <IntentRow key={intent} intent={intent} />
          ))}
        </section>

        {/* Primitive ramps */}
        <section className="flex flex-col gap-8">
          <div className="flex flex-col gap-1">
            <h2 className="text-h3 font-semibold">Primitive ramps</h2>
            <p className="text-body-sm text-muted-foreground">
              The raw palette. Reference-only — the semantic layer maps these to
              roles.
            </p>
          </div>
          {RAMPS.map((ramp) => (
            <RampRow key={ramp.prefix} {...ramp} />
          ))}
        </section>
      </div>
    </ContentCard>
  );
}
