import { z } from "zod";
import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { subscribers } from "@/db/schema";
import { api, body, utmColumns } from "@/lib/http";
import { utmSchema } from "@/lib/validation";
export const runtime = "nodejs";
export const POST = api(async (request) => {
  const input = z
    .object({
      email: z
        .string()
        .trim()
        .email("Địa chỉ email chưa hợp lệ.")
        .max(254)
        .transform((value) => value.toLowerCase()),
      utm: utmSchema,
    })
    .parse(await body(request));
  await getDb()
    .insert(subscribers)
    .values({ email: input.email, ...utmColumns(input.utm) })
    .onConflictDoNothing();
  return NextResponse.json({ ok: true, couponCode: "WELCOME10" });
}, true);
