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

### `select.tsx` — spacing rewired to the `--space-*` scale
**Date:** 2026-07-10
**Why:** The forked Select used raw Tailwind spacing utilities (`p-2`, `pl-2.5`,
`gap-1.5`…) rather than the design system's `--space-*` primitive scale, so the
Select doc page's token reference couldn't show real tokens. First forked
component to consume `--space-*` directly (per the deferred-spacing plan: add
the consumer at fork time).
**What:** Rewired all padding/gap/margin to `--space-*` via Tailwind v4's
`p-(--space-200)` var syntax across trigger, group, item, label, separator, and
scroll buttons. `pl-2.5` (10px, off-scale) snapped to `--space-200` (8px, a 2px
tighter left pad). Heights (`h-7`/`h-8`) intentionally left as raw utilities
(sizing, not spacing; 28px has no token). Mapping: 4px `--space-100`, 6px
`--space-150`, 8px `--space-200`, 32px `--space-800`.
**Trigger sizing is now padding-driven** (deliberate model choice): removed the
fixed heights (`h-8`/`h-7`) so the trigger's height falls out of `py` +
text line-height — changing the padding resizes the control. Size variants differ
by `py`: default `--space-200` (8px), sm `--space-150` (6px); `px-(--space-300)`
(12px) constant. (Padding bumped up one step on the ramp 2026-07-10 — was py
`--space-150`/`--space-100`, px `--space-200`.) Trade-off vs. the fixed-height model (shadcn default): padding is the
single knob, but row-alignment with other controls now depends on keeping their
padding consistent rather than a shared fixed height. When other controls
(Button, Input) are forked, tokenize their vertical size the same way so they
stay aligned.

### `select.tsx` — default to `position="popper"` (drop below the trigger)
**Date:** 2026-07-10
**Why:** shadcn's Select defaults `SelectContent` to `position="item-aligned"`,
which overlays the popup on the trigger (centering the selected item over it).
That needs vertical room above the trigger and breaks when the trigger sits at
the top of the viewport — the product switcher in the top bar opened a clipped/
empty menu.
**What:** In the Cardboard-forked `select.tsx`, changed `SelectContent` defaults
to `position="popper"`, `align="start"`, `sideOffset={4}` (drop-below dropdown),
passed `sideOffset` through to the radix Content, and removed the popper-mode
`h-(--radix-select-trigger-height)` on the Viewport (it clamped the list to a
single trigger-height row). Callers can still pass `position="item-aligned"` to
opt back in.

### `sheet.tsx`, `sidebar.tsx` — FORKED into Cardboard
**Date:** 2026-07-10
**Why:** Cardboard fork batch 19 — the final pass. Both were **already customized**
(sheet scrim/slide/`draggable`; sidebar trigger tooltip), so these were moved in
place **preserving every prior customization**, not blind-overwritten. Owned in
`cardboard/`; `ui/` paths are re-export shims; doc pages added.
**What (token rewires + preserved customizations):**
- **sheet (radix Dialog):** imports **Cardboard** Button; lucide `XIcon`→Heroicons
  `XMarkIcon`; description `text-muted-foreground`→`text-subtle`. **Preserved** the
  translucent-scrim GPU fade, the `tw-animate` real slide (per-side, `420ms`
  easeOutCubic, transform-only), and the `draggable` opt-out — all carried over
  byte-for-byte (see the two older `sheet.tsx` entries below).
- **sidebar (composable primitives):** imports **Cardboard** Button / Input /
  Separator / Sheet / Skeleton / Tooltip. No token rewires — the sidebar has its
  own first-class `--sidebar-*` token family (bg-sidebar, sidebar-accent,
  sidebar-border, sidebar-ring…), already mapped to the neutral ramp. **Kept**
  lucide's `PanelLeftIcon` on the trigger (Heroicons has no panel glyph) and the
  `SidebarTrigger` tooltip + state-aware label (see older `sidebar.tsx` entry below).

