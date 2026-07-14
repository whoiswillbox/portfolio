import * as React from "react"
import Link from "next/link"

import { cn } from "@/lib/utils"

/* Cardboard NavBar — owned (new, not forked). The top application bar: a thin,
   fixed strip that holds the product logo (a home link), a product switcher,
   and optional top-level nav items. A layout composition — compose the parts:

     <NavBar>
       <NavBarLogo href="/"><BoxLogo /></NavBarLogo>
       <ProductSwitcher />
       <NavBarNav>…links…</NavBarNav>   // optional, right-aligned
     </NavBar>

   Desktop-only in the app shell (hidden under sm; the mobile nav takes over). */

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

/* A single top-level nav link. `active` marks the current section (fuller
   weight + foreground); the rest are tertiary with a hover lift. */
function NavBarNavItem({
  active = false,
  className,
  ...props
}: React.ComponentProps<typeof Link> & { active?: boolean }) {
  return (
    <Link
      data-slot="nav-bar-nav-item"
      data-active={active || undefined}
      className={cn(
        "rounded-md px-2.5 py-1.5 text-body-xs transition-colors outline-none focus-visible:ring-2 focus-visible:ring-border-focus",
        active ? "font-medium text-foreground" : "text-tertiary hover:text-secondary",
        className
      )}
      {...props}
    />
  )
}

export { NavBar, NavBarLogo, NavBarNav, NavBarNavItem }
