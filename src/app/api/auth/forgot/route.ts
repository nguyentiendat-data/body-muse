import { randomInt } from "node:crypto";
import { and, desc, eq, gt, sql } from "drizzle-orm";
import { NextResponse } from "next/server";
import { z } from "zod";
import { getDb } from "@/db";
import { otpCodes } from "@/db/schema";
import { api, body, fail } from "@/lib/http";
import { hashOtp } from "@/lib/otp";
import { sendSms } from "@/lib/sms";
import { phoneSchema, utmSchema } from "@/lib/validation";
export const runtime = "nodejs";
export const POST = api(async request => {
  const { phone } = z.object({ phone: phoneSchema, utm: utmSchema }).parse(await body(request));
  await getDb().transaction(async tx => {
    await tx.execute(sql`select pg_advisory_xact_lock(hashtext(${`otp:${phone}`}))`);
    const recent = await tx.select().from(otpCodes).where(and(eq(otpCodes.phone, phone), gt(otpCodes.createdAt, new Date(Date.now() - 3600000)))).orderBy(desc(otpCodes.createdAt));
    if (recent.length >= 3 || (recent[0] && recent[0].createdAt.getTime() > Date.now() - 60000)) fail("TOO_MANY_ATTEMPTS", "Vui lòng chờ trước khi yêu cầu mã mới.", 429);
    const code = process.env.OTP_MODE === "sms" ? String(randomInt(0, 1000000)).padStart(6, "0") : "123456";
    // Issue the same response and limits for known and unknown numbers.
    if (process.env.OTP_MODE === "sms") await sendSms(phone, `Ma BODY MUSE: ${code}. Hieu luc 5 phut.`);
    await tx.insert(otpCodes).values({ phone, codeHash: hashOtp(phone, code), expiresAt: new Date(Date.now() + 300000) });
  });
  return NextResponse.json({ ok: true, resendAfterSec: 60 });
}, true);
