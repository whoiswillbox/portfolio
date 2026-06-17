import { cookies } from "next/headers";
import { getFeedback } from "@/lib/chat/log";
import { ADMIN_COOKIE, adminToken } from "@/lib/auth";

/* Owner-only: returns the thumbs up/down feedback log when a valid admin
   cookie is present (set by logging in at /admin/login). */
export async function GET() {
  const adminKey = process.env.ADMIN_KEY;
  if (!adminKey) {
    return Response.json({ error: "not_configured" }, { status: 501 });
  }
  const cookie = (await cookies()).get(ADMIN_COOKIE)?.value;
  if (!cookie || cookie !== (await adminToken(adminKey))) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }
  return Response.json({ log: await getFeedback(200) });
}
