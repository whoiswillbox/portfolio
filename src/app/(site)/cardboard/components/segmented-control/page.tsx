"use client";

import * as React from "react";
import { SegmentedControl, SegmentedControlItem } from "@cardboard";
import {
  ComponentPage,
  AudienceTabs,
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
  Related,
  ApiNotes,
} from "../_component-page";

// A single segment rendered with its state classes FORCED, so each interaction
// state is visible statically. `extra` layers the state-specific utilities on
// top of the shared item base.
function StateSegment({ extra, label = "Item" }: { extra: string; label?: string }) {
  return (
    <div className="inline-flex items-center rounded-lg bg-muted p-1 ring-1 ring-border">
      <span
        className={`rounded-md px-3 py-1.5 text-body-sm font-medium whitespace-nowrap ${extra}`}
      >
        {label}
      </span>
    </div>
  );
}

function TwoOption() {
  const [v, setV] = React.useState("2");
  return (
    <SegmentedControl value={v} onValueChange={setV}>
      <SegmentedControlItem value="1">Item</SegmentedControlItem>
      <SegmentedControlItem value="2">Item</SegmentedControlItem>
    </SegmentedControl>
  );
}

function ThreeOption() {
  const [v, setV] = React.useState("1");
  return (
    <SegmentedControl value={v} onValueChange={setV}>
      <SegmentedControlItem value="1">Item</SegmentedControlItem>
      <SegmentedControlItem value="2">Item</SegmentedControlItem>
      <SegmentedControlItem value="3">Item</SegmentedControlItem>
    </SegmentedControl>
  );
}

function Small() {
  const [v, setV] = React.useState("2");
  return (
    <SegmentedControl size="sm" value={v} onValueChange={setV}>
      <SegmentedControlItem value="1">Item</SegmentedControlItem>
      <SegmentedControlItem value="2">Item</SegmentedControlItem>
      <SegmentedControlItem value="3">Item</SegmentedControlItem>
    </SegmentedControl>
  );
}

function DisabledOption() {
  const [v, setV] = React.useState("2");
  return (
    <SegmentedControl value={v} onValueChange={setV}>
      <SegmentedControlItem value="1">Item</SegmentedControlItem>
      <SegmentedControlItem value="2">Item</SegmentedControlItem>
      <SegmentedControlItem value="3" disabled>
        Item
      </SegmentedControlItem>
    </SegmentedControl>
  );
}

const VARIANTS = [
          {
            label: "Default",
            caption: "Two mutually exclusive options.",
            preview: <TwoOption />,
            code: `"use client";

import { useState } from "react";
import { SegmentedControl, SegmentedControlItem } from "@cardboard";

function Example() {
  const [value, setValue] = useState("1");
  return (
    <SegmentedControl value={value} onValueChange={setValue}>
      <SegmentedControlItem value="1">Item</SegmentedControlItem>
      <SegmentedControlItem value="2">Item</SegmentedControlItem>
    </SegmentedControl>
  );
}`,
            styles: `/* The track — a muted, ringed container. */
.segmented-control {
  display: inline-flex;
  align-items: center;
  gap: var(--space-100);            /* 4px */
  padding: var(--space-100);        /* 4px */
  background: var(--color-muted);
  border-radius: var(--radius-lg);
  box-shadow: inset 0 0 0 1px var(--color-border);
}

/* A segment — the active one lifts onto a raised surface pill. */
.segmented-control-item {
  padding: var(--space-150) var(--space-300); /* 6px 12px */
  font-weight: var(--font-weight-medium);
  color: var(--color-tertiary);
  border-radius: var(--radius-md);
}

.segmented-control-item[data-state="active"] {
  background: var(--color-background);
  color: var(--color-foreground);
  box-shadow: var(--shadow-sm);
}`,
          },
          {
            label: "Three options",
            caption: "Scales to a few segments; keep it under ~5.",
            preview: <ThreeOption />,
            code: `// Add a third item — see the Default variant for imports.
<SegmentedControl value={value} onValueChange={setValue}>
  <SegmentedControlItem value="1">Item</SegmentedControlItem>
  <SegmentedControlItem value="2">Item</SegmentedControlItem>
  <SegmentedControlItem value="3">Item</SegmentedControlItem>
</SegmentedControl>`,
          },
          {
            label: "Small",
            caption: "Compact size for dense toolbars.",
            preview: <Small />,
            code: `// Pass size="sm" for the compact variant.
<SegmentedControl size="sm" value={value} onValueChange={setValue}>
  <SegmentedControlItem value="1">Item</SegmentedControlItem>
  <SegmentedControlItem value="2">Item</SegmentedControlItem>
  <SegmentedControlItem value="3">Item</SegmentedControlItem>
</SegmentedControl>`,
          },
          {
            label: "Disabled option",
            caption: "Individual segments can be disabled.",
            preview: <DisabledOption />,
            code: `// Disable a single segment with the disabled prop.
<SegmentedControl value={value} onValueChange={setValue}>
  <SegmentedControlItem value="1">Item</SegmentedControlItem>
  <SegmentedControlItem value="2">Item</SegmentedControlItem>
  <SegmentedControlItem value="3" disabled>Item</SegmentedControlItem>
</SegmentedControl>`,
          },
];

