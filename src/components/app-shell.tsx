"use client"

import { Suspense } from "react"
import { usePathname } from "next/navigation"
import { NavBar, NavBarLogo } from "@/components/cardboard/nav-bar"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { CardboardSidebar } from "@/components/cardboard-sidebar"
import { BoxNavItems } from "@/components/box-nav-items"
import { ProductSwitcher } from "@/components/product-switcher"
import { BoxLogo } from "@/components/box-logo"
import { ContentWorkspace } from "@/components/content-workspace"
import { BoxSeedProvider } from "@/components/box-seed"

export function AppShell({
  showLock = false,
  children,
}: {
  showLock?: boolean
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const inCardboard = pathname.startsWith("/cardboard")
  // TRIAL (try/nav-bar-shell, one-page model): "/" now hosts the live Box AI with
  // a splash OVERLAY on top (fixed, full-viewport) — so "/" uses the SAME layout
  // as /who (topbar reserved, Box AI centered). The nav bar just fades its opacity
  // via --enter-progress while the splash is up. No special full-bleed casing.
  const isLanding = pathname === "/"
  // Box home is "/" — it already hosts the live (warm) Box AI in the one-page
  // model, so keeping the home there avoids remounting the heavy Box AI on every
  // nav (which caused first-scroll lag). The ?box-home=1 marker tells "/" to skip
  // the landing splash and show Box AI directly (the logo must NOT re-show the
  // splash); "/" strips the marker after reading it.
  const home = inCardboard
    ? { name: "Cardboard", href: "/cardboard/foundations" }
    : { name: "Box", href: "/?box-home=1" }

  return (
    // --topbar-h is consumed by ContentWorkspace/BoxAI, which need an explicit
    // pixel height (100dvh minus the top bar) for their h-full to resolve.
    // 0 on mobile (no top bar) and on the landing splash (full-bleed, nav bar
    // overlays); 3.5rem on desktop everywhere else where the header shows.
    <div
      className="flex h-svh flex-col overflow-hidden [--topbar-h:0px] sm:[--topbar-h:3.5rem]"
    >
      {/* Full-width top bar (Tailwind-docs style): the Box logo home link + the
          product switcher pill. Desktop only — mobile uses MobileNav. Sits
          ABOVE the SidebarProvider so the provider keeps its original row
          layout / height behavior unchanged. Hidden on the landing splash. */}
      {/* TRIAL (try/nav-bar-shell): the nav bar renders on the landing page too,
          but fades in with the scroll scrub (via --enter-progress the landing
          page publishes) so it's already present at commit → no pop into /who.
          Off the landing route the var is absent, so opacity falls back to 1.
          On landing it OVERLAYS absolutely (full-bleed splash keeps --topbar-h:0,
          no reserved white gap); it just fades in over the splash. */}
      <NavBar
        className={`max-sm:hidden ${inCardboard ? "" : "border-b-0"}`}
        style={isLanding ? { opacity: "var(--enter-progress, 0)" } : undefined}
      >
        <NavBarLogo href={home.href} aria-label={home.name}>
          <BoxLogo className="size-6" />
        </NavBarLogo>
        <ProductSwitcher />
        {/* Box nav lives in the top bar instead of the left sidebar.
            Cardboard keeps its own sidebar. */}
        {!inCardboard && <BoxNavItems />}
      </NavBar>

      <SidebarProvider
        defaultOpen={false}
        className="!min-h-0 flex-1 bg-background max-sm:bg-sidebar"
      >
        <Suspense fallback={null}>
          {inCardboard ? (
            <CardboardSidebar />
          ) : (
            // TRIAL (try/nav-bar-shell): the Box desktop sidebar is replaced by
            // the top-nav (BoxNavItems above), so AppSidebar is not rendered for
            // Box. (AppSidebar was desktop-only — `max-sm:hidden` — so mobile is
            // unaffected; MobileNav handles mobile Box navigation separately.)
            null
          )}
        </Suspense>
        <SidebarInset className={`min-h-0 flex-1 m-2 max-sm:m-0 bg-transparent max-sm:bg-sidebar ${!inCardboard && !isLanding ? "sm:mt-0" : ""}`}>
          <main className="flex flex-1 flex-col min-w-0 min-h-0 h-full">
            <BoxSeedProvider>
              <Suspense fallback={null}>
                <ContentWorkspace>{children}</ContentWorkspace>
              </Suspense>
            </BoxSeedProvider>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}
