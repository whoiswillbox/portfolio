"use client"

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

   Desktop-only in the app shell (hidden under sm; the mobile nav takes over).

   NavBar is a layout shell only — it takes free children, it does NOT own the
   switcher. The product switcher (ProductSwitcher) is dropped in as a child and
   is itself a disclosure NavBarNavItem: clicking the current product name opens
   the full-width panel with the product(s) you can switch to — same push-down
   behavior as the other disclosure items, so the switch reads as part of the
   same nav language. It is NOT exposed as a fixed `switcher` slot (that would
   bake "has a switcher" into every bar). Keep it compositional. */

/* ── Disclosure menu coordination ──────────────────────────────────────────
   A disclosure nav item no longer opens its own popover. Instead it toggles a
   shared "open key" so that at most one menu is open, and its items render in a
   full-width panel BELOW the bar (NavBarPanel) that pushes the page content
   down rather than floating over it. NavBarMenuProvider wraps the bar AND the
   panel (the panel is a sibling below the header so it can push siblings). */
type NavBarMenuContextValue = {
  openKey: string | null
  /** Toggle a menu open/closed by key (clicking the open one closes it). The
      trigger element lets the panel align the product-switcher's content under
      its trigger (every other menu centers instead — see NavBarPanel). */
  toggle: (key: string, trigger?: HTMLElement | null) => void
  close: () => void
  /** Viewport-x of the open trigger's left edge. Only consulted by the
      product-switcher panel (it stays pinned under its trigger next to the
      logo); every other disclosure ignores this and centers. */
  openLeft: number | null
  /** Disclosure items register their groups here so the panel can render them
      by key without prop-drilling. Returns the groups for the open key. */
  register: (key: string, groups: NavBarNavMenuGroup[]) => void
  groupsFor: (key: string | null) => NavBarNavMenuGroup[] | null
}

const NavBarMenuContext = React.createContext<NavBarMenuContextValue | null>(null)

