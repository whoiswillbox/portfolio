"use client"

import { useRouter, usePathname } from "next/navigation"
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
    href: "/who",
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

export function ProductSwitcher() {
  const router = useRouter()
  const pathname = usePathname()
  const active = products.find((p) => p.match(pathname)) ?? products[0]

  return (
    <Select
      value={active.id}
      onValueChange={(id) => {
        const next = products.find((p) => p.id === id)
        if (next && next.id !== active.id) router.push(next.href)
      }}
    >
      <SelectTrigger size="sm" aria-label="Switch product">
        {/* Show just the product name (not the full item content). */}
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
