import Link from "next/link";
import { AdminForm } from "@/components/admin-controls";
import { Icon } from "@/components/ui-icon";
import { safeAdminNext } from "@/lib/admin-redirect";
export default async function Login({searchParams}: {searchParams: Promise<{next?: string | string[]}>}) {
 const {next} = await searchParams;
 return <main className="admin-login"><section className="admin-login-story"><Link href="/" className="admin-login-brand">BODY MUSE<small>OWN YOUR SCENT</small></Link><div><p className="eyebrow">KHÔNG GIAN DÀNH CHO ĐỘI NGŨ</p><h2>Một cửa hàng chỉn chu.<br/>Từ bên trong.</h2><p>Quản lý đơn hàng, chăm sóc khách hàng và theo dõi hoạt động BODY MUSE trong cùng một không gian.</p></div><p className="admin-login-footnote">BODY MUSE · Công nghệ marketing</p></section><section className="admin-login-form"><div><span className="admin-login-icon"><Icon name="shield" size={26}/></span><p className="eyebrow">CHÀO MỪNG TRỞ LẠI</p><h1>Đăng nhập quản trị</h1><p className="admin-login-description">Sử dụng mật khẩu quản trị để tiếp tục.</p><AdminForm endpoint="/api/admin/login" mode="POST" redirectTo={safeAdminNext(next)}><label>Mật khẩu quản trị<input name="password" type="password" required autoComplete="current-password" placeholder="Nhập mật khẩu quản trị"/></label></AdminForm><Link href="/" className="admin-login-back"><Icon name="arrow" size={15}/>Trở về cửa hàng</Link><p className="admin-login-demo">Bản demo cho đồ án · Không thu tiền thật</p></div></section></main>;
}
