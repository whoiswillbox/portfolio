# Base Component Customizations

This file is the **source of truth** for every change made to shadcn/ui base
components in `src/components/ui/`. These components are vendored (copied into
the repo), so our edits are canonical — **the customized version IS the
component, period.**

## Rules

1. **Never blind-overwrite.** Do not run `shadcn add <name> --overwrite` or
   re-init shadcn without first checking this log. If a component is listed
   here, its customizations must be preserved or re-applied.
2. **Log every change.** Any edit to a file in `src/components/ui/` gets an
   entry below: what changed, where, and why.
3. **Adding a new component is fine** — `shadcn add <new-name>` for components
   not yet in the repo carries no risk. The danger is only re-adding an
   existing, customized one.
4. **If a shadcn upgrade is ever needed**, add the new version to a scratch
   location, diff against ours, and port their improvements into our file by
   hand — never the reverse.

## Icon library convention

**Heroicons (`@heroicons/react`) is the icon library for our own components.**
We are migrating off lucide-react incrementally, not all at once:

- **Our components** (anything outside `src/components/ui/`) use Heroicons.
  Outline: `@heroicons/react/24/outline`; filled: `@heroicons/react/24/solid`
  (also `20/solid`, `16/solid`). Note: outline only exists at 24px.
- **Vendored `ui/` components still ship with lucide** (that's what `shadcn add`
  generates). Leave them on lucide until a component is actually used, then
  convert its icons to Heroicons at that point and log it here. Both libraries
  are installed and coexist intentionally during the migration.
- **Heroicons has no brand icons** (LinkedIn, GitHub, etc.) and no panel/sidebar
  glyph — inline an SVG for those. The sidebar trigger (`ui/sidebar.tsx`) keeps
  lucide's `PanelLeftIcon` since Heroicons has no equivalent.

## Log

### `alert.tsx` — add `success` (green) variant
**Date:** 2026-06-16
**Why:** Needed a green success alert (the "designs are protected" note on the
Upgrade case study). Mirrors the existing `info` variant.
**What:** Added a `success` variant to `alertVariants` using the success intent
tokens: `border-success bg-surface-success text-success`, description tinted
`text-success/90`, SVG icons inheriting `text-current`.

### `globals.css` — restore pointer cursor on interactive controls
**Date:** 2026-06-16
**Why:** Tailwind v4's Preflight sets `cursor: default` on buttons, so our
custom `<button>` actions (chips, feedback, dismiss, conversation rows, etc.)
didn't show a pointer on hover.
**What:** Added a base-layer rule giving `button:not(:disabled)`,
`[role="button"]:not(:disabled)`, and `label[for]` `cursor: pointer`.

### `switch.tsx` — hover interaction states
**Date:** 2026-06-13
**Why:** The stock Switch had no hover feedback (only focus + checked states).
**What:**
- Added `cursor-pointer` to the root.
- Added a hover ring: `hover:ring-2 hover:ring-ring/40`.
- Added hover track colors: `hover:data-checked:bg-primary/80` and
  `hover:data-unchecked:bg-muted-foreground/40`.
- Added `data-disabled:hover:ring-0` so disabled switches don't show the ring.

---

### `globals.css` — restructured into layered design tokens
**Date:** 2026-06-13
**Why:** Centralize design tokens into a scalable primitives → semantics
architecture (see `docs/design-foundations.md`). Also fixed the self-referential
`--font-sans` bug (base-nova → radix leftover) as part of the move.
**What:** `globals.css` now only imports `src/styles/{primitives,semantics}/*`
and defines the base layer. All color/type/spacing tokens live in those files.
shadcn's semantic values are preserved exactly (now referencing primitives), so
there is no visual change — except the dark `--sidebar-primary` stray blue,
which was unified to the brand ramp (it is unused in the UI, so no-op).

---

### `alert.tsx` — add `info` (blue) variant
**Date:** 2026-06-15
**Why:** shadcn's Alert ships only `default` and `destructive` variants. We
needed a blue informational alert (used by Box AI's privacy note), and the
design system already defines an `info` intent in `src/styles/semantics/intent.css`.
**What:** Added an `info` variant to `alertVariants` using the existing intent
tokens: `border-info bg-surface-info text-info`, with the description tinted
`text-info/90` and SVG icons inheriting `text-current` (mirrors how the
`destructive` variant is built).

---

### `calendar.tsx` — fix react-day-picker v10 type error
**Date:** 2026-06-15
**Why:** The vendored calendar used the `table` classNames key, which was
removed in react-day-picker v10 (the project uses `^10.0.1`). It compiled under
Turbopack dev but failed `next build`'s TypeScript check, breaking the Vercel
deploy.
**What:** Renamed the `table` key to `month_grid` (the v10 equivalent for the
grid `<table>` element). Same styling, just the correct key name.
