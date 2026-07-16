"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"

// Box product footer: © year on the left, a Light/Dark theme toggle on the
// right. The toggle labels reuse the top-nav item interaction states —
// text-body-sm, active = text-foreground, rest = text-quaternary
// hover:text-secondary — so it reads as part of the same nav language.
export function BoxFooter({
  isLanding = false,
  className,
  style,
}: {
  isLanding?: boolean
  className?: string
  style?: React.CSSProperties
}) {
  const { resolvedTheme, setTheme } = useTheme()
  // Avoid a hydration mismatch: theme is only known on the client, so render the
  // labels inert until mounted, then reflect the active one.
  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => setMounted(true), [])

  const labelClass = (active: boolean) =>
    cn(
      "rounded-md px-2 py-1 text-body-sm transition-colors",
      active ? "text-foreground" : "text-quaternary hover:text-secondary"
    )

  return (
    <footer
      className={cn(
        // mx-5 (not px-5) so the footer box shares the content card's exact
        // m-5 left/right offset — © and Light/Dark line up with the card's
        // outer edges.
        "flex items-center justify-between mx-5 max-sm:hidden",
        // On landing the footer fades in with the scroll into Box AI, tracking
        // the same --enter-progress signal as the nav reveal. nav-splash-inert +
        // data-splash keep it non-interactive until it's revealed. Its height
        // also grows 0 → full with progress so it doesn't steal space from the
        // full-bleed splash card at rest. Off-landing it's a static row.
        isLanding ? "overflow-hidden nav-splash-inert" : "pb-3",
        // Smoothly slide the left inset (Cardboard: footer insets by the sidebar
        // width when it opens, matching the content card's slide).
        "transition-[padding] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]",
        className
      )}
      style={{
        ...(isLanding
          ? {
              opacity: "var(--enter-progress, 0)",
              height: "calc(2.75rem * var(--enter-progress, 0))",
            }
          : undefined),
        ...style,
      }}
    >
      <p className="font-mono text-body-xs text-quaternary">
        © {new Date().getFullYear()}
      </p>
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => setTheme("light")}
          className={labelClass(mounted && resolvedTheme === "light")}
        >
          Light
        </button>
        <button
          type="button"
          onClick={() => setTheme("dark")}
          className={labelClass(mounted && resolvedTheme === "dark")}
        >
          Dark
        </button>
      </div>
    </footer>
  )
}
