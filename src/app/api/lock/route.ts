import { NextResponse } from "next/server";
import { AUTH_COOKIE } from "@/lib/auth";

/* Clears the auth cookie, re-locking the site. */
export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(AUTH_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
    secure: process.env.NODE_ENV === "production",
  });
  return res;
}
