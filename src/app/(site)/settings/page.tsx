import { cookies } from "next/headers";
import { SettingsList } from "@/components/settings-list";
import { ADMIN_COOKIE, adminToken } from "@/lib/auth";

export default async function SettingsPage() {
  const adminKey = process.env.ADMIN_KEY;
  const cookieStore = await cookies();
  const adminCookie = cookieStore.get(ADMIN_COOKIE)?.value;
  const isAdmin =
    Boolean(adminKey) && adminCookie === (await adminToken(adminKey!));

  return <SettingsList isAdmin={isAdmin} />;
}
