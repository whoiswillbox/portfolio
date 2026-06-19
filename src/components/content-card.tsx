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
        "min-h-0 overflow-hidden rounded-xl bg-sidebar shadow-lg ring-1 ring-sidebar-border animate-in fade-in duration-300",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
