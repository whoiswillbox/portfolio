"use client"

import { useRouter, usePathname } from "next/navigation"
import { CubeIcon, SwatchIcon, ChevronDownIcon, CheckIcon } from "@heroicons/react/24/outline"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/cardboard/dropdown-menu"
import { cn } from "@/lib/utils"

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
    <DropdownMenu>
      {/* Compact pill (Tailwind-docs style): current product name + chevron. */}
      <DropdownMenuTrigger
        className={cn(
          "flex items-center gap-1.5 rounded-full border border-border bg-surface-secondary py-1 pl-2.5 pr-2",
          "text-body-sm font-medium text-foreground outline-none transition-colors",
          "hover:bg-surface-secondary/70 focus-visible:ring-2 focus-visible:ring-border-focus"
        )}
      >
        {active.name}
        <ChevronDownIcon className="size-3.5 text-subtle" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        {products.map((product) => {
          const Icon = product.icon
          const isActive = product.id === active.id
          return (
            <DropdownMenuItem
              key={product.id}
              onSelect={() => {
                if (!isActive) router.push(product.href)
              }}
              className="gap-2 py-2"
            >
              <span className="flex size-7 items-center justify-center rounded-md bg-surface-secondary text-foreground">
                <Icon className="size-4" />
              </span>
              <span className="flex flex-1 flex-col leading-none">
                <span className="text-body-sm font-medium">{product.name}</span>
                <span className="text-body-xs text-subtle">{product.tagline}</span>
              </span>
              {isActive && <CheckIcon className="size-4 text-foreground" />}
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
