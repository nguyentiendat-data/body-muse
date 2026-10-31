import { z } from "zod";
export const phoneSchema = z
  .string()
  .regex(/^0\d{9}$/, "Số điện thoại cần đủ 10 số và bắt đầu bằng 0.");
export const scentSchema = z.enum([
  "daisy-blue",
  "peony-amber",
  "mint-soda",
  "all",
]);
export const categorySchema = z.enum([
  "xit-khu-mui",
  "tam-goi",
  "duong-the",
  "lan-nuoc-hoa",
  "bo-qua",
]);
export const utmSchema = z
  .object({
    source: z.string().max(200).optional(),
    medium: z.string().max(200).optional(),
    campaign: z.string().max(200).optional(),
  })
  .optional();
export const orderSchema = z.object({
  customer: z.object({
    name: z.string().trim().min(2, "Vui lòng nhập họ tên.").max(100),
    phone: phoneSchema,
    address: z
      .string()
      .trim()
      .min(10, "Vui lòng nhập địa chỉ đầy đủ.")
      .max(500),
    note: z.string().max(1000).optional(),
  }),
  paymentMethod: z.enum(["cod", "bank"]),
  items: z
    .array(
      z.object({
        productId: z.string().max(50),
        qty: z.number().int().min(1).max(9),
        scent: scentSchema.optional(),
      }),
    )
    .min(1, "Giỏ hàng đang trống.")
    .max(30),
  couponCode: z
    .string()
    .trim()
    .max(30)
    .transform((value) => value.toUpperCase())
    .optional(),
  utm: utmSchema,
});
export const reviewSchema = z.object({
  productId: z.string().max(50),
  stars: z.number().int().min(1).max(5),
  name: z.string().trim().min(2).max(100),
  body: z.string().trim().min(5).max(2000),
  utm: utmSchema,
});
export const quizSchema = z.object({
  answers: z.array(z.number().int().min(0).max(2)).length(5),
  scent: scentSchema,
  utm: utmSchema,
});
