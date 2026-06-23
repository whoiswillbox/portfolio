import { Suspense } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { SidebarServer } from "@/components/sidebar-server";
import { ContentWorkspace } from "@/components/content-workspace";
import { MobileNav } from "@/components/mobile-nav";
import { BoxSeedProvider } from "@/components/box-seed";

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <TooltipProvider>
      <SidebarProvider defaultOpen={false} className="h-full min-h-0 bg-background max-sm:bg-sidebar">
        <Suspense fallback={null}>
          <SidebarServer />
        </Suspense>
        <SidebarInset className="min-h-0 m-2 max-sm:m-0 bg-transparent max-sm:bg-sidebar max-sm:pb-28">
          <main className="flex flex-1 flex-col min-w-0 min-h-0">
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
