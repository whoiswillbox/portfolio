import { ArrowPathIcon } from "@heroicons/react/24/outline"

import { cn } from "@/lib/utils"

/* Cardboard Spinner — owned. Forked from the vendored shadcn spinner; switched
   the glyph from lucide (Loader2Icon) to Heroicons (ArrowPathIcon) per the icon
   convention. The old ui/spinner path re-exports this. */
function Spinner({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <ArrowPathIcon
      role="status"
      aria-label="Loading"
      className={cn("size-4 animate-spin", className)}
      {...props}
    />
  )
}

export { Spinner }
