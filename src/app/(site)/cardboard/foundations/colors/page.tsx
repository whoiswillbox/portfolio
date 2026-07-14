"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeftIcon, LightBulbIcon } from "@heroicons/react/24/outline";
import { ContentCard } from "@/components/content-card";
import { CopyToken } from "@/components/copy-token";
import { SegmentedControl, SegmentedControlItem } from "@/components/cardboard/segmented-control";

/* Living reference — swatches render the ACTUAL CSS variables the app uses, so
   this page always reflects the real tokens (and updates with the theme). */

/* Build a map of custom-property → its RAW declared value by scanning every
   stylesheet rule (computed style flattens var() chains, so we must read the
   source declarations). THEME-AWARE: a token declared in both :root (light) and
   `.dark` must resolve to the ACTIVE theme's value. Since later rules overwrite
   earlier ones in the map, we skip `.dark`-scoped rules when light is active and
   skip light-only (:root) overrides of dark tokens when dark is active — i.e.
   only apply a rule if its selector matches the current theme. */
function collectVarDeclarations(): Map<string, string> {
  const map = new Map<string, string>();
  const isDark = document.documentElement.classList.contains("dark");
  for (const sheet of Array.from(document.styleSheets)) {
    let rules: CSSRuleList;
    try {
      rules = sheet.cssRules;
    } catch {
      continue; // cross-origin sheet — skip
    }
    const walk = (list: CSSRuleList) => {
      for (const rule of Array.from(list)) {
        if (rule instanceof CSSStyleRule) {
          // Only apply rules whose selector matches the active theme. A `.dark`
          // scoped rule applies only in dark mode; everything else (:root, etc.)
          // is base/light and is overridden by .dark when dark is active.
          const isDarkRule = /(^|[\s,>+~])\.dark\b/.test(rule.selectorText);
          if (isDarkRule && !isDark) continue; // skip dark rules in light mode
          const style = rule.style;
          for (let i = 0; i < style.length; i++) {
            const prop = style[i];
            if (prop.startsWith("--")) map.set(prop, style.getPropertyValue(prop).trim());
          }
        } else if ("cssRules" in rule) {
          walk((rule as CSSGroupingRule).cssRules);
        }
      }
    };
    walk(rules);
  }
  return map;
}

/* Resolve a semantic color var to the leaf PRIMITIVE it references (e.g.
   --p-text-tertiary → --neutral-500, --surface-success → --green-50). Follows the
   raw var() chain via the declaration map, then confirms against the live
   computed value so the theme-dependent hop resolves correctly. Returns the
   terminal ramp var name (with leading --), or null. */
