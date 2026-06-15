import { getChatLog } from "@/lib/chat/log";

/* Owner-only: returns the chat log when the correct ?key= is supplied.
   Set ADMIN_KEY in env to enable. */
export async function GET(request: Request) {
  const adminKey = process.env.ADMIN_KEY;
  if (!adminKey) {
    return Response.json({ error: "not_configured" }, { status: 501 });
  }
  const key = new URL(request.url).searchParams.get("key");
  if (key !== adminKey) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }
  return Response.json({ log: await getChatLog(200) });
}
