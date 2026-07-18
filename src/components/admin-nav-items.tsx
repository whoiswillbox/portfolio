"use client"

/* Admin's top-level navigation — Chat log · Feedback — as NavBar items,
   mirroring CardboardNavItems/BoxNavItems for the other products. */

import { usePathname } from "next/navigation"
import { NavBarNav, NavBarNavItem } from "@/components/cardboard/nav-bar"

export function AdminNavItems() {
  const pathname = usePathname()

  return (
    <NavBarNav>
      <NavBarNavItem href="/admin/chat" active={pathname === "/admin/chat"}>
        Chat log
      </NavBarNavItem>
      <NavBarNavItem href="/admin/feedback" active={pathname === "/admin/feedback"}>
        Feedback
      </NavBarNavItem>
    </NavBarNav>
  )
}
