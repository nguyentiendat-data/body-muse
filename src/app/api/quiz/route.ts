import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { quizResults } from "@/db/schema";
import { resolveQuiz } from "@/data/quiz";
import { api, body, fail, utmColumns } from "@/lib/http";
import { quizSchema } from "@/lib/validation";
export const runtime = "nodejs";
export const POST = api(async request => {
  const input = quizSchema.parse(await body(request));
  if (resolveQuiz(input.answers) !== input.scent) fail("INVALID_INPUT", "Kết quả không khớp câu trả lời.");
  await getDb().insert(quizResults).values({ answers: input.answers, scent: input.scent, ...utmColumns(input.utm) });
  return NextResponse.json({ ok: true });
}, true);
