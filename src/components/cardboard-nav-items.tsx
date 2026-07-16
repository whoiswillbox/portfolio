"use client"

/* Cardboard's top-level navigation — Foundations · Components · Utilities — as
   NavBar items, mirroring BoxNavItems for the Box product. Clicking a section
   navigates into it; the CardboardSidebar then filters to that section's list.

   Routing note: Foundations lives under /cardboard/foundations, while BOTH
   Components and Utilities live under /cardboard/components/<slug>. So the active
   section can't be read from the path prefix alone for those two — it's derived
   from which list the current slug belongs to (see cardboardSection). */

import { usePathname } from "next/navigation"
import { NavBarNav, NavBarNavItem } from "@/components/cardboard/nav-bar"
import {
  cardboardSection,
  FOUNDATIONS_HREF,
  COMPONENTS_HREF,
  UTILITIES_HREF,
} from "@/lib/cardboard-nav"

export function CardboardNavItems() {
  const pathname = usePathname()
  const section = cardboardSection(pathname)

  return (
    <NavBarNav>
      <NavBarNavItem href={FOUNDATIONS_HREF} active={section === "foundations"}>
        Foundations
      </NavBarNavItem>
      <NavBarNavItem href={COMPONENTS_HREF} active={section === "components"}>
        Components
      </NavBarNavItem>
      <NavBarNavItem href={UTILITIES_HREF} active={section === "utilities"}>
        Utilities
      </NavBarNavItem>
    </NavBarNav>
  )
}
