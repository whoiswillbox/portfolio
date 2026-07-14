"use client"

/* TRIAL (try/nav-bar-shell branch) — the Box product's top-level navigation
   expressed as NavBar items with disclosure dropdowns, to evaluate a horizontal
   nav bar as a replacement for the left sidebar. Mirrors app-sidebar.tsx's
   sections. Not wired on main; the app-shell renders this only on this branch.

   Left out of the trial for now: the dynamic Conversations list and the
   coming-soon "PACKAGING" badge (top-nav dropdowns don't carry those well). */

import { usePathname } from "next/navigation"
import { NavBarNav, NavBarNavItem } from "@/components/cardboard/nav-bar"

export function BoxNavItems() {
  const pathname = usePathname()
  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`)

  const experience = [
    { label: "BARBRI", href: "/projects/next-gen-bar" },
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

  const withActive = (items: { label: string; href: string }[]) =>
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
      <NavBarNavItem href="/settings" active={pathname === "/settings"}>
        Settings
      </NavBarNavItem>
    </NavBarNav>
  )
}
