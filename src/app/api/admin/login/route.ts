import { createHash, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";
import { api, body, fail } from "@/lib/http";
import { signToken } from "@/lib/session";
export const runtime = "nodejs";
export const POST = api(async request => {
  const { password } = z.object({ password: z.string().max(200) }).parse(await body(request));
  if (!process.env.ADMIN_PASSWORD) fail("UNAVAILABLE", "Chưa cấu hình tài khoản quản trị.");
  const digest = (value: string) => createHash("sha256").update(value).digest();
  if (!timingSafeEqual(digest(password), digest(process.env.ADMIN_PASSWORD))) fail("BAD_CREDENTIALS", "Mật khẩu chưa đúng.", 401);
  (await cookies()).set("bm_admin", await signToken({}, "admin", "7d"), { httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: 7 * 86400 });
  return NextResponse.json({ ok: true });
}, true);
