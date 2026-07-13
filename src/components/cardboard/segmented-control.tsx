"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

/* Cardboard SegmentedControl — owned (new, not forked). A single-select
   "pill on a track" selector: a muted, ringed track holds equal segments; the
   active segment lifts onto a raised surface pill. Controlled via value /
   onValueChange. Distinct from ToggleGroup (joined buttons) — this is the
   iOS-style segmented switch used for view toggles (e.g. Primitives/Semantics).

   Composition:
     <SegmentedControl value={v} onValueChange={setV}>
       <SegmentedControlItem value="a">A</SegmentedControlItem>
       <SegmentedControlItem value="b">B</SegmentedControlItem>
     </SegmentedControl>
*/

type SegmentedControlContextValue = {
  value: string
  onValueChange: (value: string) => void
  size: "sm" | "default"
  fullWidth: boolean
}

const SegmentedControlContext = React.createContext<SegmentedControlContextValue | null>(null)

function useSegmentedControl() {
  const ctx = React.useContext(SegmentedControlContext)
  if (!ctx) throw new Error("SegmentedControlItem must be used within a SegmentedControl")
  return ctx
}

function SegmentedControl({
  value,
  onValueChange,
  size = "default",
  fullWidth = false,
  className,
  children,
  ...props
}: Omit<React.ComponentProps<"div">, "onChange"> & {
  value: string
  onValueChange: (value: string) => void
  size?: "sm" | "default"
  /** Stretch to fill the container; segments share the width evenly. Useful on
      mobile / full-bleed layouts. */
  fullWidth?: boolean
}) {
  const ref = React.useRef<HTMLDivElement>(null)

  // WAI-ARIA tablist keyboard nav: arrows/Home/End move selection between the
  // enabled segments (roving), skipping disabled ones. Selection follows focus.
  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const keys = ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"]
    if (!keys.includes(e.key)) return
    const tabs = Array.from(
      ref.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]:not([disabled])') ?? []
    )
    if (tabs.length === 0) return
    e.preventDefault()
    const currentIndex = tabs.findIndex((t) => t.dataset.value === value)
    let nextIndex = currentIndex
    if (e.key === "Home") nextIndex = 0
    else if (e.key === "End") nextIndex = tabs.length - 1
    else if (e.key === "ArrowRight" || e.key === "ArrowDown")
      nextIndex = (currentIndex + 1 + tabs.length) % tabs.length
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp")
      nextIndex = (currentIndex - 1 + tabs.length) % tabs.length
    const next = tabs[nextIndex]
    if (next) {
      next.focus()
      onValueChange(next.dataset.value!)
    }
  }

  return (
    <SegmentedControlContext.Provider value={{ value, onValueChange, size, fullWidth }}>
      <div
        ref={ref}
        data-slot="segmented-control"
        data-size={size}
        data-full-width={fullWidth}
        role="tablist"
        onKeyDown={onKeyDown}
        className={cn(
          "flex items-center gap-1 rounded-lg bg-muted p-1 ring-1 ring-border",
          fullWidth ? "w-full" : "w-fit",
          className
        )}
        {...props}
      >
        {children}
      </div>
    </SegmentedControlContext.Provider>
  )
}

function SegmentedControlItem({
  value,
  icon,
  className,
  children,
  ...props
}: Omit<React.ComponentProps<"button">, "value"> & {
  value: string
  /** Optional leading icon, rendered before the label. */
  icon?: React.ReactNode
}) {
  const { value: selected, onValueChange, size, fullWidth } = useSegmentedControl()
  const active = selected === value
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      // Roving tabindex: only the selected segment is in the tab order, so the
      // group is a single Tab stop; arrows move within it.
      tabIndex={active ? 0 : -1}
      data-slot="segmented-control-item"
      data-value={value}
      data-state={active ? "active" : "inactive"}
      onClick={() => onValueChange(value)}
      className={cn(
        "inline-flex items-center justify-center gap-1.5 rounded-md whitespace-nowrap transition-colors outline-none focus-visible:ring-2 focus-visible:ring-border-focus disabled:pointer-events-none disabled:opacity-50",
        size === "sm" ? "px-2.5 py-1 text-body-xs" : "px-3 py-1.5 text-body-sm",
        fullWidth && "flex-1",
        active
          ? "bg-background text-foreground shadow-sm font-medium"
          : "text-tertiary hover:text-foreground font-normal",
        className
      )}
      {...props}
    >
      {icon && (
        <span className="[&_svg]:size-4 shrink-0" aria-hidden="true">
          {icon}
        </span>
      )}
      {children}
    </button>
  )
}

export { SegmentedControl, SegmentedControlItem }
