"use client";

import * as React from "react";
import { SegmentedControl, SegmentedControlItem } from "@cardboard";
import { ComponentPage, Variants } from "../_component-page";

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

export default function SegmentedControlDocs() {
  return (
    <ComponentPage
      title="Segmented Control"
      description="A single-select pill-on-track switch for toggling between a few mutually exclusive views. Use it for view modes (e.g. Primitives / Semantics); for actions, use Toggle Group."
    >
      <Variants
        variants={[
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
            styles: `// The track — a muted, ringed container (Cardboard tokens).
<SegmentedControl className="
  inline-flex w-fit items-center gap-1
  rounded-lg        // --radius-lg
  bg-muted          // --color-muted
  p-1               // --space-100 (4px)
  ring-1 ring-border // --color-border
" />

// A segment — the active one lifts onto a raised surface pill.
<SegmentedControlItem className="
  rounded-md px-3 py-1.5 font-medium  // --radius-md, padding
  text-tertiary                       // --color-tertiary (inactive)
  data-[state=active]:bg-background   // --color-background (active pill)
  data-[state=active]:text-foreground // --color-foreground
  data-[state=active]:shadow-sm       // --shadow-sm
" />`,
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
        ]}
      />
    </ComponentPage>
  );
}
