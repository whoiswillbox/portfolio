import { cn } from "@/lib/utils";

export function ContentCard({
  className,
  children,
  ref,
  flush = false,
  ...props
}: React.ComponentProps<"div"> & {
  /** Drop the card chrome (bg/rounded/shadow/ring) so content sits directly on
      the page background. Keeps the scroll structure. Used by Cardboard pages. */
  flush?: boolean;
}) {
  return (
    <div
      ref={ref}
      className={cn(
        "min-h-0 h-full overflow-hidden",
        !flush && "sm:bg-sidebar sm:rounded-xl sm:shadow-lg sm:ring-1 sm:ring-sidebar-border"
      )}
      {...props}
    >
      {/* The SidebarInset no longer reserves space for the floating nav, so the
          scroll area fills the full height and content scrolls under the nav
          (matching the top, which scrolls under the status bar). Add bottom
          padding so the last content clears the floating nav. Box-ai overrides
          this with its own bottom handling. */}
      <div data-scroll-container className={cn("h-full overflow-auto max-sm:pb-24", className)}>
        {children}
      </div>
    </div>
  );
}
