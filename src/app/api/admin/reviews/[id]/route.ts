import { eq } from "drizzle-orm";
import { z } from "zod";
import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { reviews } from "@/db/schema";
import { adminApi } from "@/lib/admin";
import { body, fail } from "@/lib/http";
export const runtime = "nodejs";
export const PATCH = adminApi(async request => {
  const id = z.string().uuid().parse(new URL(request.url).pathname.split("/").pop());
  const input = z.object({ status: z.enum(["pending", "approved", "rejected"]), reply: z.string().trim().max(2000).nullable() }).parse(await body(request));
  const [review] = await getDb().update(reviews).set(input).where(eq(reviews.id, id)).returning({ id: reviews.id });
  if (!review) fail("NOT_FOUND", "Không tìm thấy đánh giá.", 404);
  return NextResponse.json({ ok: true });
});
