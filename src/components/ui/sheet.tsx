/* Forked into Cardboard. Re-export shim — the owned component lives at
   `@/components/cardboard/sheet`. See docs/component-customizations.md.
   (Preserves the custom scrim fade, real slide animation, and `draggable`
   opt-out.) */
export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
} from "@/components/cardboard/sheet"
