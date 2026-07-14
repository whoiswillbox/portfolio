"use client"

import { Suspense } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { CardboardSidebar } from "@/components/cardboard-sidebar"
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
        <header className="flex h-14 shrink-0 items-center gap-0 border-b border-border/60 bg-background px-4 max-sm:hidden">
          <Link
            href={home.href}
            aria-label={home.name}
            className="flex items-center rounded-md text-foreground outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
          >
            <BoxLogo className="size-6" />
          </Link>
          <ProductSwitcher />
        </header>
      )}

      <SidebarProvider
        defaultOpen={false}
        className="!min-h-0 flex-1 bg-background max-sm:bg-sidebar"
      >
        <Suspense fallback={null}>
          {inCardboard ? (
            <CardboardSidebar />
          ) : (
            <AppSidebar showLock={showLock} />
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
