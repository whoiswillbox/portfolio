"use client";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/cardboard/tooltip";
import { ComponentPage, Demo } from "../_component-page";

const SIDES = ["top", "right", "bottom", "left"] as const;

export default function TooltipDocs() {
  return (
    <ComponentPage
      title="Tooltip"
      description="A hover (or focus) hint that labels a control or adds brief context. Ours has no arrow."
    >
      <TooltipProvider>
        <Demo title="Basic" caption="Hover or focus the trigger to reveal the tooltip.">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline">Hover me</Button>
            </TooltipTrigger>
            <TooltipContent>A short, helpful label.</TooltipContent>
          </Tooltip>
        </Demo>

        <Demo title="Sides" caption="Position the bubble on any side of the trigger.">
          {SIDES.map((side) => (
            <Tooltip key={side}>
              <TooltipTrigger asChild>
                <Button variant="outline" className="capitalize">
                  {side}
                </Button>
              </TooltipTrigger>
              <TooltipContent side={side}>On the {side}.</TooltipContent>
            </Tooltip>
          ))}
        </Demo>
      </TooltipProvider>
    </ComponentPage>
  );
}