### `calendar.tsx`, `chart.tsx`, `carousel.tsx` — FORKED into Cardboard
**Date:** 2026-07-10
**Why:** Cardboard fork batch 18 — the last three vendored components on the
fork list. Owned in `cardboard/`; `ui/` paths are re-export shims; doc pages added.
**What (token rewires):**
- **calendar (react-day-picker):** imports **Cardboard** Button; lucide chevrons
  (`ChevronLeft/Right/DownIcon`)→Heroicons; root `bg-background`→`bg-surface`;
  dropdown `bg-popover`→`bg-surface`; weekday / week-number / outside / disabled /
  caption-icon `text-muted-foreground`→`text-subtle`; range start/middle/end +
  today `bg-muted`→`bg-surface-secondary`; day button selected/range
  `bg-primary`/`text-primary-foreground`→`bg-fill-solid`/`text-on-solid`, range-middle
  `bg-muted`→`bg-surface-secondary`, focus ring `border-ring`/`ring-ring/50`→
  `border-border-focus`/`ring-border-focus/50`. **Preserved** the v10 `month_grid`
  key customization (see older entry below).
- **chart (recharts):** no icons. Axis-tick `fill-muted-foreground`→`fill-subtle`;
  radial-bg / tooltip-cursor `fill-muted`→`fill-surface-secondary`; tooltip surface
  `bg-background`→`bg-surface`; indicator/legend `text-muted-foreground`→`text-subtle`;
  `border-border`/`stroke-border` unchanged (already Cardboard token). Series colors
  still come from the caller's `ChartConfig`.
- **carousel (embla):** imports **Cardboard** Button; lucide `ChevronLeft/RightIcon`→
  Heroicons. No color tokens in the component itself.

### `command.tsx`, `combobox.tsx` — FORKED into Cardboard
**Date:** 2026-07-10
**Why:** Cardboard fork batch 17 (Button pattern). Coupled pair — both build on the
already-forked Dialog / Input Group / Button. Owned in `cardboard/`; `ui/` paths are
re-export shims; doc pages added.
**What (token rewires):**
- **command (cmdk):** imports **Cardboard** Dialog + Input Group; lucide
  `SearchIcon`/`CheckIcon`→Heroicons `MagnifyingGlassIcon`/`CheckIcon`; root `bg-popover`/
  `text-popover-foreground`→`bg-surface`/`text-foreground`; selected item `bg-muted`→
  `bg-surface-secondary`; search field dropped the translucent `border-input/30 bg-input/30`
  tint for `bg-surface-secondary`; group-heading + shortcut `text-muted-foreground`→`text-subtle`.
- **combobox (@base-ui/react):** imports **Cardboard** Button + Input Group; lucide
  `ChevronDownIcon`/`XIcon`/`CheckIcon`→Heroicons (`XIcon`→`XMarkIcon`); popup `bg-popover`/
  `text-popover-foreground`→`bg-surface`/`text-foreground` + inner field tint
  `border-input/30 bg-input/30`→`bg-surface-secondary`; item `data-highlighted:bg-accent`/
  `text-accent-foreground`→`bg-surface-secondary`/`text-foreground`; chips `border-input`/
  `border-ring`/`ring-ring/50`→`border`/`border-border-focus`/`ring-border-focus/50` +
  destructive→critical + dropped dark `bg-input/30`/dark destructive variants; chip
  `bg-muted`→`bg-surface-secondary`; labels/empty `text-muted-foreground`→`text-subtle`.

