import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { createHash } from "node:crypto";
import { sql } from "drizzle-orm";
import { getDb } from "@/db";
import { rateLimits } from "@/db/schema";
import type { Utm } from "@/types/api";

export class ApiFailure extends Error {
  constructor(
    public code: string,
    message: string,
    public status = 400,
  ) {
    super(message);
  }
}
export function fail(code: string, message: string, status = 400): never {
  throw new ApiFailure(code, message, status);
}
export function utmColumns(utm?: Utm) {
  return {
    utmSource: utm?.source,
    utmMedium: utm?.medium,
    utmCampaign: utm?.campaign,
  };
}
export function ipKey(request: Request) {
  return createHash("sha256")
    .update(
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
        "unknown",
    )
    .digest("hex");
}
export async function rateLimit(
  key: string,
  maximum = 10,
  milliseconds = 60000,
) {
  const [entry] = await getDb()
    .insert(rateLimits)
    .values({ key, count: 1, expiresAt: new Date(Date.now() + milliseconds) })
    .onConflictDoUpdate({
      target: rateLimits.key,
      set: {
        count: sql`CASE WHEN ${rateLimits.expiresAt} <= now() THEN 1 ELSE ${rateLimits.count} + 1 END`,
        expiresAt: sql`CASE WHEN ${rateLimits.expiresAt} <= now() THEN ${new Date(Date.now() + milliseconds)} ELSE ${rateLimits.expiresAt} END`,
      },
    })
    .returning();
  if (entry.count > maximum)
    fail(
      "TOO_MANY_ATTEMPTS",
      "Bạn thao tác quá nhanh. Vui lòng thử lại sau.",
      429,
    );
}
export function sameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin)
    fail("INVALID_ORIGIN", "Yêu cầu không hợp lệ.");
  if (request.headers.get("sec-fetch-site") === "cross-site")
    fail("INVALID_ORIGIN", "Yêu cầu không hợp lệ.");
}
export async function body(request: Request): Promise<unknown> {
  if (Number(request.headers.get("content-length")) > 20000)
    fail("INVALID_INPUT", "Nội dung yêu cầu quá dài.");
  const raw = await request.text();
  if (raw.length > 20000) fail("INVALID_INPUT", "Nội dung yêu cầu quá dài.");
  try {
    return JSON.parse(raw);
  } catch {
    return fail("INVALID_INPUT", "Dữ liệu gửi lên không hợp lệ.");
  }
}
export function api(
  handler: (request: Request) => Promise<Response>,
  post = false,
) {
  return async (request: Request) => {
    try {
      sameOrigin(request);
      if (post) await rateLimit(`post:${ipKey(request)}`);
      return await handler(request);
    } catch (error) {
      if (error instanceof ApiFailure)
        return NextResponse.json(
          { error: { code: error.code, message: error.message } },
          { status: error.status },
        );
      if (error instanceof ZodError) {
        const issue = error.issues[0];
        const code =
          issue?.path[0] === "confirmPassword"
            ? "PASSWORD_MISMATCH"
            : issue?.path[0] === "password"
              ? "WEAK_PASSWORD"
              : "INVALID_INPUT";
        const message =
          error.issues.find(
            (issue) =>
              !issue.message.match(
                /^(Invalid|Expected|Required|String|Number|Array|Too|Invalid input)/,
              ),
          )?.message || "Vui lòng kiểm tra các thông tin đã nhập.";
        return NextResponse.json({ error: { code, message } }, { status: 400 });
      }
      return NextResponse.json(
        {
          error: {
            code: "UNAVAILABLE",
            message: "Chưa thể xử lý yêu cầu. Vui lòng thử lại sau.",
          },
        },
        { status: 400 },
      );
    }
  };
}
