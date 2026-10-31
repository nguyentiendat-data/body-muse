import { NextResponse } from "next/server";
import { currentUser } from "@/lib/session";
import { api } from "@/lib/http";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const GET = api(async () =>
  NextResponse.json(
    { user: await currentUser() },
    { headers: { "Cache-Control": "no-store" } },
  ),
);