### `menubar.tsx`, `navigation-menu.tsx`, `drawer.tsx` — FORKED into Cardboard
**Date:** 2026-07-10
**Why:** Cardboard fork batch 16 (Button pattern). Owned in `cardboard/`; `ui/`
paths are re-export shims; doc pages added. Same menu/overlay rewrite map as the
already-forked dropdown-menu / context-menu.
**What (token rewires):**
- **menubar:** lucide `CheckIcon`/`ChevronRightIcon`→Heroicons; content `bg-popover`/
  `text-popover-foreground`→`bg-surface`/`text-foreground`; item focus `bg-accent`/
  `text-accent-foreground`→`bg-surface-secondary`/`text-foreground`; destructive
  `text-destructive`/`bg-destructive/10`→`text-critical`/`bg-surface-critical`;
  trigger + shortcut `hover:bg-muted`/`text-muted-foreground`→`bg-surface-secondary`/
  `text-subtle`.
- **navigation-menu:** lucide `ChevronDownIcon`→Heroicons; trigger + link
  `hover:bg-muted`/`focus:bg-muted`/`data-*:bg-muted/50`→`bg-surface-secondary`(/50);
  `ring-ring/50`→`ring-border-focus/50`; content + viewport `bg-popover`/
  `text-popover-foreground`→`bg-surface`/`text-foreground`. Indicator `bg-border` kept.
- **drawer (vaul):** no lucide; content `bg-popover`/`text-popover-foreground`→
  `bg-surface`/`text-foreground`; drag handle `bg-muted`→`bg-surface-secondary`;
  description `text-muted-foreground`→`text-subtle`. Overlay `bg-black/10` kept.

### `direction.tsx`, `sonner.tsx`, `resizable.tsx`, `table.tsx` — FORKED into Cardboard
**Date:** 2026-07-10
**Why:** Cardboard fork batch 15 (Button pattern). Owned in `cardboard/`; `ui/`
paths are re-export shims; doc pages added.
**What (token rewires):**
- **direction:** no styling — pure Radix DirectionProvider re-export, relocated
  to Cardboard for namespace consistency.
- **sonner:** lucide status icons (`CircleCheckIcon`/`InfoIcon`/`TriangleAlertIcon`/
  `OctagonXIcon`/`Loader2Icon`) → Heroicons (`CheckCircleIcon`/`InformationCircleIcon`/
  `ExclamationTriangleIcon`/`XCircleIcon`/`ArrowPathIcon`). CSS vars repointed from
  shadcn role vars (`--popover`/`--popover-foreground`/`--border`) to Cardboard
  public tokens (`--color-surface`/`--color-foreground`/`--color-border`). NOTE:
  no `<Toaster />` is mounted app-wide; the doc page mounts one locally for the demo.
- **resizable:** handle `focus-visible:ring-ring`→`ring-border-focus`. Handle +
  grip already `bg-border` (native) — no change.
- **table:** `bg-muted/50`→`bg-surface-secondary/50` (footer, hover, expanded);
  `data-[state=selected]:bg-muted`→`bg-surface-secondary`; caption
  `text-muted-foreground`→`text-subtle`.

### `item.tsx`, `input-group.tsx`, `input-otp.tsx` — FORKED into Cardboard
**Date:** 2026-07-10
**Why:** Cardboard fork batch 14 (Button pattern). Owned in `cardboard/`; `ui/`
paths are re-export shims; doc pages added.
**What (token rewires):**
- **item:** imports **Cardboard** Separator; focus `border-ring`/`ring-ring/50`→
  `border-border-focus`/`ring-border-focus/50`; hover + muted `bg-muted`/`bg-muted/50`→
  `bg-surface-secondary`; `text-muted-foreground`→`text-subtle`; description link
  `hover:text-primary`→`hover:text-fill-solid`.
- **input-group:** imports **Cardboard** Button/Input/Textarea; `border-input`→
  `border`; focus-within `border-ring`/`ring-ring/50`→`border-border-focus`/
  `ring-border-focus/50`; invalid `border-destructive`/`ring-destructive/20`→
  `border-critical`/`ring-critical/20`; `text-muted-foreground`→`text-subtle`;
  dropped all `dark:bg-input/*` translucency + dark destructive-ring variants.
