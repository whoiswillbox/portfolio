import { logFeedback, hashIp } from "@/lib/chat/log";

/* ============================================================================
   Feedback API — records a thumbs up/down on an AI answer into Upstash.
   No Anthropic key needed; no-ops if Upstash isn't configured.
   ========================================================================== */

export async function POST(request: Request) {
  let body: {
    conversationId?: string;
    question?: string;
    answer?: string;
    rating?: string;
    feedback?: string;
  };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "bad_request" }, { status: 400 });
  }

  const rating = body.rating;
  if (rating !== "up" && rating !== "down") {
    return Response.json({ error: "bad_request" }, { status: 400 });
  }

  const ipRaw = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const city = request.headers.get("x-vercel-ip-city");

  await logFeedback({
    t: new Date().toISOString(),
    c: typeof body.conversationId === "string" ? body.conversationId.slice(0, 64) : undefined,
    q: typeof body.question === "string" ? body.question.slice(0, 300) : undefined,
    a: typeof body.answer === "string" ? body.answer.slice(0, 300) : "",
    rating,
    feedback: typeof body.feedback === "string" ? body.feedback.slice(0, 500) : undefined,
    country: request.headers.get("x-vercel-ip-country") ?? undefined,
    city: city ? decodeURIComponent(city) : undefined,
    ip: ipRaw ? await hashIp(ipRaw) : undefined,
  });

  return Response.json({ ok: true });
}
