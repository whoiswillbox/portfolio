"use client";

import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from "@/components/cardboard/sheet";
import { Button } from "@/components/cardboard/button";
import { Input } from "@/components/cardboard/input";
import { Label } from "@/components/cardboard/label";
import { ComponentPage, Demo } from "../_component-page";

export default function SheetDocs() {
  return (
    <ComponentPage
      title="Sheet"
      description="A panel that slides in from an edge (built on Radix Dialog). Cardboard customizes the scrim fade, a real GPU slide animation, and a floating-card look on left/right; icons are Heroicons."
    >
      <Demo title="Sides" caption="Slides in from the chosen edge.">
        {(["left", "right", "top", "bottom"] as const).map((side) => (
          <Sheet key={side}>
            <SheetTrigger asChild>
              <Button variant="outline" className="capitalize">
                {side}
              </Button>
            </SheetTrigger>
            <SheetContent side={side} className="bg-surface p-0">
              <div className="flex h-full flex-col rounded-xl border border-border bg-surface">
                <SheetHeader>
                  <SheetTitle>Edit profile</SheetTitle>
                  <SheetDescription>
                    Make changes and save when you&apos;re done.
                  </SheetDescription>
                </SheetHeader>
                <div className="flex flex-col gap-4 p-4">
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" defaultValue="Will Box" />
                  </div>
                </div>
                <SheetFooter>
                  <SheetClose asChild>
                    <Button>Save changes</Button>
                  </SheetClose>
                </SheetFooter>
              </div>
            </SheetContent>
          </Sheet>
        ))}
      </Demo>
    </ComponentPage>
  );
}
