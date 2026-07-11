"use client"

import { Suspense } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { CubeIcon, SwatchIcon } from "@heroicons/react/24/solid"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { CardboardSidebar } from "@/components/cardboard-sidebar"
import { ProductSwitcher } from "@/components/product-switcher"
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
  const home = inCardboard
    ? { name: "Cardboard", href: "/cardboard/foundations", Icon: SwatchIcon }
    : { name: "Box", href: "/who", Icon: CubeIcon }

  return (
    <SidebarProvider
      defaultOpen={false}
      className="h-full min-h-0 flex-col bg-background max-sm:bg-sidebar"
    >
      {/* Full-width top bar (Tailwind-docs style): sidebar collapse trigger,
          wordmark home link, then the product switcher pill. Desktop only —
          mobile uses MobileNav. Inside SidebarProvider so the trigger can
          read/toggle sidebar state. */}
      <header className="flex h-14 shrink-0 items-center gap-3 border-b border-border/60 bg-background px-4 max-sm:hidden">
        <Link
          href={home.href}
          className="flex items-center gap-2 rounded-md text-foreground outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
        >
          <home.Icon className="size-5" />
          <span className="font-heading text-base font-semibold">{home.name}</span>
        </Link>
        <ProductSwitcher />
      </header>

      <div className="flex min-h-0 flex-1">
        <Suspense fallback={null}>
          {inCardboard ? (
            <CardboardSidebar />
          ) : (
            <AppSidebar showLock={showLock} />
          )}
        </Suspense>
        <SidebarInset className="h-full min-h-0 m-2 max-sm:m-0 max-sm:h-full sm:h-[calc(100%-1rem)] bg-transparent max-sm:bg-sidebar">
          <main className="flex flex-1 flex-col min-w-0 min-h-0 h-full">
            <BoxSeedProvider>
              <Suspense fallback={null}>
                <ContentWorkspace>{children}</ContentWorkspace>
              </Suspense>
            </BoxSeedProvider>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
