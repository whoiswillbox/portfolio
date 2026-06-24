"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import { CubeIcon, FolderIcon, BuildingOffice2Icon, DocumentTextIcon, ChevronRightIcon, LockClosedIcon, XMarkIcon, LifebuoyIcon, PuzzlePieceIcon, MusicalNoteIcon, BoltIcon, AcademicCapIcon, Cog6ToothIcon } from "@heroicons/react/24/outline"
import { Cog6ToothIcon as Cog6ToothSolid } from "@heroicons/react/24/solid"
import {
  CubeIcon as CubeSolid,
  FolderIcon as FolderSolid,
  BuildingOffice2Icon as BuildingOffice2Solid,
  DocumentTextIcon as DocumentTextSolid,
  LifebuoyIcon as LifebuoySolid,
  PuzzlePieceIcon as PuzzlePieceSolid,
  MusicalNoteIcon as MusicalNoteSolid,
  BoltIcon as BoltSolid,
  AcademicCapIcon as AcademicCapSolid,
} from "@heroicons/react/24/solid"
import { Badge } from "@/components/ui/badge"
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
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarSeparator,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import {
  loadConversations,
  saveConversations,
  subscribeConversations,
  type Conversation,
} from "@/lib/chat/store"
import { caseStudyForConversation } from "@/lib/case-studies"

const items = [
  { title: "Box", href: "/who", icon: CubeIcon, iconActive: CubeSolid },
]

// Collapsible company groups, each with its own nested projects.
const groups = [
  {
    title: "BARBRI",
    comingSoon: true,
    icon: FolderIcon,
    iconActive: FolderSolid,
    href: "/projects/next-gen-bar",
    items: [],
  },
  {
    title: "Technergetics",
    icon: BuildingOffice2Icon,
    iconActive: BuildingOffice2Solid,
    items: [
      { title: "Jetdash", href: "/technergetics/jetdash" },
      { title: "Upgrade", href: "/technergetics/upgrade" },
      { title: "Reusable Table", href: "/technergetics/reusable-table" },
      { title: "Design Standards", href: "/technergetics/design-standards" },
    ],
  },
]

