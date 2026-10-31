import { z } from "zod";
import { phoneSchema, utmSchema } from "./validation";
export const passwordSchema = z
  .string()
  .min(8, "Mật khẩu cần ít nhất 8 ký tự, có chữ và số.")
  .max(128, "Mật khẩu tối đa 128 ký tự.")
  .regex(/^(?=.*[\p{L}])(?=.*\d)/u, "Mật khẩu cần có chữ và số.");
export const loginSchema = z.object({
  phone: phoneSchema,
  password: z.string().min(1, "Vui lòng nhập mật khẩu.").max(128),
  utm: utmSchema,
});
export const registerSchema = z
  .object({
    phone: phoneSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
    utm: utmSchema,
  })
  .refine((value) => value.password === value.confirmPassword, {
    message: "Mật khẩu nhập lại chưa khớp.",
    path: ["confirmPassword"],
  });
