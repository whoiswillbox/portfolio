import * as React from "react"

import { cn } from "@/lib/utils"

/* Cardboard Input — owned. Forked from the vendored shadcn input and rewired to
   Cardboard-native tokens. The old ui/input path re-exports this. */
function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-8 w-full min-w-0 rounded-lg border border-border bg-transparent px-2.5 py-1 text-base transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-subtle focus-visible:border-border-focus focus-visible:ring-3 focus-visible:ring-border-focus/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-surface-disabled disabled:opacity-50 aria-invalid:border-critical aria-invalid:ring-3 aria-invalid:ring-critical/20 md:text-sm",
        className
      )}
      {...props}
    />
  )
}

export { Input }