- **input-otp:** lucide `MinusIcon`→Heroicons `MinusIcon`; slot `border-input`→
  `border`; active `border-ring`/`ring-ring/50`→`border-border-focus`/
  `ring-border-focus/50`; `border-destructive`/`ring-destructive/20`→`border-critical`/
  `ring-critical/20`; dropped `dark:bg-input/30` + dark destructive-ring variant.

### `scroll-area.tsx`, `button-group.tsx`, `field.tsx` — FORKED into Cardboard
**Date:** 2026-07-10
**Why:** Cardboard fork batch 13 (Button pattern). Owned in `cardboard/`; `ui/`
paths are re-export shims; doc pages added.
**What (token rewires):**
- **scroll-area:** viewport `focus-visible:ring-ring/50`→`ring-border-focus/50`.
  Thumb already `bg-border` (Cardboard-native) — no change.
- **button-group:** imports **Cardboard** Separator; text addon `bg-muted`→
  `bg-surface-secondary`; separator `bg-input`→`bg-border`.
- **field:** imports **Cardboard** Label + Separator; `data-[invalid]:text-destructive`
  and `FieldError` `text-destructive`→`text-critical`; `text-muted-foreground`→
  `text-subtle` (description + separator content); checked-label
  `border-primary/30`/`bg-primary/5` (+ dark `/20`,`/10`)→`border-fill-solid`/
  `bg-fill-solid`; link `hover:text-primary`→`hover:text-fill-solid`.

### `pagination.tsx`, `slider.tsx`, `collapsible.tsx` — FORKED into Cardboard
**Date:** 2026-07-10
**Why:** Cardboard fork batch 12 (Button pattern). Owned in `cardboard/`; `ui/`
paths are re-export shims; doc pages added.
**What (token rewires):**
- **pagination:** imports **Cardboard** Button (so active/hover already use
  Cardboard tokens). lucide `ChevronLeftIcon`/`ChevronRightIcon`/`MoreHorizontalIcon`
  → Heroicons `ChevronLeftIcon`/`ChevronRightIcon`/`EllipsisHorizontalIcon`.
- **slider:** track `bg-muted`→`bg-surface-secondary`; range `bg-primary`→
  `bg-fill-solid`; thumb `border-ring`/`ring-ring/50`→`border-border-focus`/
  `ring-border-focus/50`; thumb fill `bg-white`→`bg-background` (theme-aware).
- **collapsible:** no color tokens — pure Radix primitive re-export, relocated to
  Cardboard for namespace consistency.

### `radio-group.tsx`, `toggle-group.tsx`, `breadcrumb.tsx` — FORKED into Cardboard
**Date:** 2026-07-10
**Why:** Cardboard fork batch 11 (Button pattern). Owned in `cardboard/`; `ui/`
paths are re-export shims; doc pages added.
**What (token rewires):**
- **radio-group:** `border-input`→`border`; `data-checked` `bg-primary`/`border-primary`/
  `text-primary-foreground`→`bg-fill-solid`/`border-fill-solid`/`text-on-solid`;
  indicator dot `bg-primary-foreground`→`bg-on-solid`; ring→`border-border-focus`;
  destructive→critical; dropped dark `bg-input/30`.
- **toggle-group:** no direct color tokens — delegates to the forked Cardboard
  `toggleVariants`; only change is importing from `cardboard/toggle`.
- **breadcrumb:** `text-muted-foreground`→`text-subtle`. **lucide ChevronRight /
  MoreHorizontal → Heroicons (ChevronRight / EllipsisHorizontal).**

### `alert-dialog.tsx`, `hover-card.tsx` — FORKED into Cardboard
**Date:** 2026-07-10
**Why:** Cardboard fork batch 10 (Button pattern). Owned in `cardboard/`; `ui/`
paths are re-export shims; doc pages added. Neither used lucide.
**What (token rewires):**
- **alert-dialog:** imports **Cardboard** Button; content `bg-popover
  text-popover-foreground`→`bg-surface text-foreground`; footer `bg-muted/50`→
  `bg-surface-secondary/50`; media `bg-muted`→`bg-surface-secondary`; description
  `text-muted-foreground`→`text-subtle`. Overlay scrim `bg-black/10` kept.
