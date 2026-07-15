"use client"

/* The Box product's top-level navigation, expressed as NavBar items with
   disclosure dropdowns — the horizontal nav bar that replaced the left sidebar.
   Mirrors app-sidebar.tsx's sections.

   Not yet carried over from the sidebar: nested Technergetics grouping (the
   studies are flat under Experience) and per-item icons (top-nav dropdowns
   don't carry those well). */

import * as React from "react"
import { usePathname, useSearchParams } from "next/navigation"
import { NavBarNav, NavBarNavItem } from "@/components/cardboard/nav-bar"
import {
  loadConversations,
  subscribeConversations,
  type Conversation,
} from "@/lib/chat/store"
import { caseStudyForConversation } from "@/lib/case-studies"

export function BoxNavItems() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`)

  // Box AI conversations, kept in sync with the chat (same localStorage store
  // the old sidebar read). Surfaced here as a top-nav disclosure since the
  // sidebar that used to hold them is gone.
  const [conversations, setConversations] = React.useState<Conversation[]>([])
  React.useEffect(() => {
    const sync = () => setConversations(loadConversations())
    sync()
    return subscribeConversations(sync)
  }, [])

  // Where a conversation reopens: a case-study chat reopens on its project page
  // with Box AI toggled on; everything else reopens on the home Box AI ("/?c=").
  const boxParam = searchParams.get("box")
  const convoParam = searchParams.get("c")
  const conversationItems = conversations.slice(0, 5).map((c) => {
    const study = caseStudyForConversation(c)
    const href = study ? `${study.href}?box=${c.id}` : `/?c=${c.id}`
    const active = study
      ? pathname === study.href && boxParam === c.id
      : pathname === "/" && convoParam === c.id
    return { label: c.title, href, active }
  })
  // Only claim the "Conversations" section on the conversations surfaces
  // themselves — the /conversations page or the home Box AI viewing a
  // conversation (/?c=). A case-study conversation lives ON its project page,
  // which belongs to Experience, so it must NOT also light up Conversations
  // (that page would then activate two nav items at once).
  const conversationsActive =
    pathname === "/conversations" || (pathname === "/" && !!convoParam)

  const experience = [
    { label: "BARBRI", href: "/projects/next-gen-bar", badge: { label: "PACKAGING", variant: "warning" as const } },
    { label: "Jetdash", href: "/technergetics/jetdash" },
    { label: "Upgrade", href: "/technergetics/upgrade" },
    { label: "Reusable Table", href: "/technergetics/reusable-table" },
    { label: "Design Standards", href: "/technergetics/design-standards" },
    { label: "Lightcert", href: "/technergetics/lightcert" },
    { label: "Resume", href: "/resume" },
  ]
  const school = [{ label: "SwipeRight.ai", href: "/school/swiperight-ai" }]
  const extras = [
    { label: "Surfing", href: "/extracurriculars/surfing" },
    { label: "Gaming", href: "/extracurriculars/gaming" },
    { label: "Music", href: "/extracurriculars/music" },
  ]

  const withActive = <T extends { href: string }>(items: T[]) =>
    items.map((i) => ({ ...i, active: isActive(i.href) }))

  const groupActive = (items: { href: string }[]) =>
    items.some((i) => isActive(i.href))

  return (
    <NavBarNav>
      <NavBarNavItem disclosure active={groupActive(experience)} items={withActive(experience)}>
        Experience
      </NavBarNavItem>
      <NavBarNavItem disclosure active={groupActive(school)} items={withActive(school)}>
        School
      </NavBarNavItem>
      <NavBarNavItem disclosure active={groupActive(extras)} items={withActive(extras)}>
        Extracurriculars
      </NavBarNavItem>
      {conversationItems.length > 0 && (
        <NavBarNavItem
          disclosure
          active={conversationsActive}
          items={[
            ...conversationItems,
            { label: "View all →", href: "/conversations", active: pathname === "/conversations" },
          ]}
        >
          Conversations
        </NavBarNavItem>
      )}
      <NavBarNavItem href="/settings" active={pathname === "/settings"}>
        Settings
      </NavBarNavItem>
    </NavBarNav>
  )
}
