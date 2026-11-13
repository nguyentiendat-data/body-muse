"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "./ui-icon";
export function AdminForm({
  endpoint,
  children,
  mode = "PATCH",
  redirectTo = "/admin",
  className = "",
}: {
  endpoint: string;
  children: React.ReactNode;
  mode?: "POST" | "PATCH";
  redirectTo?: string;
  className?: string;
}) {
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const router = useRouter();
  return (
    <form
      className={"admin-form " + className}
      onSubmit={async (event) => {
        event.preventDefault();
        setBusy(true);
        setMessage("");
        const data = Object.fromEntries(new FormData(event.currentTarget));
        const payload = Object.fromEntries(
          Object.entries(data).map(([key, value]) => [
            key,
            ["priceVnd", "stock"].includes(key)
              ? Number(value)
              : key === "isActive"
                ? value === "true"
                : value,
          ]),
        );
        try {
          const response = await fetch(endpoint, {
            method: mode,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
          const result = await response.json();
          if (!response.ok) throw new Error(result.error.message);
          setMessage("Đã lưu.");
          if (endpoint.endsWith("/login")) router.push(redirectTo);
          else router.refresh();
        } catch (error) {
          setMessage(
            error instanceof Error
              ? error.message
              : "Không thể lưu. Vui lòng thử lại.",
          );
        } finally {
          setBusy(false);
        }
      }}
    >
      {children}
      <button
        disabled={busy}
        className="btn primary admin-save"
      >
        {busy ? "Đang lưu…" : mode === "POST" ? "Đăng nhập" : "Lưu thay đổi"}
      </button>
      {message && <p role="status" className={message === "Đã lưu." ? "admin-feedback success" : "admin-feedback"}>{message}</p>}
    </form>
  );
}
export function AdminLogout() {
  const router = useRouter();
  return (
    <button
      className="admin-logout"
      onClick={async () => {
        await fetch("/api/admin/logout", { method: "POST" });
        router.push("/admin/login");
        router.refresh();
      }}
    >
      <Icon name="logout" size={17} />Đăng xuất
    </button>
  );
}