function NavBarMenuProvider({
  children,
  defaultOpenKey = null,
  isolated = false,
}: {
  children: React.ReactNode
  /** Seed a disclosure open on mount (e.g. for a static doc-page preview that
      wants to show the panel already expanded). Uninitialized state otherwise
      — this is NOT a controlled `open` prop, just an initial value. */
  defaultOpenKey?: string | null
  /** Skip the global window-level scroll-lock (wheel/touchmove preventDefault).
      Set this on any provider that ISN'T the real page-level nav — e.g. a
      doc-page preview seeded open via defaultOpenKey. Without it, a preview
      that mounts already-open immediately locks scroll on the ENTIRE page
      (the listener is on window, not scoped to the preview's own box) with no
      user action to ever unlock it. */
  isolated?: boolean
}) {
  const [openKey, setOpenKey] = React.useState<string | null>(defaultOpenKey)
  const [openLeft, setOpenLeft] = React.useState<number | null>(null)
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
  const toggle = React.useCallback((key: string, trigger?: HTMLElement | null) => {
    setOpenKey((cur) => {
      if (cur === key) return null
      if (trigger) setOpenLeft(trigger.getBoundingClientRect().left)
      return key
    })
  }, [])
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
  // Skipped when isolated — see the prop doc above.
  React.useEffect(() => {
    if (!openKey || isolated) return
    const block = (e: Event) => e.preventDefault()
    window.addEventListener("wheel", block, { passive: false })
    window.addEventListener("touchmove", block, { passive: false })
    return () => {
      window.removeEventListener("wheel", block)
      window.removeEventListener("touchmove", block)
    }
  }, [openKey, isolated])

  return (
    <NavBarMenuContext.Provider value={{ openKey, toggle, close, openLeft, register, groupsFor }}>
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

/** Safe close handle for elements outside the bar that should collapse an open
 *  disclosure menu when interacted with (e.g. a content-area launcher button).
 *  No-ops outside a NavBarMenuProvider. */
function useNavBarMenuClose() {
  const ctx = React.useContext(NavBarMenuContext)
  return React.useCallback(() => ctx?.close(), [ctx])
}

function NavBar({ className, children, ...props }: React.ComponentProps<"header">) {
  return (
    <header
      data-slot="nav-bar"
      className={cn(
        "relative flex h-14 shrink-0 items-center gap-0 border-b border-border-divider bg-background px-4",
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

/* Optional top-level nav. Holds NavBarNavItem links.

   `position="right"` (default) — sits after the logo/switcher and centers
   itself in the bar on larger viewports (with a narrow-container fallback,
   see below).

   `position="left"` — sits immediately after the logo/switcher, left-aligned,
   no centering. Use when the bar has right-aligned content of its own (e.g.
   actions, a switcher on the right) that the nav shouldn't compete with for
   the center. */
function NavBarNav({
  className,
  style,
  position = "right",
  ...props
}: React.ComponentProps<"nav"> & {
  position?: "left" | "right"
}) {
  // Centers itself in the bar via `left: 50%` — correct at the bar's real
  // width (always the full viewport, min ~1024px, since it's max-sm:hidden).
  // But in a NARROW bar (e.g. a doc-page preview box), the bar's horizontal
  // center can fall under the leading siblings (logo + switcher) if they're
  // wide enough, overlapping them. Measure the bar and its leading siblings;
  // when centering would overlap, fall back to sitting right after the
  // leading content instead (left-aligned-after-content, not centered).
  // Only relevant for position="right" — "left" never centers.
  const ref = React.useRef<HTMLElement>(null)
  const [fallbackLeft, setFallbackLeft] = React.useState<number | null>(null)
  React.useLayoutEffect(() => {
    if (position !== "right") return
    const el = ref.current
    const bar = el?.parentElement
    if (!el || !bar) return
    const GAP = 24 // ~1.5rem breathing room after the leading content
    const update = () => {
      let leadingWidth = 0
      for (const sib of Array.from(bar.children)) {
        if (sib === el) break
        leadingWidth += (sib as HTMLElement).getBoundingClientRect().width
      }
      const barWidth = bar.getBoundingClientRect().width
      const navWidth = el.getBoundingClientRect().width
      const centeredLeftEdge = barWidth / 2 - navWidth / 2
      setFallbackLeft(centeredLeftEdge < leadingWidth + GAP ? leadingWidth + GAP : null)
    }
    update()
    const ro = new ResizeObserver(update)
    ro.observe(bar)
    return () => ro.disconnect()
  }, [position])

  return (
    <nav
      ref={ref}
      data-slot="nav-bar-nav"
      data-position={position}
      style={{
        ...(fallbackLeft != null
          ? { left: `${fallbackLeft}px`, transform: "translateX(0)" }
          : undefined),
        ...style,
      }}
      className={cn(
        position === "left"
          ? "flex items-center gap-1"
          : "ml-auto flex items-center gap-1 sm:absolute sm:left-1/2 sm:ml-0 sm:-translate-x-1/2",
        className
      )}
      {...props}
    />
  )
}

// Shared className for a nav item's rest / active / focus states — used by both
// the link and the disclosure-trigger forms so they look identical.
const navItemClass = (active: boolean, className?: string) =>
  cn(
    "inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 text-body-sm transition-colors outline-none focus-visible:ring-2 focus-visible:ring-border-focus",
    active ? "text-foreground" : "text-tertiary hover:text-secondary",
    className
  )

/* A child row shown in a disclosure menu's panel. */
type NavBarNavMenuItem = {
  label: string
  href: string
  /** Marks the current child (medium weight + foreground). */
  active?: boolean
}

/* A labelled category of items within a disclosure panel. An empty label
   renders no header (for single-category or "View all" rows). */
type NavBarNavMenuGroup = {
  label?: string
  items: NavBarNavMenuItem[]
  /** When set, the category TAB itself is a link that navigates here (instead
      of revealing `items`) — for a single-destination category like a CV. */
  href?: string
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
  // A plain nav link should also collapse any open disclosure panel (and drop
  // its now-stale active state) when clicked. Context is optional so the item
  // still works outside a provider (e.g. the Cardboard docs).
  const menu = React.useContext(NavBarMenuContext)

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

  // A plain nav link defers its active state while a disclosure menu is open —
  // the open menu is the current context, so the route-active link (e.g. Resume)
  // shouldn't also read as active.
  const linkActive = active && !menu?.openKey

  return (
    <Link
      href={href ?? "#"}
      data-slot="nav-bar-nav-item"
      data-active={linkActive || undefined}
      className={navItemClass(linkActive, className)}
      {...props}
      onClick={(e) => {
        menu?.close()
        props.onClick?.(e)
      }}
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
      onClick={(e) => toggle(menuKey, e.currentTarget)}
      className={cn(navItemClass(showActive), className)}
    >
      {children}
    </button>
  )
}

/* The full-width disclosure panel — renders BELOW the bar and expands to push
   page content down when a disclosure item is open. Place it as a sibling
   directly after <NavBar>, inside the same <NavBarMenuProvider>. Styling is
   intentionally minimal here (a hairline + padding); the app tunes the rest. */
function NavBarPanel({
  className,
  isolated = false,
  ...props
}: React.ComponentProps<"div"> & {
  /** Skip publishing --navpanel-h to document.documentElement. Set this on any
      NavBarPanel that ISN'T the real page-level nav (e.g. a doc-page preview
      mounted alongside the real one) — otherwise its open/close would reach
      past its own sandboxed preview box and slide the REAL Cardboard sidebar,
      since the CSS var is inherited from the shared page root. */
  isolated?: boolean
}) {
  const { openKey, groupsFor, close, openLeft } = useNavBarMenu()
  const openItems = groupsFor(openKey)
  const open = !!openKey && !!openItems && openItems.length > 0
  const isSwitcher = openKey === "product-switcher"
  const panelRef = React.useRef<HTMLDivElement>(null)
  const contentRef = React.useRef<HTMLDivElement>(null)
  // The panel's natural content height drives its own animated height (0 →
  // content height). It's a flex sibling of the page content, so growing pushes
  // that content down — no CSS var / viewport calc needed.
  const [contentH, setContentH] = React.useState(0)

  // The product switcher pins its content under its trigger (left, next to the
  // logo) rather than centering — pad the content by (trigger left − panel
  // left). Every other disclosure ignores this and centers instead.
  const [padLeft, setPadLeft] = React.useState(0)
  React.useLayoutEffect(() => {
    if (!open || !isSwitcher || openLeft == null || !panelRef.current) { setPadLeft(0); return }
    setPadLeft(Math.max(0, openLeft - panelRef.current.getBoundingClientRect().left))
  }, [open, isSwitcher, openLeft])


  // Groups render as TABS: a row of clickable category labels, with the selected
  // category's items below. Single-group menus skip the tab row.
  const groups = openItems ?? []
  const labelledGroups = groups.filter((g) => g.label)
  const asTabs = labelledGroups.length > 1
  // No tab is ever pre-selected on open — even when the current route lives
  // in one of the tabs. Opening a level-1 item always shows level-2 tabs
  // ONLY; level-3 items require an explicit tab click. Consistent two-step
  // reveal every time, rather than sometimes jumping straight to level-3
  // depending on where you currently are.
  const [activeTab, setActiveTab] = React.useState<number | null>(null)
  React.useEffect(() => {
    if (!asTabs) return
    setActiveTab(null)
  }, [openKey]) // eslint-disable-line react-hooks/exhaustive-deps

  const shownItems = asTabs
    // A link-tab (group with href) navigates on click and shows no items below.
    ? (activeTab != null && !groups[activeTab]?.href ? groups[activeTab]?.items ?? [] : [])
    : groups.flatMap((g) => g.items)

  React.useLayoutEffect(() => {
    const el = contentRef.current
    if (!el) return
    const update = () => setContentH(el.scrollHeight)
    update()
    // Re-measure on any content reflow: tab switch, item count, font load, and
    // viewport resize (wrapping changes the height). Observe the content itself.
    const ro = new ResizeObserver(update)
    ro.observe(el)
    window.addEventListener("resize", update)
    return () => { ro.disconnect(); window.removeEventListener("resize", update) }
  }, [openKey, activeTab, shownItems.length])

  // Publish the panel's current open height as --navpanel-h on the root so
  // fixed/floating siblings that AREN'T in the flex flow (e.g. the Cardboard
  // sidebar, pinned at top-14) can offset themselves to sit BELOW the expanded
  // panel instead of being overlapped by it. In-flow content is pushed by the
  // panel's own height and ignores this var. Skipped when isolated (a doc-page
  // preview instance) — it has no real sidebar depending on it, and writing to
  // the shared root would reach past its sandboxed preview box.
  React.useEffect(() => {
    if (isolated) return
    const root = document.documentElement
    root.style.setProperty("--navpanel-h", `${open ? contentH : 0}px`)
    return () => { root.style.setProperty("--navpanel-h", "0px") }
  }, [open, contentH, isolated])

  return (
    <div
      ref={panelRef}
      data-slot="nav-bar-panel"
      data-state={open ? "open" : "closed"}
      style={{ height: open ? contentH : 0 }}
      className={cn(
        "overflow-hidden bg-background transition-[height] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]",
        className
      )}
      {...props}
    >
      <div
        ref={contentRef}
        style={{ paddingLeft: padLeft || undefined }}
        className={cn(
          "flex flex-col gap-4 px-4 pb-3 [&>div]:max-w-full",
          // The product switcher's panel stays pinned under its trigger (via
          // padLeft, computed above) — every other disclosure (Experience,
          // etc.) centers under the now-centered nav row.
          isSwitcher ? "items-start" : "items-center"
        )}
      >
        {/* Category tabs — clickable labels that swap the items shown below.
            A group with an `href` is a link-tab: it navigates directly instead
            of revealing items (e.g. a single-destination category like a CV). */}
        {asTabs && (
          <div
            className={cn(
              "flex flex-wrap items-center gap-1",
              isSwitcher ? "justify-start" : "justify-center"
            )}
          >
            {groups.map((group, gi) => {
              const tabClass = cn(
                "rounded-md px-3 py-1 text-body-sm transition-colors",
                (group.href ? group.items.some((i) => i.active) : gi === activeTab)
                  ? "text-foreground"
                  : "text-quaternary hover:text-secondary"
              )
              return group.href ? (
                <Link key={gi} href={group.href} onClick={close} className={tabClass}>
                  {group.label}
                </Link>
              ) : (
                <button
                  key={gi}
                  type="button"
                  onClick={() => setActiveTab(gi)}
                  data-active={gi === activeTab || undefined}
                  className={tabClass}
                >
                  {group.label}
                </button>
              )
            })}
          </div>
        )}

        {/* Items for the selected tab (or all items for a single-group menu).
            Only rendered once there's something to show — otherwise its
            gap-4 above reserves dead space while no tab is selected yet. */}
        {shownItems.length > 0 && (
          <div
            className={cn(
              "flex flex-wrap items-center gap-x-4 gap-y-1",
              isSwitcher ? "justify-start" : "justify-center"
            )}
          >
            {shownItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={close}
                data-active={item.active || undefined}
                className={cn(
                  "inline-flex items-center gap-2 whitespace-nowrap rounded-md px-2 py-1 text-body-sm transition-colors",
                  item.active
                    ? "text-foreground"
                    : "text-quaternary hover:text-secondary"
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>
        )}
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
  useNavBarMenuClose,
}
export type { NavBarNavMenuItem, NavBarNavMenuGroup, NavBarNavMenuData }
