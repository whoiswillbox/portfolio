"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"
import { EMAIL, LINKEDIN_URL, GITHUB_URL } from "@/lib/contact"

// Shared className for a footer item — same interaction states as the top-nav
// items (text-body-sm, active = text-foreground, rest = text-quaternary
// hover:text-secondary) so it reads as part of the same nav language.
const itemClass = (active: boolean) =>
  cn(
    "rounded-md px-2 py-1 text-body-sm transition-colors",
    active ? "text-foreground" : "text-quaternary hover:text-secondary"
  )

type FooterMenuKey = "theme" | "connect"

type FooterMenuContextValue = {
  openKey: FooterMenuKey | null
  toggle: (key: FooterMenuKey) => void
  close: () => void
}

const FooterMenuContext = React.createContext<FooterMenuContextValue | null>(null)

/* Coordinates the footer's Theme/Connect disclosures the same way
   NavBarMenuProvider coordinates the top nav's — at most one open at a time.
   Kept separate from NavBarMenuProvider (rather than sharing its openKey)
   because the footer's panel pushes content UP, the opposite direction of the
   nav's panel, and the two are never meant to be able to close each other. */
function FooterMenuProvider({ children }: { children: React.ReactNode }) {
  const [openKey, setOpenKey] = React.useState<FooterMenuKey | null>(null)
  const toggle = React.useCallback(
    (key: FooterMenuKey) => setOpenKey((cur) => (cur === key ? null : key)),
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

  // Close on click outside the footer + panel.
  React.useEffect(() => {
    if (!openKey) return
    const onPointerDown = (e: PointerEvent) => {
      const t = e.target as Element | null
      if (t?.closest('[data-slot="footer-panel"], footer')) return
      setOpenKey(null)
    }
    document.addEventListener("pointerdown", onPointerDown, true)
    return () => document.removeEventListener("pointerdown", onPointerDown, true)
  }, [openKey])

  // Scroll-lock while a menu is open — same as the top nav's disclosure panel,
  // so scrolling can't carry you back to the landing splash (or anywhere else)
  // while Theme/Connect is open underneath.
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
    <FooterMenuContext.Provider value={{ openKey, toggle, close }}>
      {children}
    </FooterMenuContext.Provider>
  )
}

function useFooterMenu() {
  const ctx = React.useContext(FooterMenuContext)
  if (!ctx) throw new Error("FooterTriggers/FooterPanel must be used within a FooterMenuProvider")
  return ctx
}

/* The full-width panel that expands ABOVE the footer row — a mirror of
   NavBarPanel, which expands below the nav bar and pushes content down. Here
   growing pushes the content card UP instead, since the footer sits at the
   bottom of the page (there's nothing below it to push into). Render as a
   sibling immediately BEFORE <BoxFooter>. */
function FooterPanel({ className, style }: { className?: string; style?: React.CSSProperties }) {
  const { openKey, close } = useFooterMenu()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => setMounted(true), [])
  // The panel (and its openKey state) persists across client-side navigation —
  // it lives above the routed content, not inside it. If a menu is left open
  // while navigating to a page whose content-card layout differs (e.g. a
  // narrower split view), the height measured on the PREVIOUS page can go
  // stale since openKey itself didn't change. Re-measuring on pathname changes
  // too keeps contentH honest regardless of what route it's open on.
  const pathname = usePathname()

  const open = openKey != null
  const contentRef = React.useRef<HTMLDivElement>(null)
  const [contentH, setContentH] = React.useState(0)
  React.useLayoutEffect(() => {
    const el = contentRef.current
    if (!el) return
    const update = () => setContentH(el.scrollHeight)
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    window.addEventListener("resize", update)
    return () => { ro.disconnect(); window.removeEventListener("resize", update) }
  }, [openKey, pathname])

  return (
    <div
      data-slot="footer-panel"
      data-state={open ? "open" : "closed"}
      style={{ height: open ? contentH : 0, ...style }}
      className={cn(
        "overflow-hidden bg-background transition-[height] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]",
        className
      )}
    >
      <div ref={contentRef} className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 mx-5 px-4 pt-3">
        {openKey === "theme" && (
          <>
            <button type="button" onClick={() => setTheme("light")} className={itemClass(mounted && theme === "light")}>
              Light
            </button>
            <button type="button" onClick={() => setTheme("dark")} className={itemClass(mounted && theme === "dark")}>
              Dark
            </button>
            <button type="button" onClick={() => setTheme("system")} className={itemClass(mounted && theme === "system")}>
              System
            </button>
          </>
        )}
        {openKey === "connect" && (
          <>
            <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" onClick={close} className={itemClass(false)}>
              LinkedIn
            </a>
            <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" onClick={close} className={itemClass(false)}>
              GitHub
            </a>
            <a href={`mailto:${EMAIL}`} onClick={close} className={itemClass(false)}>
              Email
            </a>
          </>
        )}
      </div>
    </div>
  )
}

