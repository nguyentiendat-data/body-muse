import { createHmac, timingSafeEqual } from "node:crypto";
import { sessionKey } from "./session";
export function hashOtp(phone: string, code: string) {
  return createHmac("sha256", sessionKey())
    .update(`${phone}:${code}`)
    .digest("hex");
}
export function checkOtp(
  record: {
    codeHash: string;
    expiresAt: Date;
    attempts: number;
    usedAt: Date | null;
  },
  phone: string,
  code: string,
  now = new Date(),
) {
  if (record.usedAt) return "OTP_INVALID";
  if (record.attempts >= 5) return "TOO_MANY_ATTEMPTS";
  if (record.expiresAt <= now) return "OTP_EXPIRED";
  const actual = Buffer.from(hashOtp(phone, code), "hex");
  const expected = Buffer.from(record.codeHash, "hex");
  return actual.length === expected.length && timingSafeEqual(actual, expected)
    ? null
    : "OTP_INVALID";
}
