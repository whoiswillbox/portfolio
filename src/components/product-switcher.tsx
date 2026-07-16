"use client"

import { usePathname } from "next/navigation"
import { NavBarNavItem } from "@/components/cardboard/nav-bar"

type Product = {
  id: "box" | "cardboard"
  name: string
  /** Landing route entered when the product is selected. */
  href: string
  /** Pathname prefix that marks this product as active. */
  match: (pathname: string) => boolean
}

const products: Product[] = [
  {
    id: "box",
    name: "Box",
    href: "/?box-home=1",
    match: (p) => !p.startsWith("/cardboard"),
  },
  {
    id: "cardboard",
    name: "Cardboard",
    href: "/cardboard/foundations",
    match: (p) => p.startsWith("/cardboard"),
  },
]

export function ProductSwitcher({ demo = false }: { demo?: boolean } = {}) {
  const pathname = usePathname()
  const active = products.find((p) => p.match(pathname)) ?? products[0]

  // The switcher is now a disclosure nav item (same push-down panel behavior as
  // Experience, etc.) rather than a Select dropdown. Clicking the trigger opens
  // the full-width panel with the products; picking the other one navigates.
  // In `demo` mode (docs) there's no NavBarMenuProvider, so render an inert
  // trigger-shaped label instead.
  if (demo) {
    return (
      <span className="inline-flex items-center rounded-md px-2.5 py-1.5 text-body-sm text-tertiary">
        {active.name}
      </span>
    )
  }

  // Only show the OTHER product(s) — no point listing the one you're already in.
  const items = products
    .filter((p) => p.id !== active.id)
    .map((p) => ({ label: p.name, href: p.href }))

  return (
    <NavBarNavItem disclosure menuKey="product-switcher" items={items}>
      {active.name}
    </NavBarNavItem>
  )
}
