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
  // Show the lock button only in local dev (never on the deployed site), and
  // only when the gate is actually active.
  const showLock = process.env.NODE_ENV === "development";

  // Only the owner (valid admin cookie) sees the Admin nav item.
  const adminKey = process.env.ADMIN_KEY;
  const cookieStore = await cookies();
  const adminCookie = cookieStore.get(ADMIN_COOKIE)?.value;
  const isAdmin = Boolean(adminKey) && adminCookie === (await adminToken(adminKey!));

  // Always start closed — content-workspace opens it once the user enters the app.
  // This ensures the landing page never shows the sidebar even if the cookie is set.
  const sidebarDefaultOpen = false;

  return (
    <TooltipProvider>
      <SidebarProvider defaultOpen={sidebarDefaultOpen} className="h-full min-h-0 bg-background max-sm:bg-sidebar">
        <AppSidebar showLock={showLock} isAdmin={isAdmin} />
        <SidebarInset className="min-h-0 m-2 max-sm:m-0 bg-transparent max-sm:bg-sidebar max-sm:pb-28">
          {/* No overflow-hidden here: it would clip the content cards' drop
              shadows and rounded corners. The cards manage their own scroll.
              ContentWorkspace surfaces the sidebar trigger + Box AI launcher
              inside the content card. */}
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
