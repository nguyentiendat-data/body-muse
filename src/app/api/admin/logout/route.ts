import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { adminApi } from "@/lib/admin";
export const runtime = "nodejs";
export const POST = adminApi(async () => { (await cookies()).set("bm_admin", "", { httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: 0 }); return NextResponse.json({ ok: true }); });
