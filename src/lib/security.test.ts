import { afterEach, describe, expect, it, vi } from "vitest";
import { calculateTotals } from "./pricing";
import { hashPassword, verifyPassword } from "./password";
import { checkOtp, hashOtp } from "./otp";
import { readToken, signToken } from "./session";
import { sameOrigin } from "./http";
import { csv } from "./admin";
import { orderSchema } from "./validation";

afterEach(() => vi.unstubAllEnvs());
describe("Tính tiền và giảm giá", () => {
  it("tính ship tại ngưỡng 399k, giảm trên tạm tính và làm tròn VND", () => {
    expect(calculateTotals(398999, "WELCOME10")).toEqual({
      subtotalVnd: 398999,
      shippingVnd: 25000,
      discountVnd: 39900,
      totalVnd: 384099,
    });
    expect(calculateTotals(399000, "WELCOME10").shippingVnd).toBe(0);
    expect(calculateTotals(129000).totalVnd).toBe(154000);
  });
  it("không nhận mã lạ, mã đã dùng hay tổng âm", () => {
    expect(() => calculateTotals(100000, "BAD")).toThrow("Mã giảm giá");
    expect(() => calculateTotals(100000, "WELCOME10", true)).toThrow("đã dùng");
    expect(() => calculateTotals(-1)).toThrow();
  });
  it("không nhận số lượng vượt 9 và số điện thoại sai", () => {
    expect(
      orderSchema.safeParse({
        customer: {
          name: "Khách demo",
          phone: "1234567890",
          address: "Địa chỉ minh họa",
        },
        paymentMethod: "cod",
        items: [{ productId: "BM-01", qty: 10 }],
      }).success,
    ).toBe(false);
  });
});
describe("Mật khẩu và OTP", () => {
  it("scrypt có muối riêng và từ chối mật khẩu sai", async () => {
    const one = await hashPassword("Matkhau123");
    const two = await hashPassword("Matkhau123");
    expect(one).not.toBe(two);
    expect(one).not.toContain("Matkhau123");
    expect(await verifyPassword("Matkhau123", one)).toBe(true);
    expect(await verifyPassword("Sai12345", one)).toBe(false);
    expect(await verifyPassword("anything", "invalid")).toBe(false);
  });
  it("kiểm tra OTP đúng, sai, hết hạn, quá 5 lần và đã dùng", () => {
    vi.stubEnv("SESSION_SECRET", "test-secret-".repeat(4));
    const record = {
      codeHash: hashOtp("0901234567", "123456"),
      expiresAt: new Date(Date.now() + 300000),
      attempts: 0,
      usedAt: null,
    };
    expect(checkOtp(record, "0901234567", "123456")).toBeNull();
    expect(checkOtp(record, "0901234567", "000000")).toBe("OTP_INVALID");
    expect(checkOtp(record, "0909999999", "123456")).toBe("OTP_INVALID");
    expect(
      checkOtp({ ...record, expiresAt: new Date(0) }, "0901234567", "123456"),
    ).toBe("OTP_EXPIRED");
    expect(checkOtp({ ...record, attempts: 5 }, "0901234567", "123456")).toBe(
      "TOO_MANY_ATTEMPTS",
    );
    expect(
      checkOtp({ ...record, usedAt: new Date() }, "0901234567", "123456"),
    ).toBe("OTP_INVALID");
  });
  it("JWT không dùng chéo giữa admin, khách và reset", async () => {
    vi.stubEnv("SESSION_SECRET", "test-secret-".repeat(4));
    const token = await signToken({ id: "demo" }, "customer", "30d");
    expect((await readToken(token, "customer")).id).toBe("demo");
    await expect(readToken(token, "admin")).rejects.toThrow();
    await expect(
      readToken(await signToken({}, "reset", "-1s"), "reset"),
    ).rejects.toThrow();
  });
});
describe("Biên bảo mật", () => {
  it("chặn origin khác và cross-site", () => {
    expect(() =>
      sameOrigin(
        new Request("https://body.example/api/orders", {
          headers: { origin: "https://other.example" },
        }),
      ),
    ).toThrow();
    expect(() =>
      sameOrigin(
        new Request("https://body.example/api/orders", {
          headers: { "sec-fetch-site": "cross-site" },
        }),
      ),
    ).toThrow();
    expect(() =>
      sameOrigin(
        new Request("https://body.example/api/orders", {
          headers: { origin: "https://body.example" },
        }),
      ),
    ).not.toThrow();
  });
  it("CSV chống công thức, xử lý dấu nháy và xuống dòng", () => {
    expect(csv([["=1+1", 'a"b', "a\nb"]])).toBe('\uFEFF"\'=1+1","a""b","a\nb"');
  });
});
