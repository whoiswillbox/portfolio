import { Suspense } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ContentWorkspace } from "@/components/content-workspace";
import { MobileNav } from "@/components/mobile-nav";
import { BoxSeedProvider } from "@/components/box-seed";

export default async function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const showLock = process.env.NODE_ENV === "development";

  return (
    <TooltipProvider>
      {/* defaultOpen=true matches the client (ContentWorkspace auto-opens the
          sidebar on every non-landing page), avoiding a hydration mismatch on
          the sidebar's data-state. */}
      <SidebarProvider defaultOpen className="h-full min-h-0 bg-background max-sm:bg-sidebar">
        <Suspense fallback={null}>
          <AppSidebar showLock={showLock} />
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
      </SidebarProvider>
      <div className="sm:hidden">
        <Suspense fallback={null}>
          <MobileNav />
        </Suspense>
      </div>
    </TooltipProvider>
  );
}
