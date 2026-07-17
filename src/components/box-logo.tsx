import { cn } from "@/lib/utils"

/** The isometric "Box" cube mark (3 faces, currentColor). Shared by the top-bar
 *  logo and the Box AI empty-state so the brand mark stays consistent. */
export function BoxLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("text-foreground", className)}
      aria-hidden="true"
    >
      {/* Fills only — no per-path stroke, so shared edges between faces don't
          double up into a darker line than the outer silhouette. */}
      <path d="M2 9 L12 15 L12 25 L2 19 Z" fill="currentColor" fillOpacity="0.12" />
      <path d="M22 9 L12 15 L12 25 L22 19 Z" fill="currentColor" fillOpacity="0.06" />
      <path d="M2 9 L12 3 L22 9 L12 15 Z" fill="currentColor" fillOpacity="0.085" />
      {/* One unified stroke pass: the outer hexagon silhouette plus the two
          internal edges meeting at the cube's center vertex — every line gets
          exactly one stroke, so opacity reads even all the way around. */}
      <path
        d="M2 9 L12 3 L22 9 L22 19 L12 25 L2 19 Z M12 15 L2 9 M12 15 L22 9 M12 15 L12 25"
        stroke="currentColor"
        strokeOpacity="0.45"
        strokeWidth={1}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  )
}
