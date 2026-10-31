import { randomUUID } from "node:crypto";
import { desc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { z } from "zod";
import { getDb } from "@/db";
import { otpCodes, resetTokens } from "@/db/schema";
import { api, body, fail } from "@/lib/http";
import { checkOtp } from "@/lib/otp";
import { signToken } from "@/lib/session";
import { phoneSchema, utmSchema } from "@/lib/validation";
export const runtime = "nodejs";
export const POST = api(async (request) => {
  const input = z
    .object({
      phone: phoneSchema,
      otp: z.string().regex(/^\d{6}$/, "Mã OTP gồm 6 số."),
      utm: utmSchema,
    })
    .parse(await body(request));
  const result = await getDb().transaction(async (tx) => {
    const [record] = await tx
      .select()
      .from(otpCodes)
      .where(eq(otpCodes.phone, input.phone))
      .orderBy(desc(otpCodes.createdAt))
      .limit(1)
      .for("update");
    if (!record) return { error: "OTP_INVALID" };
    const error = checkOtp(record, input.phone, input.otp);
    if (error) {
      if (error === "OTP_INVALID" && !record.usedAt)
        await tx
          .update(otpCodes)
          .set({ attempts: record.attempts + 1 })
          .where(eq(otpCodes.id, record.id));
      return {
        error:
          error === "OTP_INVALID" && record.attempts >= 4
            ? "TOO_MANY_ATTEMPTS"
            : error,
      };
    }
    const id = randomUUID();
    await tx
      .update(otpCodes)
      .set({ usedAt: new Date() })
      .where(eq(otpCodes.id, record.id));
    await tx
      .insert(resetTokens)
      .values({
        id,
        phone: input.phone,
        expiresAt: new Date(Date.now() + 600000),
      });
    return {
      token: await signToken({ phone: input.phone, jti: id }, "reset", "10m"),
    };
  });
  if (result.error)
    fail(
      result.error,
      result.error === "OTP_EXPIRED"
        ? "Mã OTP đã hết hạn. Vui lòng yêu cầu mã mới."
        : result.error === "TOO_MANY_ATTEMPTS"
          ? "Bạn đã nhập sai quá 5 lần. Vui lòng yêu cầu mã mới."
          : "Mã OTP không hợp lệ.",
      result.error === "TOO_MANY_ATTEMPTS" ? 429 : 400,
    );
  return NextResponse.json({ ok: true, resetToken: result.token });
}, true);
