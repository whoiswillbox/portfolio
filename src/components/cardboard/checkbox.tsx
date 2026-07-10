"use client"

import * as React from "react"
import { Checkbox as CheckboxPrimitive } from "radix-ui"
import { CheckIcon } from "@heroicons/react/24/solid"

import { cn } from "@/lib/utils"

/* Cardboard Checkbox — owned. Forked from the vendored shadcn checkbox: rewired
   to Cardboard-native tokens and switched the check glyph from lucide to
   Heroicons (per the icon convention). radix Checkbox primitives kept. The old
   ui/checkbox path re-exports this. */
function Checkbox({
  className,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "peer relative flex size-4 shrink-0 items-center justify-center rounded-[4px] border border-border transition-colors outline-none group-has-disabled/field:opacity-50 after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:border-border-focus focus-visible:ring-3 focus-visible:ring-border-focus/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-critical aria-invalid:ring-3 aria-invalid:ring-critical/20 aria-invalid:aria-checked:border-fill-solid data-checked:border-fill-solid data-checked:bg-fill-solid data-checked:text-on-solid",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="grid place-content-center text-current transition-none [&>svg]:size-3.5"
      >
        <CheckIcon />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }
