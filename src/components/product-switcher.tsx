"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import { NavBarNavItem } from "@/components/cardboard/nav-bar"

type Product = {
  id: "box" | "cardboard" | "admin"
  name: string
  /** Landing route entered when the product is selected. */
  href: string
  /** Pathname prefix that marks this product as active. */
  match: (pathname: string) => boolean
  /** Only listed as a switch-to option when true — used to gate Admin behind
      the isAdmin check instead of showing it to every visitor. */
  hidden?: boolean
}

const products: Product[] = [
  {
    id: "box",
    name: "Box",
    href: "/?box-home=1",
    match: (p) => !p.startsWith("/cardboard") && !p.startsWith("/admin"),
  },
  {
    id: "cardboard",
    name: "Cardboard",
    href: "/cardboard",
    match: (p) => p.startsWith("/cardboard"),
  },
  {
    id: "admin",
    name: "Admin",
    href: "/admin/chat",
    match: (p) => p.startsWith("/admin"),
    hidden: true,
  },
]

export function ProductSwitcher({
  demo = false,
  demoLabel,
}: {
  demo?: boolean
  /** Override the shown label in demo mode only (e.g. a generic "Product" for
      a structure-focused doc example instead of the real route-derived
      name). Ignored outside demo mode — the real switcher always reflects
      the actual current product. */
  demoLabel?: string
} = {}) {
  const pathname = usePathname()
  const active = products.find((p) => p.match(pathname)) ?? products[0]

  // Admin is only ever offered as a switch-to target when the visitor already
  // has a valid admin cookie — same check the settings-menu Admin entry uses.
  // Not a security boundary (the /admin routes themselves are cookie-gated),
  // just keeps it out of the switcher for everyone else.
  const [isAdmin, setIsAdmin] = React.useState(false)
  React.useEffect(() => {
    fetch("/api/admin-status", { credentials: "same-origin", cache: "no-store" })
      .then((r) => r.json())
      .then((d) => setIsAdmin(Boolean(d.isAdmin)))
      .catch(() => {})
  }, [])

  // The switcher is now a disclosure nav item (same push-down panel behavior as
  // Experience, etc.) rather than a Select dropdown. Clicking the trigger opens
  // the full-width panel with the products; picking the other one navigates.
  // In `demo` mode (docs) there's no NavBarMenuProvider, so render an inert
  // trigger-shaped label instead.
  if (demo) {
    return (
      <span className="inline-flex items-center rounded-md px-2.5 py-1.5 text-body-sm text-tertiary">
        {demoLabel ?? active.name}
      </span>
    )
  }

  // Only show the OTHER product(s) — no point listing the one you're already
  // in — and drop hidden ones (Admin) unless unlocked.
  const items = products
    .filter((p) => p.id !== active.id)
    .filter((p) => !p.hidden || isAdmin)
    .map((p) => ({ label: p.name, href: p.href }))

  return (
    <NavBarNavItem disclosure menuKey="product-switcher" items={items}>
      {active.name}
    </NavBarNavItem>
  )
}
