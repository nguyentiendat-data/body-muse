"use client";
import { CampaignImage } from "./campaign-image";
import { Icon } from "./ui-icon";
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
export function Shop({ category = "", scent = "", sort = "popular", q = "" }: { category?: string; scent?: string; sort?: string; q?: string }) {
 const router = useRouter();
 const [filtersOpen,setFiltersOpen] = useState(false);
 const query = new URLSearchParams();
 if(category) query.set("category",category);
 if(scent) query.set("scent",scent);
 if(q) query.set("q",q);
 query.set("sort",sort);
 const {products, loading, error} = useProducts("?"+query);
 const normalize = (value: string) => value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g,"d");
 const visible = q ? products.filter(p => normalize(p.name+" "+scentNames[p.scent]).includes(normalize(q.trim()))) : products;
 function filter(key: string, value: string) {if(value) query.set(key,value);else query.delete(key);router.push("/shop?"+query,{scroll:false});}
 return <main id="main" className="page shop-page">
  <nav className="breadcrumbs" aria-label="Đường dẫn"><Link href="/">Trang chủ</Link><Icon name="chevron" size={12}/><span>Cửa hàng</span></nav>
  <div className="shop-heading"><div><p className="eyebrow">BỘ SƯU TẬP BODY MUSE</p><h1 className="title">Chỉn chu từ những điều nhỏ.</h1><p>Chọn món bạn cần. Tìm dấu hương của riêng mình.</p></div><Link href="/quiz" className="text-link">Cần gợi ý mùi hương? <Icon name="arrow" size={16}/></Link></div>
  <div className="shop-layout">
   <aside className={"shop-sidebar "+(filtersOpen ? "is-open" : "")} aria-label="Bộ lọc sản phẩm"><div className="filter-section"><h2>Danh mục</h2>{categories.map(([key,label])=><button key={key} className={category===key ? "filter-option selected" : "filter-option"} aria-pressed={category===key} onClick={()=>filter("category",key)}>{label}<Icon name="chevron" size={13}/></button>)}</div><div className="filter-section"><h2>Mùi hương</h2>{[["","Mọi mùi"],...Object.entries(scentNames)].map(([key,label])=><button key={key} className={scent===key ? "filter-option selected" : "filter-option"} aria-pressed={scent===key} onClick={()=>filter("scent",key)}><span className={"scent-dot dot-"+key}/>{label}{scent===key && <Icon name="check" size={15}/>}</button>)}</div><div className="filter-help"><Icon name="shield"/><strong>An tâm lựa chọn</strong><p>Đổi trả 30 ngày.<br/>Miễn phí ship từ 399.000đ.</p><Link href="/policies">Xem chính sách</Link></div></aside>
   <div className="shop-results"><div className="shop-toolbar"><button className="btn filter-toggle" aria-expanded={filtersOpen} onClick={()=>setFiltersOpen(!filtersOpen)}><Icon name="filter" size={17}/>Bộ lọc</button><p role="status">{loading ? "Đang tải…" : visible.length+" sản phẩm"}</p><label>Sắp xếp<select aria-label="Sắp xếp" value={sort} onChange={e=>filter("sort",e.target.value)}><option value="popular">Phổ biến</option><option value="price_asc">Giá tăng dần</option><option value="unit_asc">Giá / 100 ml hoặc g</option></select></label></div>
    {(category || scent || q) && <div className="active-filters">{q && <span>Tìm: “{q}”</span>}{category && <span>{categories.find(([key])=>key===category)?.[1]}</span>}{scent && <span>{scentNames[scent as keyof typeof scentNames] || scent}</span>}<Link href="/shop">Xóa bộ lọc</Link></div>}
    <CatalogState loading={loading} error={error}/>{!loading && !error && !visible.length && <div className="empty-state"><Icon name="search" size={30}/><h2>Chưa tìm thấy sản phẩm</h2><p>Thử tên khác hoặc bỏ bớt bộ lọc để xem thêm lựa chọn.</p><Link href="/shop" className="btn">Xem tất cả sản phẩm</Link></div>}<ProductGrid products={visible}/>
   </div>
  </div>
 </main>;
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
        ...(product.id === "BM-11" ? ["/products/trial-kit-detail.png"] : product.id === "BM-13" ? ["/products/ocean-campaign.png", "/products/ocean.png"] : []),
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
      <section className="product-detail-layout">
        <div className="product-gallery">
          <div className="photo product-main-photo">
            {images[selectedImage] && (
              <CampaignImage
                src={images[selectedImage]}
                alt={`${product.name} — ảnh ${selectedImage + 1}`}
                priority
                cropRollOn={product.id === "BM-13" && selectedImage === 0}
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
                  key={src + index}
                >
                  <CampaignImage
                    src={src}
                    alt=""
                    cropRollOn={product.id === "BM-13" && index === 0}
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="product-purchase flex flex-col gap-5">
          <p className="font-bold text-sm tracking-widest">
            BODY MUSE · {product.size}
          </p>
          <h1 className="font-display text-[34px] md:text-[44px] font-extrabold leading-tight">
            {product.name}
          </h1>
          <p>
            {product.id === "BM-11" ? "Bộ thử 3 mùi Ocean, Woody và Citrus. Ba chai xịt mini để bạn khám phá dấu hương của riêng mình. Dung tích từng chai đang chờ xác nhận." : product.id === "BM-13" ? "Lăn khử mùi nam Ocean 50 ml. Trong trẻo, điềm tĩnh như biển sớm." : "Một mùi hương cho nhịp sống của riêng bạn. Gọn trong thói quen, rõ trong cá tính."}
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
                : product.size}{" "}
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
      <div className="mobile-purchase md:hidden fixed z-20 bottom-0 inset-x-0 bg-cream border-t border-ink p-3 flex items-center justify-between gap-3">
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
