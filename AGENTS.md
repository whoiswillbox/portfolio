<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Base component customizations

Components in `src/components/ui/` are vendored shadcn/ui files that we have
customized. **The customized version is canonical — it IS the component.**

- Before editing, re-adding, or overwriting any `src/components/ui/` file,
  read `docs/component-customizations.md`.
- Every change to a base component MUST be logged in that file.
- Never run `shadcn add <name> --overwrite` or re-init shadcn on a component
  listed there without preserving/re-applying its customizations.
- Adding brand-new components (not yet in the repo) is safe.

# Cardboard design system

Before adding or documenting a Cardboard component, or touching design tokens,
read `docs/cardboard.md` — the contributor guide (token architecture, how to add
+ document a component, doc-page conventions, the "don't touch Box" rule).
