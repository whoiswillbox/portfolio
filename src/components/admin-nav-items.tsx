"use client"

/* Admin's top-level navigation — Chat history — as a NavBar item, mirroring
   CardboardNavItems/BoxNavItems for the other products. Feedback used to be
   a separate page/route but is now folded into Chat history (its ratings
   join in per-message), so there's just the one section. */

import { usePathname } from "next/navigation"
import { NavBarNav, NavBarNavItem } from "@/components/cardboard/nav-bar"

export function AdminNavItems() {
  const pathname = usePathname()

  return (
    <NavBarNav>
      <NavBarNavItem href="/admin/chat" active={pathname === "/admin/chat"}>
        Chat history
      </NavBarNavItem>
    </NavBarNav>
  )
}
