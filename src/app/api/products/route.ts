import { NextResponse } from "next/server";
import { and, asc, eq, sql } from "drizzle-orm";
import { z } from "zod";
import { getDb } from "@/db";
import { products } from "@/db/schema";
import { api } from "@/lib/http";
import { categorySchema, scentSchema } from "@/lib/validation";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const GET = api(async request => {
  const input = z.object({ category: categorySchema.optional(), scent: scentSchema.optional(), sort: z.enum(["popular", "price_asc", "unit_asc"]).default("popular") }).parse(Object.fromEntries(new URL(request.url).searchParams));
  const result = await getDb().select().from(products).where(and(eq(products.isActive, true), input.category ? eq(products.category, input.category) : undefined, input.scent ? eq(products.scent, input.scent) : undefined)).orderBy(input.sort === "price_asc" ? asc(products.priceVnd) : input.sort === "unit_asc" ? sql`${products.unitPriceVnd} asc nulls last` : asc(products.id));
  return NextResponse.json({ products: result });
});
