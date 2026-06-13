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

## Log

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
