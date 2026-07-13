"use client";

import * as React from "react";
import { SegmentedControl, SegmentedControlItem } from "@/components/cardboard/segmented-control";
import { ComponentPage, Demo } from "../_component-page";

export default function SegmentedControlDocs() {
  const [view, setView] = React.useState("semantics");
  const [size, setSize] = React.useState("md");
  const [align, setAlign] = React.useState("left");

  return (
    <ComponentPage
      title="Segmented Control"
      description="A single-select pill-on-track switch for toggling between a few mutually exclusive views. Use it for view modes (e.g. Primitives / Semantics); for actions, use Toggle Group."
    >
      <Demo title="Default">
        <SegmentedControl value={view} onValueChange={setView}>
          <SegmentedControlItem value="primitives">Primitives</SegmentedControlItem>
          <SegmentedControlItem value="semantics">Semantics</SegmentedControlItem>
        </SegmentedControl>
      </Demo>

      <Demo title="Three options">
        <SegmentedControl value={align} onValueChange={setAlign}>
          <SegmentedControlItem value="left">Left</SegmentedControlItem>
          <SegmentedControlItem value="center">Center</SegmentedControlItem>
          <SegmentedControlItem value="right">Right</SegmentedControlItem>
        </SegmentedControl>
      </Demo>

      <Demo title="Small" caption="Compact size for dense toolbars.">
        <SegmentedControl size="sm" value={size} onValueChange={setSize}>
          <SegmentedControlItem value="sm">SM</SegmentedControlItem>
          <SegmentedControlItem value="md">MD</SegmentedControlItem>
          <SegmentedControlItem value="lg">LG</SegmentedControlItem>
        </SegmentedControl>
      </Demo>

      <Demo title="Disabled option">
        <SegmentedControl value={view} onValueChange={setView}>
          <SegmentedControlItem value="primitives">Primitives</SegmentedControlItem>
          <SegmentedControlItem value="semantics">Semantics</SegmentedControlItem>
          <SegmentedControlItem value="soon" disabled>
            Soon
          </SegmentedControlItem>
        </SegmentedControl>
      </Demo>
    </ComponentPage>
  );
}
