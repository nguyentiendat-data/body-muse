"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AuthProvider, useAuth } from "@/lib/session-client";
import { CartProvider, useCart } from "@/lib/cart";
import { captureUtm } from "@/lib/utm";
import { messengerLink, siteConfig } from "@/lib/site-config";
import { startAnalytics } from "@/lib/analytics";
import { isMock } from "@/lib/client-api";
import { CartContent } from "./shopping";
import { Icon } from "./ui-icon";
const storeCategories = [["xit-khu-mui", "Xịt khử mùi"], ["tam-goi", "Tắm & gội"], ["duong-the", "Dưỡng thể"], ["lan-nuoc-hoa", "Lăn & nước hoa"], ["bo-qua", "Bộ quà tặng"]];
function Header() {
 const { user, logout } = useAuth();
 const cart = useCart();
 const [menu, setMenu] = useState(false);
 const [search, setSearch] = useState(false);
 const [error, setError] = useState("");
 const count = cart.items.reduce((sum, item) => sum + item.qty, 0);
 return <>
  <div className="announcement">Miễn phí giao hàng từ 399.000đ <span>·</span> Đổi trả trong 30 ngày</div>
  <header className="store-header">
   <div className="wrap header-main">
    <button className="icon-button mobile-only" aria-label="Mở menu" aria-expanded={menu} aria-controls="mobile-menu" onClick={() => setMenu(!menu)}><Icon name={menu ? "close" : "menu"} /></button>
    <Link href="/" className="brand-lockup"><Image src="/logo-badge.png" alt="Biểu trưng BODY MUSE" width={38} height={38} className="rounded-full" /><span className="brand-wordmark">BODY MUSE<small>OWN YOUR SCENT</small></span></Link>
    <nav className="header-navigation" aria-label="Menu chính"><Link href="/shop">Cửa hàng</Link><Link href="/quiz">Tìm mùi của bạn</Link><Link href="/about">Câu chuyện thương hiệu</Link></nav>
    <div className="header-actions"><button className="icon-button" aria-label="Tìm kiếm sản phẩm" aria-expanded={search} aria-controls="header-search" onClick={() => setSearch(!search)}><Icon name="search" /></button>
     <div className="header-account">{user ? <><span>{user.phone.slice(0,3)}****{user.phone.slice(-3)}</span><button onClick={() => logout().catch(e => setError(e.message))}>Đăng xuất</button></> : <Link href="/login" className="icon-button" aria-label="Đăng nhập"><Icon name="user" /></Link>}</div>
     <button className="bag-button" onClick={() => cart.setOpen(true)} aria-label={"Mở giỏ hàng, " + count + " sản phẩm"}><Icon name="bag" /><span className="bag-count">{count}</span></button>
    </div>
   </div>
   {search && <form id="header-search" className="wrap header-search" action="/shop"><label className="sr-only" htmlFor="search-products">Tìm sản phẩm</label><Icon name="search"/><input id="search-products" name="q" placeholder="Tìm tên sản phẩm, mùi hương…" maxLength={100} autoFocus /><button className="btn primary">Tìm kiếm</button></form>}
   <nav className="category-navigation" aria-label="Danh mục sản phẩm"><div className="wrap"><Link href="/shop">Tất cả sản phẩm</Link>{storeCategories.map(([key,label])=><Link key={key} href={"/shop?category="+key}>{label}</Link>)}<Link href="/#sale" className="sale-nav">Ưu đãi 11.11</Link></div></nav>
   {menu && <nav id="mobile-menu" className="mobile-menu wrap" aria-label="Menu điện thoại" onClick={()=>setMenu(false)}><Link href="/shop">Cửa hàng</Link><Link href="/quiz">Tìm mùi của bạn</Link><Link href="/about">Câu chuyện thương hiệu</Link><Link href="/track">Tra cứu đơn</Link>{user ? <button onClick={()=>logout().catch(e=>setError(e.message))}>Đăng xuất</button> : <Link href="/login">Đăng nhập</Link>}</nav>}
  </header>
  {error && <p role="alert" className="wrap text-danger">{error}</p>}
  {isMock && <p className="demo-strip">Chế độ xem thử · Dữ liệu chỉ lưu trên trình duyệt này</p>}
 </>;
}
function CartDrawer() {
  const cart = useCart();
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const element = dialog.current;
    if (cart.open && !element?.open) element?.showModal();
    else if (!cart.open && element?.open) element.close();
  }, [cart.open]);
  return (
    <dialog
      ref={dialog}
      onCancel={() => cart.setOpen(false)}
      onClose={() => cart.setOpen(false)}
      className="cart-drawer"
      aria-labelledby="drawer-title"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 id="drawer-title" className="font-display text-3xl">
          Giỏ hàng của bạn
        </h2>
        <button
          className="btn"
          onClick={() => cart.setOpen(false)}
          aria-label="Đóng giỏ hàng"
        >
          Đóng
        </button>
      </div>
      {cart.open && <CartContent drawer />}
    </dialog>
  );
}
function CookieConsent() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    captureUtm();
    try {
      const saved = localStorage.getItem("bm_consent");
      setVisible(!saved);
      if (saved === "yes") startAnalytics();
    } catch {
      setVisible(true);
    }
  }, []);
  function consent(value: string) {
    try {
      localStorage.setItem("bm_consent", value);
    } catch {}
    setVisible(false);
    if (value === "yes") startAnalytics();
  }
  return visible ? (
    <section
      aria-label="Đồng ý cookie"
      className="fixed z-50 bottom-4 left-4 right-4 md:right-auto md:max-w-lg panel shadow-lg"
    >
      <p className="mb-4">
        Cho phép cookie đo lường để chúng mình biết nội dung nào hữu ích với
        bạn? Giỏ hàng vẫn hoạt động khi bạn từ chối.
      </p>
      <div className="flex gap-3">
        <button className="btn primary" onClick={() => consent("yes")}>
          Đồng ý
        </button>
        <button className="btn" onClick={() => consent("no")}>
          Từ chối
        </button>
      </div>
      <Link className="text-cobalt-text underline block mt-3" href="/policies">
        Chính sách bảo mật
      </Link>
    </section>
  ) : null;
}
export function Messenger() {
  const [source, setSource] = useState("web");
  useEffect(() => {
    setSource(captureUtm().source || "web");
  }, []);
  return (
    <a
      className="messenger-button" aria-label="Nhắn Messenger"
      href={messengerLink(source)}
      target="_blank"
      rel="noopener noreferrer"
    >
      <Icon name="mail" /><span>Hỗ trợ</span>
    </a>
  );
}
export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="storefront"><AuthProvider>
      <CartProvider>
        <a href="#main" className="skip-link">
          Đến nội dung chính
        </a>
        <Header />
        {children}
        <footer className="store-footer">
          <div className="wrap footer-grid">
            <div>
              <Link className="font-display text-3xl" href="/">
                BODY MUSE
              </Link>
              <p className="mt-3 font-bold">{siteConfig.slogan}</p>
              <p className="mt-3">
                Mùi hương của riêng bạn,
                <br />
                từ đầu đến chân.
              </p>
            </div>
            <nav className="grid gap-3" aria-label="Thông tin">
              <Link href="/about">Về chúng mình</Link>
              <Link href="/policies">Giao hàng, đổi trả & bảo mật</Link>
              <Link href="/track">Tra cứu đơn hàng</Link>
            </nav>
            <div>
              <p className="font-bold">
                Bản demo cho đồ án, không thu tiền thật
              </p>
              <p className="mt-3 text-sm">
                Giá và chính sách là giả định cho đồ án môn {siteConfig.course},{" "}
                {siteConfig.teamName}.
              </p>
              <p className="mt-3 text-sm">
                Liên hệ:{" "}
                <a className="underline" href={`mailto:${siteConfig.email}`}>
                  {siteConfig.email}
                </a>
                {" · "}
                <a
                  className="underline"
                  href={siteConfig.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Facebook
                </a>
              </p>
            </div>
          </div>
        </footer>
        <Messenger />
        <CartDrawer />
        <CookieConsent />
      </CartProvider>
    </AuthProvider></div>
  );
}
