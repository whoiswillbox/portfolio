import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

/* Cardboard Badge — owned. Forked from the vendored shadcn badge and rewired to
   Cardboard-native tokens. radix Slot + cva kept as implementation detail. The
   old ui/badge path re-exports this. */
const badgeVariants = cva(
  "group/badge inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-4xl border border-transparent px-2 py-0.5 text-xs font-medium whitespace-nowrap transition-all focus-visible:border-border-focus focus-visible:ring-[3px] focus-visible:ring-border-focus/50 has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 aria-invalid:border-critical aria-invalid:ring-critical/20 [&>svg]:pointer-events-none [&>svg]:size-3!",
  {
    variants: {
      variant: {
        default: "bg-fill-solid text-on-solid [a]:hover:bg-fill-solid-hover",
        secondary:
          "bg-surface-secondary text-foreground [a]:hover:bg-surface-secondary-hover",
        destructive:
          "bg-surface-critical text-critical focus-visible:ring-critical/20 [a]:hover:bg-surface-critical-hover",
        outline:
          "border-border text-foreground [a]:hover:bg-surface-secondary [a]:hover:text-subtle",
        ghost:
          "hover:bg-surface-secondary hover:text-subtle",
        warning:
          "bg-surface-caution text-caution font-mono uppercase tracking-wide font-semibold",
        link: "text-link underline-offset-4 hover:underline",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "span"

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