export default function SegmentedControlDocs() {
  return (
    <ComponentPage
      title="Segmented Control"
      description="A single-select pill-on-track switch for toggling between a few mutually exclusive views. Use it for view modes (e.g. Primitives / Semantics); for actions, use Toggle Group."
    >
      <AudienceTabs
        design={
          <>
            <Variants variants={VARIANTS} showCode={false} />
            <Anatomy
              parts={[
                { n: 1, part: "Track — the container that holds the segments.", tokens: "bg-muted · --radius-lg · ring-border" },
                { n: 2, part: "Segment — a selectable option (inactive).", tokens: "text-tertiary" },
                { n: 3, part: "Active pill — the raised, selected segment.", tokens: "bg-background · shadow-sm · text-foreground" },
              ]}
            >
              <SegmentedControl value="2" onValueChange={() => {}}>
                <SegmentedControlItem value="1">Item</SegmentedControlItem>
                <SegmentedControlItem value="2">Item</SegmentedControlItem>
              </SegmentedControl>
            </Anatomy>
            <Guidelines
              use={[
                "Switching between 2–5 mutually exclusive views (e.g. tabs of one panel).",
                "Options are short, equal-weight, and always visible.",
                "The choice changes what's shown, not a destructive action.",
              ]}
              avoid={[
                "More than ~5 options — use a Select or Tabs instead.",
                "Triggering actions (Save, Delete) — use Buttons or a Toggle Group.",
                "Long or uneven labels that make segments different widths.",
              ]}
            />
            <ContentGuidelines
              rules={[
                "Keep labels to 1–2 words so all segments stay a similar width.",
                "Use sentence case; no trailing punctuation.",
                "Write parallel labels (all nouns or all verbs), not a mix.",
                "Avoid icons-only segments unless the meaning is unmistakable.",
              ]}
            />
            <DoDont
              dos={[
                {
                  caption: "Keep labels short and parallel so segments stay even.",
                  example: <TwoOption />,
                },
              ]}
              donts={[
                {
                  caption: "Don't cram long, uneven labels into segments.",
                  example: (
                    <SegmentedControl value="a" onValueChange={() => {}}>
                      <SegmentedControlItem value="a">Primitives</SegmentedControlItem>
                      <SegmentedControlItem value="b">Semantic tokens &amp; roles</SegmentedControlItem>
                    </SegmentedControl>
                  ),
                },
              ]}
            />
            <States
              states={[
          {
            name: "Rest",
            node: <StateSegment extra="text-tertiary" />,
            tokens: "text-tertiary",
          },
          {
            name: "Hover",
            node: <StateSegment extra="text-foreground" />,
            tokens: "hover:text-foreground",
          },
          {
            name: "Selected",
            node: <StateSegment extra="bg-background text-foreground shadow-sm" />,
            tokens: "data-[state=active]: bg-background · text-foreground · shadow-sm",
          },
          {
            name: "Focus",
            node: <StateSegment extra="text-tertiary ring-2 ring-border-focus" />,
            tokens: "focus-visible:ring-2 ring-border-focus",
          },
                {
                  name: "Disabled",
                  node: <StateSegment extra="text-tertiary opacity-50" />,
                  tokens: "disabled: opacity-50 · pointer-events-none",
                },
              ]}
            />
            <WcagChecklist
              rows={[
                {
                  criterion: "Text contrast (1.4.3)",
                  status: "pass",
                  label: "AA",
                  detail: "Active label foreground/background ≈ 17:1; inactive tertiary/muted ≈ 4.6:1 (≥ 4.5).",
                },
                {
                  criterion: "Non-text contrast (1.4.11)",
                  status: "pass",
                  label: "AA",
                  detail: "Track ring and focus ring meet ≥ 3:1 against adjacent colors.",
                },
                {
                  criterion: "Focus visible (2.4.7)",
                  status: "pass",
                  label: "AA",
                  detail: "2px ring (ring-border-focus) on keyboard focus, ≥ 3:1 contrast.",
                },
                {
                  criterion: "Target size (2.5.8)",
                  status: "note",
                  label: "AA · note",
                  detail: "Default height ≈ 32px (meets the 24px AA minimum). For 44px AAA / touch, add padding or use larger labels.",
                },
                {
                  criterion: "Use of color (1.4.1)",
                  status: "pass",
                  label: "AA",
                  detail: "Selection is shown by a raised pill + shadow, not color alone.",
                },
                {
                  criterion: "Reflow / text sizing (1.4.4)",
                  status: "pass",
                  label: "AA",
                  detail: "Labels use rem type tokens and scale to 200% without loss of content.",
                },
              ]}
            />
            <Related
              items={[
                { href: "/cardboard/components/select", when: "For more than ~5 options." },
                { href: "/cardboard/components/toggle-group", when: "For actions, or multi-select." },
                { href: "/cardboard/components/tabs", when: "For switching larger content panels." },
              ]}
            />
          </>
        }
        dev={
          <>
            <Install code={`import { SegmentedControl, SegmentedControlItem } from "@cardboard";`} />
            <ApiNotes
              notes={[
                "Controlled only — always pass value and onValueChange (there is no defaultValue).",
                "SegmentedControlItem must be rendered inside a SegmentedControl (it reads context).",
                "Each item needs a unique value; it's passed back to onValueChange on select.",
                "Style hooks: the track exposes data-slot=\"segmented-control\"; items expose data-state (active/inactive) and data-value.",
                "No extra dependencies or providers required.",
              ]}
            />
            <Variants variants={VARIANTS} preview={false} />
            <PropsTable
              groups={[
                {
                  interfaceName: "SegmentedControlProps",
                  rows: [
                    { name: "value", type: "string", desc: "The selected item's value (controlled)." },
                    { name: "onValueChange", type: "(value: string) => void", desc: "Fires when the selection changes." },
                    { name: "size?", type: '"default" | "sm"', default: '"default"', desc: "Control size." },
                  ],
                },
                {
                  interfaceName: "SegmentedControlItemProps",
                  rows: [
                    { name: "value", type: "string", desc: "Unique value identifying the segment." },
                    { name: "disabled?", type: "boolean", default: "false", desc: "Disable an individual segment." },
                  ],
                },
              ]}
            />
            <Accessibility
              keyboard={[
                { keys: ["Tab"], does: "Moves focus into / out of the control (single tab stop)." },
                { keys: ["←", "→"], does: "Moves the selection to the previous / next segment." },
                { keys: ["↑", "↓"], does: "Same as ← / → (selection follows focus)." },
                { keys: ["Home", "End"], does: "Selects the first / last segment." },
              ]}
              aria={[
                { attr: 'role="tablist"', on: "Track", purpose: "Groups the segments as a single-select set." },
                { attr: 'role="tab"', on: "Each segment", purpose: "Identifies a selectable option." },
                { attr: "aria-selected", on: "Each segment", purpose: 'Set to "true" on the active segment.' },
                { attr: "tabindex", on: "Each segment", purpose: "Roving: 0 on the active segment, -1 on the rest." },
              ]}
              labeling={[
                "The control has no built-in label — wrap it with a visible label or pass aria-label / aria-labelledby to name the group.",
                "Each segment is labeled by its own text content, so keep labels meaningful (avoid icon-only segments without an aria-label).",
              ]}
              screenReader={[
                'Each segment announces as a tab with its position and state, e.g. "Item, tab, 2 of 3, selected".',
                "Because selection follows focus, arrowing to a segment both moves focus and announces the new selection.",
                "Disabled segments are skipped by arrow navigation and not announced as focusable.",
              ]}
              reducedMotion="The only animation is a short color fade (transition-colors) on selection — no motion or position change — so it's safe for users with prefers-reduced-motion."
              notes={[
                "Roving tabindex — only the selected segment is tabbable, so the group is one Tab stop and arrows move within it.",
                "Focus shows a visible ring (focus-visible:ring-2 ring-border-focus).",
              ]}
            />
          </>
        }
      />
    </ComponentPage>
  );
}
