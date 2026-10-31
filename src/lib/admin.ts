import { cookies } from "next/headers";
import { api, fail } from "./http";
import { readToken } from "./session";
export async function requireAdmin() {
  try { await readToken((await cookies()).get("bm_admin")?.value || "", "admin"); }
  catch { fail("UNAUTHORIZED", "Vui lòng đăng nhập quản trị.", 401); }
}
export function adminApi(handler: (request: Request) => Promise<Response>) {
  return api(async request => { await requireAdmin(); return handler(request); });
}
export function csv(rows: unknown[][]) {
  return "\uFEFF" + rows.map(row => row.map(value => {
    let text = String(value ?? "");
    if (/^[=+\-@\t\r\n]/.test(text)) text = `'${text}`;
    return `"${text.replaceAll('"', '""')}"`;
  }).join(",")).join("\r\n");
}
