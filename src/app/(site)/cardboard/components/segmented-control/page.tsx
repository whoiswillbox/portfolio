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
          </>
        }
        dev={
          <>
            <Install code={`import { SegmentedControl, SegmentedControlItem } from "@cardboard";`} />
            <Variants variants={VARIANTS} />
            <PropsTable
              rows={[
                { name: "value", type: "string", desc: "The selected item's value (controlled)." },
                { name: "onValueChange", type: "(value: string) => void", desc: "Fires when the selection changes." },
                { name: "size", type: '"default" | "sm"', default: '"default"', desc: "Control size." },
                { name: "SegmentedControlItem · value", type: "string", desc: "Unique value identifying the segment." },
                { name: "SegmentedControlItem · disabled", type: "boolean", default: "false", desc: "Disable an individual segment." },
              ]}
            />
            <Accessibility
              keyboard={[
                { keys: ["Tab"], does: "Moves focus into / out of the control (single tab stop)." },
                { keys: ["←", "→"], does: "Moves the selection to the previous / next segment." },
                { keys: ["↑", "↓"], does: "Same as ← / → (selection follows focus)." },
                { keys: ["Home", "End"], does: "Selects the first / last segment." },
              ]}
              notes={[
                "Rendered as role=\"tablist\" with role=\"tab\" segments; the active segment sets aria-selected.",
                "Roving tabindex — only the selected segment is tabbable, so the group is one Tab stop and arrows move within it.",
                "Disabled segments are skipped by arrow navigation and not selectable.",
                "Focus shows a visible ring (focus-visible:ring-2 ring-border-focus).",
              ]}
            />
          </>
        }
      />
    </ComponentPage>
  );
}
