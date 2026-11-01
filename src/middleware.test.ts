import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { middleware } from "./middleware";
import { signToken } from "./lib/session";
import { safeAdminNext } from "./lib/admin-redirect";

const origin = "https://body.example";
const request = (path: string, cookie?: string) =>
  new NextRequest(`${origin}${path}`, {
    headers: cookie ? { cookie: `bm_admin=${cookie}` } : {},
  });

beforeEach(() => vi.stubEnv("SESSION_SECRET", "x".repeat(32)));
afterEach(() => vi.unstubAllEnvs());
describe("Middleware quản trị", () => {
  it("chuyển trang /admin chưa đăng nhập sang /admin/login kèm next", async () => {
    for (const path of ["/admin", "/admin/orders?status=new"]) {
      const response = await middleware(request(path));
      expect(response.status).toBe(302);
      const location = new URL(response.headers.get("location") || "");
      expect(location.pathname).toBe("/admin/login");
      expect(location.searchParams.get("next")).toBe(path);
    }
  });
  it("trả JSON 401 cho /api/admin/* chưa đăng nhập", async () => {
    const response = await middleware(request("/api/admin/orders"));
    expect(response.status).toBe(401);
    expect(response.headers.get("location")).toBeNull();
    expect((await response.json()).error.code).toBe("UNAUTHORIZED");
  });
  it("cho qua trang đăng nhập và phiên admin hợp lệ", async () => {
    expect((await middleware(request("/admin/login"))).status).toBe(200);
    expect((await middleware(request("/api/admin/login"))).status).toBe(200);
    const token = await signToken({}, "admin", "1h");
    expect((await middleware(request("/admin/orders", token))).status).toBe(
      200,
    );
    const customer = await signToken({ id: "demo" }, "customer", "1h");
    expect((await middleware(request("/admin", customer))).status).toBe(302);
  });
  it("chỉ chuyển về trang quản trị nội bộ sau đăng nhập", () => {
    expect(safeAdminNext("/admin/orders?status=new")).toBe(
      "/admin/orders?status=new",
    );
    expect(safeAdminNext(undefined)).toBe("/admin");
    expect(safeAdminNext(["/admin/orders"])).toBe("/admin");
    expect(safeAdminNext("https://evil.example/admin")).toBe("/admin");
    expect(safeAdminNext("//evil.example")).toBe("/admin");
    expect(safeAdminNext("/administrator")).toBe("/admin");
    expect(safeAdminNext("/admin/login?next=/admin")).toBe("/admin");
    expect(safeAdminNext("/admin\\..\\evil")).toBe("/admin");
  });
});
