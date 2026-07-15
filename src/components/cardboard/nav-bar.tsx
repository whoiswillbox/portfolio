"use client"

import * as React from "react"
import Link from "next/link"
import { ChevronDownIcon } from "@heroicons/react/24/outline"

import { cn } from "@/lib/utils"
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

/* ── Disclosure menu coordination ──────────────────────────────────────────
   A disclosure nav item no longer opens its own popover. Instead it toggles a
   shared "open key" so that at most one menu is open, and its items render in a
   full-width panel BELOW the bar (NavBarPanel) that pushes the page content
   down rather than floating over it. NavBarMenuProvider wraps the bar AND the
   panel (the panel is a sibling below the header so it can push siblings). */
type NavBarMenuContextValue = {
  openKey: string | null
  /** Toggle a menu open/closed by key (clicking the open one closes it). */
  toggle: (key: string) => void
  close: () => void
  /** Disclosure items register their groups here so the panel can render them
      by key without prop-drilling. Returns the groups for the open key. */
  register: (key: string, groups: NavBarNavMenuGroup[]) => void
  groupsFor: (key: string | null) => NavBarNavMenuGroup[] | null
}

const NavBarMenuContext = React.createContext<NavBarMenuContextValue | null>(null)

function NavBarMenuProvider({ children }: { children: React.ReactNode }) {
  const [openKey, setOpenKey] = React.useState<string | null>(null)
  // Registered groups per menuKey, in STATE so the panel re-renders when a
  // disclosure (re)registers — a ref wouldn't notify the panel and it rendered
  // empty. Keyed writes are cheap and idempotent.
  const [registry, setRegistry] = React.useState<Record<string, NavBarNavMenuGroup[]>>({})

  const register = React.useCallback((key: string, groups: NavBarNavMenuGroup[]) => {
    setRegistry((cur) => (cur[key] === groups ? cur : { ...cur, [key]: groups }))
  }, [])
  const groupsFor = React.useCallback(
    (key: string | null) => (key ? registry[key] ?? null : null),
    [registry]
  )
  const toggle = React.useCallback(
    (key: string) => setOpenKey((cur) => (cur === key ? null : key)),
    []
  )
  const close = React.useCallback(() => setOpenKey(null), [])

  // Close on Escape.
  React.useEffect(() => {
    if (!openKey) return
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpenKey(null) }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [openKey])

  // Close on click outside the bar + panel (e.g. on the content card). Clicks on
  // a nav trigger or inside the panel are ignored (they toggle / navigate).
  React.useEffect(() => {
    if (!openKey) return
    const onPointerDown = (e: PointerEvent) => {
      const t = e.target as Element | null
      if (t?.closest('[data-slot="nav-bar"], [data-slot="nav-bar-panel"]')) return
      setOpenKey(null)
    }
    // Capture phase so it runs before other handlers stop propagation.
    document.addEventListener("pointerdown", onPointerDown, true)
    return () => document.removeEventListener("pointerdown", onPointerDown, true)
  }, [openKey])

  // Scroll-lock while a menu is open — universal (every page), so the content
  // beneath the panel can't scroll out from under it. A non-passive wheel/touch
  // blocker stops native scrolling of the page and any inner scroll container.
  // (The landing page has its own scrub gate too; this covers everything else.)
  React.useEffect(() => {
    if (!openKey) return
    const block = (e: Event) => e.preventDefault()
    window.addEventListener("wheel", block, { passive: false })
    window.addEventListener("touchmove", block, { passive: false })
    return () => {
      window.removeEventListener("wheel", block)
      window.removeEventListener("touchmove", block)
    }
  }, [openKey])

  return (
    <NavBarMenuContext.Provider value={{ openKey, toggle, close, register, groupsFor }}>
      {children}
    </NavBarMenuContext.Provider>
  )
}

function useNavBarMenu() {
  const ctx = React.useContext(NavBarMenuContext)
  if (!ctx) {
    throw new Error(
      "NavBarNavItem (disclosure) and NavBarPanel must be used within a NavBarMenuProvider"
    )
  }
  return ctx
}

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

/* A child row shown in a disclosure menu's panel. */
type NavBarNavMenuItem = {
  label: string
  href: string
  /** Marks the current child (medium weight + foreground). */
  active?: boolean
  /** Optional trailing status badge (e.g. a "PACKAGING" coming-soon tag). */
  badge?: { label: string; variant?: React.ComponentProps<typeof Badge>["variant"] }
}

/* A labelled category of items within a disclosure panel. An empty label
   renders no header (for single-category or "View all" rows). */
type NavBarNavMenuGroup = {
  label?: string
  items: NavBarNavMenuItem[]
}

/* Accept either a flat item list (one implicit category) or explicit groups. */
type NavBarNavMenuData = NavBarNavMenuItem[] | NavBarNavMenuGroup[]

function toGroups(data: NavBarNavMenuData): NavBarNavMenuGroup[] {
  if (data.length === 0) return []
  // A group has `items`; a flat item has `href`. Discriminate on that.
  return "items" in data[0]
    ? (data as NavBarNavMenuGroup[])
    : [{ items: data as NavBarNavMenuItem[] }]
}

