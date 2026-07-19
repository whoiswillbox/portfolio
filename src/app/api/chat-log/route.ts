import { cookies } from "next/headers";
import { getChatLog, getFeedback, deleteChatThread } from "@/lib/chat/log";
import { ADMIN_COOKIE, adminToken } from "@/lib/auth";

// Always evaluate per-request (reads live from Redis); never cache the log.
export const dynamic = "force-dynamic";

async function requireAdmin(): Promise<boolean> {
  const adminKey = process.env.ADMIN_KEY;
  if (!adminKey) return false;
  const cookie = (await cookies()).get(ADMIN_COOKIE)?.value;
  return Boolean(cookie && cookie === (await adminToken(adminKey)));
}

/* Owner-only: returns the chat log when a valid admin cookie is present
   (set by logging in at /admin/login). */
export async function GET() {
  const adminKey = process.env.ADMIN_KEY;
  if (!adminKey) {
    return Response.json({ error: "not_configured" }, { status: 501 });
  }
  if (!(await requireAdmin())) {
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

/* Owner-only: deletes one thread — either every entry sharing a conversation
   id, or (for a one-off "solo" message, which has no conversation id) the
   single entry with a matching timestamp. Body: { conversationId } or
   { timestamp }. */
export async function DELETE(request: Request) {
  const adminKey = process.env.ADMIN_KEY;
  if (!adminKey) {
    return Response.json({ error: "not_configured" }, { status: 501 });
  }
  if (!(await requireAdmin())) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }
  let body: { conversationId?: string; timestamp?: string };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "bad_request" }, { status: 400 });
  }
  if (typeof body.conversationId === "string" && body.conversationId) {
    await deleteChatThread({ conversationId: body.conversationId });
  } else if (typeof body.timestamp === "string" && body.timestamp) {
    await deleteChatThread({ timestamp: body.timestamp });
  } else {
    return Response.json({ error: "bad_request" }, { status: 400 });
  }
  return Response.json({ ok: true });
}
