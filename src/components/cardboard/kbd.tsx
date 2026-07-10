import * as React from "react"

import { cn } from "@/lib/utils"

/* Cardboard Kbd — owned. Forked from the vendored shadcn kbd and rewired to
   Cardboard-native tokens. The old ui/kbd path re-exports this. */
function Kbd({ className, ...props }: React.ComponentProps<"kbd">) {
  return (
    <kbd
      data-slot="kbd"
      className={cn(
        "pointer-events-none inline-flex h-5 w-fit min-w-5 items-center justify-center gap-1 rounded-sm bg-surface-secondary px-1 font-sans text-xs font-medium text-subtle select-none in-data-[slot=tooltip-content]:bg-on-inverse/20 in-data-[slot=tooltip-content]:text-on-inverse [&_svg:not([class*='size-'])]:size-3",
        className
      )}
      {...props}
    />
  )
}

function KbdGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <kbd
      data-slot="kbd-group"
      className={cn("inline-flex items-center gap-1", className)}
      {...props}
    />
  )
}

export { Kbd, KbdGroup }
