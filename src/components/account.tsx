"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { request } from "@/lib/client-api";
import { loginSchema, registerSchema } from "@/lib/auth-validation";
import { phoneSchema } from "@/lib/validation";
import { useAuth } from "@/lib/session-client";
function AuthAside() {
  return (
    <aside className="hidden md:block max-w-md">
      <div className="relative aspect-[3/4] border-[3px] border-ink rounded-[32px] overflow-hidden bg-photo">
        <Image
          src="/products/bm-01.jpg"
          alt="Xịt khử mùi Daisy Blue của BODY MUSE"
          fill
          sizes="400px"
          className="object-cover"
        />
      </div>
      <h2 className="font-display text-3xl mt-6">Thơm theo cách của bạn.</h2>
      <p className="mt-3">Một tài khoản nhỏ, cho những lần mua sắm gọn hơn.</p>
    </aside>
  );
}
export function Account({
  mode,
  next = "/shop",
}: {
  mode: "login" | "register" | "forgot";
  next?: string;
}) {
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState("");
  const [token, setToken] = useState("");
  const [show, setShow] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const auth = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (seconds <= 0) return;
    const timer = setTimeout(() => setSeconds(seconds - 1), 1000);
    return () => clearTimeout(timer);
  }, [seconds]);
  const forgot = mode === "forgot";
  const title =
    mode === "login"
      ? "Đăng nhập"
      : mode === "register"
        ? "Tạo tài khoản"
        : step === 1
          ? "Quên mật khẩu?"
          : step === 2
            ? "Nhập mã xác nhận"
            : step === 3
              ? "Đặt mật khẩu mới"
              : "Đã đổi mật khẩu";
  const showPhone = !forgot || step === 1;
  const showPassword = !forgot || step === 3;
  const confirm = mode === "register" || (forgot && step === 3);
  async function sendOtp() {
    const result = await request<{ resendAfterSec: number }>(
      "/api/auth/forgot",
      { phone },
    );
    setSeconds(result.resendAfterSec);
    setStep(2);
  }
  function fieldError(name: string) {
    return errors[name] ? (
      <p role="alert" id={`${name}-error`} className="text-danger text-sm mt-2">
        {errors[name]}
      </p>
    ) : null;
  }
  return (
    <main id="main" className="page grid md:grid-cols-2 gap-12 max-w-5xl">
      <section className="panel h-fit">
        <p className="text-sm font-bold mb-4">CHÀO BẠN, MUSE.</p>
        <h1 className="font-display text-[40px] font-extrabold leading-tight mb-5">
          {title}
        </h1>
        {forgot && step < 4 && (
          <>
            <p className="mb-3">Bước {step}/3</p>
            <progress
              className="w-full accent-cobalt mb-5"
              max={3}
              value={step}
              aria-label={`Bước ${step} trên 3`}
            />
          </>
        )}
        {forgot && step === 2 && (
          <>
            <p className="mb-4">
              Mã xác nhận cho số {phone.slice(0, 3)}****{phone.slice(-3)}. Mã có
              hiệu lực 5 phút.
            </p>
            {process.env.NEXT_PUBLIC_OTP_DEMO === "1" && (
              <p className="notice bg-sun mb-4">Bản demo: mã OTP là 123456</p>
            )}
          </>
        )}
        {step < 4 && (
          <form
            noValidate
            className="grid gap-5"
            onSubmit={async (event) => {
              event.preventDefault();
              if (busy) return;
              setBusy(true);
              setMessage("");
              setErrors({});
              const values = Object.fromEntries(
                new FormData(event.currentTarget),
              );
              const input = { ...values, phone };
              try {
                if (mode === "login") loginSchema.parse(input);
                else if (mode === "register" || step === 3)
                  registerSchema.parse(input);
                else if (step === 1) phoneSchema.parse(phone);
                else
                  z.string()
                    .regex(/^\d{6}$/, "Mã OTP gồm 6 số.")
                    .parse(values.otp);
                if (forgot) {
                  if (step === 1) await sendOtp();
                  else if (step === 2) {
                    const result = await request<{ resetToken: string }>(
                      "/api/auth/verify-otp",
                      { phone, otp: values.otp },
                    );
                    setToken(result.resetToken);
                    setStep(3);
                  } else {
                    await request("/api/auth/reset", {
                      ...input,
                      resetToken: token,
                    });
                    setToken("");
                    setStep(4);
                  }
                } else {
                  await request(`/api/auth/${mode}`, input);
                  await auth.refresh();
                  const target =
                    next.startsWith("/") &&
                    !next.startsWith("//") &&
                    !next.includes("\\")
                      ? next
                      : "/shop";
                  router.push(target);
                  router.refresh();
                }
              } catch (error) {
                if (error instanceof z.ZodError) {
                  const fields: Record<string, string> = {};
                  for (const issue of error.issues) {
                    const key = String(
                      issue.path[0] || (step === 2 ? "otp" : "phone"),
                    );
                    fields[key] ??= issue.message;
                  }
                  setErrors(fields);
                } else
                  setMessage(
                    error instanceof Error
                      ? error.message
                      : "Chưa thể xử lý. Vui lòng thử lại.",
                  );
              } finally {
                setBusy(false);
              }
            }}
          >
            {showPhone && (
              <div>
                <label htmlFor="account-phone">Số điện thoại</label>
                <input
                  id="account-phone"
                  name="phone"
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel"
                  placeholder="Ví dụ: 0901234567"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  aria-invalid={!!errors.phone}
                  aria-describedby={errors.phone ? "phone-error" : undefined}
                />
                {fieldError("phone")}
              </div>
            )}
            {forgot && step === 2 && (
              <div>
                <label htmlFor="account-otp">Mã OTP 6 số</label>
                <input
                  id="account-otp"
                  name="otp"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={6}
                  className="text-center tracking-[.5em] text-2xl"
                  aria-invalid={!!errors.otp}
                  aria-describedby={errors.otp ? "otp-error" : undefined}
                />
                {fieldError("otp")}
              </div>
            )}
            {showPassword && (
              <div>
                <label htmlFor="account-password">
                  {forgot ? "Mật khẩu mới" : "Mật khẩu"}
                </label>
                <div className="relative">
                  <input
                    id="account-password"
                    name="password"
                    type={show ? "text" : "password"}
                    autoComplete={
                      mode === "login" ? "current-password" : "new-password"
                    }
                    className="!pr-20"
                    aria-invalid={!!errors.password}
                    aria-describedby={
                      errors.password ? "password-error" : undefined
                    }
                  />
                  <button
                    className="absolute right-2 top-1 min-h-12 px-3 font-semibold"
                    type="button"
                    onClick={() => setShow(!show)}
                    aria-label={show ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                  >
                    {show ? "Ẩn" : "Hiện"}
                  </button>
                </div>
                {fieldError("password")}
                {mode !== "login" && (
                  <p className="text-sm mt-2">
                    Ít nhất 8 ký tự, có cả chữ và số.
                  </p>
                )}
              </div>
            )}
            {confirm && (
              <div>
                <label htmlFor="account-confirm">Nhập lại mật khẩu</label>
                <input
                  id="account-confirm"
                  name="confirmPassword"
                  type={show ? "text" : "password"}
                  autoComplete="new-password"
                  aria-invalid={!!errors.confirmPassword}
                  aria-describedby={
                    errors.confirmPassword ? "confirmPassword-error" : undefined
                  }
                />
                {fieldError("confirmPassword")}
              </div>
            )}
            {message && (
              <p role="alert" className="text-danger">
                {message}
              </p>
            )}
            {mode === "login" && (
              <Link
                className="text-cobalt-text underline"
                href="/forgot-password"
              >
                Quên mật khẩu?
              </Link>
            )}
            <button className="btn dark w-full" disabled={busy}>
              {busy
                ? "Đang xử lý…"
                : forgot
                  ? step === 1
                    ? "Gửi mã OTP"
                    : step === 2
                      ? "Xác nhận mã"
                      : "Đổi mật khẩu"
                  : mode === "login"
                    ? "Đăng nhập"
                    : "Đăng ký"}
            </button>
          </form>
        )}
        {forgot && step === 2 && (
          <button
            className="min-h-12 underline text-cobalt-text mt-3"
            disabled={seconds > 0 || busy}
            onClick={async () => {
              setBusy(true);
              setMessage("");
              try {
                await sendOtp();
              } catch (error) {
                setMessage((error as Error).message);
              } finally {
                setBusy(false);
              }
            }}
          >
            {seconds > 0 ? `Gửi lại mã sau ${seconds}s` : "Gửi lại mã"}
          </button>
        )}
        {step === 4 && (
          <>
            <p className="my-6" role="status">
              Mật khẩu mới đã được lưu. Bạn có thể đăng nhập ngay.
            </p>
            <Link className="btn dark" href="/login">
              Đăng nhập
            </Link>
          </>
        )}
        {!forgot && (
          <p className="mt-6">
            {mode === "login" ? "Chưa có tài khoản?" : "Đã có tài khoản?"}{" "}
            <Link
              className="underline text-cobalt-text"
              href={mode === "login" ? "/register" : "/login"}
            >
              {mode === "login" ? "Đăng ký" : "Đăng nhập"}
            </Link>
          </p>
        )}
        <Link className="underline block mt-6 text-cobalt-text" href="/shop">
          Tiếp tục khám phá cửa hàng
        </Link>
      </section>
      <AuthAside />
    </main>
  );
}
