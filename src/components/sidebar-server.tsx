import { cookies } from "next/headers";
import { AppSidebar } from "@/components/app-sidebar";
import { ADMIN_COOKIE, adminToken } from "@/lib/auth";

export async function SidebarServer() {
  const showLock = process.env.NODE_ENV === "development";
  const adminKey = process.env.ADMIN_KEY;
  const cookieStore = await cookies();
  const adminCookie = cookieStore.get(ADMIN_COOKIE)?.value;
  const isAdmin = Boolean(adminKey) && adminCookie === (await adminToken(adminKey!));

  return <AppSidebar showLock={showLock} isAdmin={isAdmin} />;
}
