import { cn } from "@/lib/utils"

/* Cardboard Skeleton — owned. Forked from the vendored shadcn skeleton; rewired
   the placeholder fill to the Cardboard surface token. The old ui/skeleton path
   re-exports this. */
function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("animate-pulse rounded-md bg-surface-secondary", className)}
      {...props}
    />
  )
}

export { Skeleton }