/* The footer row's own triggers — © year pinned left, Theme + Connect centered
   in the row (absolute-centered so the © doesn't throw off the center, same
   pattern as the top nav's centered items). Clicking a trigger opens
   FooterPanel (rendered above this row) with that group's items; clicking the
   open one closes it again. */
function FooterTriggers() {
  const { openKey, toggle } = useFooterMenu()
  return (
    <>
      <p className="font-mono text-body-xs text-quaternary">
        © {new Date().getFullYear()}
      </p>
      <div className="absolute left-1/2 flex -translate-x-1/2 items-center gap-4">
        <button
          type="button"
          onClick={() => toggle("theme")}
          aria-expanded={openKey === "theme"}
          className={itemClass(openKey === "theme")}
        >
          Theme
        </button>
        <button
          type="button"
          onClick={() => toggle("connect")}
          aria-expanded={openKey === "connect"}
          className={itemClass(openKey === "connect")}
        >
          Connect
        </button>
      </div>
    </>
  )
}

// Box product footer: © year on the left, a Theme + Connect disclosure on the
// right. Both expand FooterPanel above this row (pushing the content card up)
// rather than a dropdown — same push-panel language as the top nav, mirrored.
export function BoxFooter({
  isLanding = false,
  className,
  style,
}: {
  isLanding?: boolean
  className?: string
  style?: React.CSSProperties
}) {
  return (
    <FooterMenuProvider>
      <FooterPanel
        style={style}
        className={cn(isLanding && "max-sm:hidden")}
      />
      <FooterRow isLanding={isLanding} style={style} className={className} />
    </FooterMenuProvider>
  )
}

/* The footer's own <footer> element — split out so it can read openKey (via
   useFooterMenu) to add a small gap below FooterPanel ONLY while a panel is
   open. Keeping that off the resting/closed row means this gap can never leak
   onto the plain footer (e.g. on the landing splash where no panel is ever
   open behind the fade-in).

   On landing this ALSO measures its own natural (content) height and scales
   THAT by --enter-progress, instead of a hardcoded rem value — so the fade-in
   height always matches whatever is actually inside the row (© + triggers,
   plus the open-panel gap), on every page, with no separate number to keep in
   sync by hand. */
function FooterRow({
  isLanding,
  className,
  style,
}: {
  isLanding: boolean
  className?: string
  style?: React.CSSProperties
}) {
  const { openKey } = useFooterMenu()
  // Measured off a plain, UNSTYLED inner wrapper — never the height-scaled
  // <footer> itself — so measuring can't feed back into what it's measuring
  // (the earlier version toggled the footer's own inline height to "auto" to
  // measure it, which raced with the ResizeObserver watching that same
  // element and could settle on a stale/sliver value).
  const contentRef = React.useRef<HTMLDivElement>(null)
  const [rowH, setRowH] = React.useState(0)
  React.useLayoutEffect(() => {
    if (!isLanding) return
    const el = contentRef.current
    if (!el) return
    const update = () => setRowH(el.scrollHeight)
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    window.addEventListener("resize", update)
    return () => { ro.disconnect(); window.removeEventListener("resize", update) }
  }, [isLanding, openKey])

  return (
    <footer
      className={cn(
        "mx-5 max-sm:hidden",
        // On landing the footer fades in with the scroll into Box AI, tracking
        // the same --enter-progress signal as the nav reveal. nav-splash-inert +
        // data-splash keep it non-interactive until it's revealed. Its height
        // also grows 0 → full with progress so it doesn't steal space from the
        // full-bleed splash card at rest. Off-landing it's a static row (auto
        // height — the inner content div's own padding sets it).
        isLanding && "overflow-hidden nav-splash-inert",
        // Smoothly slide the left inset (Cardboard: footer insets by the sidebar
        // width when it opens, matching the content card's slide).
        "transition-[padding] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]",
        className
      )}
      style={{
        ...(isLanding
          ? {
              opacity: "var(--enter-progress, 0)",
              height: `calc(${rowH}px * var(--enter-progress, 0))`,
            }
          : undefined),
        ...style,
      }}
    >
      {/* The measured content — relative so Theme/Connect can absolute-center
          against it regardless of the © text's width. pt-3/pb-3 is the
          footer's padding (breathing room from the content card above, and
          from the panel above it when a menu is open — matches the gap
          between the top nav's parent items and its sub-items panel). */}
      <div ref={contentRef} className="relative flex items-center pt-3 pb-3">
        <FooterTriggers />
      </div>
    </footer>
  )
}
