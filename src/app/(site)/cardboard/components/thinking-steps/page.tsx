"use client";

import * as React from "react";
import {
  MagnifyingGlassIcon,
  DocumentTextIcon,
  BuildingOffice2Icon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import { ThinkingSteps, type ThinkingStep } from "@cardboard";
import {
  ComponentPage,
  AudienceTabs,
  Playground,
  Variants,
  States,
  PropsTable,
  Guidelines,
  DoDont,
  Install,
  Accessibility,
  WcagChecklist,
  Anatomy,
  ContentGuidelines,
  Changelog,
} from "../_component-page";

/* ── Reusable example step sets ──────────────────────────────────────────── */

const runningSteps: ThinkingStep[] = [
  { label: "Reviewing work experience…", icon: BuildingOffice2Icon, status: "done" },
  { label: "Reading the CV…", icon: DocumentTextIcon, status: "done" },
  { label: "Drafting an answer…", icon: SparklesIcon, status: "active" },
];

const completeSteps: ThinkingStep[] = [
  { label: "Searching the portfolio…", icon: MagnifyingGlassIcon, status: "done" },
  { label: "Reading the SwipeRight case study…", icon: DocumentTextIcon, status: "done" },
  { label: "Drafting an answer…", icon: SparklesIcon, status: "done" },
];

const singleStep: ThinkingStep[] = [
  { label: "Searching the portfolio…", icon: MagnifyingGlassIcon, status: "active" },
];

/* ── Variants ────────────────────────────────────────────────────────────── */

const VARIANTS = [
  {
    label: "Running",
    caption: "The last (active) step pulses; finished steps dim and show a checkmark.",
    preview: (
      <div className="w-full max-w-md">
        <ThinkingSteps heading="Riding the break 🏄‍♂️" seconds={3} steps={runningSteps} />
      </div>
    ),
    code: `import { ThinkingSteps, type ThinkingStep } from "@cardboard";
import { BuildingOffice2Icon, DocumentTextIcon, SparklesIcon } from "@heroicons/react/24/outline";

const steps: ThinkingStep[] = [
  { label: "Reviewing work experience…", icon: BuildingOffice2Icon, status: "done" },
  { label: "Reading the CV…", icon: DocumentTextIcon, status: "done" },
  { label: "Drafting an answer…", icon: SparklesIcon, status: "active" },
];

<ThinkingSteps heading="Riding the break 🏄‍♂️" seconds={3} steps={steps} />`,
  },
  {
    label: "Complete",
    caption: "Every step done — shown briefly before the answer replaces the trace.",
    preview: (
      <div className="w-full max-w-md">
        <ThinkingSteps heading="Riding the break 🏄‍♂️" seconds={4} steps={completeSteps} />
      </div>
    ),
    code: `// Same shape as Running, but every step's status is "done".
<ThinkingSteps heading="Riding the break 🏄‍♂️" seconds={4} steps={steps} />`,
  },
  {
    label: "Single step, no header",
    caption: "The header is optional; a one-step trace is valid.",
    preview: (
      <div className="w-full max-w-md">
        <ThinkingSteps steps={singleStep} />
      </div>
    ),
    code: `<ThinkingSteps
  steps={[{ label: "Searching the portfolio…", icon: MagnifyingGlassIcon, status: "active" }]}
/>`,
  },
];

/* ── Playground ──────────────────────────────────────────────────────────── */

function PlaygroundDemo({
  heading,
  seconds,
  active,
}: {
  heading: boolean;
  seconds: number;
  active: number;
}) {
  // A fixed 3-step chain; `active` picks which step is currently running (the
  // ones before it are done, the ones after are pending).
  const labels = [
    { label: "Searching the portfolio…", icon: MagnifyingGlassIcon },
    { label: "Reading the case study…", icon: DocumentTextIcon },
    { label: "Drafting an answer…", icon: SparklesIcon },
  ];
  const steps: ThinkingStep[] = labels.map((l, i) => ({
    ...l,
    status: i < active ? "done" : i === active ? "active" : "pending",
  }));
  return (
    <div className="w-full max-w-md">
      <ThinkingSteps
        heading={heading ? "Riding the break 🏄‍♂️" : undefined}
        seconds={seconds}
        steps={steps}
      />
    </div>
  );
}

/* ── Page ────────────────────────────────────────────────────────────────── */

export default function ThinkingStepsDocs() {
  return (
    <ComponentPage
      title="Thinking Steps"
      status="experimental"
      version="0.1"
      description="A reasoning trace: a card of sequential steps, each with a leading icon, a label, and a right-aligned status — a pulsing dot while running, a filled checkmark when done. Presentational and controlled: pass the step statuses; the consumer (e.g. Box AI) drives the timing."
    >
      <AudienceTabs
        playground={
          <Playground
            controls={[
              { prop: "heading", label: "heading", type: "boolean", default: true },
              { prop: "seconds", label: "seconds", type: "select", options: [0, 2, 4], default: 2 },
              { prop: "active", label: "active step", type: "select", options: [0, 1, 2], default: 1 },
            ]}
            render={(v) => (
              <PlaygroundDemo
                heading={Boolean(v.heading)}
                seconds={Number(v.seconds)}
                active={Number(v.active)}
              />
            )}
          />
        }
        design={
          <>
            <Anatomy
              parts={[
                { n: 1, part: "Card — the container holding the whole trace.", tokens: "rounded-xl · border-border · bg-muted/40 · data-slot=thinking-steps" },
                { n: 2, part: "Header — an optional pulsing phrase + elapsed seconds.", tokens: "font-mono · uppercase · text-muted-foreground · animate-pulse" },
                { n: 3, part: "Step row — icon, label, and a right-aligned status.", tokens: "rounded-lg · bg-muted · data-status" },
                { n: 4, part: "Status — a pulsing dot (running) or a filled checkmark (done).", tokens: "bg-foreground · text-background" },
              ]}
            >
              <div className="w-full max-w-md">
                <ThinkingSteps heading="Riding the break 🏄‍♂️" seconds={3} steps={runningSteps} />
              </div>
            </Anatomy>
            <Guidelines
              use={[
                "Showing progress on a short, sequential background task (e.g. an AI response being composed).",
                "When the steps name real work being done — so the trace reads as grounded, not decorative.",
                "As a transient state that's replaced by the result when finished.",
              ]}
              avoid={[
                "A single indeterminate spinner would do — don't manufacture fake steps for a one-shot wait.",
                "Long-running or user-blocking tasks — use a Progress bar with real percentage instead.",
                "Persisting the trace after the result arrives (it's ephemeral).",
              ]}
            />
            <ContentGuidelines
              rules={[
                "Write each step as a present-participle phrase ending in an ellipsis (“Reading the CV…”).",
                "Name the actual source or action, not a vague verb (“Searching the portfolio…”, not “Thinking…”).",
                "Keep the final step a composing/drafting action so the last row reads as producing the answer.",
                "Use sentence case; keep labels short enough to not truncate on a narrow panel.",
              ]}
            />
            <DoDont
              dos={[
                {
                  caption: "Name the specific source each step consults.",
                  example: (
                    <div className="w-full max-w-sm">
                      <ThinkingSteps steps={completeSteps} />
                    </div>
                  ),
                },
              ]}
              donts={[
                {
                  caption: "Don't use vague, generic labels — they read as filler.",
                  example: (
                    <div className="w-full max-w-sm">
                      <ThinkingSteps
                        steps={[
                          { label: "Thinking…", icon: SparklesIcon, status: "done" },
                          { label: "Still thinking…", icon: SparklesIcon, status: "active" },
                        ]}
                      />
                    </div>
                  ),
                },
              ]}
            />
            <States
              states={[
                {
                  name: "Active (running)",
                  node: (
                    <div className="w-64">
                      <ThinkingSteps steps={[{ label: "Searching…", icon: MagnifyingGlassIcon, status: "active" }]} />
                    </div>
                  ),
                  tokens: "pulsing dot · bg-current opacity-40 · animate-pulse",
                },
                {
                  name: "Done (complete)",
                  node: (
                    <div className="w-64">
                      <ThinkingSteps steps={[{ label: "Searching…", icon: MagnifyingGlassIcon, status: "done" }]} />
                    </div>
                  ),
                  tokens: "filled checkmark · bg-foreground · text-background · opacity-50 row",
                },
              ]}
            />
            <WcagChecklist
              rows={[
                {
                  criterion: "Use of color (1.4.1)",
                  status: "pass",
                  label: "AA",
                  detail: "Completion is shown by a checkmark GLYPH, not color alone; running shows a distinct pulsing dot.",
                },
                {
                  criterion: "Text contrast (1.4.3)",
                  status: "pass",
                  label: "AA",
                  detail: "Step labels use text-muted-foreground on bg-muted (≥ 4.5:1); the checkmark is foreground-on-background.",
                },
                {
                  criterion: "Reduced motion (2.3.3)",
                  status: "note",
                  label: "note",
                  detail: "The header + active dot use animate-pulse and rows fade/slide in. Consider a prefers-reduced-motion guard for motion-sensitive users.",
                },
              ]}
            />
          </>
        }
        dev={
          <>
            <Install code={`import { ThinkingSteps, type ThinkingStep } from "@cardboard";`} />
            <Variants variants={VARIANTS} />
            <PropsTable
              groups={[
                {
                  interfaceName: "ThinkingSteps",
                  rows: [
                    { name: "steps", type: "ThinkingStep[]", desc: "The steps to render, in order." },
                    { name: "heading?", type: "ReactNode", desc: "Optional header phrase shown above the steps (pulses)." },
                    { name: "seconds?", type: "number", desc: "Optional elapsed seconds shown next to the heading; hidden when 0." },
                    { name: "…div", type: "HTMLDivProps", desc: "Extends <div> (className, etc.)." },
                  ],
                },
                {
                  interfaceName: "ThinkingStep",
                  rows: [
                    { name: "label", type: "string", desc: "The step's text (a present-participle phrase)." },
                    { name: "icon", type: "React.ElementType", desc: "A leading icon component (e.g. a Heroicon), rendered at size-3.5." },
                    { name: "status", type: '"pending" | "active" | "done"', desc: "Drives the row: active = pulsing dot, done = checkmark + dimmed. Set via data-status." },
                  ],
                },
              ]}
            />
            <Accessibility
              keyboard={[
                { keys: ["—"], does: "Non-interactive — a status display with no focusable controls or keyboard behavior." },
              ]}
              aria={[
                { attr: "data-slot", on: "Card", purpose: 'Style/target hook ("thinking-steps").' },
                { attr: "data-status", on: "Each step row", purpose: 'Reflects the step status ("pending" | "active" | "done") for styling.' },
              ]}
              notes={[
                "Presentational and controlled — it renders exactly the statuses you pass and owns no timers; the consumer drives the reveal + completion.",
                "The checkmark uses an inline SVG glyph, so the component has no icon-library dependency.",
                "Ephemeral: intended to be unmounted and replaced by the result once complete.",
              ]}
              reducedMotion="The header and the active step's dot use a pulse animation, and rows fade/slide in. There's currently no prefers-reduced-motion guard — add one if the trace is shown to motion-sensitive users."
            />
            <Changelog
              entries={[
                { version: "0.1", changes: ["Initial extraction from Box AI — presentational card + sequential steps with pulsing-dot / checkmark statuses."] },
              ]}
            />
          </>
        }
      />
    </ComponentPage>
  );
}
