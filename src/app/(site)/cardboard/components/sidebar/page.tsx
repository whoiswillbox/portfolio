"use client";

import { HomeIcon, InboxIcon, Cog6ToothIcon } from "@heroicons/react/24/outline";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarInset,
  SidebarTrigger,
} from "@/components/cardboard/sidebar";
import { ComponentPage, Demo } from "../_component-page";

const items = [
  { title: "Home", icon: HomeIcon, active: true },
  { title: "Inbox", icon: InboxIcon, active: false },
  { title: "Settings", icon: Cog6ToothIcon, active: false },
];

export default function SidebarDocs() {
  return (
    <ComponentPage
      title="Sidebar"
      description="A collapsible app sidebar (composable primitives + provider). Colors come from the dedicated --sidebar-* token family; the trigger has a state-aware tooltip. On mobile it slides in as a Sheet."
    >
      <Demo title="Basic" caption="Toggle with the trigger, ⌘B, or the rail.">
        <div className="h-[22rem] w-full overflow-hidden rounded-xl border border-border">
          <SidebarProvider className="min-h-full">
            <Sidebar collapsible="icon" className="absolute">
              <SidebarHeader className="px-3 py-2 font-heading text-base font-medium">
                Acme
              </SidebarHeader>
              <SidebarContent>
                <SidebarGroup>
                  <SidebarGroupLabel>Platform</SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {items.map((item) => (
                        <SidebarMenuItem key={item.title}>
                          <SidebarMenuButton
                            isActive={item.active}
                            tooltip={item.title}
                          >
                            <item.icon />
                            <span>{item.title}</span>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              </SidebarContent>
              <SidebarFooter className="px-3 py-2 text-xs text-sidebar-foreground/70">
                v1.0.0
              </SidebarFooter>
            </Sidebar>
            <SidebarInset className="bg-surface">
              <div className="flex items-center gap-2 border-b border-border p-3">
                <SidebarTrigger />
                <span className="text-body-sm text-muted-foreground">
                  Content area
                </span>
              </div>
              <div className="flex-1 p-4 text-body-sm text-muted-foreground">
                The sidebar collapses to icons; each item shows a tooltip when
                collapsed.
              </div>
            </SidebarInset>
          </SidebarProvider>
        </div>
      </Demo>
    </ComponentPage>
  );
}