function useLeafPrimitive(v: string | undefined): string | null {
  const [leaf, setLeaf] = React.useState<string | null>(null);
  React.useEffect(() => {
    if (!v || !v.startsWith("--")) {
      setLeaf(null);
      return;
    }
    const resolve = () => {
      const decls = collectVarDeclarations();
      const computed = getComputedStyle(document.documentElement);
      const target = computed.getPropertyValue(v).trim(); // the live (theme) value
      let name = v;
      for (let i = 0; i < 10; i++) {
        const raw = decls.get(name);
        if (!raw) break;
        const match = /var\(\s*(--[\w-]+)/.exec(raw);
        if (!match) break; // literal color → name is the leaf
        // If a var has light/dark variants, pick the branch whose computed value
        // matches the live target (so dark mode resolves to its own ramp step).
        const candidates = Array.from(raw.matchAll(/var\(\s*(--[\w-]+)/g)).map((m) => m[1]);
        const next =
          candidates.find((c) => computed.getPropertyValue(c).trim() === target) ?? match[1];
        if (next === name) break;
        name = next;
      }
      setLeaf(name !== v ? name : null);
    };
    resolve();
    const obs = new MutationObserver(resolve);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class", "data-theme"] });
    return () => obs.disconnect();
  }, [v]);
  return leaf;
}

// Small guidance line shown under a section's description — how/when to use.
function UsageHint({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2 rounded-lg bg-muted/60 px-3 py-2 text-body-sm text-muted-foreground">
      <LightBulbIcon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
      <p>{children}</p>
    </div>
  );
}

// Component-specific role tokens (shadcn vocabulary) that aren't covered by the
// foundational Background/Text/Borders families — button colors, focus ring, and
// the sidebar theming. Rendered as solid swatches like the other sections.
const COMPONENTS: { token: string; v: string; description: string }[] = [
  { token: "bg-primary", v: "--primary", description: "Primary action color (e.g. filled buttons)." },
  { token: "text-primary-foreground", v: "--primary-foreground", description: "Text/icon on top of a primary fill." },
  { token: "bg-destructive", v: "--destructive", description: "Destructive action color." },
  { token: "ring-ring", v: "--ring", description: "Focus ring color." },
  { token: "bg-sidebar", v: "--sidebar", description: "Sidebar background." },
  { token: "bg-sidebar-accent", v: "--sidebar-accent", description: "Sidebar hovered / active item background." },
  { token: "border-sidebar-border", v: "--sidebar-border", description: "Sidebar borders and dividers." },
];

// Neutral surfaces — PatternFly prominence system. `bg-surface` is the highest
// prominence (a card); each has interaction states. token = the Tailwind utility;
// v = the live CSS var the swatch renders (theme-aware).
const SURFACES: { token: string; v: string; description: string }[] = [
  { token: "bg-page", v: "--p-bg", description: "The default page background." },
  { token: "bg-inverse", v: "--p-bg-inverse", description: "High-contrast inverse background." },
  { token: "bg-surface", v: "--p-bg-surface", description: "Highest prominence surface, like a card." },
  { token: "bg-surface-hover", v: "--p-bg-surface-hover", description: "Hover state for the highest-prominence surface." },
  { token: "bg-surface-active", v: "--p-bg-surface-active", description: "Active (on-press) state for the highest-prominence surface." },
  { token: "bg-surface-selected", v: "--p-bg-surface-selected", description: "Selected state for the highest-prominence surface." },
  { token: "bg-surface-disabled", v: "--p-bg-surface-disabled", description: "Disabled state for elements." },
  { token: "bg-surface-secondary", v: "--p-bg-surface-secondary", description: "Second level of prominence." },
  { token: "bg-surface-secondary-hover", v: "--p-bg-surface-secondary-hover", description: "Hover state for the second level of prominence." },
  { token: "bg-surface-secondary-active", v: "--p-bg-surface-secondary-active", description: "Active (on-press) state for the second level of prominence." },
  { token: "bg-surface-secondary-selected", v: "--p-bg-surface-secondary-selected", description: "Selected state for the second level of prominence." },
  { token: "bg-surface-tertiary", v: "--p-bg-surface-tertiary", description: "Third level of prominence." },
  { token: "bg-surface-tertiary-hover", v: "--p-bg-surface-tertiary-hover", description: "Hover state for the third level of prominence." },
  { token: "bg-surface-tertiary-active", v: "--p-bg-surface-tertiary-active", description: "Active (on-press) state for the third level of prominence." },
  // Solid action fill — the high-contrast neutral for primary buttons.
  { token: "bg-fill-solid", v: "--p-fill-solid", description: "Solid neutral fill for the primary action (buttons)." },
  { token: "bg-fill-solid-hover", v: "--p-fill-solid-hover", description: "Hover state for the solid action fill." },
  // Intent surfaces (pale tinted backgrounds) — bg-surface-info / bg-surface-success / …
  { token: "bg-surface-brand", v: "--surface-brand", description: "Pale surface communicating brand." },
  { token: "bg-surface-brand-hover", v: "--surface-brand-hover", description: "Hover state for the brand surface." },
  { token: "bg-surface-brand-active", v: "--surface-brand-active", description: "Active state for the brand surface." },
  { token: "bg-surface-info", v: "--surface-info", description: "Pale surface communicating information." },
  { token: "bg-surface-info-hover", v: "--surface-info-hover", description: "Hover state for the info surface." },
  { token: "bg-surface-info-active", v: "--surface-info-active", description: "Active state for the info surface." },
  { token: "bg-surface-success", v: "--surface-success", description: "Pale surface communicating success." },
  { token: "bg-surface-success-hover", v: "--surface-success-hover", description: "Hover state for the success surface." },
  { token: "bg-surface-success-active", v: "--surface-success-active", description: "Active state for the success surface." },
  { token: "bg-surface-caution", v: "--surface-caution", description: "Pale surface communicating caution." },
  { token: "bg-surface-caution-hover", v: "--surface-caution-hover", description: "Hover state for the caution surface." },
  { token: "bg-surface-caution-active", v: "--surface-caution-active", description: "Active state for the caution surface." },
  { token: "bg-surface-critical", v: "--surface-critical", description: "Pale surface communicating a critical / error state." },
  { token: "bg-surface-critical-hover", v: "--surface-critical-hover", description: "Hover state for the critical surface." },
  { token: "bg-surface-critical-active", v: "--surface-critical-active", description: "Active state for the critical surface." },
  // Fills (solid intent backgrounds) — bg-fill-info / bg-fill-success / …
  { token: "bg-fill-brand", v: "--fill-brand", description: "Solid brand background." },
  { token: "bg-fill-brand-hover", v: "--fill-brand-hover", description: "Hover state for the brand fill." },
  { token: "bg-fill-info", v: "--fill-info", description: "Solid background communicating information." },
  { token: "bg-fill-info-hover", v: "--fill-info-hover", description: "Hover state for the info fill." },
  { token: "bg-fill-success", v: "--fill-success", description: "Solid background communicating success." },
  { token: "bg-fill-success-hover", v: "--fill-success-hover", description: "Hover state for the success fill." },
  { token: "bg-fill-caution", v: "--fill-caution", description: "Solid background communicating caution." },
  { token: "bg-fill-caution-hover", v: "--fill-caution-hover", description: "Hover state for the caution fill." },
  { token: "bg-fill-critical", v: "--fill-critical", description: "Solid background communicating a critical / error state." },
  { token: "bg-fill-critical-hover", v: "--fill-critical-hover", description: "Hover state for the critical fill." },
];

// Text tokens — the swatch shows the color as a filled chip (text colors are
// hard to read as a pale swatch, so we fill a chip with the text color).
const TEXTS: { token: string; v: string; description: string }[] = [
  { token: "text-foreground", v: "--p-text", description: "The default text color (highest prominence)." },
  { token: "text-secondary", v: "--p-text-secondary", description: "Supporting text — subheads and secondary labels." },
  { token: "text-tertiary", v: "--p-text-tertiary", description: "Muted text, captions, and metadata." },
  { token: "text-quaternary", v: "--p-text-quaternary", description: "Lowest-prominence text — placeholders, hints." },
  { token: "text-disabled", v: "--p-text-disabled", description: "Text in a disabled state." },
  { token: "text-on-inverse", v: "--p-text-on-inverse", description: "Text on top of an inverse background." },
  { token: "text-on-solid", v: "--p-text-on-solid", description: "Text/icon on top of a solid action fill." },
  { token: "text-link", v: "--p-text-link", description: "Text links." },
  { token: "text-link-hover", v: "--p-text-link-hover", description: "Hover state for text links." },
  { token: "text-link-active", v: "--p-text-link-active", description: "Active (on-press) state for text links." },
  { token: "text-brand", v: "--p-text-brand", description: "Text that needs to pull attention." },
  { token: "text-brand-hover", v: "--p-text-brand-hover", description: "Hover state for attention-pulling text." },
  // Intent text (saturated accents) — text-info / text-success / …
  { token: "text-info", v: "--accent-info", description: "Text communicating information." },
  { token: "text-success", v: "--accent-success", description: "Text communicating success." },
  { token: "text-caution", v: "--accent-caution", description: "Text communicating caution." },
  { token: "text-critical", v: "--accent-critical", description: "Text communicating a critical / error state." },
];

const BORDERS: { token: string; v: string; description: string }[] = [
  { token: "border", v: "--p-border", description: "Default border for separating elements." },
  { token: "border-divider", v: "--p-border-divider", description: "Lighter hairline for dividers between rows and sections (Separator)." },
  { token: "border-hover", v: "--p-border-hover", description: "Hover state — a stronger, darker border." },
  { token: "border-disabled", v: "--p-border-disabled", description: "Disabled state border." },
  { token: "border-subtle", v: "--p-border-secondary", description: "Subtle, low-contrast divider." },
  { token: "border-strong", v: "--p-border-tertiary", description: "Stronger, higher-contrast border." },
  { token: "border-focus", v: "--p-border-focus", description: "Focus ring / active outline." },
  // Intent borders (saturated accents) — border-info / border-success / …
  { token: "border-info", v: "--accent-info", description: "Border communicating information." },
  { token: "border-success", v: "--accent-success", description: "Border communicating success." },
  { token: "border-caution", v: "--accent-caution", description: "Border communicating caution." },
  { token: "border-critical", v: "--accent-critical", description: "Border communicating a critical / error state." },
];

// The public design-token var for a utility (what a consumer would reference in
// CSS), derived from the token by stripping the property prefix: e.g.
// "text-text-link" → "--color-content-link". Primitives (already a --var
// passed as the token) fall through unchanged. The swatch still RENDERS from the
// internal `v` (which may be a private --p-* var), but we never surface that.
function publicVar(token: string, v: string): string {
  // A bare property utility (e.g. "border") maps to --color-{property}.
  if (/^(bg|text|border|ring|fill|stroke)$/.test(token)) return `--color-${token}`;
  // Primitive ramp rows pass a raw ramp var as `v` (e.g. --neutral-500) and the
  // token is the same name without the leading dashes → show the ramp var itself.
  if (!/^(bg|text|border|ring|fill|stroke)-/.test(token)) return v;
  const name = token.replace(/^(bg|text|border|ring|fill|stroke)-/, "");
  return `--color-${name}`;
}

function SurfaceRow({ token, v, description, swatch, copyAs }: { token: string; v: string; description: string; swatch?: React.ReactNode; copyAs?: string }) {
  // `token` is the label shown; `copyAs` (if given) is what actually gets copied
  // — used for icons, where the label reads "icon-critical" but the working
  // utility is "text-icon-critical". The public var is derived from copyAs.
  const shown = publicVar(copyAs ?? token, v);
  // The leaf primitive the semantic token ultimately resolves to (e.g.
  // --green-50), walked live so it's theme-correct. Only shown when it differs
  // from the public var (primitive-ramp rows already ARE the leaf).
  const leaf = useLeafPrimitive(v);
  const primitive = leaf && leaf !== shown ? leaf : null;
  return (
    <div className="flex items-center gap-4 py-3">
      {swatch ?? (
        <div className="size-12 shrink-0 rounded-lg border border-border" style={{ background: `var(${v})` }} />
      )}
      <div className="w-72 shrink-0 max-sm:w-40">
        <CopyToken value={token} copyValue={copyAs} className="-ml-1.5" />
        <div className="px-1.5 font-mono text-[0.65rem] text-muted-foreground">var({shown})</div>
      </div>
      {/* Primitive column — the leaf ramp var this semantic color resolves to
          (theme-correct, e.g. --green-50). */}
      <div className="w-48 shrink-0 max-sm:hidden">
        {primitive && <CopyToken value={primitive} className="-ml-1.5 text-[0.65rem]" />}
      </div>
      <div className="flex-1 text-right text-body-sm text-muted-foreground">{description}</div>
    </div>
  );
}

// Icon tokens — saturated colors for icon glyphs, mostly mirroring the intent
// accents. Rendered as solid swatches.
// Icon tokens: shown as the clean "icon-*" name; copied as the working utility
// "text-icon-*" (icons take their color from the text- utility in Tailwind).
const ICONS: { token: string; copyAs: string; v: string; description: string }[] = [
  { token: "icon", copyAs: "text-icon", v: "--p-text", description: "Default icon color." },
  { token: "icon-secondary", copyAs: "text-icon-secondary", v: "--p-text-secondary", description: "Secondary, lower-prominence icons." },
  { token: "icon-subtle", copyAs: "text-icon-subtle", v: "--p-text-tertiary", description: "Subtle / muted icons." },
  { token: "icon-brand", copyAs: "text-icon-brand", v: "--accent-brand", description: "Icons that need to pull attention." },
  { token: "icon-info", copyAs: "text-icon-info", v: "--accent-info", description: "Icons communicating information." },
  { token: "icon-success", copyAs: "text-icon-success", v: "--accent-success", description: "Icons communicating success." },
  { token: "icon-caution", copyAs: "text-icon-caution", v: "--accent-caution", description: "Icons communicating caution." },
  { token: "icon-critical", copyAs: "text-icon-critical", v: "--accent-critical", description: "Icons communicating a critical / error state." },
];

// Primitive ramps — raw palette values (context-free). Var names match colors.css.
const STEPS = ["50", "100", "200", "300", "400", "500", "600", "700", "800", "900"] as const;
const RAMPS: { name: string; prefix: string; steps: readonly string[] }[] = [
  { name: "Neutral", prefix: "--neutral", steps: ["0", "50", "100", "200", "300", "400", "500", "600", "700", "800", "900", "950", "1000"] },
  { name: "Brand", prefix: "--brand", steps: [...STEPS, "950"] },
  { name: "Blue", prefix: "--blue", steps: STEPS },
  { name: "Green", prefix: "--green", steps: STEPS },
  { name: "Amber", prefix: "--amber", steps: STEPS },
  { name: "Red", prefix: "--red", steps: STEPS },
];

function RampRow({ name, prefix, steps }: { name: string; prefix: string; steps: readonly string[] }) {
  return (
    <section className="mb-14 flex flex-col gap-4">
      <h2 className="text-h3">{name}</h2>
      <div className="flex flex-col divide-y divide-border">
        {steps.map((step) => (
          <SurfaceRow
            key={step}
            token={`${prefix.replace(/^--/, "")}-${step}`}
            v={`${prefix}-${step}`}
            description=""
          />
        ))}
      </div>
    </section>
  );
}

type View = "semantics" | "components" | "primitives";

export default function Colors() {
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
            <h1 className="text-h1">Colors</h1>
            <p className="text-body-lg text-muted-foreground">
              Color sets tone, signals state and intent, and guides the eye to
              what matters most.
            </p>
          </div>
          {/* Semantics / Primitives toggle */}
          <SegmentedControl value={view} onValueChange={(v) => setView(v as View)}>
            <SegmentedControlItem value="primitives">Primitives</SegmentedControlItem>
            <SegmentedControlItem value="semantics">Semantics</SegmentedControlItem>
            <SegmentedControlItem value="components">Components</SegmentedControlItem>
          </SegmentedControl>
        </div>

        {view === "semantics" ? (
        <>
        {/* Neutral surfaces (PatternFly prominence system) */}
        <section className="mb-14 flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-h3">Background</h2>
            <p className="text-body-sm text-muted-foreground">
              All background tokens — neutral surfaces by prominence, pale intent
              surfaces, and solid fills —{" "}
              <span className="font-mono text-body-xs">bg-surface</span>,{" "}
              <span className="font-mono text-body-xs">bg-surface-info</span>,{" "}
              <span className="font-mono text-body-xs">bg-fill-info</span>.
            </p>
            <UsageHint>
              Use <span className="font-mono text-body-xs">bg-surface</span> for cards
              and raised elements, <span className="font-mono text-body-xs">bg-surface-secondary</span>{" "}
              for insets and nested panels, and the intent surfaces (
              <span className="font-mono text-body-xs">bg-surface-info</span>…) for
              status banners. Solid <span className="font-mono text-body-xs">bg-fill-*</span>{" "}
              is for filled buttons and badges.
            </UsageHint>
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
            <h2 className="text-h3">Text</h2>
            <p className="text-body-sm text-muted-foreground">
              Foreground text by prominence —{" "}
              <span className="font-mono text-body-xs">text-foreground</span> and friends.
            </p>
            <UsageHint>
              A prominence ramp:{" "}
              <span className="font-mono text-body-xs">text-foreground</span> →{" "}
              <span className="font-mono text-body-xs">text-secondary</span> →{" "}
              <span className="font-mono text-body-xs">text-tertiary</span> →{" "}
              <span className="font-mono text-body-xs">text-quaternary</span>{" "}
              (most → least prominent). Plus{" "}
              <span className="font-mono text-body-xs">text-link</span> for links
              and the intent variants (
              <span className="font-mono text-body-xs">text-critical</span>…) for
              inline status messages.
            </UsageHint>
          </div>
          <div className="flex flex-col divide-y divide-border">
            {TEXTS.map((t) => (
              <SurfaceRow key={t.token} {...t} />
            ))}
          </div>
        </section>

        {/* Border tokens */}
        <section className="mb-14 flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-h3">Borders</h2>
            <p className="text-body-sm text-muted-foreground">
              Dividers and outlines by prominence —{" "}
              <span className="font-mono text-body-xs">border</span> and friends.
            </p>
            <UsageHint>
              <span className="font-mono text-body-xs">border</span> is the
              default; <span className="font-mono text-body-xs">border-subtle</span>{" "}
              for quieter dividers, <span className="font-mono text-body-xs">border-focus</span>{" "}
              for focus rings, and the intent variants to outline status elements.
            </UsageHint>
          </div>
          <div className="flex flex-col divide-y divide-border">
            {BORDERS.map((b) => (
              <SurfaceRow key={b.token} {...b} />
            ))}
          </div>
        </section>

        {/* Icon tokens */}
        <section className="mb-14 flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-h3">Icons</h2>
            <p className="text-body-sm text-muted-foreground">
              Colors for icon glyphs, by prominence and intent —{" "}
              <span className="font-mono text-body-xs">text-icon</span>,{" "}
              <span className="font-mono text-body-xs">text-icon-info</span>, and friends.
            </p>
            <UsageHint>
              Match icon color to its context —{" "}
              <span className="font-mono text-body-xs">text-icon</span> alongside body
              text, <span className="font-mono text-body-xs">text-icon-subtle</span> for
              decorative glyphs, and the intent variants when an icon reinforces a status.
            </UsageHint>
          </div>
          <div className="flex flex-col divide-y divide-border">
            {ICONS.map((i) => (
              <SurfaceRow key={i.token} {...i} />
            ))}
          </div>
        </section>

        </>
        ) : view === "components" ? (
        /* Component-specific roles */
        <section className="mb-14 flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-h3">Component roles</h2>
            <p className="text-body-sm text-muted-foreground">
              Tokens tied to specific components — button color, focus ring, and
              the sidebar theming.
            </p>
          </div>
          <div className="flex flex-col divide-y divide-border">
            {COMPONENTS.map((c) => (
              <SurfaceRow key={c.token} {...c} />
            ))}
          </div>
        </section>
        ) : (
        /* Primitive ramps — each ramp is its own top-level section. */
        <>
          {RAMPS.map((ramp) => (
            <RampRow key={ramp.prefix} {...ramp} />
          ))}
        </>
        )}
      </div>
    </ContentCard>
  );
}
