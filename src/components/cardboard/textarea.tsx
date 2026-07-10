import * as React from "react"

import { cn } from "@/lib/utils"

/* Cardboard Textarea — owned. Forked from the vendored shadcn textarea and
   rewired to Cardboard-native tokens (mirrors the Cardboard Input). The old
   ui/textarea path re-exports this. */
function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-16 w-full rounded-lg border border-border bg-transparent px-2.5 py-2 text-base transition-colors outline-none placeholder:text-subtle focus-visible:border-border-focus focus-visible:ring-3 focus-visible:ring-border-focus/50 disabled:cursor-not-allowed disabled:bg-surface-disabled disabled:opacity-50 aria-invalid:border-critical aria-invalid:ring-3 aria-invalid:ring-critical/20 md:text-sm",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
