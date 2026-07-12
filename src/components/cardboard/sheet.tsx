"use client"

import * as React from "react"
import { Dialog as SheetPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"
import { Button } from "@/components/cardboard/button"
import { XMarkIcon } from "@heroicons/react/24/outline"

function Sheet({ ...props }: React.ComponentProps<typeof SheetPrimitive.Root>) {
  return <SheetPrimitive.Root data-slot="sheet" {...props} />
}

function SheetTrigger({
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Trigger>) {
  return <SheetPrimitive.Trigger data-slot="sheet-trigger" {...props} />
}

function SheetClose({
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Close>) {
  return <SheetPrimitive.Close data-slot="sheet-close" {...props} />
}

function SheetPortal({
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Portal>) {
  return <SheetPrimitive.Portal data-slot="sheet-portal" {...props} />
}

function SheetOverlay({
  className,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Overlay>) {
  return (
    <SheetPrimitive.Overlay
      data-slot="sheet-overlay"
      className={cn(
        // Translucent fill (an OPAQUE black layer turned the iOS status-bar safe
        // area solid black). Fade element opacity 1 → 0 via a state-driven CSS
        // transition.
        "fixed inset-0 bg-black/20",
        "data-[state=open]:opacity-100 data-[state=closed]:opacity-0",
        className
      )}
      style={{
        // GPU-promote to a real isolated Safari compositor layer so the fade
        // composites smoothly (it banded/"blocky" otherwise, esp. in Safari).
        transition: "opacity 300ms cubic-bezier(0.33,1,0.68,1)",
        willChange: "opacity",
        transform: "translate3d(0,0,0)",
        backfaceVisibility: "hidden",
        isolation: "isolate",
        zIndex: 299,
      }}
      {...props}
    />
  )
}

function SheetContent({
  className,
  children,
  side = "right",
  showCloseButton = true,
  draggable = false,
  style,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Content> & {
  side?: "top" | "right" | "bottom" | "left"
  showCloseButton?: boolean
  /** Disable the built-in slide animation so the consumer can drive the
   *  transform itself (e.g. drag-to-expand/dismiss). */
  draggable?: boolean
}) {
  return (
    <SheetPortal>
      <SheetOverlay />
      <SheetPrimitive.Content
        data-slot="sheet-content"
        data-side={side}
        className={cn(
          "fixed flex flex-col gap-4 bg-transparent text-sm",
          "data-[side=bottom]:inset-x-0 data-[side=bottom]:bottom-0 data-[side=bottom]:h-auto",
          "data-[side=left]:inset-0 data-[side=right]:inset-0",
          "data-[side=top]:inset-x-0 data-[side=top]:top-0 data-[side=top]:h-auto",
          "transform-gpu will-change-transform",
          // Enter/exit slide keyed on Radix's open/closed state via tw-animate.
          // Skipped when draggable (consumer drives the transform).
          !draggable && [
            "duration-[420ms] ease-[cubic-bezier(0.33,1,0.68,1)]",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[side=bottom]:data-[state=open]:slide-in-from-bottom data-[side=bottom]:data-[state=closed]:slide-out-to-bottom",
            "data-[side=top]:data-[state=open]:slide-in-from-top data-[side=top]:data-[state=closed]:slide-out-to-top",
            "data-[side=left]:data-[state=open]:slide-in-from-left data-[side=left]:data-[state=closed]:slide-out-to-left",
            "data-[side=right]:data-[state=open]:slide-in-from-right data-[side=right]:data-[state=closed]:slide-out-to-right",
          ],
          className
        )}
        style={{
          zIndex: 300,
          isolation: "isolate",
          ...style,
        }}
        {...props}
      >
        {children}
        {showCloseButton && (
          <SheetPrimitive.Close data-slot="sheet-close" asChild>
            <Button
              variant="ghost"
              className="absolute top-3 right-3"
              size="icon-sm"
            >
              <XMarkIcon />
              <span className="sr-only">Close</span>
            </Button>
          </SheetPrimitive.Close>
        )}
      </SheetPrimitive.Content>
    </SheetPortal>
  )
}

function SheetHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-header"
      className={cn("flex flex-col gap-0.5 p-4", className)}
      {...props}
    />
  )
}

function SheetFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-footer"
      className={cn("mt-auto flex flex-col gap-2 p-4", className)}
      {...props}
    />
  )
}

function SheetTitle({
  className,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Title>) {
  return (
    <SheetPrimitive.Title
      data-slot="sheet-title"
      className={cn(
        "font-heading text-base font-medium text-foreground",
        className
      )}
      {...props}
    />
  )
}

function SheetDescription({
  className,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Description>) {
  return (
    <SheetPrimitive.Description
      data-slot="sheet-description"
      className={cn("text-sm text-tertiary", className)}
      {...props}
    />
  )
}

export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
}
