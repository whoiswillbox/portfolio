import { cookies } from "next/headers";
import { getChatLog, getFeedback } from "@/lib/chat/log";
import { ADMIN_COOKIE, adminToken } from "@/lib/auth";

// Always evaluate per-request (reads live from Redis); never cache the log.
export const dynamic = "force-dynamic";

/* Owner-only: returns the chat log when a valid admin cookie is present
   (set by logging in at /admin/login). */
export async function GET() {
  const adminKey = process.env.ADMIN_KEY;
  if (!adminKey) {
    return Response.json({ error: "not_configured" }, { status: 501 });
  }
  const cookie = (await cookies()).get(ADMIN_COOKIE)?.value;
  if (!cookie || cookie !== (await adminToken(adminKey))) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }
  // Comma-separated hashed IPs (see hashIp in lib/chat/log.ts) that belong to
  // the site owner, testing the assistant — lets the log tell "it's me"
  // apart from an actual returning visitor. Optional; empty if unset.
  const ownerIps = (process.env.OWNER_IP_HASHES ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  // Feedback (thumbs up/down) is a separate log, keyed loosely by
  // conversation id + question/answer text — joined client-side so the
  // transcript view can show whether each answer was rated.
  return Response.json({ log: await getChatLog(200), feedback: await getFeedback(200), ownerIps });
}
