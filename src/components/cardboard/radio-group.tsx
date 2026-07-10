"use client"

import * as React from "react"
import { RadioGroup as RadioGroupPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

/* Cardboard RadioGroup — owned. Forked from the vendored shadcn radio-group and
   rewired to Cardboard-native tokens (fill-solid when checked). radix RadioGroup
   primitives kept. The old ui/radio-group path re-exports this. */
function RadioGroup({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Root>) {
  return (
    <RadioGroupPrimitive.Root
      data-slot="radio-group"
      className={cn("grid w-full gap-2", className)}
      {...props}
    />
  )
}

function RadioGroupItem({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Item>) {
  return (
    <RadioGroupPrimitive.Item
      data-slot="radio-group-item"
      className={cn(
        "group/radio-group-item peer relative flex aspect-square size-4 shrink-0 rounded-full border border-border outline-none after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:border-border-focus focus-visible:ring-3 focus-visible:ring-border-focus/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-critical aria-invalid:ring-3 aria-invalid:ring-critical/20 aria-invalid:aria-checked:border-fill-solid data-checked:border-fill-solid data-checked:bg-fill-solid data-checked:text-on-solid",
        className
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator
        data-slot="radio-group-indicator"
        className="flex size-4 items-center justify-center"
      >
        <span className="absolute top-1/2 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-on-solid" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  )
}

export { RadioGroup, RadioGroupItem }
