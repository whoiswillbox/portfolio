# Cardboard

Cardboard is the portfolio's design system: the token architecture, the vendored
component library, and a living Storybook-style doc site at `/cardboard`. This
file is the contributor guide — how to add a component, how to document it, and
the rules that keep the system coherent. For the token-level story see
`docs/design-foundations.md`; for the log of every vendored-component edit see
`docs/component-customizations.md`.

## The one rule that overrides everything

**Cardboard changes must not alter Box behavior.** Cardboard is a separate
product surface from the main portfolio ("Box"). Doc pages, registry entries, and
Cardboard-only UI live under `/cardboard` and must never change how Box renders
or behaves. The shared exceptions are inherently global and accepted as such:
design **tokens** (`src/styles/`), **fonts**, and the **vendored components**
themselves (both products consume them). When you touch a vendored component or a
token, you are touching both products — verify Box still looks right.

## Where things live

| Thing | Path |
| --- | --- |
| Owned components | `src/components/cardboard/*.tsx` |
| Vendored shims (re-export owned) | `src/components/ui/*.tsx` |
| Doc pages | `src/app/(site)/cardboard/components/<slug>/page.tsx` |
| Shared doc scaffold | `src/app/(site)/cardboard/components/_component-page.tsx` |
| Gallery registry | `src/app/(site)/cardboard/components/component-registry.tsx` |
| Sidebar nav | `src/components/cardboard-sidebar.tsx` |
| Foundations pages | `src/app/(site)/cardboard/foundations/*` |
| Tokens (primitives → semantics) | `src/styles/primitives/*`, `src/styles/semantics/*` |

## Token architecture

Three layers, each referencing the one below. Never skip a layer — a component
reads a **semantic**, a semantic reads a **primitive**, a primitive is a raw value.

1. **Primitives** (`src/styles/primitives/`) — raw ramps: `--neutral-100…900`,
   `--space-*`, radii, type scale. No meaning, just values.
2. **Semantics** (`src/styles/semantics/core.css`, `intent.css`) — meaningful
   aliases: `--color-foreground`, `--color-surface`, `--color-border`,
   `--color-border-divider`, `--color-fill-solid`, intent colors. Components use
   *these*.
3. **Utilities** — Tailwind v4 auto-generates `bg-*`/`text-*`/`border-*` from the
   `@theme inline` block in `core.css`. `--color-border-divider` →
   `border-divider`, etc.

Key semantic distinctions worth remembering:
- `--color-border` (light `--neutral-200`, dark `--neutral-700`) = **element**
  borders (inputs, cards).
- `--color-border-divider` (light `--neutral-100`, dark `--neutral-800`) = the
  lighter **hairline** for structural dividers (separators, nav-bar bottom,
  sidebar edge). If it separates *regions*, use `border-divider`.
- `--color-fill-solid` / `--color-on-solid` = the primary solid fill (buttons,
  switches) and its foreground.

Dark mode uses `@custom-variant dark (&:is(.dark *))` — it matches **descendants**
of `.dark`, not the `.dark` element itself. The Colors foundations page resolves
raw stylesheet declarations (getComputedStyle flattens custom properties), so it
is theme-aware by skipping `.dark` rules when the page is in light mode.

## Adding a component

Two flavors:

**Vendoring a shadcn base** ("the Button pattern"):
1. `shadcn add <name>` generates it in `src/components/ui/`. Adding a *new*
   component is safe.
2. Move the real implementation to `src/components/cardboard/<name>.tsx`; make
   `ui/<name>.tsx` a thin re-export shim so existing `@/components/ui/*` imports
   keep working.
3. Rewire shadcn role tokens → Cardboard semantics (`bg-popover` → `bg-surface`,
   `text-muted-foreground` → `text-subtle`, `ring-ring` → `border-border-focus`,
   `destructive` → `critical`, etc.). See existing log entries for the full map.
