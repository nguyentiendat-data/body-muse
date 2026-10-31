"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart";
import { useAuth } from "@/lib/session-client";
import { request } from "@/lib/client-api";
import { track } from "@/lib/analytics";
import type { OrderReceipt } from "@/types/api";
import { CatalogState, money, useProducts } from "./catalog";
export function CartContent({ drawer = false }: { drawer?: boolean }) {
  const cart = useCart();
  const { products, loading, error } = useProducts();
  const subtotal = cart.items.reduce(
    (sum, item) =>
      sum +
      (products.find((product) => product.id === item.productId)?.priceVnd ||
        0) *
        item.qty,
    0,
  );
  return (
    <>
      <CatalogState loading={loading} error={error} />
      {!cart.items.length ? (
        <div className="py-8">
          <p className="mb-5">Giỏ hơi trống. Thêm chút mùi hương nhé?</p>
          <Link
            className="btn primary"
            href="/shop"
            onClick={() => cart.setOpen(false)}
          >
            Khám phá cửa hàng
          </Link>
        </div>
      ) : (
        <>
          <div className="notice bg-mint mb-5">
            {subtotal >= 399000
              ? "Bạn đã được miễn phí giao hàng."
              : `Còn ${money(399000 - subtotal)} là được miễn phí ship.`}
            <progress
              className="block w-full accent-cobalt mt-3"
              max={399000}
              value={subtotal}
              aria-label="Tiến độ miễn phí giao hàng"
            />
          </div>
          <div className="grid gap-5">
            {cart.items.map((item) => {
              const product = products.find(
                (product) => product.id === item.productId,
              );
              return (
                <article
                  key={item.productId}
                  className="flex gap-4 border-b border-ink pb-5"
                >
                  <div className="relative w-20 aspect-[3/4] shrink-0 rounded-xl overflow-hidden bg-photo">
                    {product?.image && (
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link
                      className="font-bold"
                      href={product ? `/shop/${product.slug}` : "/shop"}
                      onClick={() => cart.setOpen(false)}
                    >
                      {product?.name ||
                        `Sản phẩm ${item.productId} hiện không còn bán`}
                    </Link>
                    {product && (
                      <p className="text-cobalt-text font-bold my-2">
                        {money(product.priceVnd * item.qty)}
                      </p>
                    )}
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        className="btn !px-4"
                        aria-label={`Giảm số lượng ${product?.name || item.productId}`}
                        onClick={() =>
                          cart.update(item.productId, item.qty - 1)
                        }
                      >
                        −
                      </button>
                      <span aria-live="polite">{item.qty}</span>
                      <button
                        className="btn !px-4"
                        disabled={item.qty >= Math.min(9, product?.stock ?? 9)}
                        aria-label={`Tăng số lượng ${product?.name || item.productId}`}
                        onClick={() =>
                          cart.update(item.productId, item.qty + 1)
                        }
                      >
                        +
                      </button>
                      <button
                        className="underline min-h-12 px-2"
                        onClick={() => cart.update(item.productId, 0)}
                      >
                        Xóa
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
          <p className="flex justify-between font-bold text-xl my-6">
            <span>Tạm tính</span>
            <span>{money(subtotal)}</span>
          </p>
          <Link
            className="btn primary w-full"
            href="/checkout"
            onClick={() => cart.setOpen(false)}
          >
            Tiến hành thanh toán
          </Link>
          {drawer && (
            <Link
              className="block text-center underline mt-4 min-h-12 py-3"
              href="/cart"
              onClick={() => cart.setOpen(false)}
            >
              Xem giỏ hàng
            </Link>
          )}
        </>
      )}
    </>
  );
}
export function Checkout() {
  const cart = useCart();
  const { user } = useAuth();
  const { products, loading, error } = useProducts();
  const router = useRouter();
  const [coupon, setCoupon] = useState("");
  const [applied, setApplied] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const begun = useRef(false);
  const subtotal = cart.items.reduce(
    (sum, item) =>
      sum +
      (products.find((product) => product.id === item.productId)?.priceVnd ||
        0) *
        item.qty,
    0,
  );
  const shipping = subtotal >= 399000 ? 0 : 25000;
  const discount = applied ? Math.round(subtotal * 0.1) : 0;
  useEffect(() => {
    if (!begun.current && subtotal) {
      begun.current = true;
      track("begin_checkout", { value: subtotal });
    }
  }, [subtotal]);
  if (!cart.items.length)
    return (
      <div className="panel">
        <p>Giỏ hàng đang trống.</p>
        <Link href="/shop" className="btn mt-4">
          Đến cửa hàng
        </Link>
      </div>
    );
  return (
    <>
      <p className="notice bg-sun mb-6 font-bold">
        Bản demo cho đồ án, không thu tiền thật. Vui lòng không chuyển tiền.
      </p>
      <CatalogState loading={loading} error={error} />
      <form
        className="grid lg:grid-cols-[1.3fr_1fr] gap-6"
        onSubmit={async (event) => {
          event.preventDefault();
          if (busy) return;
          setBusy(true);
          setMessage("");
          const form = new FormData(event.currentTarget);
          const input = {
            customer: {
              name: String(form.get("name")),
              phone: String(form.get("phone")),
              address: String(form.get("address")),
              note: String(form.get("note")),
            },
            paymentMethod: String(form.get("paymentMethod")),
            items: cart.items,
            couponCode: applied || undefined,
          };
          try {
            const receipt = await request<OrderReceipt>("/api/orders", input);
            sessionStorage.setItem(
              "bm_last_order",
              JSON.stringify({
                ...receipt,
                paymentMethod: input.paymentMethod,
              }),
            );
            track("purchase", {
              transaction_id: receipt.code,
              value: receipt.totalVnd,
            });
            cart.clear();
            router.push("/checkout/success");
          } catch (error) {
            setMessage(
              error instanceof Error
                ? error.message
                : "Không thể đặt đơn. Vui lòng thử lại.",
            );
          } finally {
            setBusy(false);
          }
        }}
      >
        <div className="panel grid gap-5">
          <h2 className="text-2xl font-bold">Thông tin nhận hàng</h2>
          <label>
            Họ và tên
            <input
              name="name"
              required
              autoComplete="name"
              minLength={2}
              maxLength={100}
            />
          </label>
          <label>
            Số điện thoại
            <input
              name="phone"
              key={user?.phone || "guest"}
              defaultValue={user?.phone}
              type="tel"
              inputMode="numeric"
              pattern="0[0-9]{9}"
              required
              autoComplete="tel"
            />
          </label>
          <label>
            Địa chỉ nhận hàng
            <textarea
              name="address"
              autoComplete="street-address"
              minLength={10}
              maxLength={500}
              required
              rows={3}
            />
          </label>
          <label>
            Ghi chú (không bắt buộc)
            <input
              name="note"
              maxLength={1000}
              placeholder="Ví dụ: giao giờ hành chính"
            />
          </label>
          <fieldset className="grid gap-3">
            <legend className="text-xl font-bold mb-3">Thanh toán</legend>
            <label className="notice flex items-center gap-3">
              <input
                type="radio"
                name="paymentMethod"
                value="cod"
                defaultChecked
                className="!w-5 !m-0"
              />
              Thanh toán khi nhận hàng (COD)
            </label>
            <label className="notice flex items-center gap-3">
              <input
                type="radio"
                name="paymentMethod"
                value="bank"
                className="!w-5 !m-0"
              />
              Chuyển khoản thủ công (minh họa)
            </label>
          </fieldset>
        </div>
        <aside className="panel h-fit grid gap-4">
          <h2 className="text-2xl font-bold">Đơn hàng của bạn</h2>
          {cart.items.map((item) => {
            const product = products.find(
              (product) => product.id === item.productId,
            );
            return (
              <p className="flex justify-between gap-3" key={item.productId}>
                <span>
                  {product?.name || item.productId} × {item.qty}
                </span>
                <b>{money((product?.priceVnd || 0) * item.qty)}</b>
              </p>
            );
          })}
          <label>
            Mã giảm giá
            <div className="flex gap-2 mt-2">
              <input
                value={coupon}
                className="!mt-0 min-w-0"
                onChange={(event) => setCoupon(event.target.value)}
              />
              <button
                className="btn shrink-0"
                type="button"
                onClick={() => {
                  const normalized = coupon.trim().toUpperCase();
                  if (normalized && normalized !== "WELCOME10") {
                    setMessage("Mã giảm giá không hợp lệ.");
                    setApplied("");
                  } else {
                    setApplied(normalized);
                    setMessage(
                      normalized
                        ? "Đã áp dụng giảm 10%. Mỗi số điện thoại dùng một lần; hệ thống sẽ kiểm tra khi đặt đơn."
                        : "Đã bỏ mã giảm giá.",
                    );
                  }
                }}
              >
                Áp dụng
              </button>
            </div>
          </label>
          <p className="flex justify-between">
            Tạm tính <b>{money(subtotal)}</b>
          </p>
          <p className="flex justify-between">
            Giao hàng <b>{money(shipping)}</b>
          </p>
          <p className="flex justify-between">
            Giảm giá <b>−{money(discount)}</b>
          </p>
          <p className="flex justify-between text-xl font-bold border-t-2 border-ink pt-4">
            Tổng cộng{" "}
            <span className="text-cobalt-text">
              {money(subtotal + shipping - discount)}
            </span>
          </p>
          <p className="text-sm">
            Giá cuối cùng được hệ thống tính lại khi đặt hàng.
          </p>
          {message && (
            <p role="alert" className="text-danger">
              {message}
            </p>
          )}
          <button className="btn primary" disabled={busy || loading || !!error}>
            {busy ? "Đang đặt đơn…" : "Đặt đơn demo"}
          </button>
          <Link href="/policies" className="underline text-sm">
            Chính sách giao hàng và đổi trả
          </Link>
        </aside>
      </form>
    </>
  );
}
export function Success() {
  const [receipt, setReceipt] = useState<
    (OrderReceipt & { paymentMethod: string }) | null
  >(null);
  useEffect(() => {
    try {
      setReceipt(JSON.parse(sessionStorage.getItem("bm_last_order") || "null"));
    } catch {}
  }, []);
  return (
    <section className="panel max-w-2xl mx-auto">
      <p className="text-cobalt-text font-bold mb-3">CẢM ƠN BẠN</p>
      <h1 className="title">
        {receipt ? "Đã nhận đơn của bạn." : "Thông tin đơn hàng"}
      </h1>
      {receipt ? (
        <>
          <p className="my-6 text-xl">
            Mã đơn: <b>{receipt.code}</b>
            <br />
            Tổng tiền minh họa: <b>{money(receipt.totalVnd)}</b>
          </p>
          {receipt.paymentMethod === "bank" && (
            <div className="notice bg-sun">
              <p className="font-bold">Không chuyển tiền thật.</p>
              <p>Ngân hàng: [Tên ngân hàng]</p>
              <p>Số tài khoản: [Số tài khoản]</p>
              <p>Chủ tài khoản: [Tên chủ tài khoản]</p>
              <div className="border-2 border-dashed border-ink rounded-xl p-8 mt-4 text-center">
                [Mã QR chuyển khoản]
              </div>
              <p className="mt-3">Nội dung minh họa: {receipt.code}</p>
            </div>
          )}
          <Link href="/track" className="btn primary mt-6">
            Tra cứu đơn hàng
          </Link>
        </>
      ) : (
        <p className="my-6">Chưa có đơn hàng trong phiên này.</p>
      )}
      <Link className="btn mt-4 ml-2" href="/shop">
        Tiếp tục khám phá
      </Link>
    </section>
  );
}
