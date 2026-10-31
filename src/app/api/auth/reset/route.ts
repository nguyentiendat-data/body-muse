import { and, eq, gt, isNull, sql } from "drizzle-orm";
import { NextResponse } from "next/server";
import { z } from "zod";
import { getDb } from "@/db";
import { resetTokens, users } from "@/db/schema";
import { passwordSchema } from "@/lib/auth";
import { api, body, fail } from "@/lib/http";
import { hashPassword } from "@/lib/password";
import { readToken } from "@/lib/session";
import { phoneSchema, utmSchema } from "@/lib/validation";
export const runtime = "nodejs";
export const POST = api(async (request) => {
  const input = z
    .object({
      phone: phoneSchema,
      resetToken: z.string().max(2000),
      password: passwordSchema,
      confirmPassword: z.string(),
      utm: utmSchema,
    })
    .refine((value) => value.password === value.confirmPassword, {
      message: "Mật khẩu nhập lại chưa khớp.",
      path: ["confirmPassword"],
    })
    .parse(await body(request));
  let payload;
  try {
    payload = await readToken(input.resetToken, "reset");
  } catch {
    fail("OTP_INVALID", "Phiên đổi mật khẩu không hợp lệ hoặc đã hết hạn.");
  }
  if (
    payload.phone !== input.phone ||
    typeof payload.jti !== "string" ||
    !z.string().uuid().safeParse(payload.jti).success
  )
    fail("OTP_INVALID", "Phiên đổi mật khẩu không hợp lệ.");
  const hash = await hashPassword(input.password);
  await getDb().transaction(async (tx) => {
    const [token] = await tx
      .update(resetTokens)
      .set({ usedAt: new Date() })
      .where(
        and(
          eq(resetTokens.id, payload.jti!),
          eq(resetTokens.phone, input.phone),
          isNull(resetTokens.usedAt),
          gt(resetTokens.expiresAt, new Date()),
        ),
      )
      .returning();
    if (!token)
      fail("OTP_INVALID", "Phiên đổi mật khẩu đã hết hạn hoặc đã được dùng.");
    await tx
      .update(users)
      .set({ passwordHash: hash })
      .where(eq(users.phone, input.phone));
    await tx
      .delete(resetTokens)
      .where(
        and(
          eq(resetTokens.phone, input.phone),
          sql`${resetTokens.id} <> ${token.id}`,
        ),
      );
  });
  return NextResponse.json({ ok: true });
}, true);
