import { cookies } from "next/headers";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ChatPanel } from "@/components/chat-panel";
import { ADMIN_COOKIE, adminToken } from "@/lib/auth";

export default async function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Show the lock button only in local dev (never on the deployed site), and
  // only when the gate is actually active.
  const showLock =
    process.env.NODE_ENV === "development" && Boolean(process.env.SITE_PASSWORD);

  // Only the owner (valid admin cookie) sees the Admin nav item.
  const adminKey = process.env.ADMIN_KEY;
  const adminCookie = (await cookies()).get(ADMIN_COOKIE)?.value;
  const isAdmin = Boolean(adminKey) && adminCookie === (await adminToken(adminKey!));

  return (
    <TooltipProvider>
      <SidebarProvider className="h-full min-h-0">
        <AppSidebar showLock={showLock} isAdmin={isAdmin} />
        <SidebarInset className="min-h-0">
          <div className="flex flex-1 min-h-0">
            <div className="flex flex-1 flex-col min-w-0">
              <header className="flex h-12 items-center px-4 border-b">
                <SidebarTrigger />
              </header>
              <main className="flex-1 min-h-0 overflow-auto p-6">{children}</main>
            </div>
            <ChatPanel />
          </div>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
