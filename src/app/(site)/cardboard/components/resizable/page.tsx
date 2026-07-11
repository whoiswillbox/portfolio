"use client";

import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/cardboard/resizable";
import { ComponentPage, Demo } from "../_component-page";

export default function ResizableDocs() {
  return (
    <ComponentPage
      title="Resizable"
      description="Draggable split panels. The handle uses the border token; its focus ring uses the focus-ring token. Add withHandle for a visible grip."
    >
      <Demo title="Horizontal, with handle">
        <div className="w-full">
          <ResizablePanelGroup
            orientation="horizontal"
            className="h-40 rounded-lg border border-border"
          >
            <ResizablePanel defaultSize={50}>
              <div className="flex h-full items-center justify-center p-4 text-body-sm text-muted-foreground">
                One
              </div>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={50}>
              <div className="flex h-full items-center justify-center p-4 text-body-sm text-muted-foreground">
                Two
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </Demo>

      <Demo title="Vertical">
        <div className="w-full">
          <ResizablePanelGroup
            orientation="vertical"
            className="h-48 rounded-lg border border-border"
          >
            <ResizablePanel defaultSize={40}>
              <div className="flex h-full items-center justify-center p-4 text-body-sm text-muted-foreground">
                Top
              </div>
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel defaultSize={60}>
              <div className="flex h-full items-center justify-center p-4 text-body-sm text-muted-foreground">
                Bottom
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </Demo>
    </ComponentPage>
  );
}
