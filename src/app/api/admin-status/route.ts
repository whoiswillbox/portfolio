import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ADMIN_COOKIE, adminToken } from "@/lib/auth";

// Always evaluate per-request (reads the admin cookie); never cache the result.
export const dynamic = "force-dynamic";

/** Returns whether the current request carries a valid admin cookie, so client
 *  components can gate admin-only UI (the cookie itself is HTTP-only). */
export async function GET() {
  const adminKey = process.env.ADMIN_KEY;
  const cookieStore = await cookies();
  const adminCookie = cookieStore.get(ADMIN_COOKIE)?.value;
  const isAdmin =
    Boolean(adminKey) && adminCookie === (await adminToken(adminKey!));
  return NextResponse.json({ isAdmin });
}
