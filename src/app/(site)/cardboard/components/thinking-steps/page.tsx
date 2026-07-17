"use client";

import * as React from "react";
import {
  MagnifyingGlassIcon,
  DocumentTextIcon,
  BuildingOffice2Icon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import { ThinkingSteps, type ThinkingStep, type ThinkingStepSource } from "@cardboard";
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

// The two canonical variants: THINKING (live — steps visible, one active) and
// THOUGHT (done — a collapsible/expandable "Thought for Xs" card). The extra
// examples below (single step, headerless) are shapes of the Thinking variant.
const VARIANTS = [
  {
    label: "Thinking",
    caption: "A static snapshot of the live trace: steps threaded on a connector line, the active one breathing (fades in/out), finished ones dimmed with a checkmark.",
    preview: (
      <div className="w-full max-w-md">
        <ThinkingSteps steps={runningSteps} />
      </div>
    ),
    code: `import { ThinkingSteps, type ThinkingStep } from "@cardboard";
import { BuildingOffice2Icon, DocumentTextIcon, SparklesIcon } from "@heroicons/react/24/outline";

const steps: ThinkingStep[] = [
  { label: "Reviewing work experience…", icon: BuildingOffice2Icon, status: "done" },
  { label: "Reading the CV…", icon: DocumentTextIcon, status: "done" },
  { label: "Drafting an answer…", icon: SparklesIcon, status: "active" },
];

// Thinking: pass steps. (An optional heading is also supported.)
<ThinkingSteps steps={steps} />`,
  },
  {
    label: "Thought",
    caption: "Once complete, pass a `summary` to collapse it into an expandable \"Thought for Xs\" card — click to re-reveal the steps. Show above the answer.",
    preview: (
      <div className="w-full max-w-md">
        <ThinkingSteps summary="Thought for 4s" steps={completeSteps} />
      </div>
    ),
    code: `// Thought: pass a summary (every step done) to render the collapsed card.
<ThinkingSteps summary="Thought for 4s" steps={completeSteps} />

// Start expanded with defaultOpen:
<ThinkingSteps summary="Thought for 4s" steps={completeSteps} defaultOpen />`,
  },
  {
    label: "Thinking · single step",
    caption: "A Thinking trace with one step and no header — the header is optional.",
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

const PLAYGROUND_SOURCES: ThinkingStepSource[] = [
  { title: "SwipeRight.ai", subtitle: "School · 2024", href: "/school/swiperight-ai" },
  { title: "Jet Dash", subtitle: "Technergetics · 2023–24", href: "/technergetics/jetdash" },
  { title: "Next Gen Bar Prep", subtitle: "BARBRI · 2024–2025", href: "/projects/next-gen-bar" },
];

function PlaygroundDemo({
  variant,
  seconds,
  active,
  sources,
  autoplay,
}: {
  variant: "thinking" | "thought";
  seconds: number;
  active: number;
  sources: boolean;
  autoplay: boolean;
}) {
  const labels = [
    { label: "Searching the case studies…", icon: MagnifyingGlassIcon },
    { label: "Reading the case study…", icon: DocumentTextIcon },
    { label: "Drafting an answer…", icon: SparklesIcon },
  ];

  // Auto-play (Thinking only): reveal steps one at a time on a loop, ignoring the
  // manual `active` control. Otherwise `active` scrubs the running step by hand.
  const looping = autoplay && variant === "thinking";
  const [phase, setPhase] = React.useState(1);
  React.useEffect(() => {
    if (!looping) return;
    const next = phase > labels.length ? 1 : phase + 1;
    const id = setTimeout(() => setPhase(next), phase > labels.length ? 1600 : 900);
    return () => clearTimeout(id);
  }, [looping, phase, labels.length]);
  React.useEffect(() => { if (!looping) setPhase(1); }, [looping]);

  const activeIdx = looping ? Math.min(phase, labels.length) - 1 : active;
  const allDone = looping && phase > labels.length;

  const steps: ThinkingStep[] = labels
    .slice(0, looping ? Math.min(phase, labels.length) : labels.length)
    .map((l, i, arr) => {
      const status: ThinkingStep["status"] =
        variant === "thought" || allDone
          ? "done"
          : i < activeIdx
          ? "done"
          : i === (looping ? arr.length - 1 : activeIdx)
          ? "active"
          : "pending";
      // Attach sources to the case-study step (once it's done).
      const withSources =
        sources && status === "done" && l.label.toLowerCase().includes("case stud");
      return { ...l, status, sources: withSources ? PLAYGROUND_SOURCES : undefined };
    });

  return (
    <div className="w-full max-w-md">
      {variant === "thought" ? (
        <ThinkingSteps summary={`Thought for ${seconds || 4}s`} steps={steps} />
      ) : (
        <ThinkingSteps steps={steps} />
      )}
    </div>
  );
}

/* ── Page ────────────────────────────────────────────────────────────────── */

export default function ThinkingStepsDocs() {
  return (
    <ComponentPage
      title="Thinking Steps"
      status="experimental"
      version="0.4"
      description="A reasoning trace card with two variants: Thinking (live — steps visible, the active one pulsing, finished ones checked) and Thought (done — a collapsible 'Thought for Xs' card that re-reveals the steps on click). Presentational and controlled: pass the step statuses; the consumer (e.g. Box AI) drives the timing."
    >
      <AudienceTabs
        playground={
          <Playground
            controls={[
              { prop: "variant", label: "variant", type: "select", options: ["thinking", "thought"], default: "thinking" },
              { prop: "autoplay", label: "auto-play", type: "boolean", default: true, visibleIf: (v) => v.variant === "thinking" },
              { prop: "active", label: "active step", type: "select", options: [0, 1, 2], default: 1, visibleIf: (v) => v.variant === "thinking" && !v.autoplay },
              { prop: "seconds", label: "seconds", type: "select", options: [0, 2, 4], default: 2, visibleIf: (v) => v.variant === "thought" },
              { prop: "sources", label: "sources", type: "boolean", default: false },
            ]}
            render={(v) => (
              <PlaygroundDemo
                variant={v.variant as "thinking" | "thought"}
                seconds={Number(v.seconds)}
                active={Number(v.active)}
                sources={Boolean(v.sources)}
                autoplay={Boolean(v.autoplay)}
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
                { n: 3, part: "Step — an icon node threaded by a vertical connector line, with the label to its right (no per-step box).", tokens: "timeline · data-status · label truncate" },
                { n: 4, part: "Node — the source icon while pending/active (pulsing when active), a checkmark when done.", tokens: "CheckGlyph · animate-pulse · connector w-px bg-current/20" },
              ]}
            >
              <div className="w-full max-w-md">
                <ThinkingSteps steps={runningSteps} />
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
                  tokens: "source icon node · animate-pulse · opacity-80",
                },
                {
                  name: "Done (complete)",
                  node: (
                    <div className="w-64">
                      <ThinkingSteps steps={[{ label: "Searching…", icon: MagnifyingGlassIcon, status: "done" }]} />
                    </div>
                  ),
                  tokens: "checkmark node · row opacity-50",
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
                    { name: "heading?", type: "ReactNode", desc: "Optional header phrase shown above the steps (pulses). Live state only; ignored when `summary` is set." },
                    { name: "seconds?", type: "number", desc: "Optional elapsed seconds shown next to the heading; hidden when 0." },
                    { name: "summary?", type: "ReactNode", desc: 'Renders the COLLAPSED state: a clickable summary row (e.g. "Thought for 4s") with a chevron that discloses the steps. Use after the trace completes.' },
                    { name: "defaultOpen?", type: "boolean", default: "false", desc: "In collapsed (summary) mode, whether the steps start expanded." },
                    { name: "…div", type: "HTMLDivProps", desc: "Extends <div> (className, etc.)." },
                  ],
                },
                {
                  interfaceName: "ThinkingStep",
                  rows: [
                    { name: "label", type: "string", desc: "The step's text (a present-participle phrase)." },
                    { name: "icon", type: "React.ElementType", desc: "A leading icon component (e.g. a Heroicon), rendered at size-3.5." },
                    { name: "status", type: '"pending" | "active" | "done"', desc: "Drives the row: active = breathing, done = checkmark + dimmed. Set via data-status." },
                    { name: "sources?", type: "ThinkingStepSource[]", desc: "Sources this step consulted, listed beneath it (search-results style)." },
                  ],
                },
                {
                  interfaceName: "ThinkingStepSource",
                  rows: [
                    { name: "title", type: "string", desc: "The source's primary label (e.g. a case study title)." },
                    { name: "subtitle?", type: "string", desc: "Muted secondary line (e.g. a category, org, or path)." },
                    { name: "href?", type: "string", desc: "When set, the source row links here." },
                  ],
                },
              ]}
            />
            <Accessibility
              keyboard={[
                { keys: ["Tab"], does: "In collapsed (summary) mode, focuses the disclosure toggle. The live trace is non-interactive." },
                { keys: ["↵", "Space"], does: "Toggles the collapsed summary open/closed." },
              ]}
              aria={[
                { attr: "data-slot", on: "Card", purpose: 'Style/target hook ("thinking-steps").' },
                { attr: "data-collapsed", on: "Card", purpose: "Present when in collapsed (summary) mode." },
                { attr: "data-status", on: "Each step row", purpose: 'Reflects the step status ("pending" | "active" | "done") for styling.' },
                { attr: "aria-expanded", on: "Summary toggle", purpose: "Reflects whether the collapsed steps are open." },
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
                { version: "0.4", changes: ["Steps can now list `sources` beneath them (search-results style) — e.g. the case studies a step scraped, each linking to its page."] },
                { version: "0.3", changes: ["Redesigned steps as a Claude-style timeline: icon nodes threaded by a vertical connector line, no per-step boxes.", "The active step now \"breathes\" (fades in/out) while running, replacing the pulsing heading."] },
                { version: "0.2", changes: ["Added the collapsed summary mode (summary + defaultOpen) — a \"Thought for Xs\" disclosure that re-reveals the completed steps."] },
                { version: "0.1", changes: ["Initial extraction from Box AI — presentational card + sequential steps with pulsing-dot / checkmark statuses."] },
              ]}
            />
          </>
        }
      />
    </ComponentPage>
  );
}
