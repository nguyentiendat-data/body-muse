import { and, eq, inArray, sql } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { orders, orderItems, products } from "@/db/schema";
import { api, body, fail, utmColumns } from "@/lib/http";
import { calculateTotals } from "@/lib/pricing";
import { currentUser } from "@/lib/session";
import { orderSchema } from "@/lib/validation";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const POST = api(async request => {
  const input = orderSchema.parse(await body(request));
  const user = await currentUser();
  const receipt = await getDb().transaction(async tx => {
    // Serialize orders per phone, including guest checkouts and coupon use.
    await tx.execute(sql`select pg_advisory_xact_lock(hashtext(${input.customer.phone}))`);
    const ids = input.items.map(item => item.productId).sort();
    if (new Set(ids).size !== ids.length) fail("INVALID_INPUT", "Mỗi sản phẩm chỉ được xuất hiện một lần trong giỏ.");
    const selected = await tx.select().from(products).where(inArray(products.id, ids)).orderBy(products.id).for("update");
    const lines = input.items.map(item => {
      const product = selected.find(product => product.id === item.productId);
      if (!product || !product.isActive || product.stock < item.qty) fail("OUT_OF_STOCK", "Sản phẩm không đủ tồn kho. Vui lòng kiểm tra giỏ hàng.");
      if (item.scent && item.scent !== product.scent) fail("INVALID_INPUT", "Mùi hương không khớp sản phẩm.");
      return { product, qty: item.qty };
    });
    const previous = input.couponCode ? await tx.select({ id: orders.id }).from(orders).where(and(eq(orders.phone, input.customer.phone), eq(orders.couponCode, "WELCOME10"))).limit(1) : [];
    const totals = calculateTotals(lines.reduce((sum, line) => sum + line.product.priceVnd * line.qty, 0), input.couponCode, previous.length > 0);
    const number = await tx.execute(sql`select nextval('order_number') as number`);
    const code = `BM-${String(number.rows[0].number).padStart(4, "0")}`;
    const [order] = await tx.insert(orders).values({ code, userId: user?.id, ...input.customer, paymentMethod: input.paymentMethod, subtotal: totals.subtotalVnd, shipping: totals.shippingVnd, discount: totals.discountVnd, total: totals.totalVnd, couponCode: input.couponCode || null, ...utmColumns(input.utm) }).returning({ id: orders.id });
    for (const { product, qty } of lines) {
      await tx.update(products).set({ stock: product.stock - qty }).where(eq(products.id, product.id));
      await tx.insert(orderItems).values({ orderId: order.id, productId: product.id, nameSnapshot: product.name, priceSnapshot: product.priceVnd, qty, scent: product.scent });
    }
    return { code, ...totals };
  });
  return NextResponse.json(receipt, { status: 201 });
}, true);
