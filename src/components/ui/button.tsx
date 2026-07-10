/* Forked into Cardboard. This path is now a re-export shim so existing
   `@/components/ui/button` imports keep working; the owned component lives at
   `@/components/cardboard/button`. Migrate imports to cardboard/ over time.
   See docs/component-customizations.md. */
export { Button, buttonVariants } from "@/components/cardboard/button"
