"use client";
import { useState } from "react";
import { CatalogState, ProductGrid, useProducts } from "./catalog";
import { request } from "@/lib/client-api";
export function FeaturedProducts() {
  const { products, loading, error } = useProducts();
  return (
    <>
      <CatalogState loading={loading} error={error} />
      <ProductGrid
        products={products.filter((product) =>
          ["BM-01", "BM-04", "BM-10", "BM-12"].includes(product.id),
        )}
      />
    </>
  );
}
export function SubscribeForm() {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  return (
    <form
      className="flex flex-wrap gap-3"
      onSubmit={async (event) => {
        event.preventDefault();
        setBusy(true);
        setMessage("");
        const email = String(new FormData(event.currentTarget).get("email"));
        try {
          const result = await request<{ couponCode: string }>(
            "/api/subscribe",
            { email },
          );
          setMessage(
            `Mã của bạn: ${result.couponCode}. Dùng một lần cho mỗi số điện thoại.`,
          );
        } catch (error) {
          setMessage((error as Error).message);
        } finally {
          setBusy(false);
        }
      }}
    >
      <label className="flex-1 min-w-40">
        <span className="sr-only">Email nhận mã giảm giá</span>
        <input
          className="!mt-0 !rounded-full"
          type="email"
          name="email"
          placeholder="ban@email.com"
          required
          maxLength={254}
        />
      </label>
      <button className="btn dark" disabled={busy}>
        {busy ? "Đang gửi…" : "Nhận mã"}
      </button>
      {message && (
        <p className="w-full" role="status">
          {message}
        </p>
      )}
    </form>
  );
}
