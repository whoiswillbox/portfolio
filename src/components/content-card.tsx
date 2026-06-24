import { cn } from "@/lib/utils";

export function ContentCard({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className="min-h-0 h-full overflow-hidden sm:bg-sidebar sm:rounded-xl sm:shadow-lg sm:ring-1 sm:ring-sidebar-border"
      {...props}
    >
      {/* Installed PWA only: the SidebarInset no longer reserves nav space, so
          the page background fills the full height (no bare band). Add bottom
          padding so scrollable content clears the floating nav. Box-ai overrides
          with its own bottom handling. Browser is unchanged. */}
      <div className={cn("h-full overflow-auto max-sm:[@media(display-mode:standalone)]:pb-24", className)}>
        {children}
      </div>
    </div>
  );
}
