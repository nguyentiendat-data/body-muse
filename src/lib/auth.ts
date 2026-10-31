import { cookies } from "next/headers";
import { signToken } from "./session";
import type { User } from "@/types/api";
export { passwordSchema, loginSchema, registerSchema } from "./auth-validation";
export async function setUserCookie(user: User) {
  (await cookies()).set(
    "bm_session",
    await signToken(user, "customer", "30d"),
    {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 30 * 86400,
    },
  );
}
