import Link from "next/link";
import { HomeHero } from "./home-hero";
import { HomeCatalog } from "./home-catalog";
import { SubscribeForm } from "./home-interactions";
import { CampaignImage } from "./campaign-image";
import { Icon } from "./ui-icon";

export function Home() {
 return <main id="main" className="boutique-home">
  <HomeHero/>
  <HomeCatalog/>
  <section className="wrap home-scent-story"><div className="scent-story-heading"><p className="eyebrow">MÙI HƯƠNG LÀ CHỮ KÝ CỦA BẠN</p><h2>Không cần giống ai.<br/><em>Chỉ cần đúng là bạn.</em></h2><p>Tươi mát cho ngày thường, ấm áp cho buổi hẹn. Khám phá những sắc thái mùi hương dành cho nhịp sống của riêng bạn.</p><Link href="/quiz" className="btn primary">Tìm mùi của bạn <Icon name="arrow" size={17}/></Link></div><div className="home-scent-cards">{[["ocean","Ocean","Trong trẻo & điềm tĩnh","/products/ocean-campaign.png"],["daisy-blue","Daisy Blue","Tươi mới & gọn gàng","/products/bm-01.jpg"],["peony-amber","Peony Amber","Ấm áp & tinh tế","/products/bm-02.jpg"]].map(([key,name,description,image])=><Link href={"/shop?scent="+key} key={key} className="home-scent-card"><div><CampaignImage src={image} alt={name} cropRollOn={key==="ocean"} sizes="(max-width:768px) 40vw, 200px" className="object-cover"/></div><h3>{name}</h3><p>{description}</p><span>Khám phá <Icon name="arrow" size={13}/></span></Link>)}</div></section>
  <section className="wrap home-campaign"><div className="campaign-poster"><CampaignImage src="/sale-11-11.png" alt="Poster BODY MUSE 11.11 Mega Sale — ưu đãi lên đến 70%" sizes="(max-width:768px) 80vw, 320px" className="object-contain"/></div><div className="campaign-copy"><p className="eyebrow">GÓC CHIẾN DỊCH / BODY MUSE 11.11</p><h2>Thêm một món yêu thích.<br/><em>Thêm một ngày chỉn chu.</em></h2><p>Khám phá bộ sưu tập chăm sóc cơ thể và những bộ quà dành cho người đặc biệt.</p><Link href="/shop" className="btn primary">Khám phá sản phẩm <Icon name="arrow" size={16}/></Link><small>Poster chiến dịch dùng cho đồ án. Mức giảm trên ảnh chưa tự động áp dụng; giỏ hàng sử dụng giá demo đang hiển thị.</small></div></section>
  <section className="wrap home-service-promises">{[["truck","Giao hàng tận nơi","2–4 ngày · Miễn phí ship từ 399.000đ"],["shield","An tâm lựa chọn","Đổi trả 30 ngày theo chính sách demo"],["box","Chăm sóc từ đầu đến chân","Gọn trong một thói quen mỗi ngày"],["mail","Luôn sẵn sàng lắng nghe","Nhắn BODY MUSE khi bạn cần gợi ý"]].map(([icon,title,text])=><div key={title}><Icon name={icon as "truck"|"shield"|"box"|"mail"} size={27}/><div><h3>{title}</h3><p>{text}</p></div></div>)}</section>
  <section className="home-newsletter"><div className="wrap"><div><p className="eyebrow">MỘT CHÚT THÂN QUEN, MỘT CHÚT ƯU ĐÃI</p><h2>Nhận thư từ <em>BODY MUSE</em></h2><p>Để lại email và nhận mã giảm 10% cho đơn đầu tiên.</p></div><SubscribeForm/></div></section>
 </main>;
}