4. Convert lucide icons → Heroicons (`@heroicons/react/24/outline` / `/solid`).
   Exceptions: no Heroicons brand icons or panel glyph — inline an SVG (the
   sidebar trigger keeps lucide's `PanelLeftIcon`).
5. **Log the change in `docs/component-customizations.md`.** This is mandatory.
   Never `shadcn add --overwrite` a component listed there.

**Building an owned component** (new, not forked — e.g. `nav-bar.tsx`): write it
directly in `src/components/cardboard/`, Heroicons from the start, semantic
tokens only. No `ui/` shim needed unless something imports it that way.

Then wire it up:
1. Add an entry to `component-registry.tsx` (`label`, `href`, `description`, live
   `preview`). Set `utility: true` for helpers/wrappers/assets — they stay in the
   registry but are filtered out of the gallery grid and shown under Utilities.
2. Add a nav entry to `cardboard-sidebar.tsx` — a `leaf(...)` in `components`
   (alphabetical) or a child of a `Group`; `utilities` for utility entries.
   Optional maturity `status` (`stable`/`beta`/`experimental`/`deprecated`) shows
   a colored dot.
3. Create the doc page (next section).

## Doc page conventions

Every doc page composes helpers from `_component-page.tsx`. The shell is
`ComponentPage` (title, description, `status`, `version`) wrapping `AudienceTabs`.

**Tabs** (order matters): optional **Playground** (first, if given), then
**Design**, then **Develop**. Design covers *what/when* (Anatomy, Guidelines,
Content, Do/Don't, States, WcagChecklist). Develop covers *how* (Install,
Variants, PropsTable, Slots, Accessibility, Changelog).

Available section helpers (all exported from `_component-page.tsx`):

- `Playground` — configurable controls (`select` / `boolean` / `text`) above a
  live render; pass a `render(values)` fn. A control can take `visibleIf:
  (values) => boolean` to only show when another control's value warrants it
  (e.g. a "label text" field that appears only when a "label" toggle is on).
- `Variants` — labeled examples; `preview` shows the rendered example, code tabs
  show source. Develop shows preview + code; Design shows preview-only.
- `Anatomy`, `Guidelines` (use/avoid), `ContentGuidelines`, `DoDont`, `States`
  (a token table — render the *real* component in each state).
- `Install`, `PropsTable` (+ `PropInterface` groups), `Specs`.
- `Slots` — for **compositional** components: the code-facing list of insertion
  points you compose *inside* (subcomponents / children), Shopify-style
  (`name • type` + description). Lives on Develop, **after** Props (Polaris
  order: config first, then composition). Distinct from
  Anatomy: Anatomy is the *visual* numbered part diagram (Design, for designers);
  Slots is the *composition contract* (Develop, for engineers). A layout-shell
  component (Nav Bar, Card) wants both; a leaf component (Button) needs neither.
- `Accessibility` (Keyboard + ARIA tables, plus labeling / screen-reader /
  reduced-motion prose), `WcagChecklist` (contrast + criteria rows).
- `Changelog`.

`Related` and `ApiNotes` still exist in the scaffold but have been **removed from
all pages** — don't add them back. (ApiNotes' genuinely useful facts — style
hooks like `data-slot`/`data-state`, controlled-only behavior — belong in
Anatomy `tokens`, PropsTable descriptions, or Accessibility instead.)

Hard doc rules:
- **The doc reflects the component 1:1.** When you change a component, the
  documentation changes with it, in the same commit — no drift, ever. Every mirror
  of the component on the page must match reality: the States helper, the CSS/code
  snippets, Anatomy, PropsTable, variant examples, and any prose describing
  behavior. If a prop is added/removed/renamed, PropsTable changes; if a style or
  state changes, States changes; if the API changes, Install/Variants change.
  Prefer rendering the *real* component (a live instance can't drift) over
  hardcoded mockups (which silently rot). Treat a component change with no
  corresponding doc change as an incomplete change.
- **Any change to a component's states updates the States section.** When a
  component's rest / hover / active / focus / selected / disabled (etc.) styling
  or behavior changes, the `States` section must be updated to reflect it in the
  same commit — both the visual example (the forced-state node) and the token
  row. A States section that doesn't match the component's real states is a bug.
  Keep the state examples visually consistent (e.g. equal widths, no text
  wrapping) so the states read as a comparison, not noise. State order follows
  the established pattern: **Rest → Hover → Selected → Focus → Disabled** (omit
  any a component doesn't have; keep the rest in this order).
- **Every component change gets a Changelog entry.** Any update to a component —
  style, prop, behavior, a11y — adds an entry to that page's `Changelog` in the
  same commit, and bumps the header `version` badge to match the top entry (patch
  for tweaks/fixes, minor for added props/variants). No silent changes: if you
  touched the component, the changelog says so. The badge and the newest changelog
  version must always agree.
- **Styling changes must re-check accessibility.** Any change to a color, state,
  or contrast must be reflected in the Accessibility section and WcagChecklist so
  the doc tells you whether the new styling still passes. Recompute real contrast
  ratios against the actual background (WCAG 2.1: 4.5:1 for normal text, 3:1 for
  large text / UI boundaries) and update the pass/fail row. Example: when the Nav
  Bar rest-state item color changed, the contrast row had to be recomputed —
  `text-quaternary` (neutral-400) was 2.49:1 (**fail**), so it was bumped to
  `text-tertiary` (4.55:1, **pass**) and the WcagChecklist row updated to match.
  The doc is the check: if a styling change fails contrast, the accessibility
  section should surface it, not hide it.
- **PropsTable is Shopify-style (flat).** No `interface` keyword framing, no boxed
  card — flat rows with colored type text and an inline default. `interfaceName`
  is just a plain mono subheading grouping related props.

Accessibility/props tables use the **bordered-card** look:
`overflow-hidden rounded-xl border border-border bg-surface`, plain header (no
`bg-muted` tint), `py-3` rows.

## Before you push

- `npm run build` before pushing — it catches prerender / CSR-bailout / stale
  route-type errors that `tsc` and dev miss. If you delete doc routes, clear stale
  types first: `rm -rf .next/types .next/dev/types`.
- **Stop the dev server before switching git branches** — a running server serves
  a stale route manifest and 404s after a checkout.
- Pushing to `main` **auto-deploys to Vercel production**. When mid-cleanup or
  mid-batch, hold the push until the batch is coherent.
- Commits end with `Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>`.
