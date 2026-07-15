"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import { CubeIcon, SwatchIcon } from "@heroicons/react/24/outline"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/cardboard/select"

type Product = {
  id: "box" | "cardboard"
  name: string
  tagline: string
  icon: typeof CubeIcon
  /** Landing route entered when the product is selected. */
  href: string
  /** Pathname prefix that marks this product as active. */
  match: (pathname: string) => boolean
}

const products: Product[] = [
  {
    id: "box",
    name: "Box",
    tagline: "Portfolio",
    icon: CubeIcon,
    href: "/?box-home=1",
    match: (p) => !p.startsWith("/cardboard"),
  },
  {
    id: "cardboard",
    name: "Cardboard",
    tagline: "Design System",
    icon: SwatchIcon,
    href: "/cardboard/foundations",
    match: (p) => p.startsWith("/cardboard"),
  },
]

export function ProductSwitcher({ demo = false }: { demo?: boolean } = {}) {
  const pathname = usePathname()
  const routeActive = products.find((p) => p.match(pathname)) ?? products[0]
  // In `demo` mode (docs) the switch is display-only: selection updates the
  // shown value locally but never navigates, so it can't route out of the demo.
  const [demoId, setDemoId] = useState(routeActive.id)
  const active = demo ? (products.find((p) => p.id === demoId) ?? products[0]) : routeActive

  return (
    <Select
      value={active.id}
      onValueChange={(id) => {
        const next = products.find((p) => p.id === id)
        if (!next || next.id === active.id) return
        if (demo) { setDemoId(next.id); return }
        // Cross-product switch (Box ↔ Cardboard) swaps the whole app shell. A
        // client-side router.push from the Box home was getting reverted (the
        // landing/Box-AI effects re-assert "/"), so navigate with a full load —
        // deliberate + rare, and bulletproof against client-side interference.
        window.location.assign(next.href)
      }}
    >
      <SelectTrigger size="sm" variant="ghost" aria-label="Switch product">
        {/* Just the product name + chevron — the pure ghost variant. */}
        <span>{active.name}</span>
      </SelectTrigger>
      <SelectContent className="w-56">
        {products.map((product) => {
          const Icon = product.icon
          return (
            <SelectItem key={product.id} value={product.id} className="py-2 pl-2">
              <span className="flex size-7 items-center justify-center rounded-md bg-surface-secondary text-foreground">
                <Icon className="size-4" />
              </span>
              <span className="flex flex-col leading-none">
                <span className="text-body-sm font-medium">{product.name}</span>
                <span className="text-body-xs text-tertiary">{product.tagline}</span>
              </span>
            </SelectItem>
          )
        })}
      </SelectContent>
    </Select>
  )
}
