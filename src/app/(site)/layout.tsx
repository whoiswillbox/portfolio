import { Suspense } from "react";
import { cookies } from "next/headers";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ContentWorkspace } from "@/components/content-workspace";
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

  // Respect the persisted sidebar state; default closed so the landing page
  // starts without the sidebar, and opens once the user enters the app.
  const sidebarCookie = cookieStore.get("sidebar_state")?.value;
  const sidebarDefaultOpen = sidebarCookie === undefined ? false : sidebarCookie === "true";

  return (
    <TooltipProvider>
      <SidebarProvider defaultOpen={sidebarDefaultOpen} className="h-full min-h-0 bg-background">
        <AppSidebar showLock={showLock} isAdmin={isAdmin} />
        <SidebarInset className="min-h-0 m-2 bg-transparent">
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
    </TooltipProvider>
  );
}
