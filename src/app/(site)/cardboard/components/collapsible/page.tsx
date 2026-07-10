"use client";

import * as React from "react";
import { ChevronUpDownIcon } from "@heroicons/react/24/outline";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/cardboard/collapsible";
import { Button } from "@/components/cardboard/button";
import { ComponentPage, Demo } from "../_component-page";

export default function CollapsibleDocs() {
  const [open, setOpen] = React.useState(false);
  return (
    <ComponentPage
      title="Collapsible"
      description="An unstyled show/hide primitive — you bring the trigger and the surface. Radix handles the open state and animation hooks."
    >
      <Demo title="Default">
        <Collapsible open={open} onOpenChange={setOpen} className="w-full max-w-sm">
          <div className="flex items-center justify-between rounded-lg border border-border bg-background px-4 py-2">
            <span className="text-body-sm font-medium">Starred repositories</span>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="icon">
                <ChevronUpDownIcon className="size-4" />
                <span className="sr-only">Toggle</span>
              </Button>
            </CollapsibleTrigger>
          </div>
          <CollapsibleContent className="mt-2 flex flex-col gap-2">
            {["@radix-ui/primitives", "@heroicons/react", "tailwindcss"].map((r) => (
              <div
                key={r}
                className="rounded-lg border border-border bg-background px-4 py-2 text-body-sm text-muted-foreground"
              >
                {r}
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>
      </Demo>
    </ComponentPage>
  );
}
