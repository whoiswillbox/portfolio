# Design Foundations

A two-tier design-token system. **Primitives** hold raw values; **semantics**
assign meaning. Components consume semantics only — never primitives.

```
src/styles/
  primitives/   raw, context-free values (the palette & scales)
    colors.css       neutral, brand, blue, green, amber, red ramps
    typography.css   font families, display sizes, weights
    spacing.css      Polaris-style space scale (--space-400 = 16px), widths, radius
  semantics/    meaning assigned to primitives, theme-aware, exposed as utilities
    core.css         shadcn vocabulary (background, primary, sidebar, …)
    intent.css       status intents (brand/info/success/caution/critical)
    typography.css   font-sans, display type scale
    spacing.css      py-section, max-w-content, radius scale
```

All files are imported (in this order) by `src/app/globals.css`.

## Tiers

1. **Primitives** — plain `:root` custom properties (`--neutral-500`,
   `--space-400`). No meaning, never used directly in components.
2. **Semantics** — `@theme` / `@theme inline` tokens that reference primitives
   and generate Tailwind utilities. Theme-aware via `:root` + `.dark`.

`@theme inline` is used when a token's value changes between light/dark (so the
utility resolves the var at use-time); plain `@theme` for static tokens.

## Color model (Tailwind v4 vs Polaris)

Polaris names the property into the token (`--p-color-bg-surface-info`). In
Tailwind v4 the property is the utility prefix, so one token serves all
properties. We keep element + intent in the name and let Tailwind add bg/text/border:

| Role | Token | Utilities |
|------|-------|-----------|
| Surface (pale bg) | `--color-surface-info` | `bg-surface-info` (+`-hover`/`-active`) |
| Accent (saturated) | `--color-info` | `text-info`, `border-info` |
| Fill (solid bg) | `--color-fill-info` | `bg-fill-info` (+`-hover`) |

Intents: `brand`, `info`, `success`, `caution`, `critical`. Text on solid fills:
`text-on-fill` (and `text-on-fill-caution` for the light amber fill).

Neutral roles (background, foreground, muted, border, …) come from `core.css`
(shadcn vocabulary) — the intent layer only adds what shadcn lacks.

## Other scales

- **Spacing**: Polaris numeric scale in `primitives/spacing.css`
  (`--space-400` = 16px). Tailwind's default `p-4`/`gap-2` scale is untouched;
  semantic layout helpers are `py-section`, `px-gutter`, `max-w-content`,
  `max-w-wide`.
- **Radius**: `--radius` (0.625rem) with `rounded-sm`…`rounded-4xl` derived.

## Type scale

Defined in `primitives/typography.css`, exposed as utilities in
`semantics/typography.css`. Each heading/display utility carries its own
line-height, letter-spacing, and weight — apply one class. Tailwind's default
`text-sm`…`text-9xl` remain available too.

| Tier | Utility | Size |
|------|---------|------|
| Body | `text-body-xs` | 12px |
| Body | `text-body-sm` | 14px |
| Body | `text-body-md` | 16px (base) |
| Body | `text-body-lg` | 18px |
| Heading | `text-h6` | 16px |
| Heading | `text-h5` | 18px |
| Heading | `text-h4` | 20px |
| Heading | `text-h3` | 24px |
| Heading | `text-h2` | 30px |
| Heading | `text-h1` | 36px |
| Display | `text-display-sm` | 40px |
| Display | `text-display` | 56px |
| Display | `text-display-lg` | 72px |

Scale is monotonic: body → headings → display.

## Rules

- Components use **semantic** utilities only. If you need a raw value, add a
  semantic token for it — don't reach into primitives.
- Re-brand the whole site by changing the brand hue in
  `primitives/colors.css` (the `254` in the brand ramp).
- `.css` comments must not contain the `*/` sequence (e.g. `--brand-*/`) — it
  closes the comment early and breaks the build.
