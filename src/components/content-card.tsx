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
      <div className={cn("h-full overflow-auto", className)}>
        {children}
      </div>
    </div>
  );
}
