"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { scentNames } from "@/data/products";
import type { ProductResponse } from "@/types/api";
import { request } from "@/lib/client-api";
import { useCart } from "@/lib/cart";
import { track } from "@/lib/analytics";
import {
  CatalogState,
  categories,
  money,
  ProductGrid,
  useProducts,
} from "./catalog";
export function Shop({
  category = "",
  scent = "",
  sort = "popular",
}: {
  category?: string;
  scent?: string;
  sort?: string;
}) {
  const router = useRouter();
  const query = new URLSearchParams();
  if (category) query.set("category", category);
  if (scent) query.set("scent", scent);
  query.set("sort", sort);
  const { products, loading, error } = useProducts(`?${query}`);
  function filter(key: string, value: string) {
    if (value) query.set(key, value);
    else query.delete(key);
    router.push(`/shop?${query}`, { scroll: false });
  }
  return (
    <main id="main" className="page">
      <p className="text-sm font-bold mb-3">MỘT CHÚT THƠM, CẢ NGÀY TỰ TIN</p>
      <h1 className="title">Cửa hàng</h1>
      <p className="mb-6">Chọn món bạn cần, chọn mùi bạn thích.</p>
      <div
        className="flex gap-2 overflow-x-auto pb-4"
        aria-label="Lọc theo nhóm"
      >
        {categories.map(([key, label]) => (
          <button
            className={`btn shrink-0 ${category === key ? "dark" : ""}`}
            aria-pressed={category === key}
            key={key}
            onClick={() => filter("category", key)}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap justify-between gap-4 mb-8">
        <div className="flex flex-wrap gap-2" aria-label="Lọc theo mùi">
          <button
            className={`btn ${!scent ? "dark" : ""}`}
            onClick={() => filter("scent", "")}
          >
            Mọi mùi
          </button>
          {Object.entries(scentNames).map(([key, label]) => (
            <button
              key={key}
              className={`btn ${scent === key ? "dark" : ""}`}
              aria-pressed={scent === key}
              onClick={() => filter("scent", key)}
            >
              {label}
            </button>
          ))}
        </div>
        <label className="flex items-center gap-3">
          Sắp xếp
          <select
            className="!mt-0 !w-auto"
            value={sort}
            onChange={(event) => filter("sort", event.target.value)}
          >
            <option value="popular">Phổ biến</option>
            <option value="price_asc">Giá tăng dần</option>
            <option value="unit_asc">Giá / 100 ml hoặc g</option>
          </select>
        </label>
      </div>
      <CatalogState loading={loading} error={error} />
      {!loading && !error && !products.length && (
        <p>Chưa có sản phẩm phù hợp. Bạn thử chọn nhóm khác nhé.</p>
      )}
      <ProductGrid products={products} />
    </main>
  );
}
export function ProductDetail({ slug }: { slug: string }) {
  const [data, setData] = useState<ProductResponse | null>(null);
  const [error, setError] = useState("");
  const [qty, setQty] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [reviewMessage, setReviewMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const cart = useCart();
  const viewed = useRef("");
  useEffect(() => {
    let active = true;
    setError("");
    setData(null);
    setQty(1);
    setSelectedImage(0);
    request<ProductResponse>(`/api/products/${slug}`)
      .then((result) => {
        if (active) {
          setData(result);
          if (viewed.current !== result.product.id) {
            track("view_item", {
              value: result.product.priceVnd,
              items: [
                { item_id: result.product.id, item_name: result.product.name },
              ],
            });
            viewed.current = result.product.id;
          }
        }
      })
      .catch((error) => {
        if (active) setError(error.message);
      });
    return () => {
      active = false;
    };
  }, [slug]);
  if (!data)
    return (
      <main id="main" className="page">
        <CatalogState loading={!error} error={error} />
      </main>
    );
  const { product, related, reviews } = data;
  const suffix =
    product.scent === "daisy-blue"
      ? "daisy"
      : product.scent === "peony-amber"
        ? "peony"
        : "mint";
  const images = product.image
    ? [
        product.image,
        ...(product.line === "xit-khu-mui"
          ? [`/products/detail-${suffix}.jpg`, `/products/set-${suffix}.jpg`]
          : []),
      ]
    : [];
  const add = () => cart.add(product, qty);
  return (
    <main id="main" className="page pb-28 md:pb-10">
      <nav className="mb-6 text-sm" aria-label="Đường dẫn">
        <Link href="/shop" className="underline">
          Cửa hàng
        </Link>{" "}
        / {product.name}
      </nav>
      <section className="grid md:grid-cols-2 gap-8 md:gap-12">
        <div>
          <div className="photo border-[3px] border-ink rounded-[28px] overflow-hidden">
            {images[selectedImage] && (
              <Image
                src={images[selectedImage]}
                alt={`${product.name} — ảnh ${selectedImage + 1}`}
                fill
                priority
                fetchPriority="high"
                sizes="(max-width: 768px) 92vw, 48vw"
              />
            )}
          </div>
          {images.length > 1 && (
            <div className="flex gap-3 mt-4">
              {images.map((src, index) => (
                <button
                  className={`relative w-20 aspect-[3/4] border-2 rounded-xl overflow-hidden ${selectedImage === index ? "border-cobalt outline outline-2 outline-cobalt" : "border-ink"}`}
                  aria-label={`Xem ảnh ${index + 1} của ${product.name}`}
                  aria-pressed={selectedImage === index}
                  onClick={() => setSelectedImage(index)}
                  key={src}
                >
                  <Image
                    src={src}
                    alt=""
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="flex flex-col gap-5">
          <p className="font-bold text-sm tracking-widest">
            BODY MUSE · {product.size}
          </p>
          <h1 className="font-display text-[34px] md:text-[44px] font-extrabold leading-tight">
            {product.name}
          </h1>
          <p>
            Một mùi hương cho nhịp sống của riêng bạn. Gọn trong thói quen, rõ
            trong cá tính.
          </p>
          <div className="flex gap-2 flex-wrap" aria-label="Chọn mùi hương">
            {[product, ...related]
              .sort((a, b) => a.id.localeCompare(b.id))
              .map((item) => (
                <Link
                  aria-current={item.id === product.id ? "page" : undefined}
                  className={`btn ${item.id === product.id ? "dark" : ""}`}
                  key={item.id}
                  href={`/shop/${item.slug}`}
                >
                  {scentNames[item.scent]}
                </Link>
              ))}
          </div>
          <div>
            <p
              className="font-bold text-cobalt-text text-3xl"
              aria-live="polite"
            >
              {money(product.priceVnd * qty)}
            </p>
            <p className="text-sm mt-2">
              {product.unitPriceVnd
                ? `${money(product.unitPriceVnd)} / ${product.unitBasis}`
                : "Bộ 4 món"}{" "}
              · {product.stock ? "Còn hàng" : "Tạm hết hàng"}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center border-2 border-ink rounded-full overflow-hidden">
              <button
                className="w-12 h-12"
                disabled={qty <= 1}
                aria-label="Giảm số lượng"
                onClick={() => setQty(qty - 1)}
              >
                −
              </button>
              <span className="px-3" aria-live="polite">
                {qty}
              </span>
              <button
                className="w-12 h-12"
                disabled={qty >= Math.min(9, product.stock)}
                aria-label="Tăng số lượng"
                onClick={() => setQty(qty + 1)}
              >
                +
              </button>
            </div>
            <button
              className="btn primary flex-1"
              onClick={add}
              disabled={product.stock < 1}
            >
              {product.stock ? "Thêm vào giỏ" : "Tạm hết hàng"}
            </button>
          </div>
          <div className="notice bg-mint">
            <p className="font-bold">Phí ship 25.000đ · Miễn phí từ 399.000đ</p>
            <p className="mt-2">
              Giao hàng 2–4 ngày. Đổi trả 30 ngày theo chính sách demo.
            </p>
            <Link href="/policies" className="underline inline-block mt-2">
              Xem chính sách
            </Link>
          </div>
          {product.notes && (
            <div className="panel !bg-daisy">
              <h2 className="text-xl font-bold mb-3">Ba tầng hương</h2>
              <p>Hương đầu: {product.notes.top}</p>
              <p className="my-2">Hương giữa: {product.notes.mid}</p>
              <p>Hương cuối: {product.notes.base}</p>
            </div>
          )}
        </div>
      </section>
      <section className="grid md:grid-cols-2 gap-8 mt-12">
        <div className="panel">
          <h2 className="section-title mb-5">Thành phần và cách dùng</h2>
          <p>
            [Bảng thành phần và hướng dẫn sử dụng chính thức của {product.name}]
          </p>
          <p className="mt-4">
            Nhóm sẽ bổ sung thông tin đã xác minh từ nhãn sản phẩm trước khi sử
            dụng ngoài phạm vi đồ án.
          </p>
        </div>
        <div>
          <h2 className="section-title mb-5">Đánh giá khách hàng</h2>
          {reviews.length ? (
            reviews.map((review) => (
              <article className="notice bg-cream mb-4" key={review.id}>
                <p className="font-bold">
                  {review.name} · {review.stars}/5
                </p>
                <p className="mt-2">{review.body}</p>
                {review.reply && (
                  <p className="mt-3 border-t border-ink pt-3">
                    BODY MUSE: {review.reply}
                  </p>
                )}
              </article>
            ))
          ) : (
            <p className="mb-5">Chưa có đánh giá. Bạn là người đầu tiên nhé?</p>
          )}
          <form
            className="panel grid gap-4"
            onSubmit={async (event) => {
              event.preventDefault();
              setBusy(true);
              setReviewMessage("");
              const form = event.currentTarget;
              const fields = new FormData(form);
              try {
                await request("/api/reviews", {
                  productId: product.id,
                  stars: Number(fields.get("stars")),
                  name: String(fields.get("name")),
                  body: String(fields.get("body")),
                });
                setReviewMessage("Cảm ơn bạn. Đánh giá đang chờ duyệt.");
                form.reset();
              } catch (error) {
                setReviewMessage((error as Error).message);
              } finally {
                setBusy(false);
              }
            }}
          >
            <h3 className="font-bold text-xl">Gửi đánh giá</h3>
            <label>
              Tên của bạn
              <input name="name" minLength={2} maxLength={100} required />
            </label>
            <label>
              Số sao
              <select name="stars" defaultValue="5">
                {[5, 4, 3, 2, 1].map((value) => (
                  <option key={value} value={value}>
                    {value} sao
                  </option>
                ))}
              </select>
            </label>
            <label>
              Chia sẻ trải nghiệm
              <textarea name="body" minLength={5} maxLength={2000} required />
            </label>
            <button className="btn primary" disabled={busy}>
              {busy ? "Đang gửi…" : "Gửi đánh giá"}
            </button>
            <p role="status">{reviewMessage}</p>
          </form>
        </div>
      </section>
      <div className="md:hidden fixed z-20 bottom-0 inset-x-0 bg-cream border-t-2 border-ink p-3 flex items-center justify-between gap-3">
        <b className="text-cobalt-text">{money(product.priceVnd * qty)}</b>
        <button
          className="btn primary"
          onClick={add}
          disabled={product.stock < 1}
        >
          {product.stock ? "Thêm vào giỏ" : "Tạm hết hàng"}
        </button>
      </div>
    </main>
  );
}
