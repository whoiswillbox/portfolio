import { NextResponse } from "next/server";
import { ENTERED_COOKIE, ENTERED_TTL_MS } from "@/proxy";

export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ENTERED_COOKIE, String(Date.now()), {
    path: "/",
    maxAge: ENTERED_TTL_MS / 1000,
    sameSite: "lax",
  });
  return res;
}
