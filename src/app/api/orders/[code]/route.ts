import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { orders, orderItems } from "@/db/schema";
import { api, fail, ipKey, rateLimit } from "@/lib/http";
import { phoneSchema } from "@/lib/validation";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const GET = api(async (request) => {
  await rateLimit(`track:${ipKey(request)}`, 10);
  const url = new URL(request.url);
  const phone = phoneSchema.parse(url.searchParams.get("phone"));
  const code = url.pathname.split("/").pop() || "";
  const db = getDb();
  const [order] = await db
    .select()
    .from(orders)
    .where(and(eq(orders.code, code), eq(orders.phone, phone)));
  if (!order)
    fail("NOT_FOUND", "Không tìm thấy đơn hàng với thông tin này.", 404);
  const items = await db
    .select({
      name: orderItems.nameSnapshot,
      qty: orderItems.qty,
      priceVnd: orderItems.priceSnapshot,
    })
    .from(orderItems)
    .where(eq(orderItems.orderId, order.id));
  return NextResponse.json({
    code: order.code,
    status: order.status,
    totalVnd: order.total,
    items,
    createdAt: order.createdAt,
  });
});
