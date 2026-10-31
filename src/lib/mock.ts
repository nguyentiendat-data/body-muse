import { products } from "@/data/products";
import { resolveQuiz } from "@/data/quiz";
import type {
  OrderInput,
  OrderLookup,
  OrderReceipt,
  Product,
  User,
} from "@/types/api";
type MockUser = User & { hash: string; salt: string };
type MockOrder = OrderReceipt &
  OrderLookup & { phone: string; couponCode?: string; utm?: unknown };
function read<T>(key: string, fallback: T): T {
  try {
    return JSON.parse(localStorage.getItem(key) || "null") ?? fallback;
  } catch {
    return fallback;
  }
}
function save(key: string, value: unknown) {
  localStorage.setItem(key, JSON.stringify(value));
}
async function hash(password: string, salt: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits"],
  );
  const bits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: new TextEncoder().encode(salt),
      iterations: 100000,
      hash: "SHA-256",
    },
    key,
    256,
  );
  return Array.from(new Uint8Array(bits), (byte) =>
    byte.toString(16).padStart(2, "0"),
  ).join("");
}
export async function mockRequest(
  path: string,
  data?: Record<string, unknown>,
): Promise<unknown> {
  const url = new URL(path, location.origin);
  const route = url.pathname;
  const input = data || {};
  const catalog = read<Product[]>("bm_mock_products", products);
  let users = read<MockUser[]>("bm_mock_users", []);
  if (route === "/api/products") {
    const category = url.searchParams.get("category");
    const scent = url.searchParams.get("scent");
    const sort = url.searchParams.get("sort");
    const result = catalog.filter(
      (product) =>
        product.isActive &&
        (!category || product.category === category) &&
        (!scent || product.scent === scent),
    );
    if (sort === "price_asc") result.sort((a, b) => a.priceVnd - b.priceVnd);
    if (sort === "unit_asc")
      result.sort(
        (a, b) => (a.unitPriceVnd ?? Infinity) - (b.unitPriceVnd ?? Infinity),
      );
    return { products: result };
  }
  if (route.startsWith("/api/products/")) {
    const product = catalog.find(
      (product) => product.slug === route.split("/").pop(),
    );
    if (!product) throw new Error("Không tìm thấy sản phẩm.");
    return {
      product,
      related: catalog.filter(
        (item) => item.id !== product.id && item.line === product.line,
      ),
      reviews: [],
    };
  }
  if (route === "/api/auth/me")
    return { user: read<User | null>("bm_mock_session", null) };
  if (route === "/api/auth/logout") {
    localStorage.removeItem("bm_mock_session");
    return { ok: true };
  }
  const { orderSchema, reviewSchema, quizSchema, phoneSchema } =
    await import("./validation");
  const { registerSchema, loginSchema } = await import("./auth-validation");
  if (route === "/api/auth/register") {
    const valid = registerSchema.parse(input);
    if (users.some((user) => user.phone === valid.phone))
      throw new Error("Số điện thoại này đã có tài khoản.");
    const salt = crypto.randomUUID();
    const user = {
      id: crypto.randomUUID(),
      phone: valid.phone,
      salt,
      hash: await hash(valid.password, salt),
    };
    users.push(user);
    save("bm_mock_users", users);
    const publicUser = { id: user.id, phone: user.phone };
    save("bm_mock_session", publicUser);
    return { user: publicUser };
  }
  if (route === "/api/auth/login") {
    const valid = loginSchema.parse(input);
    const key = `bm_mock_login_${valid.phone}`;
    const attempts = read(key, { count: 0, until: 0 });
    if (attempts.until > Date.now() && attempts.count >= 5)
      throw new Error("Vui lòng thử lại sau 15 phút.");
    const user = users.find((user) => user.phone === valid.phone);
    if (!user || user.hash !== (await hash(valid.password, user.salt))) {
      save(key, {
        count: (attempts.until > Date.now() ? attempts.count : 0) + 1,
        until: Date.now() + 900000,
      });
      throw new Error("Số điện thoại hoặc mật khẩu chưa đúng.");
    }
    localStorage.removeItem(key);
    const publicUser = { id: user.id, phone: user.phone };
    save("bm_mock_session", publicUser);
    return { user: publicUser };
  }
  const phone = typeof input.phone === "string" ? input.phone : "";
  if (route === "/api/auth/forgot") {
    phoneSchema.parse(phone);
    const previous = read<number[]>(`bm_mock_otp_sends_${phone}`, []).filter(
      (time) => time > Date.now() - 3600000,
    );
    if (
      previous.length >= 3 ||
      previous[previous.length - 1] > Date.now() - 60000
    )
      throw new Error("Vui lòng chờ trước khi yêu cầu mã mới.");
    save(`bm_mock_otp_sends_${phone}`, [...previous, Date.now()]);
    save(`bm_mock_otp_${phone}`, { expires: Date.now() + 300000, attempts: 0 });
    return { ok: true, resendAfterSec: 60 };
  }
  if (route === "/api/auth/verify-otp") {
    const record = read(`bm_mock_otp_${phone}`, { expires: 0, attempts: 0 });
    if (record.expires < Date.now()) throw new Error("Mã OTP đã hết hạn.");
    if (record.attempts >= 5) throw new Error("Bạn đã nhập sai quá 5 lần.");
    if (input.otp !== "123456") {
      save(`bm_mock_otp_${phone}`, {
        ...record,
        attempts: record.attempts + 1,
      });
      throw new Error("Mã OTP không hợp lệ.");
    }
    localStorage.removeItem(`bm_mock_otp_${phone}`);
    const resetToken = crypto.randomUUID();
    sessionStorage.setItem(
      `bm_mock_reset_${phone}`,
      JSON.stringify({ resetToken, expires: Date.now() + 600000 }),
    );
    return { ok: true, resetToken };
  }
  if (route === "/api/auth/reset") {
    const valid = registerSchema.parse(input);
    const record = JSON.parse(
      sessionStorage.getItem(`bm_mock_reset_${phone}`) || "null",
    );
    if (
      !record ||
      record.expires < Date.now() ||
      record.resetToken !== input.resetToken
    )
      throw new Error("Phiên đổi mật khẩu không hợp lệ.");
    const salt = crypto.randomUUID();
    const passwordHash = await hash(valid.password, salt);
    users = users.map((user) =>
      user.phone === phone ? { ...user, salt, hash: passwordHash } : user,
    );
    save("bm_mock_users", users);
    sessionStorage.removeItem(`bm_mock_reset_${phone}`);
    return { ok: true };
  }
  if (route === "/api/orders") {
    const valid: OrderInput = orderSchema.parse(input);
    const history = read<MockOrder[]>("bm_mock_orders", []);
    const lines = valid.items.map((item) => {
      const product = catalog.find((product) => product.id === item.productId);
      if (!product || product.stock < item.qty)
        throw new Error("Sản phẩm không đủ tồn kho.");
      return { product, qty: item.qty };
    });
    if (valid.couponCode && valid.couponCode !== "WELCOME10")
      throw new Error("Mã giảm giá không hợp lệ.");
    if (
      valid.couponCode &&
      history.some(
        (order) =>
          order.phone === valid.customer.phone &&
          order.couponCode === valid.couponCode,
      )
    )
      throw new Error("Số điện thoại này đã dùng mã WELCOME10.");
    const subtotalVnd = lines.reduce(
      (sum, line) => sum + line.product.priceVnd * line.qty,
      0,
    );
    const shippingVnd = subtotalVnd >= 399000 ? 0 : 25000;
    const discountVnd = valid.couponCode ? Math.round(subtotalVnd * 0.1) : 0;
    const order: MockOrder = {
      code: `BM-${String(history.length + 1).padStart(4, "0")}`,
      subtotalVnd,
      shippingVnd,
      discountVnd,
      totalVnd: subtotalVnd + shippingVnd - discountVnd,
      phone: valid.customer.phone,
      couponCode: valid.couponCode,
      status: "new",
      createdAt: new Date().toISOString(),
      items: lines.map((line) => ({
        name: line.product.name,
        qty: line.qty,
        priceVnd: line.product.priceVnd,
      })),
      utm: input.utm,
    };
    save("bm_mock_orders", [...history, order]);
    save(
      "bm_mock_products",
      catalog.map((product) => ({
        ...product,
        stock:
          product.stock -
          (lines.find((line) => line.product.id === product.id)?.qty || 0),
      })),
    );
    return order;
  }
  if (route.startsWith("/api/orders/")) {
    const order = read<MockOrder[]>("bm_mock_orders", []).find(
      (order) =>
        order.code === route.split("/").pop() &&
        order.phone === url.searchParams.get("phone"),
    );
    if (!order) throw new Error("Không tìm thấy đơn hàng với thông tin này.");
    return order;
  }
  if (route === "/api/quiz") {
    const valid = quizSchema.parse(input);
    if (resolveQuiz(valid.answers) !== valid.scent)
      throw new Error("Kết quả không hợp lệ.");
    save("bm_mock_quiz", [...read<unknown[]>("bm_mock_quiz", []), input]);
    return { ok: true };
  }
  if (route === "/api/reviews") {
    reviewSchema.parse(input);
    return { ok: true, status: "pending" };
  }
  if (route === "/api/subscribe") {
    if (
      typeof input.email !== "string" ||
      !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(input.email)
    )
      throw new Error("Địa chỉ email chưa hợp lệ.");
    save("bm_mock_subscribers", [
      ...read<unknown[]>("bm_mock_subscribers", []),
      input,
    ]);
    return { ok: true, couponCode: "WELCOME10" };
  }
  throw new Error("Chức năng demo chưa sẵn sàng.");
}
