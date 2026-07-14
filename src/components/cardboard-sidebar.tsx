"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronRightIcon } from "@heroicons/react/24/outline"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarTrigger,
} from "@/components/ui/sidebar"

const foundations = [
  { title: "Overview", slug: "" },
  { title: "Colors", slug: "colors" },
  { title: "Typography", slug: "typography" },
  { title: "Spacing", slug: "spacing" },
  { title: "Radius", slug: "radius" },
  { title: "Elevation", slug: "elevation" },
  { title: "Iconography", slug: "iconography" },
]

// A flat, alphabetical component list. A leaf is a single doc page ([Title,
// slug]); a group is a collapsible parent whose `children` are related variants
// (e.g. Button → Button, Button Group, Toggle…). Sorted by top-level title.
type Status = "stable" | "beta" | "experimental" | "deprecated"
type Leaf = { title: string; slug: string; status?: Status }
type Group = { title: string; children: Leaf[] }
type Entry = Leaf | Group

const isGroup = (e: Entry): e is Group => "children" in e

const leaf = (title: string, slug: string, status?: Status): Leaf => ({ title, slug, status })

// A small maturity dot shown after a nav item's title. Tone matches the doc
// page's StatusBadge (success = stable, caution = beta/experimental, etc.).
const statusTone: Record<Status, string> = {
  stable: "bg-icon-success",
  beta: "bg-icon-caution",
  experimental: "bg-icon-caution",
  deprecated: "bg-icon-critical",
}
function StatusDot({ status }: { status: Status }) {
  return (
    <span
      className={`ml-auto size-1.5 shrink-0 rounded-full ${statusTone[status]}`}
      title={status}
      aria-label={status}
    />
  )
}

const components: Entry[] = [
  leaf("Accordion", "accordion"),
  leaf("Alert", "alert"),
  leaf("Badge", "badge"),
  leaf("Breadcrumb", "breadcrumb"),
  leaf("Button", "button"),
  {
    title: "Card",
    children: [
      leaf("Card", "card"),
      leaf("Contact Card", "contact-card"),
      leaf("Content Card", "content-card"),
    ],
  },
  {
    title: "Dialog",
    children: [
      leaf("Dialog", "dialog"),
      leaf("Alert Dialog", "alert-dialog"),
      leaf("Drawer", "drawer"),
      leaf("Sheet", "sheet"),
    ],
  },
  leaf("Empty", "empty"),
  leaf("Field", "field"),
  leaf("Image Lightbox", "image-lightbox"),
  {
    title: "Input",
    children: [
      leaf("Input", "input"),
      leaf("Input Group", "input-group"),
      leaf("Input OTP", "input-otp"),
    ],
  },
  leaf("Item", "item"),
  {
    title: "Menu",
    children: [
      leaf("Command", "command"),
      leaf("Context Menu", "context-menu"),
      leaf("Dropdown Menu", "dropdown-menu"),
      leaf("Menubar", "menubar"),
      leaf("Navigation Menu", "navigation-menu"),
    ],
  },
  leaf("Nav Bar", "nav-bar", "stable"),
  leaf("Popover", "popover"),
  leaf("Progress", "progress"),
  leaf("Resizable", "resizable"),
  leaf("Segmented Control", "segmented-control", "stable"),
  {
    title: "Select",
    children: [
      leaf("Select", "select", "stable"),
      leaf("Combobox", "combobox"),
    ],
  },
  leaf("Separator", "separator"),
  leaf("Sidebar", "sidebar"),
  leaf("Skeleton", "skeleton"),
  leaf("Switch", "switch"),
  leaf("Table", "table"),
  leaf("Tabs", "tabs"),
  leaf("Textarea", "textarea"),
  leaf("Tooltip", "tooltip"),
].sort((a, b) => a.title.localeCompare(b.title))

// Utilities — helpers, wrappers, and assets that aren't interactive UI
// components (render wrappers, brand marks, doc tooling, glyph primitives).
const utilities: Leaf[] = [
  leaf("Copy Token", "copy-token"),
  leaf("Kbd", "kbd"),
  leaf("Logo", "logo"),
  leaf("Mobile Only", "mobile-only"),
].sort((a, b) => a.title.localeCompare(b.title))

