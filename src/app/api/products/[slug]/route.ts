import { and, eq, ne } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { products, reviews } from "@/db/schema";
import { api, fail } from "@/lib/http";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const GET = api(async (request) => {
  const slug = decodeURIComponent(
    new URL(request.url).pathname.split("/").pop() || "",
  );
  const db = getDb();
  const [product] = await db
    .select()
    .from(products)
    .where(and(eq(products.slug, slug), eq(products.isActive, true)));
  if (!product) fail("NOT_FOUND", "Không tìm thấy sản phẩm.", 404);
  const [related, approved] = await Promise.all([
    db
      .select()
      .from(products)
      .where(
        and(
          eq(products.line, product.line),
          ne(products.id, product.id),
          eq(products.isActive, true),
        ),
      ),
    db
      .select({
        id: reviews.id,
        stars: reviews.stars,
        name: reviews.name,
        body: reviews.body,
        reply: reviews.reply,
        createdAt: reviews.createdAt,
      })
      .from(reviews)
      .where(
        and(eq(reviews.productId, product.id), eq(reviews.status, "approved")),
      ),
  ]);
  return NextResponse.json({ product, related, reviews: approved });
});
