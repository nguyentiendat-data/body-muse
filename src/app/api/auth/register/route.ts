import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { users } from "@/db/schema";
import { api, body, fail } from "@/lib/http";
import { registerSchema, setUserCookie } from "@/lib/auth";
import { hashPassword } from "@/lib/password";
export const runtime = "nodejs";
export const POST = api(async (request) => {
  const input = registerSchema.parse(await body(request));
  const [user] = await getDb()
    .insert(users)
    .values({
      phone: input.phone,
      passwordHash: await hashPassword(input.password),
    })
    .onConflictDoNothing()
    .returning({ id: users.id, phone: users.phone });
  if (!user) fail("PHONE_TAKEN", "Số điện thoại này đã có tài khoản.");
  await setUserCookie(user);
  return NextResponse.json({ user }, { status: 201 });
}, true);
