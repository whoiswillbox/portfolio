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

### `tooltip.tsx` — remove the arrow
**Date:** 2026-06-17
**Why:** Preferred a clean tooltip bubble with no pointer arrow.
**What:** Removed the `<TooltipPrimitive.Arrow>` element from `TooltipContent`
and bumped the default `sideOffset` from `0` to `4` so the bubble keeps a small
gap from the trigger now that the arrow no longer spaces it.

### `sidebar.tsx` — `SidebarTrigger` tooltip + state-aware label
**Date:** 2026-06-17
**Why:** The trigger was an unlabeled panel icon; needed a hover tooltip
("Collapse sidebar" / "Expand sidebar") so its action is discoverable.
**What:** Wrapped the trigger `Button` in `Tooltip`/`TooltipTrigger`/
`TooltipContent` (side="bottom"), pulled `state` from `useSidebar`, and derived
a `label` ("Expand sidebar" when collapsed, else "Collapse sidebar") used for
both the tooltip and the `sr-only` text (was the static "Toggle Sidebar").

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

### `button.tsx` — no font override (inherits sans)
**Date:** 2026-06-18
**Why:** Buttons inherit the app's sans font (currently EB Garamond for testing). No explicit font class needed.
**What:** No change from shadcn default — buttons use inherited `font-sans`.

---

### `calendar.tsx` — fix react-day-picker v10 type error
**Date:** 2026-06-15
**Why:** The vendored calendar used the `table` classNames key, which was
removed in react-day-picker v10 (the project uses `^10.0.1`). It compiled under
Turbopack dev but failed `next build`'s TypeScript check, breaking the Vercel
deploy.
**What:** Renamed the `table` key to `month_grid` (the v10 equivalent for the
grid `<table>` element). Same styling, just the correct key name.

---

### `alert.tsx` — reduce alert action right padding
**Date:** 2026-06-18
**Why:** `pr-18` (72px) left too much space between alert text and the dismiss button.
**What:** Changed `has-data-[slot=alert-action]:pr-18` to `has-data-[slot=alert-action]:pr-10`.

---

### `sheet.tsx` — left/right side sheets float as cards
**Date:** 2026-06-22
**Why:** Mobile sidebar slides in as a floating card (mirroring the desktop content card aesthetic). The default sheet was edge-to-edge with no padding or rounding.
**What:** Changed `data-[side=left]` and `data-[side=right]` from `inset-y-0`/`h-full` to `inset-y-2`/`h-[calc(100%-1rem)]` and added `rounded-xl`. Removed the `border-r`/`border-l` since the card style replaces the border.

### `sheet.tsx` — real slide animation + `draggable` opt-out
**Date:** 2026-06-25
**Why:** The CSS `transition` on translate didn't actually slide (Radix mounts content already in the `open` state, so only opacity animated → it "appeared"). Also needed an escape hatch for a drag-controlled sheet.
**What:**
- Overlay (scrim): `opacity 280ms cubic-bezier(0.33,1,0.68,1)`, GPU-promoted with `will-change:opacity` + `transform:translateZ(0)` + `backface-visibility:hidden` so the fade composites instead of repainting a full-screen translucent layer each frame (the dismiss fade was janky). Shortened from 420ms so the dismiss feels snappier.
- Content: replaced the inline `transition` + `data-[state]` translate classes with `tw-animate-css` enter/exit animations keyed on Radix state (`data-[state=open]:animate-in`/`closed:animate-out` + per-side `slide-in-from-*`/`slide-out-to-*`), `duration-[420ms]` easeOutCubic. Added `transform-gpu will-change-transform`; dropped the opacity/fade on content (transform-only = smoother on mobile).
- Added a `draggable?: boolean` prop: when true, the built-in slide classes are skipped so a consumer can drive the transform/height itself. (Currently unused — the settings sheet drag is height-based and keeps the slide — but kept as an escape hatch.)
Applies to all sheets (settings + case-study bottom sheet).
