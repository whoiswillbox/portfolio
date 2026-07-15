import * as React from "react"
import Link from "next/link"
import { ChevronDownIcon } from "@heroicons/react/24/outline"

import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/cardboard/dropdown-menu"
import { Badge } from "@/components/cardboard/badge"

/* Cardboard NavBar — owned (new, not forked). The top application bar: a thin,
   fixed strip that holds the product logo (a home link), a product switcher,
   and optional top-level nav items. A layout composition — compose the parts:

     <NavBar>
       <NavBarLogo href="/"><BoxLogo /></NavBarLogo>
       <ProductSwitcher />
       <NavBarNav>…links…</NavBarNav>   // optional, right-aligned
     </NavBar>

   Desktop-only in the app shell (hidden under sm; the mobile nav takes over).

   NavBar is a layout shell only — it takes free children, it does NOT own the
   switcher. The product switcher is a real Select (ProductSwitcher), dropped in
   as a child, because it has genuine listbox semantics: a selected value, a
   checkmark, a listbox popup. Deliberately NOT folded into NavBarNavItem as a
   "disclosure" prop (a nav item is a Link that navigates; conflating the two
   would overload one component with two ARIA roles) and NOT exposed as a fixed
   `switcher` slot (would bake "has a switcher" into every bar). Keep it
   compositional. */

function NavBar({ className, children, ...props }: React.ComponentProps<"header">) {
  return (
    <header
      data-slot="nav-bar"
      className={cn(
        "flex h-14 shrink-0 items-center gap-0 border-b border-border-divider bg-background px-4",
        className
      )}
      {...props}
    >
      {children}
    </header>
  )
}

/* The logo slot — a home link wrapping the product's logo mark. Pass the logo
   as children; give it an accessible label since it's typically icon-only. */
function NavBarLogo({
  href = "/",
  className,
  "aria-label": ariaLabel = "Home",
  children,
  ...props
}: React.ComponentProps<typeof Link>) {
  return (
    <Link
      href={href}
      data-slot="nav-bar-logo"
      aria-label={ariaLabel}
      className={cn(
        "flex items-center rounded-md text-foreground outline-none focus-visible:ring-2 focus-visible:ring-border-focus",
        className
      )}
      {...props}
    >
      {children}
    </Link>
  )
}

/* Optional top-level nav, right-aligned via ml-auto. Holds NavBarNavItem links. */
function NavBarNav({ className, ...props }: React.ComponentProps<"nav">) {
  return (
    <nav
      data-slot="nav-bar-nav"
      className={cn("ml-auto flex items-center gap-1", className)}
      {...props}
    />
  )
}

// Shared className for a nav item's rest / active / focus states — used by both
// the link and the disclosure-trigger forms so they look identical.
const navItemClass = (active: boolean, className?: string) =>
  cn(
    "inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 text-body-xs transition-colors outline-none focus-visible:ring-2 focus-visible:ring-border-focus",
    active ? "font-medium text-foreground" : "text-tertiary hover:text-secondary",
    className
  )

/* A child row shown in a disclosure item's dropdown menu. */
type NavBarNavMenuItem = {
  label: string
  href: string
  /** Marks the current child (medium weight + foreground). */
  active?: boolean
  /** Optional trailing status badge (e.g. a "PACKAGING" coming-soon tag). */
  badge?: { label: string; variant?: React.ComponentProps<typeof Badge>["variant"] }
}

/* A single top-level nav item. Two forms:

   · Link (default) — `active` marks the current section.
   · Disclosure — pass `disclosure` + `items` to make it a menu trigger that
     opens a DropdownMenu of child links (mirrors the Box sidebar's expandable
     items, but as a dropdown since the nav bar is horizontal). It renders a
     <button> with a rotating chevron instead of a <Link>. */
function NavBarNavItem({
  active = false,
  className,
  disclosure = false,
  items,
  href,
  children,
  ...props
}: Omit<React.ComponentProps<typeof Link>, "href"> & {
  /** The item's route. Optional — a disclosure item is a menu trigger, not a link. */
  href?: React.ComponentProps<typeof Link>["href"]
  active?: boolean
  /** Render as a menu trigger that discloses `items` in a dropdown. */
  disclosure?: boolean
  /** Child links shown in the disclosure dropdown. */
  items?: NavBarNavMenuItem[]
}) {
  if (disclosure) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger
          data-slot="nav-bar-nav-item"
          data-active={active || undefined}
          className={cn(navItemClass(active), "group/disclosure", className)}
        >
          {children}
          <ChevronDownIcon
            className="size-3.5 shrink-0 transition-transform duration-200 group-data-[state=open]/disclosure:rotate-180"
            aria-hidden="true"
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="min-w-44">
          {items?.map((item) => (
            <DropdownMenuItem key={item.href} asChild>
              <Link href={item.href} data-active={item.active || undefined}>
                <span className={item.active ? "font-medium text-foreground" : undefined}>
                  {item.label}
                </span>
                {item.badge && (
                  <Badge variant={item.badge.variant ?? "default"} className="ml-auto">
                    {item.badge.label}
                  </Badge>
                )}
              </Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <Link
      href={href ?? "#"}
      data-slot="nav-bar-nav-item"
      data-active={active || undefined}
      className={navItemClass(active, className)}
      {...props}
    >
      {children}
    </Link>
  )
}

export { NavBar, NavBarLogo, NavBarNav, NavBarNavItem }
export type { NavBarNavMenuItem }
