"use client"

import * as React from "react"
import { AspectRatio as AspectRatioPrimitive } from "radix-ui"

/* Cardboard AspectRatio — owned. Forked from the vendored shadcn aspect-ratio
   (no design tokens — a pure radix wrapper). The old ui/aspect-ratio path
   re-exports this. */
function AspectRatio({
  ...props
}: React.ComponentProps<typeof AspectRatioPrimitive.Root>) {
  return <AspectRatioPrimitive.Root data-slot="aspect-ratio" {...props} />
}

export { AspectRatio }
