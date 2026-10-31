import { z } from "zod";
import { cookies } from "next/headers";
import { phoneSchema, utmSchema } from "./validation";
import { signToken } from "./session";
import type { User } from "@/types/api";
export const passwordSchema = z.string().min(8, "Mật khẩu cần ít nhất 8 ký tự, có chữ và số.").max(128, "Mật khẩu tối đa 128 ký tự.").regex(/^(?=.*[\p{L}])(?=.*\d)/u, "Mật khẩu cần có chữ và số.");
export const loginSchema = z.object({ phone: phoneSchema, password: z.string().min(1).max(128), utm: utmSchema });
export const registerSchema = z.object({ phone: phoneSchema, password: passwordSchema, confirmPassword: z.string(), utm: utmSchema }).refine(value => value.password === value.confirmPassword, { message: "Mật khẩu nhập lại chưa khớp.", path: ["confirmPassword"] });
export async function setUserCookie(user: User) {
  (await cookies()).set("bm_session", await signToken(user, "customer", "30d"), { httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: 30 * 86400 });
}
