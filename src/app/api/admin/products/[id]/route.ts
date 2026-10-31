import { eq } from "drizzle-orm";
import { z } from "zod";
import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { products } from "@/db/schema";
import { adminApi } from "@/lib/admin";
import { body, fail } from "@/lib/http";
export const runtime = "nodejs";
export const PATCH = adminApi(async request => {
  const id = new URL(request.url).pathname.split("/").pop() || "";
  const input = z.object({ priceVnd: z.number().int().min(1000).max(100000000), stock: z.number().int().min(0).max(1000000), isActive: z.boolean() }).parse(await body(request));
  const db = getDb();
  const [product] = await db.select().from(products).where(eq(products.id, id));
  if (!product) fail("NOT_FOUND", "Không tìm thấy sản phẩm.", 404);
  const amount = Number.parseFloat(product.size);
  const unitPriceVnd = product.unitBasis && amount > 0 ? Math.round(input.priceVnd / amount * 100) : null;
  await db.update(products).set({ ...input, unitPriceVnd }).where(eq(products.id, id));
  return NextResponse.json({ ok: true });
});
