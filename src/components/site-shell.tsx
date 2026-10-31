"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AuthProvider, useAuth } from "@/lib/session-client";
import { CartProvider, useCart } from "@/lib/cart";
import { captureUtm } from "@/lib/utm";
import { startAnalytics } from "@/lib/analytics";
import { isMock } from "@/lib/client-api";
import { CartContent } from "./shopping";
function Header() {
  const { user, logout } = useAuth(); const cart = useCart(); const [menu, setMenu] = useState(false); const [error, setError] = useState("");
  return <><div className="bg-ink text-cream text-center px-4 py-2 text-sm">Miễn phí giao hàng từ 399.000đ · Đổi trả trong 30 ngày</div><header className="wrap flex items-center justify-between gap-3 py-4"><button className="btn md:hidden !px-3" aria-label="Mở menu" aria-expanded={menu} aria-controls="mobile-menu" onClick={() => setMenu(!menu)}><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" /></svg></button><Link href="/" className="flex items-center gap-3"><Image src="/logo-badge.png" alt="Biểu trưng BODY MUSE" width={48} height={48} className="rounded-full" /><span className="font-display text-xl md:text-2xl">BODY MUSE</span></Link><nav className="hidden md:flex gap-6 font-semibold" aria-label="Menu chính"><Link href="/shop">Cửa hàng</Link><Link href="/quiz">Tìm mùi của bạn</Link><Link href="/about">Về chúng mình</Link></nav><div className="flex gap-3 items-center"><div className="hidden lg:block">{user ? <><span>{user.phone.slice(0, 3)}****{user.phone.slice(-3)}</span><button className="ml-3 underline min-h-12" onClick={() => logout().catch(error => setError(error.message))}>Đăng xuất</button></> : <Link href="/login">Đăng nhập</Link>}</div><button className="btn !px-3 md:!px-5" onClick={() => cart.setOpen(true)} aria-label={`Mở giỏ hàng, ${cart.items.reduce((sum, item) => sum + item.qty, 0)} sản phẩm`}>Giỏ ({cart.items.reduce((sum, item) => sum + item.qty, 0)})</button></div></header>{menu && <nav id="mobile-menu" className="wrap grid gap-3 pb-5" aria-label="Menu điện thoại" onClick={() => setMenu(false)}><Link href="/shop">Cửa hàng</Link><Link href="/quiz">Tìm mùi của bạn</Link><Link href="/about">Về chúng mình</Link><Link href="/track">Tra cứu đơn</Link>{user ? <><p>{user.phone.slice(0, 3)}****{user.phone.slice(-3)}</p><button className="text-left min-h-12" onClick={() => logout().catch(error => setError(error.message))}>Đăng xuất</button></> : <Link href="/login">Đăng nhập</Link>}</nav>}{error && <p role="alert" className="wrap text-danger">{error}</p>}{isMock && <p className="bg-sun text-center p-2 text-sm">Chế độ xem thử · Dữ liệu chỉ lưu trên trình duyệt này</p>}</>;
}
function CartDrawer() {
  const cart = useCart(); const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => { const element = dialog.current; if (cart.open && !element?.open) element?.showModal(); else if (!cart.open && element?.open) element.close(); }, [cart.open]);
  return <dialog ref={dialog} onCancel={() => cart.setOpen(false)} onClose={() => cart.setOpen(false)} className="cart-drawer" aria-labelledby="drawer-title"><div className="flex justify-between items-center mb-6"><h2 id="drawer-title" className="font-display text-3xl">Giỏ hàng của bạn</h2><button className="btn" onClick={() => cart.setOpen(false)} aria-label="Đóng giỏ hàng">Đóng</button></div>{cart.open && <CartContent drawer />}</dialog>;
}
function CookieConsent() {
  const [visible, setVisible] = useState(false);
  useEffect(() => { captureUtm(); try { const saved = localStorage.getItem("bm_consent"); setVisible(!saved); if (saved === "yes") startAnalytics(); } catch { setVisible(true); } }, []);
  function consent(value: string) { try { localStorage.setItem("bm_consent", value); } catch {} setVisible(false); if (value === "yes") startAnalytics(); }
  return visible ? <section aria-label="Đồng ý cookie" className="fixed z-50 bottom-4 left-4 right-4 md:right-auto md:max-w-lg panel shadow-lg"><p className="mb-4">Cho phép cookie đo lường để chúng mình biết nội dung nào hữu ích với bạn? Giỏ hàng vẫn hoạt động khi bạn từ chối.</p><div className="flex gap-3"><button className="btn primary" onClick={() => consent("yes")}>Đồng ý</button><button className="btn" onClick={() => consent("no")}>Từ chối</button></div><Link className="text-cobalt-text underline block mt-3" href="/policies">Chính sách bảo mật</Link></section> : null;
}
export function Messenger() {
  const [source, setSource] = useState("web"); useEffect(() => { setSource(captureUtm().source || "web"); }, []);
  const page = process.env.NEXT_PUBLIC_MESSENGER_PAGE; if (!page) return null;
  return <a className="btn primary fixed z-30 bottom-24 right-4 shadow-lg" href={`https://m.me/${encodeURIComponent(page)}?ref=${encodeURIComponent(source)}`} target="_blank" rel="noopener noreferrer">Nhắn Messenger</a>;
}
export function SiteShell({ children }: { children: React.ReactNode }) {
  return <AuthProvider><CartProvider><a href="#main" className="skip-link">Đến nội dung chính</a><Header />{children}<footer className="bg-ink text-cream mt-16 py-10"><div className="wrap grid md:grid-cols-3 gap-8"><div><Link className="font-display text-3xl" href="/">BODY MUSE</Link><p className="mt-3">Mùi hương của riêng bạn,<br />từ đầu đến chân.</p></div><nav className="grid gap-3" aria-label="Thông tin"><Link href="/about">Về chúng mình</Link><Link href="/policies">Giao hàng, đổi trả & bảo mật</Link><Link href="/track">Tra cứu đơn hàng</Link></nav><div><p className="font-bold">Bản demo cho đồ án, không thu tiền thật</p><p className="mt-3 text-sm">Giá và chính sách là giả định cho đồ án E-marketing.</p><p className="mt-3 text-sm">Liên hệ: [Email của nhóm]</p></div></div></footer><Messenger /><CartDrawer /><CookieConsent /></CartProvider></AuthProvider>;
}
