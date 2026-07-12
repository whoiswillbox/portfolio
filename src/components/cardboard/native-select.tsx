import * as React from "react"
import { ChevronDownIcon } from "@heroicons/react/24/outline"

import { cn } from "@/lib/utils"

/* Cardboard NativeSelect — owned. Forked from the vendored shadcn native-select:
   rewired to Cardboard-native tokens and switched the chevron from lucide to
   Heroicons (per the icon convention). The old ui/native-select path re-exports
   this. */
type NativeSelectProps = Omit<React.ComponentProps<"select">, "size"> & {
  size?: "sm" | "default"
}

function NativeSelect({
  className,
  size = "default",
  ...props
}: NativeSelectProps) {
  return (
    <div
      className={cn(
        "group/native-select relative w-fit has-[select:disabled]:opacity-50",
        className
      )}
      data-slot="native-select-wrapper"
      data-size={size}
    >
      <select
        data-slot="native-select"
        data-size={size}
        className="h-8 w-full min-w-0 appearance-none rounded-lg border border-border bg-transparent py-1 pr-8 pl-2.5 text-sm transition-colors outline-none select-none selection:bg-fill-solid selection:text-on-solid placeholder:text-tertiary focus-visible:border-border-focus focus-visible:ring-3 focus-visible:ring-border-focus/50 disabled:pointer-events-none disabled:cursor-not-allowed aria-invalid:border-critical aria-invalid:ring-3 aria-invalid:ring-critical/20 data-[size=sm]:h-7 data-[size=sm]:rounded-[min(var(--radius-md),10px)] data-[size=sm]:py-0.5"
        {...props}
      />
      <ChevronDownIcon
        className="pointer-events-none absolute top-1/2 right-2.5 size-4 -translate-y-1/2 text-tertiary select-none"
        aria-hidden="true"
        data-slot="native-select-icon"
      />
    </div>
  )
}

function NativeSelectOption({
  className,
  ...props
}: React.ComponentProps<"option">) {
  return (
    <option
      data-slot="native-select-option"
      className={cn("bg-[Canvas] text-[CanvasText]", className)}
      {...props}
    />
  )
}

function NativeSelectOptGroup({
  className,
  ...props
}: React.ComponentProps<"optgroup">) {
  return (
    <optgroup
      data-slot="native-select-optgroup"
      className={cn("bg-[Canvas] text-[CanvasText]", className)}
      {...props}
    />
  )
}

export { NativeSelect, NativeSelectOptGroup, NativeSelectOption }
