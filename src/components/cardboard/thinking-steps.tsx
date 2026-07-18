"use client"

import * as React from "react"
import Link from "next/link"

import { cn } from "@/lib/utils"

/* Cardboard ThinkingSteps — owned (new). A reasoning trace with TWO variants:
     • "Thinking" (live) — pass `steps`: they're visible, the active one
       pulses, finished ones dim with a checkmark.
     • "Thought" (done) — pass `summary` (+ optional `seconds`, e.g.
       summary="Thought for" seconds={4} → "Thought for 4s"): the same steps
       collapse into an expandable disclosure row, re-revealed on click.

   Presentational / CONTROLLED: it renders exactly the step statuses you pass and
   owns no timers. The consumer (e.g. Box AI) drives the reveal + completion.
   Refine the look here; behavior lives in the consumer. */

export type ThinkingStepStatus = "pending" | "active" | "done"

/* A source consulted during a step — e.g. a case study the step scraped.
   Rendered as a small row (title + muted subtitle) under the step, optionally
   linking to `href`. */
export type ThinkingStepSource = {
  title: string
  /** Muted secondary line (e.g. a category, org, or path). */
  subtitle?: string
  href?: string
}

export type ThinkingStep = {
  label: string
  /** A leading icon component (e.g. a Heroicon). Rendered at size-3.5. */
  icon: React.ElementType
  status: ThinkingStepStatus
  /** Sources this step consulted, listed beneath it (search-results style). */
  sources?: ThinkingStepSource[]
}

/* A step is a timeline row (Claude-style): a leading icon "node" threaded by a
   vertical connector line, with the label to its right. No per-step container.
   `isLast` suppresses the connector below the final node. */
function StepRow({ step, isLast }: { step: ThinkingStep; isLast: boolean }) {
  const Icon = step.icon
  const hasSources = !!step.sources?.length
  return (
    <div
      data-status={step.status}
      className={cn(
        "relative flex items-start gap-2.5 pb-5 last:pb-0 transition-opacity animate-in fade-in slide-in-from-bottom-1 duration-300",
        // Dim finished steps so the eye follows the active one.
        step.status === "done" && "opacity-50",
      )}
    >
      {/* Vertical connector — absolutely positioned so it doesn't depend on flex
          height. Runs from just under this icon to the next row's icon; the last
          step has none. The icon column is size-4 (centered at x = 0.5rem). */}
      {!isLast && (
        <span className="absolute left-2 top-5 bottom-0 w-px -translate-x-1/2 bg-border" aria-hidden="true" />
      )}
      <span className="relative z-10 flex size-4 shrink-0 items-center justify-center">
        {step.status === "done" ? (
          <CheckGlyph />
        ) : (
          <Icon className={cn("size-3.5", step.status === "active" ? "opacity-80" : "opacity-50")} />
        )}
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        {/* Only the LABEL breathes while active — not its source list. */}
        <span
          className={cn(
            "truncate font-sans text-body-sm normal-case tracking-normal leading-tight",
            step.status === "active" && "animate-pulse",
          )}
        >
          {step.label}
        </span>
        {hasSources && <SourceList sources={step.sources!} />}
      </div>
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

/* Inline chevron glyph for the collapsed summary's disclosure toggle. */
function ChevronGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={cn("size-3.5", className)} aria-hidden="true">
      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/* The sources a step consulted — a small search-results-style list under the
   step (title + muted subtitle). A source with an href renders as a link. */
function SourceList({ sources }: { sources: ThinkingStepSource[] }) {
  return (
    <ul className="flex flex-col gap-0.5 rounded-lg border border-border bg-background/50 p-1">
      {sources.map((src, i) => {
        const body = (
          <>
            <span className="truncate font-sans text-body-sm normal-case tracking-normal text-foreground">
              {src.title}
            </span>
            {src.subtitle && (
              <span className="shrink-0 truncate font-sans text-body-xs normal-case tracking-normal text-quaternary">
                {src.subtitle}
              </span>
            )}
          </>
        )
        return (
          <li key={i}>
            {src.href ? (
              <Link
                href={src.href}
                className="flex items-baseline justify-between gap-3 rounded-md px-2 py-1 transition-colors hover:bg-muted"
              >
                {body}
              </Link>
            ) : (
              <div className="flex items-baseline justify-between gap-3 px-2 py-1">{body}</div>
            )}
          </li>
        )
      })}
    </ul>
  )
}

export function ThinkingSteps({
  steps,
  summary,
  seconds,
  defaultOpen = false,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  steps: ThinkingStep[]
  /** When set, renders the COLLAPSED state instead of the live trace: a
      clickable "summary" row (e.g. "Thought for") with a chevron that
      discloses the steps. Use this after the trace completes. */
  summary?: React.ReactNode
  /** Elapsed seconds, appended to `summary` as " Xs" (e.g. "Thought for" + 4 →
      "Thought for 4s"). Thought (collapsed) mode only — ignored otherwise. */
  seconds?: number
  /** In collapsed (summary) mode, whether the steps start expanded. */
  defaultOpen?: boolean
}) {
  const collapsed = summary != null
  const [open, setOpen] = React.useState(defaultOpen)
  const stepsList = steps.length > 0 && (
    <div className="flex flex-col px-1">
      {steps.map((step, i) => (
        <StepRow key={i} step={step} isLast={i === steps.length - 1} />
      ))}
    </div>
  )

  return (
    <div
      data-slot="thinking-steps"
      data-collapsed={collapsed || undefined}
      className={cn(
        "flex w-full flex-col gap-3 font-mono text-body-xs uppercase tracking-wide text-muted-foreground",
        className,
      )}
      {...props}
    >
      {collapsed ? (
        <>
          {/* Collapsed summary row — a disclosure toggle for the completed
              trace ("Thought for Xs"). */}
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            className="flex items-center gap-2 px-1 text-left transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus rounded"
          >
            <span>{summary}{seconds != null && ` ${seconds}s`}</span>
            <ChevronGlyph className={cn("ml-auto shrink-0 transition-transform duration-200", open ? "rotate-0" : "-rotate-90")} />
          </button>
          {/* Grid-rows collapse so the steps animate open/closed. */}
          <div className={cn("grid transition-[grid-template-rows] duration-300 ease-out", open ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}>
            <div className="overflow-hidden">{stepsList}</div>
          </div>
        </>
      ) : (
        stepsList
      )}
    </div>
  )
}
