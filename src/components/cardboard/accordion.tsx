"use client"

import * as React from "react"
import { Accordion as AccordionPrimitive } from "radix-ui"
import { ChevronDownIcon, ChevronUpIcon, ChevronRightIcon } from "@heroicons/react/24/outline"

import { cn } from "@/lib/utils"

/* Cardboard Accordion — owned. Forked from the vendored shadcn accordion:
   rewired to Cardboard-native tokens, chevrons swapped to Heroicons, and given a
   `variant` system for the two real accordion styles used across the app:
     • default — bordered sections, chevron down/up, hover:underline (shadcn base)
     • inline  — compact per-row disclosure, ChevronRight rotates (Typography page)
   (Navigational drill-in lists like the Technergetics sidebar item are NOT
   accordions — those belong to the Sidebar component as a sidebar-item variant.)
   radix Accordion primitives kept. The old ui/accordion path re-exports this. */

type AccordionVariant = "default" | "inline"
const AccordionVariantContext = React.createContext<AccordionVariant>("default")

function Accordion({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Root> & {
  variant?: AccordionVariant
}) {
  return (
    <AccordionVariantContext.Provider value={variant}>
      <AccordionPrimitive.Root
        data-slot="accordion"
        data-variant={variant}
        className={cn("flex w-full flex-col", className)}
        {...props}
      />
    </AccordionVariantContext.Provider>
  )
}

function AccordionItem({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Item>) {
  const variant = React.useContext(AccordionVariantContext)
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn(variant === "default" && "not-last:border-b", className)}
      {...props}
    />
  )
}

function AccordionTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger>) {
  const variant = React.useContext(AccordionVariantContext)

  // `inline` matches the Typography-page disclosure exactly: a compact, muted
  // text-body-xs row with a size-3.5 ChevronRight (before the label) that rotates.
  const triggerClass = {
    default:
      "justify-between py-2.5 text-sm font-medium hover:underline items-start",
    inline:
      "cursor-pointer items-center gap-1.5 py-2 text-body-xs text-muted-foreground hover:text-foreground",
  }[variant]

  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          "group/accordion-trigger relative flex flex-1 border border-transparent text-left transition-colors outline-none focus-visible:border-border-focus focus-visible:ring-3 focus-visible:ring-border-focus/50 disabled:pointer-events-none disabled:opacity-50",
          triggerClass,
          className
        )}
        {...props}
      >
        {variant === "default" ? (
          <>
            {children}
            <ChevronDownIcon className="pointer-events-none ml-auto size-4 shrink-0 text-tertiary group-aria-expanded/accordion-trigger:hidden" />
            <ChevronUpIcon className="pointer-events-none ml-auto hidden size-4 shrink-0 text-tertiary group-aria-expanded/accordion-trigger:inline" />
          </>
        ) : (
          <>
            <ChevronRightIcon className="pointer-events-none size-3.5 shrink-0 transition-transform duration-200 group-aria-expanded/accordion-trigger:rotate-90" />
            {children}
          </>
        )}
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  )
}

function AccordionContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Content>) {
  return (
    <AccordionPrimitive.Content
      data-slot="accordion-content"
      className="overflow-hidden text-sm data-open:animate-accordion-down data-closed:animate-accordion-up"
      {...props}
    >
      <div
        className={cn(
          "h-(--radix-accordion-content-height) pt-0 pb-2.5 [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-foreground [&_p:not(:last-child)]:mb-4",
          className
        )}
      >
        {children}
      </div>
    </AccordionPrimitive.Content>
  )
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
