"use client";

import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubTrigger,
  ContextMenuSubContent,
} from "@/components/cardboard/context-menu";
import { ComponentPage, Demo } from "../_component-page";

export default function ContextMenuDocs() {
  return (
    <ComponentPage
      title="Context Menu"
      description="A menu triggered by right-click. Same anatomy as the dropdown menu — items, submenus, shortcuts, destructive."
    >
      <Demo title="Right-click the area" caption="Opens on secondary click / long-press.">
        <ContextMenu>
          <ContextMenuTrigger className="flex h-32 w-full max-w-md items-center justify-center rounded-xl border border-dashed border-border text-body-sm text-subtle">
            Right-click here
          </ContextMenuTrigger>
          <ContextMenuContent className="w-52">
            <ContextMenuItem>
              Back
              <ContextMenuShortcut>⌘[</ContextMenuShortcut>
            </ContextMenuItem>
            <ContextMenuItem>
              Forward
              <ContextMenuShortcut>⌘]</ContextMenuShortcut>
            </ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuSub>
              <ContextMenuSubTrigger>Share</ContextMenuSubTrigger>
              <ContextMenuSubContent>
                <ContextMenuItem>Copy link</ContextMenuItem>
                <ContextMenuItem>Email</ContextMenuItem>
              </ContextMenuSubContent>
            </ContextMenuSub>
            <ContextMenuSeparator />
            <ContextMenuItem variant="destructive">Delete</ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      </Demo>
    </ComponentPage>
  );
}
