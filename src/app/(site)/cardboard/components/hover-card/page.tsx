"use client";

import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from "@/components/cardboard/hover-card";
import { Button } from "@/components/cardboard/button";
import { ComponentPage, Demo } from "../_component-page";

export default function HoverCardDocs() {
  return (
    <ComponentPage
      title="Hover Card"
      description="A card that appears on hover — for previewing linked content without a click."
    >
      <Demo title="Default" caption="Hover the trigger to preview.">
        <HoverCard>
          <HoverCardTrigger asChild>
            <Button variant="link">@willbox</Button>
          </HoverCardTrigger>
          <HoverCardContent>
            <div className="flex flex-col gap-1">
              <p className="text-body-md font-medium text-foreground">Will Box</p>
              <p className="text-body-sm text-subtle">
                Product designer & engineer. Building Cardboard.
              </p>
            </div>
          </HoverCardContent>
        </HoverCard>
      </Demo>
    </ComponentPage>
  );
}
