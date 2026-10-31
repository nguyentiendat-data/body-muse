import { ApiFailure } from "./http";
export function calculateTotals(subtotalVnd: number, couponCode?: string, alreadyUsed = false) {
  if (!Number.isSafeInteger(subtotalVnd) || subtotalVnd < 0) throw new ApiFailure("INVALID_TOTAL", "Giá trị đơn không hợp lệ.");
  if (couponCode && couponCode !== "WELCOME10") throw new ApiFailure("INVALID_COUPON", "Mã giảm giá không hợp lệ.");
  if (couponCode && alreadyUsed) throw new ApiFailure("COUPON_USED", "Số điện thoại này đã dùng mã WELCOME10.");
  const shippingVnd = subtotalVnd >= 399000 ? 0 : 25000;
  const discountVnd = couponCode ? Math.round(subtotalVnd * 0.1) : 0;
  return { subtotalVnd, shippingVnd, discountVnd, totalVnd: subtotalVnd + shippingVnd - discountVnd };
}
