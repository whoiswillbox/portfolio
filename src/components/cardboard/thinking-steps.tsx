import * as React from "react"

import { cn } from "@/lib/utils"

/* Cardboard ThinkingSteps — owned (new). A reasoning/"thinking" trace: a card
   holding an optional header (a phrase + elapsed seconds) and a sequence of
   steps, each with a leading icon, a label, and a right-aligned status — a
   pulsing dot while running, a filled checkmark when done.

   Presentational / CONTROLLED: it renders exactly the step statuses you pass and
   owns no timers. The consumer (e.g. Box AI) drives the reveal + completion.
   Refine the look here; behavior lives in the consumer. */

export type ThinkingStepStatus = "pending" | "active" | "done"

export type ThinkingStep = {
  label: string
  /** A leading icon component (e.g. a Heroicon). Rendered at size-3.5. */
  icon: React.ElementType
  status: ThinkingStepStatus
}

function StepRow({ step }: { step: ThinkingStep }) {
  const Icon = step.icon
  const done = step.status === "done"
  return (
    <div
      data-status={step.status}
      className={cn(
        "flex items-center gap-2 rounded-lg bg-muted px-3 py-2 transition-opacity animate-in fade-in slide-in-from-bottom-1 duration-300",
        // Dim finished steps so the eye follows the active one.
        step.status === "done" ? "opacity-50" : "opacity-100",
      )}
    >
      <Icon className="size-3.5 shrink-0 opacity-60" />
      <span className="flex-1 truncate">{step.label}</span>
      {done ? (
        <span className="flex size-4 shrink-0 items-center justify-center rounded-full bg-foreground text-background">
          <CheckGlyph />
        </span>
      ) : (
        <span className="size-2 shrink-0 animate-pulse rounded-full bg-current opacity-40" />
      )}
    </div>
  )
}

/* Inline check glyph so the component has no icon-library dependency. */
function CheckGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="size-3" aria-hidden="true">
      <path
        d="M5 13l4 4L19 7"
        stroke="currentColor"
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function ThinkingSteps({
  steps,
  heading,
  seconds,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  steps: ThinkingStep[]
  /** Optional header phrase shown above the steps (e.g. "Riding the break"). */
  heading?: React.ReactNode
  /** Optional elapsed seconds shown next to the heading. */
  seconds?: number
}) {
  return (
    <div
      data-slot="thinking-steps"
      className={cn(
        "flex w-full flex-col gap-2 rounded-xl border border-border bg-muted/40 p-3 font-mono text-body-xs uppercase tracking-wide text-muted-foreground",
        className,
      )}
      {...props}
    >
      {(heading != null || seconds != null) && (
        <div className="flex items-center gap-2 px-1">
          {heading != null && <span className="animate-pulse">{heading}</span>}
          {seconds != null && seconds > 0 && <span>{seconds}s</span>}
        </div>
      )}
      {steps.length > 0 && (
        <div className="flex flex-col gap-1">
          {steps.map((step, i) => (
            <StepRow key={i} step={step} />
          ))}
        </div>
      )}
    </div>
  )
}
