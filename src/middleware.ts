import { jwtVerify } from "jose";
import { NextRequest, NextResponse } from "next/server";
export async function middleware(request: NextRequest) {
  if (
    request.nextUrl.pathname === "/admin/login" ||
    request.nextUrl.pathname === "/api/admin/login"
  )
    return NextResponse.next();
  try {
    const secret = process.env.SESSION_SECRET;
    if (!secret || secret.length < 32) throw new Error();
    const { payload } = await jwtVerify(
      request.cookies.get("bm_admin")?.value || "",
      new TextEncoder().encode(secret),
      { algorithms: ["HS256"] },
    );
    if (payload.purpose !== "admin") throw new Error();
    return NextResponse.next();
  } catch {
    return NextResponse.json(
      {
        error: {
          code: "UNAUTHORIZED",
          message: "Vui lòng đăng nhập quản trị tại /admin/login.",
        },
      },
      { status: 401 },
    );
  }
}
export const config = { matcher: ["/admin/:path*", "/api/admin/:path*"] };
