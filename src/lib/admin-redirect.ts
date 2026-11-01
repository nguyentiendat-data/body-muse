// Chỉ cho phép quay về trang quản trị nội bộ, tránh open redirect.
export function safeAdminNext(next: unknown): string {
  if (typeof next !== "string") return "/admin";
  if (!/^\/admin(\/|\?|$)/.test(next) || /[\\\r\n]/.test(next))
    return "/admin";
  if (/^\/admin\/login(\/|\?|$)/.test(next)) return "/admin";
  return next;
}