export function AppSidebar({
  showLock = false,
}: {
  showLock?: boolean
}) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const convoParam = searchParams.get("c")
  const boxParam = searchParams.get("box")

  // Box AI conversations, kept in sync with the chat (same localStorage store).
  const [conversations, setConversations] = React.useState<Conversation[]>([])
  React.useEffect(() => {
    const sync = () => setConversations(loadConversations())
    sync()
    return subscribeConversations(sync)
  }, [])
  const removeConversation = (id: string) => {
    const next = conversations.filter((c) => c.id !== id)
    setConversations(next)
    saveConversations(next)
  }

  const lock = async () => {
    await fetch("/api/lock", { method: "POST" })
    window.location.assign("/unlock") // full reload so the gate re-evaluates
  }

  return (
    <Sidebar
      variant="floating"
      className="max-sm:hidden [&_[data-slot=sidebar-inner]]:!bg-transparent [&_[data-slot=sidebar-inner]]:!shadow-none [&_[data-slot=sidebar-inner]]:!ring-0 [&_[data-slot=sidebar-menu-button]_span]:font-sans [&_[data-slot=sidebar-menu-button]_span]:normal-case [&_[data-slot=sidebar-menu-button]_span]:tracking-normal [&_[data-slot=sidebar-menu-sub-button]_span]:font-sans [&_[data-slot=sidebar-menu-sub-button]_span]:normal-case [&_[data-slot=sidebar-menu-sub-button]_span]:tracking-normal"
    >
      <SidebarHeader>
        <div className="flex items-center justify-end">
          <SidebarTrigger className="max-sm:hidden" />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                // BOX (/who) is the chat home — not active when a specific
                // conversation is being viewed there (/who?c=...).
                const active =
                  pathname === item.href &&
                  !(item.href === "/who" && convoParam !== null)
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
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="font-mono uppercase tracking-wide">
            Experience
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {groups.map((group) => {
                const sectionActive = group.items.some(
                  (i) => pathname === i.href || pathname.startsWith(`${i.href}/`)
                )
                const GroupIcon = sectionActive ? group.iconActive : group.icon

                // No sub-items: render as a plain nav link
                if (group.items.length === 0 && "href" in group && group.href) {
                  const active = pathname === group.href || pathname.startsWith(`${group.href}/`);
                  const Icon = active ? group.iconActive : group.icon;
                  return (
                    <SidebarMenuItem key={group.title}>
                      <SidebarMenuButton asChild isActive={active}>
                        <Link href={group.href}>
                          <Icon />
                          <span>{group.title}</span>
                          {"comingSoon" in group && group.comingSoon && (
                            <Badge variant="warning" className="ml-1">PACKAGING</Badge>
                          )}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                }

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
                        {"comingSoon" in group && group.comingSoon && (
                          <Badge variant="warning" className="ml-1">PACKAGING</Badge>
                        )}
                        <ChevronRightIcon className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {group.items.map((sub) => (
                          <SidebarMenuSubItem key={sub.title}>
                            <SidebarMenuSubButton
                              asChild
                              isActive={pathname === sub.href && !boxParam}
                            >
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
                <SidebarMenuButton asChild isActive={pathname === "/technergetics/lightcert"}>
                  <Link href="/technergetics/lightcert">
                    {pathname === "/technergetics/lightcert" ? <BoltSolid /> : <BoltIcon />}
                    <span>Lightcert</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

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

        <SidebarGroup>
          <SidebarGroupLabel className="font-mono uppercase tracking-wide">
            School
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/school/swiperight-ai" && !boxParam}>
                  <Link href="/school/swiperight-ai">
                    {pathname === "/school/swiperight-ai" && !boxParam ? <AcademicCapSolid /> : <AcademicCapIcon />}
                    <span>SwipeRight.ai</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="font-mono uppercase tracking-wide">
            Extracurriculars
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {[
                { title: "Surfing", href: "/extracurriculars/surfing", icon: LifebuoyIcon, iconActive: LifebuoySolid },
                { title: "Gaming", href: "/extracurriculars/gaming", icon: PuzzlePieceIcon, iconActive: PuzzlePieceSolid },
                { title: "Music", href: "/extracurriculars/music", icon: MusicalNoteIcon, iconActive: MusicalNoteSolid },
              ].map((item) => {
                const active = pathname === item.href && !boxParam;
                const Icon = active ? item.iconActive : item.icon;
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton asChild isActive={active}>
                      <Link href={item.href}>
                        <Icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {conversations.length > 0 && (
          <SidebarGroup className="group/conv mt-auto">
            <SidebarGroupLabel className="font-mono uppercase tracking-wide">
              Conversations
              <Link
                href="/conversations"
                className="ml-auto inline-flex items-center gap-0.5 rounded px-1 text-muted-foreground opacity-0 transition-opacity hover:text-foreground focus-visible:opacity-100 group-hover/conv:opacity-100"
              >
                View all
                <ChevronRightIcon className="size-3" />
              </Link>
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {conversations.slice(0, 5).map((c) => {
                  // A case-study conversation reopens on its project page with
                  // Box AI toggled on (conversation beside the case study);
                  // everything else opens on the full /who page.
                  const study = caseStudyForConversation(c)
                  const href = study ? `${study.href}?box=${c.id}` : `/who?c=${c.id}`
                  const active = study
                    ? pathname === study.href && boxParam === c.id
                    : pathname === "/who" && convoParam === c.id
                  return (
                  <SidebarMenuItem key={c.id}>
                    <SidebarMenuButton asChild isActive={active} tooltip={c.title}>
                      <Link href={href}>
                        <span>{c.title}</span>
                      </Link>
                    </SidebarMenuButton>
                    <SidebarMenuAction
                      showOnHover
                      onClick={() => removeConversation(c.id)}
                      aria-label="Delete conversation"
                    >
                      <XMarkIcon />
                    </SidebarMenuAction>
                  </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
      <SidebarFooter>
        <SidebarSeparator className="mx-0 mb-2 bg-border/50" />
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === "/settings"}>
              <Link href="/settings">
                {pathname === "/settings" ? <Cog6ToothSolid /> : <Cog6ToothIcon />}
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
