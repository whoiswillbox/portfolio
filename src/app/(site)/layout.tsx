import { Suspense } from "react";
import { cookies } from "next/headers";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ContentWorkspace } from "@/components/content-workspace";
import { MobileNav } from "@/components/mobile-nav";
import { BoxSeedProvider } from "@/components/box-seed";
import { ADMIN_COOKIE, adminToken } from "@/lib/auth";

export default async function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const showLock = process.env.NODE_ENV === "development";
  const adminKey = process.env.ADMIN_KEY;
  const cookieStore = await cookies();
  const adminCookie = cookieStore.get(ADMIN_COOKIE)?.value;
  const isAdmin = Boolean(adminKey) && adminCookie === (await adminToken(adminKey!));

  return (
    <TooltipProvider>
      <SidebarProvider defaultOpen={false} className="h-full min-h-0 bg-background max-sm:bg-sidebar">
        <AppSidebar showLock={showLock} isAdmin={isAdmin} />
        <SidebarInset className="min-h-0 m-2 max-sm:m-0 bg-transparent max-sm:bg-sidebar max-sm:pb-28">
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
