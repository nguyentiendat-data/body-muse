import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { products, reviews } from "@/db/schema";
import { api, body, fail } from "@/lib/http";
import { reviewSchema } from "@/lib/validation";
export const runtime = "nodejs";
export const POST = api(async request => {
  const input = reviewSchema.parse(await body(request));
  const [product] = await getDb().select({ id: products.id }).from(products).where(and(eq(products.id, input.productId), eq(products.isActive, true)));
  if (!product) fail("NOT_FOUND", "Không tìm thấy sản phẩm.", 404);
  await getDb().insert(reviews).values({ productId: input.productId, stars: input.stars, name: input.name, body: input.body });
  return NextResponse.json({ ok: true, status: "pending" });
}, true);
