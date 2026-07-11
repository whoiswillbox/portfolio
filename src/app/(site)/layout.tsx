import { Suspense } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppShell } from "@/components/app-shell";
import { MobileNav } from "@/components/mobile-nav";

export default async function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const showLock = process.env.NODE_ENV === "development";

  return (
    <TooltipProvider>
      {/* AppShell (client) renders the full-width top bar + product switcher and
          picks the sidebar by route (Cardboard vs. the portfolio nav).
          SidebarProvider uses defaultOpen=false so SSR always renders collapsed —
          matching the landing page; ContentWorkspace opens it on the client for
          non-landing pages. This avoids the data-state hydration mismatch that
          SSR-expanded caused on a full load of the landing page. */}
      <Suspense fallback={null}>
        <AppShell showLock={showLock}>{children}</AppShell>
      </Suspense>
      <div className="sm:hidden">
        <Suspense fallback={null}>
          <MobileNav />
        </Suspense>
      </div>
    </TooltipProvider>
  );
}
