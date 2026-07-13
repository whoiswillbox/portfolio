"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronRightIcon, Cog6ToothIcon } from "@heroicons/react/24/outline"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
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
  SidebarSeparator,
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
  leaf("Aspect Ratio", "aspect-ratio"),
  leaf("Avatar", "avatar"),
  leaf("Badge", "badge"),
  leaf("Breadcrumb", "breadcrumb"),
  {
    title: "Button",
    children: [
      leaf("Button", "button"),
      leaf("Button Group", "button-group"),
      leaf("Toggle", "toggle"),
      leaf("Toggle Group", "toggle-group"),
    ],
  },
  leaf("Calendar", "calendar"),
  {
    title: "Card",
    children: [
      leaf("Card", "card"),
      leaf("Contact Card", "contact-card"),
      leaf("Content Card", "content-card"),
    ],
  },
  leaf("Carousel", "carousel"),
  leaf("Chart", "chart"),
  leaf("Checkbox", "checkbox"),
  leaf("Collapsible", "collapsible"),
  leaf("Copy Token", "copy-token"),
  {
    title: "Dialog",
    children: [
      leaf("Dialog", "dialog"),
      leaf("Alert Dialog", "alert-dialog"),
      leaf("Drawer", "drawer"),
      leaf("Sheet", "sheet"),
    ],
  },
  leaf("Direction", "direction"),
  leaf("Empty", "empty"),
  leaf("Field", "field"),
  leaf("Hover Card", "hover-card"),
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
  leaf("Kbd", "kbd"),
  leaf("Logo", "logo"),
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
  leaf("Mobile Only", "mobile-only"),
  leaf("Pagination", "pagination"),
  leaf("Popover", "popover"),
  leaf("Progress", "progress"),
  leaf("Radio Group", "radio-group"),
  leaf("Resizable", "resizable"),
  leaf("Scroll Area", "scroll-area"),
  leaf("Segmented Control", "segmented-control", "stable"),
  {
    title: "Select",
    children: [
      leaf("Select", "select", "stable"),
      leaf("Combobox", "combobox"),
      leaf("Native Select", "native-select"),
    ],
  },
  leaf("Separator", "separator"),
  leaf("Sidebar", "sidebar"),
  leaf("Skeleton", "skeleton"),
  leaf("Slider", "slider"),
  leaf("Sonner", "sonner"),
  leaf("Spinner", "spinner"),
  leaf("Switch", "switch"),
  leaf("Table", "table"),
  leaf("Tabs", "tabs"),
  leaf("Textarea", "textarea"),
  leaf("Tooltip", "tooltip"),
].sort((a, b) => a.title.localeCompare(b.title))

export function CardboardSidebar() {
  const pathname = usePathname()
  const base = "/cardboard/components"
  const hrefFor = (slug: string) => `${base}/${slug}`

  return (
    <Sidebar
      variant="floating"
      className="max-sm:hidden !p-0 sm:!inset-y-auto sm:!top-14 sm:!bottom-0 sm:!h-auto [&_[data-slot=sidebar-inner]]:!bg-transparent [&_[data-slot=sidebar-inner]]:!shadow-none [&_[data-slot=sidebar-inner]]:!ring-0 [&_[data-slot=sidebar-inner]]:!rounded-none [&_[data-slot=sidebar-inner]]:border-r [&_[data-slot=sidebar-inner]]:border-border [&_[data-slot=sidebar-menu-button]_span]:font-sans [&_[data-slot=sidebar-menu-button]_span]:normal-case [&_[data-slot=sidebar-menu-button]_span]:tracking-normal [&_[data-slot=sidebar-menu-sub-button]_span]:font-sans [&_[data-slot=sidebar-menu-sub-button]_span]:normal-case [&_[data-slot=sidebar-menu-sub-button]_span]:tracking-normal"
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
      </SidebarContent>
      {/* Footer's own p-2 holds the divider off the panel edge. Kill the
          horizontal padding so the full-bleed separator reaches both edges (the
          Settings button re-adds its own inset via the menu button padding). */}
      <SidebarFooter className="px-0">
        <SidebarSeparator className="mx-0 w-full mb-2 bg-border" />
        <div className="px-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === "/settings"}>
              <Link href="/settings">
                <Cog6ToothIcon />
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