- **hover-card:** `bg-popover text-popover-foreground`→`bg-surface text-foreground`.

### `context-menu.tsx` — FORKED into Cardboard (`cardboard/context-menu.tsx`)
**Date:** 2026-07-10
**Why:** Cardboard fork (Button pattern). Same anatomy/rewiring as dropdown-menu.
**What:** Owned at `src/components/cardboard/context-menu.tsx`; `ui/` is a
re-export shim. radix ContextMenu primitives kept. Rewired: content/sub-content
`bg-popover text-popover-foreground`→`bg-surface text-foreground`; item focus
`bg-accent text-accent-foreground`→`bg-surface-secondary text-foreground`;
destructive `text-destructive`/`bg-destructive/10`→`text-critical`/`bg-surface-critical`;
label & shortcut `text-muted-foreground`→`text-subtle`; `bg-border` separator kept.
**lucide Check/ChevronRight → Heroicons.**

### `dropdown-menu.tsx` — FORKED into Cardboard (`cardboard/dropdown-menu.tsx`)
**Date:** 2026-07-10
**Why:** Cardboard fork (Button pattern).
**What:** Owned at `src/components/cardboard/dropdown-menu.tsx`; `ui/` is a
re-export shim. radix DropdownMenu primitives kept. Rewired: content/sub-content
`bg-popover text-popover-foreground`→`bg-surface text-foreground`; all item focus
`bg-accent text-accent-foreground`→`bg-surface-secondary text-foreground` (dropped
the redundant `**:text-accent-foreground` descendant rules); destructive item
`text-destructive`/`bg-destructive/10`→`text-critical`/`bg-surface-critical`;
label & shortcut `text-muted-foreground`→`text-subtle`; `bg-border` separator kept.
**lucide Check/ChevronRight → Heroicons.**

### `select.tsx` — FORKED into Cardboard (`cardboard/select.tsx`)
**Date:** 2026-07-10
**Why:** Cardboard fork (Button pattern).
**What:** Owned at `src/components/cardboard/select.tsx`; `ui/select.tsx` is a
re-export shim. radix Select primitives kept. Rewired: trigger `border-input`→
`border`, `data-placeholder:text-muted-foreground`→`text-subtle`, focus→`border-border-focus`,
invalid→critical, dropped dark `bg-input/30`. Content/scroll buttons `bg-popover`→
`bg-surface`, `text-popover-foreground`→`text-foreground`. Item `focus:bg-accent
focus:text-accent-foreground`→`focus:bg-surface-secondary focus:text-foreground`
(dropped the destructive-variant focus-color rule). Label `text-muted-foreground`→
`text-subtle`. `bg-border` separator kept. **lucide Chevron{Down,Up}/Check → Heroicons.**

### `accordion.tsx` (batch 6) — variant system update
**Date:** 2026-07-10
**What:** Added a `variant` prop (`default` | `inline`) unifying the app's two
accordion styles; `inline` matches the Typography primitives disclosure exactly
(text-body-xs muted, size-3.5 ChevronRight, bg-muted/50 container). The
Technergetics drill-in nav row is intentionally NOT a variant — reserved as a
future Sidebar-item variant. Typography page migrated to use `<Accordion
variant="inline">` (removed its raw `<details>`).

### `tabs.tsx`, `accordion.tsx`, `dialog.tsx`, `popover.tsx` — FORKED into Cardboard
**Date:** 2026-07-10
**Why:** Cardboard fork batch 6 — first composite radix components (Button pattern).
Owned components in `src/components/cardboard/`; `ui/` paths are re-export shims;
doc pages added.
**What (token rewires):**
- **tabs:** list `bg-muted`→`bg-surface-secondary`, `text-muted-foreground`→`text-subtle`,
  active `bg-background`→`bg-surface`, `border-input`/ring→`border`/`border-focus`.
  Dropped the dark-mode `bg-input/30` active override (bg-surface handles both).