/* A single top-level nav item. Two forms:

   · Link (default) — `active` marks the current section.
   · Disclosure — pass `disclosure`, a stable `menuKey`, and `items` to make it
     a trigger that opens a full-width panel BELOW the bar (NavBarPanel), which
     pushes the page content down. At most one disclosure is open at a time
     (coordinated via NavBarMenuProvider). It renders a <button> with a rotating
     chevron instead of a <Link>. `items` accepts a flat list or grouped
     categories. */
function NavBarNavItem({
  active = false,
  className,
  disclosure = false,
  menuKey,
  items,
  href,
  children,
  ...props
}: Omit<React.ComponentProps<typeof Link>, "href"> & {
  /** The item's route. Optional — a disclosure item is a trigger, not a link. */
  href?: React.ComponentProps<typeof Link>["href"]
  active?: boolean
  /** Render as a trigger that discloses `items` in the full-width panel. */
  disclosure?: boolean
  /** Stable identifier for this disclosure's panel (required when disclosure). */
  menuKey?: string
  /** Child links shown in the disclosure panel — flat list or grouped. */
  items?: NavBarNavMenuData
}) {
  if (disclosure) {
    return <NavBarDisclosureItem
      active={active}
      className={className}
      menuKey={menuKey ?? String(children)}
      items={items ?? []}
    >
      {children}
    </NavBarDisclosureItem>
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

/* The disclosure form, split out so it can use the menu context (hooks). */
function NavBarDisclosureItem({
  active,
  className,
  menuKey,
  items,
  children,
}: {
  active: boolean
  className?: string
  menuKey: string
  items: NavBarNavMenuData
  children: React.ReactNode
}) {
  const { openKey, toggle, register } = useNavBarMenu()
  // Stabilise by CONTENT (items is a fresh array each parent render): memo on a
  // serialized key so `groups` keeps a stable reference until the data actually
  // changes — otherwise registration would loop (new ref → setState → re-render).
  const itemsKey = JSON.stringify(items)
  const groups = React.useMemo(() => toGroups(items), [itemsKey]) // eslint-disable-line react-hooks/exhaustive-deps
  React.useEffect(() => { register(menuKey, groups) }, [register, menuKey, groups])
  const open = openKey === menuKey
  // Show the active (foreground) styling while the menu is open, not just when
  // its route is current.
  const showActive = active || open

  return (
    <button
      type="button"
      data-slot="nav-bar-nav-item"
      data-active={showActive || undefined}
      aria-expanded={open}
      onClick={() => toggle(menuKey)}
      className={cn(navItemClass(showActive), "group/disclosure", className)}
    >
      {children}
      <ChevronDownIcon
        className={cn(
          "size-3.5 shrink-0 transition-transform duration-200",
          open && "rotate-180"
        )}
        aria-hidden="true"
      />
    </button>
  )
}

/* The full-width disclosure panel — renders BELOW the bar and expands to push
   page content down when a disclosure item is open. Place it as a sibling
   directly after <NavBar>, inside the same <NavBarMenuProvider>. Styling is
   intentionally minimal here (a hairline + padding); the app tunes the rest. */
function NavBarPanel({ className, ...props }: React.ComponentProps<"div">) {
  const { openKey, groupsFor, close } = useNavBarMenu()
  const openItems = groupsFor(openKey)
  const open = !!openKey && !!openItems && openItems.length > 0
  const contentRef = React.useRef<HTMLDivElement>(null)
  // The panel's natural content height drives its own animated height (0 →
  // content height). It's a flex sibling of the page content, so growing pushes
  // that content down — no CSS var / viewport calc needed.
  const [contentH, setContentH] = React.useState(0)

  React.useLayoutEffect(() => {
    const el = contentRef.current
    if (!el) return
    const update = () => setContentH(el.scrollHeight)
    update()
    // Track content reflow (fonts, wrapping, item count changes).
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [openKey])

  return (
    <div
      data-slot="nav-bar-panel"
      data-state={open ? "open" : "closed"}
      style={{ height: open ? contentH : 0 }}
      className={cn(
        "overflow-hidden bg-background transition-[height] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]",
        className
      )}
      {...props}
    >
      <div ref={contentRef} className="flex justify-center gap-12 px-4 py-5">
          {openItems?.map((group, gi) => (
            <div key={group.label ?? gi} className="flex flex-col gap-2">
              {group.label && (
                <p className="font-mono text-body-xs uppercase tracking-wide text-tertiary">
                  {group.label}
                </p>
              )}
              <div className="flex flex-col gap-0.5">
                {group.items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={close}
                    data-active={item.active || undefined}
                    className={cn(
                      "inline-flex items-center gap-2 whitespace-nowrap rounded-md px-2 py-1 text-body-sm transition-colors",
                      item.active
                        ? "font-medium text-foreground"
                        : "text-secondary hover:bg-surface-secondary hover:text-foreground"
                    )}
                  >
                    {item.label}
                    {item.badge && (
                      <Badge variant={item.badge.variant ?? "default"}>
                        {item.badge.label}
                      </Badge>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}

export {
  NavBar,
  NavBarLogo,
  NavBarNav,
  NavBarNavItem,
  NavBarPanel,
  NavBarMenuProvider,
}
export type { NavBarNavMenuItem, NavBarNavMenuGroup, NavBarNavMenuData }
