"use client"

import * as React from "react"
import { Select as SelectPrimitive } from "radix-ui"
import { ChevronDownIcon, CheckIcon, ChevronUpIcon } from "@heroicons/react/24/outline"

import { cn } from "@/lib/utils"

/* Cardboard Select — owned. Forked from the vendored shadcn select: rewired to
   Cardboard-native tokens and chevrons/check swapped lucide → Heroicons. radix
   Select primitives kept. The old ui/select path re-exports this. */
function Select({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Root>) {
  return <SelectPrimitive.Root data-slot="select" {...props} />
}

function SelectGroup({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Group>) {
  return (
    <SelectPrimitive.Group
      data-slot="select-group"
      className={cn("scroll-my-1 p-(--space-100)", className)}
      {...props}
    />
  )
}

function SelectValue({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Value>) {
  return <SelectPrimitive.Value data-slot="select-value" {...props} />
}

function SelectTrigger({
  className,
  size = "default",
  variant = "default",
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Trigger> & {
  size?: "sm" | "default"
  /** "default" = bordered surface control; "ghost" = borderless (text +
      chevron only, subtle hover) for inline / toolbar triggers. */
  variant?: "default" | "ghost"
}) {
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      data-size={size}
      data-variant={variant}
      className={cn(
        // Padding-driven size: no fixed height — padding (on the --space-* scale)
        // plus the text line-height determines the trigger's height, so changing
        // the padding resizes the control. Size variants differ by py: default
        // --space-200 (8px), sm --space-150 (6px). px --space-300 (12px).
        // See docs/component-customizations.md.
        "flex w-fit items-center justify-between gap-(--space-200) rounded-lg px-(--space-300) text-sm whitespace-nowrap transition-colors outline-none select-none focus-visible:ring-3 focus-visible:ring-border-focus/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-critical aria-invalid:ring-3 aria-invalid:ring-critical/20 data-placeholder:text-tertiary data-[size=default]:py-(--space-200) data-[size=sm]:py-(--space-150) data-[size=sm]:rounded-[min(var(--radius-md),10px)] *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-(--space-150) [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        // variant: default = bordered surface. Border darkens to border-hover and
        // the placeholder lifts tertiary → secondary on hover; the open menu
        // (data-state=open, set by Radix on the trigger) holds that same hover
        // styling so the trigger stays "active" while the list is shown;
        // border-focus on keyboard focus. Ghost = borderless, no fill — states are
        // text-color only: hover → text-secondary, active / menu-open →
        // text-foreground.
        variant === "default"
          ? "border border-border bg-surface hover:border-border-hover data-[state=open]:border-border-hover data-placeholder:hover:text-secondary data-placeholder:data-[state=open]:text-secondary focus-visible:border-border-focus"
          // ghost: no fill, text-color states only.
          //  · selected value: foreground → dims to secondary on hover;
          //    foreground while active / open.
          //  · placeholder: tertiary → lifts to secondary on hover; foreground
          //    while active / open (compound rules beat the base placeholder color).
          : "border border-transparent bg-transparent text-foreground hover:text-secondary active:text-foreground data-[state=open]:text-foreground data-placeholder:hover:text-secondary data-placeholder:active:text-foreground data-placeholder:data-[state=open]:text-foreground",
        className
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDownIcon className="pointer-events-none size-4 text-tertiary" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  )
}

function SelectContent({
  className,
  children,
  // CUSTOMIZED: default to "popper" (drop below the trigger) instead of shadcn's
  // "item-aligned" (overlay the trigger) — item-aligned breaks when the trigger
  // sits at the top of the viewport (e.g. the product switcher in the top bar).
  // See docs/component-customizations.md.
  position = "popper",
  align = "start",
  sideOffset = 4,
  onCloseAutoFocus,
  onPointerDown,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Content>) {
  // CUSTOMIZED: suppress the trigger's focus-visible ring after a *pointer*
  // selection. On close Radix returns focus to the trigger; the browser flags
  // that programmatic refocus as :focus-visible, so a mouse click leaves a ring.
  // We track whether the close was pointer-driven and, if so, preventDefault on
  // the auto-focus (Radix keeps the trigger focused for a11y, just without the
  // visible ring). Keyboard closes fall through untouched (ring stays — correct
  // for keyboard users). See docs/component-customizations.md.
  const pointerRef = React.useRef(false)
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        data-slot="select-content"
        data-align-trigger={position === "item-aligned"}
        className={cn("relative z-50 max-h-(--radix-select-content-available-height) min-w-36 origin-(--radix-select-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-lg bg-surface text-foreground shadow-md ring-1 ring-foreground/10 duration-100 data-[align-trigger=true]:animate-none data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95", position === "popper" && "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1", className)}
        position={position}
        align={align}
        sideOffset={sideOffset}
        onPointerDown={(e) => {
          pointerRef.current = true
          onPointerDown?.(e)
        }}
        onCloseAutoFocus={(e) => {
          if (pointerRef.current) {
            // Prevent Radix from returning focus to the trigger, then actively
            // blur it next frame — preventDefault alone still leaves the browser
            // resolving :focus-visible on the trigger, so the ring lingers.
            e.preventDefault()
            requestAnimationFrame(() => {
              const el = document.activeElement
              if (el instanceof HTMLElement && el.dataset.slot === "select-trigger") {
                el.blur()
              }
            })
          }
          pointerRef.current = false
          onCloseAutoFocus?.(e)
        }}
        {...props}
      >
        <SelectScrollUpButton />
        <SelectPrimitive.Viewport
          data-position={position}
          className={cn(
            "data-[position=popper]:w-full data-[position=popper]:min-w-(--radix-select-trigger-width)"
          )}
        >
          {children}
        </SelectPrimitive.Viewport>
        <SelectScrollDownButton />
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  )
}

function SelectLabel({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Label>) {
  return (
    <SelectPrimitive.Label
      data-slot="select-label"
      className={cn("px-(--space-150) py-(--space-100) text-xs text-tertiary", className)}
      {...props}
    />
  )
}

function SelectItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Item>) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(
        "relative flex w-full cursor-default items-center gap-(--space-150) rounded-md py-(--space-100) pr-(--space-800) pl-(--space-150) text-sm outline-hidden select-none focus:bg-surface-secondary focus:text-foreground data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-(--space-200)",
        className
      )}
      {...props}
    >
      <span className="pointer-events-none absolute right-2 flex size-4 items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <CheckIcon className="pointer-events-none" />
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  )
}

function SelectSeparator({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Separator>) {
  return (
    <SelectPrimitive.Separator
      data-slot="select-separator"
      className={cn("pointer-events-none -mx-(--space-100) my-(--space-100) h-px bg-border", className)}
      {...props}
    />
  )
}

function SelectScrollUpButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollUpButton>) {
  return (
    <SelectPrimitive.ScrollUpButton
      data-slot="select-scroll-up-button"
      className={cn(
        "z-10 flex cursor-default items-center justify-center bg-surface py-(--space-100) [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      <ChevronUpIcon />
    </SelectPrimitive.ScrollUpButton>
  )
}

function SelectScrollDownButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollDownButton>) {
  return (
    <SelectPrimitive.ScrollDownButton
      data-slot="select-scroll-down-button"
      className={cn(
        "z-10 flex cursor-default items-center justify-center bg-surface py-(--space-100) [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      <ChevronDownIcon />
    </SelectPrimitive.ScrollDownButton>
  )
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
}
