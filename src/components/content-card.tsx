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
      {/* In the installed PWA (standalone) the SidebarInset no longer reserves
          space for the floating nav, so the scroll area fills the full screen.
          Add bottom padding here so scrollable content clears the floating nav
          (content scrolls up under it; last content stays visible). Pages that
          manage their own bottom (e.g. box-ai via a height cap) override this. */}
      <div className={cn("h-full overflow-auto max-sm:[@media(display-mode:standalone)]:pb-24", className)}>
        {children}
      </div>
    </div>
  );
}
