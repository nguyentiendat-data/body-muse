import { createHash } from "node:crypto";
import { eq, sql } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { rateLimits, users } from "@/db/schema";
import { loginSchema, setUserCookie } from "@/lib/auth";
import { api, body, fail, ipKey } from "@/lib/http";
import { verifyPassword } from "@/lib/password";
export const runtime = "nodejs";
export const POST = api(async request => {
  const input = loginSchema.parse(await body(request));
  const key = `login:${createHash("sha256").update(input.phone).digest("hex")}:${ipKey(request)}`;
  const db = getDb();
  const result = await db.transaction(async tx => {
    await tx.execute(sql`select pg_advisory_xact_lock(hashtext(${key}))`);
    const [limit] = await tx.select().from(rateLimits).where(eq(rateLimits.key, key));
    if (limit && limit.expiresAt > new Date() && limit.count >= 5) return { blocked: true } as const;
    const [user] = await tx.select().from(users).where(eq(users.phone, input.phone));
    // Perform scrypt even for an unknown phone to avoid a timing shortcut.
    const valid = await verifyPassword(input.password, user?.passwordHash || `${"0".repeat(32)}:${"0".repeat(128)}`);
    if (!user || !valid) {
      const count = limit && limit.expiresAt > new Date() ? limit.count + 1 : 1;
      await tx.insert(rateLimits).values({ key, count, expiresAt: new Date(Date.now() + 15 * 60000) }).onConflictDoUpdate({ target: rateLimits.key, set: { count, expiresAt: new Date(Date.now() + 15 * 60000) } });
      return { blocked: count >= 5 } as const;
    }
    await tx.delete(rateLimits).where(eq(rateLimits.key, key));
    return { user: { id: user.id, phone: user.phone } };
  });
  if (!result.user) fail(result.blocked ? "TOO_MANY_ATTEMPTS" : "BAD_CREDENTIALS", result.blocked ? "Bạn đã nhập sai quá nhiều lần. Vui lòng thử lại sau 15 phút." : "Số điện thoại hoặc mật khẩu chưa đúng.", result.blocked ? 429 : 401);
  await setUserCookie(result.user);
  return NextResponse.json({ user: result.user });
}, true);
