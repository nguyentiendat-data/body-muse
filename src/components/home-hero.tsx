"use client";
import Link from "next/link";
import { useState } from "react";
import { CampaignImage } from "./campaign-image";
import { Icon } from "./ui-icon";

const slides = [
 { eyebrow: "BODY MUSE · OWN YOUR SCENT", title: "Phong thái riêng.", accent: "Dấu hương riêng.", description: "Một thói quen chỉn chu, một dấu ấn khó quên. Khám phá bộ sưu tập chăm sóc cơ thể dành cho người đàn ông hiện đại.", image: "/products/trial-kit-cover.png", alt: "Bộ kit BODY MUSE mở hộp với ba chai mini Ocean, Woody và Citrus", href: "/shop", cta: "Khám phá bộ sưu tập", tag: "TRIAL KIT / 3 DẤU HƯƠNG", theme: "navy", crop: false },
 { eyebrow: "KHÁM PHÁ OCEAN", title: "Trong trẻo như biển.", accent: "Điềm tĩnh như bạn.", description: "Lăn khử mùi Ocean 50 ml. Một lựa chọn gọn gàng để bắt đầu ngày mới với phong thái của riêng mình.", image: "/products/ocean-campaign.png", alt: "Lăn khử mùi nam Ocean 50 ml", href: "/shop/lan-khu-mui-ocean", cta: "Khám phá Ocean", tag: "OCEAN / LĂN KHỬ MÙI 50 ML", theme: "ocean", crop: true },
 { eyebrow: "MỘT LỜI CHÀO TỪ BODY MUSE", title: "Lần đầu gặp gỡ.", accent: "Thêm một chút ưu đãi.", description: "Giảm 10% cho đơn đầu tiên với mã WELCOME10. Từ món chăm sóc mỗi ngày đến một bộ quà thật tinh tế.", image: "/products/trial-kit-detail.png", alt: "Ba chai mini Ocean, Woody và Citrus trong bộ Trial Kit", href: "/#sale", cta: "Khám phá ưu đãi", tag: "WELCOME10 / ĐƠN ĐẦU TIÊN", theme: "sand", crop: false }
];
export function HomeHero() {
 const [index, setIndex] = useState(0);
 const slide = slides[index];
 const go = (offset: number) => setIndex(current => (current + offset + slides.length) % slides.length);
 return <section className="home-hero-shell" aria-roledescription="băng chuyển" aria-label="Bộ sưu tập BODY MUSE">
  <div className={"home-hero-banner hero-theme-" + slide.theme}>
   <div className="home-hero-copy" key={index + "-copy"}>
    <p className="hero-overline"><span/>{slide.eyebrow}</p>
    <h1>{slide.title}<br/><em>{slide.accent}</em></h1>
    <p className="home-hero-description">{slide.description}</p>
    <Link href={slide.href} className="btn hero-shop-button">{slide.cta}<Icon name="arrow" size={17}/></Link>
    <div className="home-hero-assurance"><span><Icon name="shield" size={15}/>Đổi trả 30 ngày</span><span><Icon name="truck" size={15}/>Miễn ship từ 399k</span></div>
   </div>
   <div className="home-hero-art"><div className="hero-image-frame" key={slide.image}><CampaignImage src={slide.image} alt={slide.alt} priority={index===0} cropRollOn={slide.crop} className="object-contain"/></div><span className="hero-art-caption">{slide.tag}</span></div>
   <button className="hero-arrow hero-arrow-prev" aria-label="Banner trước" onClick={()=>go(-1)}><Icon name="arrow" size={17}/></button>
   <button className="hero-arrow hero-arrow-next" aria-label="Banner tiếp theo" onClick={()=>go(1)}><Icon name="arrow" size={17}/></button>
   <div className="hero-slide-pagination" aria-label="Chọn banner">{slides.map((item,i)=><button key={item.theme} aria-label={"Xem banner " + (i+1)} aria-pressed={index===i} onClick={()=>setIndex(i)}><span/></button>)}</div>
   <span className="hero-slide-number">0{index+1} / 0{slides.length}</span>
  </div>
 </section>;
}
