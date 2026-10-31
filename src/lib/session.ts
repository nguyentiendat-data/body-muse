import { cookies } from "next/headers";
import { jwtVerify, SignJWT } from "jose";
import type { User } from "@/types/api";

export function sessionKey() {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) throw new Error("Chưa cấu hình khóa phiên an toàn.");
  return new TextEncoder().encode(secret);
}
export async function signToken(payload: Record<string, unknown>, purpose: string, expiry: string) {
  return new SignJWT({ ...payload, purpose }).setProtectedHeader({ alg: "HS256" }).setIssuedAt().setExpirationTime(expiry).sign(sessionKey());
}
export async function readToken(token: string, purpose: string) {
  const { payload } = await jwtVerify(token, sessionKey(), { algorithms: ["HS256"] });
  if (payload.purpose !== purpose) throw new Error("Phiên không hợp lệ.");
  return payload;
}
export async function currentUser(): Promise<User | null> {
  const cookie = (await cookies()).get("bm_session")?.value;
  if (!cookie) return null;
  try {
    const payload = await readToken(cookie, "customer");
    if (typeof payload.id !== "string" || typeof payload.phone !== "string") return null;
    return { id: payload.id, phone: payload.phone };
  } catch { return null; }
}
