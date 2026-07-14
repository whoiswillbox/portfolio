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
  // TRIAL (try/nav-bar-shell, one-page model): "/" hosts the live Box AI inside a
  // content card with the splash overlaying it (contained in the card, not
  // full-viewport). The landing page has NO nav bar — the card fills to the top
  // (--topbar-h:0), and the nav bar is hidden here.
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
      className={`relative flex h-svh flex-col overflow-hidden [--topbar-h:0px] ${isLanding ? "sm:[--topbar-h:calc(3.5rem*var(--enter-progress,0))]" : "sm:[--topbar-h:3.5rem]"}`}
    >
      {/* Full-width top bar (Tailwind-docs style): the Box logo home link + the
          product switcher pill. Desktop only — mobile uses MobileNav. Sits
          ABOVE the SidebarProvider so the provider keeps its original row
          layout / height behavior unchanged.

          On the landing page the nav bar is present from the start but hidden
          BEHIND the content card (which fills the viewport at rest). As you
          scroll landing → Box AI, --enter-progress rises 0→1, growing --topbar-h
          from 0→3.5rem, which slides the card down to EXPOSE the nav bar. */}
      <NavBar
        className={`max-sm:hidden ${inCardboard ? "" : "border-b-0"} ${isLanding ? "absolute inset-x-0 top-0 z-20" : ""}`}
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
        className={`!min-h-0 flex-1 max-sm:bg-sidebar ${isLanding ? "z-10 bg-transparent pt-[var(--topbar-h)]" : "bg-background"}`}
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
        <SidebarInset
          className={`min-h-0 flex-1 m-2 max-sm:m-0 bg-transparent max-sm:bg-sidebar ${!inCardboard && !isLanding ? "sm:mt-0" : ""}`}
          // Landing: keep the top margin on the splash (looks like a floating
          // card), then collapse it to 0 as you scroll into the Box product so
          // the card sits flush under the revealed nav bar. Driven by
          // --enter-progress (0→1), same signal as the nav reveal.
          style={
            isLanding
              ? { marginTop: "calc(0.5rem * (1 - var(--enter-progress, 0)))" }
              : undefined
          }
        >
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