- **accordion:** `text-muted-foreground`→`text-subtle`, ring→`border-border-focus`.
  **lucide Chevron{Down,Up}Icon → Heroicons.**
- **dialog:** imports **Cardboard** Button; `bg-popover`→`bg-surface`,
  `text-popover-foreground`→`text-foreground`, footer `bg-muted/50`→`bg-surface-secondary/50`,
  `text-muted-foreground`→`text-subtle`. **lucide XIcon → Heroicons XMarkIcon.**
  Overlay scrim `bg-black/10` kept.
- **popover:** `bg-popover`→`bg-surface`, `text-popover-foreground`→`text-foreground`,
  `text-muted-foreground`→`text-subtle`. Uses the forked `shadow-md`.

### `aspect-ratio.tsx`, `kbd.tsx`, `empty.tsx`, `native-select.tsx` — FORKED into Cardboard
**Date:** 2026-07-10
**Why:** Cardboard fork batch 5 (Button pattern). Owned components in
`src/components/cardboard/`; `ui/` paths are re-export shims; doc pages added.
**What (token rewires):**
- **aspect-ratio:** no design tokens (pure radix wrapper) — relocated only.
- **kbd:** `bg-muted`→`bg-surface-secondary`, `text-muted-foreground`→`text-subtle`;
  in-tooltip `bg-background/20 text-background`→`bg-on-inverse/20 text-on-inverse`
  (matches the forked Tooltip's inverse bubble).
- **empty:** `bg-muted`→`bg-surface-secondary`, `text-muted-foreground`→`text-subtle`,
  `hover:text-primary`→`hover:text-link`.
- **native-select:** `border-input`→`border`, `selection:bg-primary/text-primary-foreground`
  →`bg-fill-solid/text-on-solid`, `text-muted-foreground`→`text-subtle`, focus→`border-border-focus`,
  invalid→critical, dropped dark translucency. **lucide `ChevronDownIcon` → Heroicons.**

### `progress.tsx`, `avatar.tsx`, `toggle.tsx`, `spinner.tsx` — FORKED into Cardboard
**Date:** 2026-07-10
**Why:** Cardboard fork batch 4 (Button pattern). Owned components in
`src/components/cardboard/`; `ui/` paths are re-export shims; doc pages added.
**What (token rewires):**
- **progress:** track `bg-muted`→`bg-surface-secondary`; fill `bg-primary`→`bg-fill-solid`.
- **avatar:** `bg-muted`→`bg-surface-secondary`, `text-muted-foreground`→`text-subtle`,
  badge `bg-primary text-primary-foreground`→`bg-fill-solid text-on-solid`,
  `ring-background`→`ring-surface` (all identical values). `after:border-border` kept.
- **toggle:** hover/on `bg-muted`→`bg-surface-secondary`, `border-input`→`border`,
  `ring-ring`→`border-border-focus`, destructive→critical.
- **spinner:** **lucide `Loader2Icon` → Heroicons `ArrowPathIcon`** (icon convention;
  another component off lucide).

### `label.tsx`, `checkbox.tsx`, `textarea.tsx`, `skeleton.tsx` — FORKED into Cardboard
**Date:** 2026-07-10
**Why:** Cardboard fork batch 3 (Button pattern). Owned components in
`src/components/cardboard/`; `ui/` paths are re-export shims; doc pages added
(Label has no standalone page — token-less, shown within Checkbox/Switch).
**What (token rewires):**
- **label:** no design tokens — relocated only.
- **checkbox:** `border-input`→`border`; `data-checked` `bg-primary`/`border-primary`/
  `text-primary-foreground`→`bg-fill-solid`/`border-fill-solid`/`text-on-solid`;
  `ring-ring`→`border-border-focus`; destructive→critical; dropped dark `bg-input/30`.
  **Icon: lucide `CheckIcon` → Heroicons `@heroicons/react/24/solid`** (per the
  icon convention — one component off lucide).
- **textarea:** mirrors Cardboard Input — `border-input`→`border`,
  `text-muted-foreground`→`text-subtle`, focus→`border-border-focus`,
  invalid→critical, `disabled:bg-input`→`bg-surface-disabled`, dropped dark translucency.
- **skeleton:** `bg-muted`→`bg-surface-secondary` (identical value) — relocated.

### `input.tsx`, `card.tsx`, `switch.tsx`, `separator.tsx` — FORKED into Cardboard
**Date:** 2026-07-10
**Why:** Cardboard fork batch 2 (Button pattern). Each now has an owned component
in `src/components/cardboard/` with the `ui/` path as a re-export shim, and a doc
page under `box-system/components/`.
**What (token rewires):**
- **input:** `border-input`→`border`, `placeholder:text-muted-foreground`→`text-subtle`
  (both identical values), focus `border-ring`/`ring-ring`→`border-border-focus`
  (neutral-400 → brand-500, intentional: focus is now brand-colored), `aria-invalid`
  destructive→critical, `disabled:bg-input`→`bg-surface-disabled`. Dropped the
  dark-mode `bg-input/30` translucency (now transparent in both).
- **card:** `bg-card`→`bg-surface`, `text-card-foreground`→`text-foreground`,
  `text-muted-foreground`→`text-subtle` (all identical), footer `bg-muted/50`→
  `bg-surface-secondary/50` (identical).
- **switch:** `data-checked:bg-primary`→`bg-fill-solid`, `/80` hover→`bg-fill-solid-hover`,
  `data-unchecked:bg-input`→`bg-surface-tertiary` (+ hover), thumb `bg-background`→
  `bg-surface`, ring `ring-ring`→`border-border-focus`, destructive→critical.
  Dropped the dark-mode thumb overrides (bg-surface/fill-solid handle both themes).
- **separator:** already used `bg-border` (Cardboard-native) — relocated only.

### `tooltip.tsx` — FORKED into Cardboard (`cardboard/tooltip.tsx`)
**Date:** 2026-07-10
**Why:** Cardboard fork (follows the Button pattern). Preserves the earlier
arrow-removal customization.
**What:** Owned component at `src/components/cardboard/tooltip.tsx`; `ui/tooltip.tsx`
is a re-export shim. radix Tooltip primitives kept. The inverted bubble rewired
from `bg-foreground text-background` → `bg-inverse text-on-inverse` (Cardboard's
inverse-surface tokens; neutral-950 → neutral-900, a slight shift). No arrow,
sideOffset 4 preserved. Doc page imports from `cardboard/`.

### `alert.tsx` — FORKED into Cardboard (`cardboard/alert.tsx`)
**Date:** 2026-07-10
**Why:** Cardboard fork (follows the Button pattern). Preserves the earlier
info/success intent variants.
**What:** Owned component at `src/components/cardboard/alert.tsx`; `ui/alert.tsx`
is a re-export shim. `cva` kept. info/success already used Cardboard intent
tokens; rewired the rest: `default` `bg-card text-card-foreground` →
`bg-surface text-foreground` (identical values); `destructive` `text-destructive`
→ `text-critical` (slight shift red-500→red-600); `AlertDescription`
`text-muted-foreground` → `text-subtle` (identical). Doc page imports from
`cardboard/`.

### `badge.tsx` — FORKED into Cardboard (`cardboard/badge.tsx`)
**Date:** 2026-07-10
**Why:** Cardboard fork (follows the Button pattern).
**What:** Owned component at `src/components/cardboard/badge.tsx`; `ui/badge.tsx`
is a re-export shim. radix `Slot` + `cva` kept. Rewired to Cardboard tokens:
`default` → `bg-fill-solid text-on-solid`; `secondary` → `bg-surface-secondary`;
`destructive` → `bg-surface-critical text-critical`; `outline`/`ghost` →
`bg-surface-secondary` / `text-subtle`; `warning` → `bg-surface-caution
text-caution` (was raw `amber-100/700`; now the caution intent tokens — minor
shade shift, keeps the mono/uppercase treatment); `link` → `text-link`; focus
ring `ring-ring` → `border-border-focus`. Doc page imports from `cardboard/`.

### `button.tsx` — FORKED into Cardboard (`cardboard/button.tsx`)
**Date:** 2026-07-10
**Why:** First component of the Cardboard fork — take ownership of the shadcn
base and rewire it to Cardboard-native tokens so the design system is the source
of truth (not shadcn role names).
**What:**
- Owned component now lives at `src/components/cardboard/button.tsx`.
  `src/components/ui/button.tsx` is a thin re-export shim (existing
  `@/components/ui/button` imports keep working; migrate to `cardboard/` over time).
- radix `Slot` + `cva` kept as implementation detail (design layer only forked).
- Rewired token classes to Cardboard-native utilities:
  - `default`: `bg-primary text-primary-foreground hover:bg-primary/80` →
    `bg-fill-solid text-on-solid hover:bg-fill-solid-hover`. **New tokens added**
    to `semantics/core.css`: `--color-fill-solid`/`-hover` (= neutral-800/700
    light, 200/300 dark — matches old `--primary` exactly) and `--color-on-solid`.
    The `/80` opacity hover became a real neutral step.
  - `outline`/`secondary`/`ghost`: → `bg-surface*` / `bg-surface-secondary*`
    (same values as the old `--background`/`--secondary`/`--muted` aliases; the
    color-mix secondary hover became `bg-surface-secondary-hover`).
  - `destructive`: `bg-destructive/10` → `bg-surface-critical` (slight shift:
    red tint → red-50 surface token).
  - `link`: `text-primary` → `text-link` (now link-blue, was neutral).
  - focus ring / aria-invalid: `ring-ring`/`border-destructive` →
    `border-border-focus` / `border-critical`.
- Doc page (`box-system/components/button`) imports from `cardboard/button`.

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
**Update 2026-07-09:** intent tokens were Tailwind-native `p-` scheme (`p-{element}-{intent}[-state]`), so the info/success
variants now use `border-p-info bg-p-surface-info text-p-info` (and `-success`).
See `src/styles/semantics/intent.css`.

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
- Overlay (scrim): translucent `bg-black/20`, element opacity faded 1 → 0 via a state-driven CSS `transition: opacity 300ms` easeOutCubic, GPU-promoted to a real isolated Safari compositor layer (`will-change:opacity` + `transform:translate3d(0,0,0)` + `backface-visibility:hidden` + `isolation:isolate`) so the fade composites smoothly. NOTE: do NOT make the fill fully opaque `bg-black` + opacity 0.2 — it turns the iOS status-bar safe area solid black. Keep the translucent fill; the isolated GPU layer is what smooths the fade.
- Content: replaced the inline `transition` + `data-[state]` translate classes with `tw-animate-css` enter/exit animations keyed on Radix state (`data-[state=open]:animate-in`/`closed:animate-out` + per-side `slide-in-from-*`/`slide-out-to-*`), `duration-[420ms]` easeOutCubic. Added `transform-gpu will-change-transform`; dropped the opacity/fade on content (transform-only = smoother on mobile).
- Added a `draggable?: boolean` prop: when true, the built-in slide classes are skipped so a consumer can drive the transform/height itself. (Currently unused — the settings sheet drag is height-based and keeps the slide — but kept as an escape hatch.)
Applies to all sheets (settings + case-study bottom sheet).
