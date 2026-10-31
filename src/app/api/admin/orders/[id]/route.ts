import { eq } from "drizzle-orm";
import { z } from "zod";
import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { orders } from "@/db/schema";
import { adminApi } from "@/lib/admin";
import { body, fail } from "@/lib/http";
export const runtime = "nodejs";
export const PATCH = adminApi(async request => {
  const id = z.string().uuid().parse(new URL(request.url).pathname.split("/").pop());
  const input = z.object({ status: z.enum(["new", "shipping", "done", "cancelled"]) }).parse(await body(request));
  const [order] = await getDb().update(orders).set(input).where(eq(orders.id, id)).returning({ id: orders.id });
  if (!order) fail("NOT_FOUND", "Không tìm thấy đơn hàng.", 404);
  return NextResponse.json({ ok: true });
});
