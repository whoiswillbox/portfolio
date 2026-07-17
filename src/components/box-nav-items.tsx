"use client"

/* The Box product's top-level navigation, expressed as NavBar items with
   disclosure dropdowns — the horizontal nav bar that replaced the left sidebar.
   Mirrors app-sidebar.tsx's sections.

   Not yet carried over from the sidebar: nested Technergetics grouping (the
   studies are flat under Experience) and per-item icons (top-nav dropdowns
   don't carry those well). */

import { usePathname } from "next/navigation"
import { NavBarNav, NavBarNavItem } from "@/components/cardboard/nav-bar"

export function BoxNavItems() {
  const pathname = usePathname()
  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`)

  const withActive = <T extends { href: string }>(items: T[]) =>
    items.map((i) => ({ ...i, active: isActive(i.href) }))

  // Experience, grouped into tabs for the disclosure panel:
  // BARBRI · Technergetics · School · More.
  const barbri = [
    { label: "Next Gen", href: "/projects/next-gen-bar" },
    { label: "SQE2", href: "/projects/sqe2" },
    { label: "Powerscore", href: "/projects/powerscore-ai-tutor" },
    { label: "OneUX", href: "/projects/onebarbri" },
  ]
  const technergetics = [
    { label: "Jetdash", href: "/technergetics/jetdash" },
    { label: "Upgrade", href: "/technergetics/upgrade" },
    { label: "Reusable Table", href: "/technergetics/reusable-table" },
    { label: "Design Standards", href: "/technergetics/design-standards" },
  ]
  const lightcert = [{ label: "Lightcert", href: "/technergetics/lightcert" }]
  const school = [{ label: "SwipeRight.ai", href: "/school/swiperight-ai" }]
  const cv = [{ label: "CV", href: "/resume" }]
  const experienceGroups = [
    { label: "BARBRI", items: withActive(barbri) },
    { label: "Technergetics", items: withActive(technergetics) },
    { label: "Internship", items: withActive(lightcert) },
    { label: "School", items: withActive(school) },
    // CV is a link-tab — clicking it goes straight to /resume, no sub-items.
    { label: "CV", href: "/resume", items: withActive(cv) },
  ]
  const experienceActive = [...barbri, ...technergetics, ...lightcert, ...school, ...cv].some((i) => isActive(i.href))

  const extras = [
    { label: "Surfing", href: "/extracurriculars/surfing" },
    { label: "Gaming", href: "/extracurriculars/gaming" },
    { label: "Music", href: "/extracurriculars/music" },
  ]

  const groupActive = (items: { href: string }[]) =>
    items.some((i) => isActive(i.href))

  return (
    <NavBarNav>
      <NavBarNavItem disclosure menuKey="experience" active={experienceActive} items={experienceGroups}>
        Experience
      </NavBarNavItem>
      <NavBarNavItem disclosure menuKey="extras" active={groupActive(extras)} items={withActive(extras)}>
        Extracurriculars
      </NavBarNavItem>
      <NavBarNavItem href="/conversations" active={pathname === "/conversations"}>
        Conversations
      </NavBarNavItem>
    </NavBarNav>
  )
}
