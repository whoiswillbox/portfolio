"use client";

import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from "@/components/cardboard/drawer";
import { Button } from "@/components/cardboard/button";
import { ComponentPage, Demo } from "../_component-page";

export default function DrawerDocs() {
  return (
    <ComponentPage
      title="Drawer"
      description="A panel that slides in from an edge (built on vaul), with a drag handle on the bottom variant. Surface and text are wired to Cardboard tokens."
    >
      <Demo title="Bottom (default)">
        <Drawer>
          <DrawerTrigger asChild>
            <Button variant="outline">Open drawer</Button>
          </DrawerTrigger>
          <DrawerContent>
            <div className="mx-auto w-full max-w-sm">
              <DrawerHeader>
                <DrawerTitle>Are you sure?</DrawerTitle>
                <DrawerDescription>
                  This will archive the conversation.
                </DrawerDescription>
              </DrawerHeader>
              <DrawerFooter>
                <Button>Archive</Button>
                <DrawerClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DrawerClose>
              </DrawerFooter>
            </div>
          </DrawerContent>
        </Drawer>
      </Demo>

      <Demo title="Right side">
        <Drawer direction="right">
          <DrawerTrigger asChild>
            <Button variant="outline">Open from right</Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Settings</DrawerTitle>
              <DrawerDescription>Slides in from the edge.</DrawerDescription>
            </DrawerHeader>
          </DrawerContent>
        </Drawer>
      </Demo>
    </ComponentPage>
  );
}