export function CardboardSidebar() {
  const pathname = usePathname()
  const base = "/cardboard/components"
  const hrefFor = (slug: string) => `${base}/${slug}`

  return (
    <Sidebar
      variant="floating"
      className="max-sm:hidden !p-0 sm:!inset-y-auto sm:!top-14 sm:!bottom-0 sm:!h-auto [&_[data-slot=sidebar-inner]]:!bg-transparent [&_[data-slot=sidebar-inner]]:!shadow-none [&_[data-slot=sidebar-inner]]:!ring-0 [&_[data-slot=sidebar-inner]]:!rounded-none [&_[data-slot=sidebar-inner]]:border-r [&_[data-slot=sidebar-inner]]:border-border-divider [&_[data-slot=sidebar-menu-button]_span]:font-sans [&_[data-slot=sidebar-menu-button]_span]:normal-case [&_[data-slot=sidebar-menu-button]_span]:tracking-normal [&_[data-slot=sidebar-menu-sub-button]_span]:font-sans [&_[data-slot=sidebar-menu-sub-button]_span]:normal-case [&_[data-slot=sidebar-menu-sub-button]_span]:tracking-normal"
    >
      <SidebarHeader>
        <div className="flex items-center justify-end">
          <SidebarTrigger className="max-sm:hidden" />
        </div>
      </SidebarHeader>
      <SidebarContent>
        {/* FOUNDATIONS — eyebrow group header, items listed directly. */}
        <SidebarGroup>
          <SidebarGroupLabel className="font-mono tracking-wide">
            Foundations
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {foundations.map((f) => {
                const href = f.slug
                  ? `/cardboard/foundations/${f.slug}`
                  : "/cardboard/foundations"
                return (
                  <SidebarMenuItem key={href}>
                    <SidebarMenuButton asChild isActive={pathname === href}>
                      <Link href={href}>
                        <span>{f.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* COMPONENTS — eyebrow group header; flat A–Z list, some collapsible. */}
        <SidebarGroup>
          <SidebarGroupLabel className="font-mono tracking-wide">
            Components
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {/* Gallery overview link */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === base}>
                  <Link href={base}>
                    <span>Overview</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {components.map((entry) => {
                if (!isGroup(entry)) {
                  const href = hrefFor(entry.slug)
                  return (
                    <SidebarMenuItem key={entry.slug}>
                      <SidebarMenuButton asChild isActive={pathname === href}>
                        <Link href={href}>
                          <span>{entry.title}</span>
                          {entry.status && <StatusDot status={entry.status} />}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                }

                const groupActive = entry.children.some(
                  (c) => pathname === hrefFor(c.slug)
                )
                return (
                  <Collapsible
                    key={entry.title}
                    asChild
                    defaultOpen={groupActive}
                    className="group/comp"
                  >
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton tooltip={entry.title}>
                          <span>{entry.title}</span>
                          <ChevronRightIcon className="ml-auto transition-transform duration-200 group-data-[state=open]/comp:rotate-90" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {entry.children.map((c) => {
                            const href = hrefFor(c.slug)
                            return (
                              <SidebarMenuSubItem key={c.slug}>
                                <SidebarMenuSubButton
                                  asChild
                                  isActive={pathname === href}
                                >
                                  <Link href={href}>
                                    <span>{c.title}</span>
                                    {c.status && <StatusDot status={c.status} />}
                                  </Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            )
                          })}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* UTILITIES — helpers / wrappers / assets, flat A–Z list. */}
        <SidebarGroup>
          <SidebarGroupLabel className="font-mono tracking-wide">
            Utilities
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {utilities.map((u) => {
                const href = hrefFor(u.slug)
                return (
                  <SidebarMenuItem key={u.slug}>
                    <SidebarMenuButton asChild isActive={pathname === href}>
                      <Link href={href}>
                        <span>{u.title}</span>
                        {u.status && <StatusDot status={u.status} />}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
