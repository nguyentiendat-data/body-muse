import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { api } from "@/lib/http";
export const runtime = "nodejs";
export const POST = api(async () => {
  (await cookies()).set("bm_session", "", { httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: 0 });
  return NextResponse.json({ ok: true });
}, true);
