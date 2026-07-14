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
  // The landing page (/) is a full-bleed splash — no top bar, no sidebar chrome.
  const isLanding = pathname === "/"
  const home = inCardboard
    ? { name: "Cardboard", href: "/cardboard/foundations" }
    : { name: "Box", href: "/who" }

  return (
    // --topbar-h is consumed by ContentWorkspace/BoxAI, which need an explicit
    // pixel height (100dvh minus the top bar) for their h-full to resolve.
    // 0 on mobile (no top bar) and on the landing page (top bar hidden);
    // 3.5rem on desktop everywhere else where the header shows.
    <div
      className={`flex h-svh flex-col overflow-hidden [--topbar-h:0px] ${
        isLanding ? "" : "sm:[--topbar-h:3.5rem]"
      }`}
    >
      {/* Full-width top bar (Tailwind-docs style): the Box logo home link + the
          product switcher pill. Desktop only — mobile uses MobileNav. Sits
          ABOVE the SidebarProvider so the provider keeps its original row
          layout / height behavior unchanged. Hidden on the landing splash. */}
      {!isLanding && (
        <NavBar className="max-sm:hidden">
          <NavBarLogo href={home.href} aria-label={home.name}>
            <BoxLogo className="size-6" />
          </NavBarLogo>
          <ProductSwitcher />
          {/* TRIAL (try/nav-bar-shell): Box nav lives in the top bar instead of
              the left sidebar. Cardboard keeps its own sidebar. */}
          {!inCardboard && <BoxNavItems />}
        </NavBar>
      )}

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
        <SidebarInset className="min-h-0 flex-1 m-2 max-sm:m-0 bg-transparent max-sm:bg-sidebar">
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
