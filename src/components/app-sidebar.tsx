"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTheme } from "next-themes"
import { CubeIcon, FolderIcon, BuildingOffice2Icon, UserCircleIcon, DocumentTextIcon, MoonIcon, SunIcon, ChevronRightIcon, LockClosedIcon, ShieldCheckIcon } from "@heroicons/react/24/outline"
import {
  FolderIcon as FolderSolid,
  BuildingOffice2Icon as BuildingOffice2Solid,
  UserCircleIcon as UserCircleSolid,
  DocumentTextIcon as DocumentTextSolid,
} from "@heroicons/react/24/solid"
import { Switch } from "@/components/ui/switch"
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
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarTrigger,
} from "@/components/ui/sidebar"

const items = [
  { title: "Will who?", href: "/who", icon: UserCircleIcon, iconActive: UserCircleSolid },
]

// Collapsible company groups, each with its own nested projects.
const groups = [
  {
    title: "BARBRI",
    icon: FolderIcon,
    iconActive: FolderSolid,
    items: [
      { title: "Next Gen Bar", href: "/projects/next-gen-bar" },
      { title: "SQE2", href: "/projects/sqe2" },
      { title: "Powerscore AI Tutor", href: "/projects/powerscore-ai-tutor" },
      { title: "OneBarbri", href: "/projects/onebarbri" },
      { title: "Deborah", href: "/projects/deborah" },
    ],
  },
  {
    title: "Technergetics",
    icon: BuildingOffice2Icon,
    iconActive: BuildingOffice2Solid,
    items: [
      { title: "Jetdash", href: "/technergetics/jetdash" },
      { title: "Upgrade", href: "/technergetics/upgrade" },
      { title: "Manifast", href: "/technergetics/manifast" },
      { title: "Web Standards", href: "/technergetics/web-standards" },
      { title: "Mobile Standards", href: "/technergetics/mobile-standards" },
    ],
  },
]

export function AppSidebar({
  showLock = false,
  isAdmin = false,
}: {
  showLock?: boolean
  isAdmin?: boolean
}) {
  const pathname = usePathname()
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => setMounted(true), [])
  const isDark = mounted && resolvedTheme === "dark"

  const lock = async () => {
    await fetch("/api/lock", { method: "POST" })
    window.location.assign("/unlock") // full reload so the gate re-evaluates
  }

  return (
    <Sidebar
      variant="floating"
      className="[&_[data-slot=sidebar-inner]]:!bg-transparent [&_[data-slot=sidebar-inner]]:!shadow-none [&_[data-slot=sidebar-inner]]:!ring-0 [&_[data-slot=sidebar-menu-button]_span]:font-mono [&_[data-slot=sidebar-menu-button]_span]:uppercase [&_[data-slot=sidebar-menu-button]_span]:tracking-wide [&_[data-slot=sidebar-menu-sub-button]_span]:font-mono [&_[data-slot=sidebar-menu-sub-button]_span]:uppercase [&_[data-slot=sidebar-menu-sub-button]_span]:tracking-wide"
    >
      <SidebarHeader>
        <div className="flex items-center justify-between">
          <CubeIcon className="size-5 text-foreground" />
          <SidebarTrigger />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const active = pathname === item.href
                const Icon = active ? item.iconActive : item.icon
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={active}>
                      <Link href={item.href}>
                        <Icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}

              {groups.map((group) => {
                const sectionActive = group.items.some(
                  (i) => pathname === i.href || pathname.startsWith(`${i.href}/`)
                )
                const GroupIcon = sectionActive ? group.iconActive : group.icon
                return (
                <Collapsible
                  key={group.title}
                  asChild
                  defaultOpen={sectionActive}
                  className="group/collapsible"
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton tooltip={group.title}>
                        <GroupIcon />
                        <span>{group.title}</span>
                        <ChevronRightIcon className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {group.items.map((sub) => (
                          <SidebarMenuSubItem key={sub.title}>
                            <SidebarMenuSubButton asChild isActive={pathname === sub.href}>
                              <Link href={sub.href}>
                                <span>{sub.title}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
                )
              })}

              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/resume"}>
                  <Link href="/resume">
                    {pathname === "/resume" ? <DocumentTextSolid /> : <DocumentTextIcon />}
                    <span>Resume</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center gap-2 px-2 py-1.5 text-sm">
              {isDark ? <MoonIcon className="size-4" /> : <SunIcon className="size-4" />}
              <span className="flex-1 font-mono uppercase tracking-wide">Dark mode</span>
              <Switch
                id="theme-switch"
                checked={isDark}
                onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
                aria-label="Toggle dark mode"
              />
            </div>
          </SidebarMenuItem>
          {isAdmin && (
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/admin/chat">
                  <ShieldCheckIcon className="size-4" />
                  <span>Admin</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
          {showLock && (
            <SidebarMenuItem>
              <SidebarMenuButton onClick={lock} className="text-muted-foreground">
                <LockClosedIcon className="size-4" />
                <span>Lock site (dev)</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
