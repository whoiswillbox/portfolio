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
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import {
  cardboardSection,
  isGroup,
  foundations,
  components,
  utilities,
  FOUNDATIONS_BASE,
  COMPONENTS_BASE,
  type Status,
} from "@/lib/cardboard-nav"

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

export function CardboardSidebar() {
  const pathname = usePathname()
  // The top-nav picks the section; the sidebar shows ONLY that section's items,
  // mirroring the Box product (nav item → filtered navigation). One label group
  // is rendered at a time.
  const section = cardboardSection(pathname)
  const hrefFor = (slug: string) => `${COMPONENTS_BASE}/${slug}`

  // Open/collapse is CONTROLLED by the route via the shell's SidebarProvider
  // (collapsed on the landing, expanded in a section) — see app-shell. The
  // sidebar-gap transitions its width, so the content card (flex-1 beside it)
  // slides over smoothly. Driving it from the pathname on both server + client
  // avoids the hydration mismatch a post-hydration setOpen() effect caused.

  return (
    <Sidebar
      variant="floating"
      // The sidebar is floating (out of the flex flow), so the disclosure panel
      // can't push it like it does in-flow content. Offset its top by the panel's
      // published height (--navpanel-h) so it slides BELOW the expanded panel
      // when the product switcher (or any disclosure) is open, instead of being
      // overlapped. Matches the panel's easing. NOTE: top must be an !important
      // utility, not inline style — the sidebar-container's base `inset-y-0` and
      // this component's `!bottom-0` are !important classes that would otherwise
      // beat an inline `top`, leaving top:auto (sidebar anchored to the bottom).
      className="max-sm:hidden !p-0 sm:!top-[calc(3.5rem+var(--navpanel-h,0px))] sm:!bottom-0 sm:!h-auto sm:transition-[top,left,right,width] sm:duration-300 sm:ease-[cubic-bezier(0.32,0.72,0,1)] [&_[data-slot=sidebar-inner]]:!bg-transparent [&_[data-slot=sidebar-inner]]:!shadow-none [&_[data-slot=sidebar-inner]]:!ring-0 [&_[data-slot=sidebar-inner]]:!rounded-none [&_[data-slot=sidebar-menu-button]_span]:font-sans [&_[data-slot=sidebar-menu-button]_span]:normal-case [&_[data-slot=sidebar-menu-button]_span]:tracking-normal [&_[data-slot=sidebar-menu-sub-button]_span]:font-sans [&_[data-slot=sidebar-menu-sub-button]_span]:normal-case [&_[data-slot=sidebar-menu-sub-button]_span]:tracking-normal [&_[data-slot=sidebar-menu-button]]:transition-colors [&_[data-slot=sidebar-menu-sub-button]]:transition-colors [&_[data-slot=sidebar-menu-button]]:!bg-transparent [&_[data-slot=sidebar-menu-sub-button]]:!bg-transparent [&_[data-slot=sidebar-menu-button]]:!font-normal [&_[data-slot=sidebar-menu-sub-button]]:!font-normal [&_[data-slot=sidebar-menu-button]]:!text-quaternary [&_[data-slot=sidebar-menu-sub-button]]:!text-quaternary [&_[data-slot=sidebar-menu-button]:hover]:!text-secondary [&_[data-slot=sidebar-menu-sub-button]:hover]:!text-secondary [&_[data-slot=sidebar-menu-button][data-active=true]]:!text-foreground [&_[data-slot=sidebar-menu-sub-button][data-active=true]]:!text-foreground"
    >
      <SidebarContent>
        {/* FOUNDATIONS */}
        {section === "foundations" && (
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {foundations.map((f) => {
                  const href = f.slug
                    ? `${FOUNDATIONS_BASE}/${f.slug}`
                    : FOUNDATIONS_BASE
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
        )}

        {/* COMPONENTS — flat A–Z list, some collapsible. */}
        {section === "components" && (
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {/* Gallery overview link */}
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={pathname === COMPONENTS_BASE}>
                    <Link href={COMPONENTS_BASE}>
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
                          <SidebarMenuButton
                            tooltip={entry.title}
                            className="!bg-transparent !font-normal !text-quaternary hover:!text-secondary data-[state=open]:!text-secondary"
                          >
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
        )}

        {/* UTILITIES — helpers / wrappers / assets, flat A–Z list. */}
        {section === "utilities" && (
          <SidebarGroup>
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
        )}
      </SidebarContent>
    </Sidebar>
  )
}
