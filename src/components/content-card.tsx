import { cn } from "@/lib/utils";

/**
 * A content-area card: the floating rounded panel that holds page content,
 * sitting on the dotted/background canvas. Pages render one (or several, side
 * by side) of these. Add layout classes (flex, flex-1, etc.) via `className`.
 */
export function ContentCard({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "min-h-0 sm:overflow-hidden sm:bg-sidebar sm:rounded-xl sm:shadow-lg sm:ring-1 sm:ring-sidebar-border",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
