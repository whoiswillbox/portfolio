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
      <path d="M2 9 L12 15 L12 25 L2 19 Z" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth={1} strokeLinejoin="round" />
      <path d="M22 9 L12 15 L12 25 L22 19 Z" fill="currentColor" fillOpacity="0.05" stroke="currentColor" strokeWidth={1} strokeLinejoin="round" />
      <path d="M2 9 L12 3 L22 9 L12 15 Z" fill="currentColor" fillOpacity="0.08" stroke="currentColor" strokeWidth={1} strokeLinejoin="round" />
    </svg>
  )
}
