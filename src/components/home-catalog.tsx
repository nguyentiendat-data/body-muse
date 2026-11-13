"use client";
import Link from "next/link";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import type { Product } from "@/types/api";
import { CatalogState, ProductCard, useProducts } from "./catalog";
import { CampaignImage } from "./campaign-image";
import { Icon } from "./ui-icon";

const categories = [
 { name: "Tất cả sản phẩm", href: "/shop", image: "/products/bm-12.jpg", key: "all" },
 { name: "Xịt khử mùi", href: "/shop?category=xit-khu-mui", image: "/products/bm-01.jpg", key: "xit-khu-mui" },
 { name: "Tắm & gội", href: "/shop?category=tam-goi", image: "/products/bm-04.jpg", key: "tam-goi" },
 { name: "Lăn & nước hoa", href: "/shop?category=lan-nuoc-hoa", image: "/products/ocean-campaign.png", key: "lan-nuoc-hoa", crop: true },
 { name: "Bộ thử mùi", href: "/shop/discovery-kit", image: "/products/trial-kit-detail.png", key: "kit" },
 { name: "Bộ quà tặng", href: "/shop?category=bo-qua", image: "/products/bm-12.jpg", key: "bo-qua" },
 { name: "Dưỡng thể", href: "/shop?category=duong-the", image: "/products/bm-08.jpg", key: "duong-the" },
 { name: "Ocean", href: "/shop?scent=ocean", image: "/products/ocean-campaign.png", key: "ocean", crop: true }
];
export function ProductRail({ products, label }: { products: Product[]; label: string }) {
 const rail = useRef<HTMLDivElement>(null);
 const [edges, setEdges] = useState({start: true, end: false});
 useEffect(()=>{
  const element=rail.current;
  if(!element) return;
  const update=()=>setEdges({start: element.scrollLeft < 4, end: element.scrollLeft + element.clientWidth >= element.scrollWidth - 4});
  update();
  const observer=new ResizeObserver(update);
  observer.observe(element);
  element.addEventListener("scroll",update,{passive:true});
  return ()=>{observer.disconnect();element.removeEventListener("scroll",update);};
 },[products]);
 function move(direction: number) {
  const element=rail.current;
  if(element) element.scrollBy({left:direction*(element.clientWidth+20),behavior:window.matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth"});
 }
 return <div className="product-rail-shell"><div className="product-rail" ref={rail} aria-label={label}>{products.map(product=><ProductCard product={product} key={product.id}/>)}</div>{products.length > 2 && <><button className="rail-arrow rail-prev" aria-label={"Sản phẩm trước: "+label} disabled={edges.start} onClick={()=>move(-1)}><Icon name="arrow" size={16}/></button><button className="rail-arrow rail-next" aria-label={"Sản phẩm tiếp theo: "+label} disabled={edges.end} onClick={()=>move(1)}><Icon name="arrow" size={16}/></button></>}</div>;
}
export function HomeCatalog() {
 const {products,loading,error}=useProducts();
 const [tab,setTab]=useState("welcome");
 const choices=[{key:"welcome",title:"Chào bạn mới",subtitle:"Ưu đãi đơn đầu",ids:["BM-13","BM-11","BM-01","BM-04","BM-10","BM-12"]},{key:"daily",title:"Chăm sóc mỗi ngày",subtitle:"Gọn trong thói quen",ids:["BM-01","BM-02","BM-03","BM-04","BM-06","BM-09"]},{key:"gift",title:"Bộ quà & thử mùi",subtitle:"Tinh tế để trao",ids:["BM-11","BM-12","BM-10","BM-13"]}];
 function tabKey(event: KeyboardEvent<HTMLButtonElement>, index: number) {
  const offsets: Record<string,number> = {ArrowRight:1,ArrowLeft:-1,Home:-index,End:choices.length-1-index};
  if (!(event.key in offsets)) return;
  event.preventDefault();
  const next=choices[(index+offsets[event.key]+choices.length)%choices.length];
  setTab(next.key);
  document.getElementById("tab-"+next.key)?.focus();
 }
 const selected=choices.find(item=>item.key===tab)!;
 const featured=selected.ids.map(id=>products.find(p=>p.id===id)).filter((p):p is Product=>Boolean(p));
 const daily=products.filter(p=>["BM-01","BM-02","BM-03","BM-04","BM-05","BM-06","BM-07","BM-08"].includes(p.id));
 return <>
  <section className="wrap home-categories" aria-label="Khám phá danh mục"><div className="round-category-list">{categories.map(item=>{
   const count=products.filter(p=>item.key==="all" || (item.key==="kit"?p.id==="BM-11":item.key==="ocean"?p.scent==="ocean":p.category===item.key)).length;
   return <Link href={item.href} className="round-category" key={item.key}><span className="round-category-photo"><CampaignImage src={item.image} alt={item.name} cropRollOn={item.crop} sizes="140px" className="object-cover"/></span><strong>{item.name}</strong><small>{loading?"Khám phá ngay":error?"Xem sản phẩm":count+" sản phẩm"}</small></Link>;
  })}</div><span className="category-accent" aria-hidden="true"/></section>
  <section className="wrap home-picks" id="sale"><header className="centered-section-heading"><p className="eyebrow">CÙNG BODY MUSE CHỈN CHU HƠN MỖI NGÀY</p><h2>Gặp gỡ mùi hương. <em>Ghi dấu phong thái.</em></h2><p>Những lựa chọn cho ngày mới tự tin, buổi hẹn đáng nhớ và món quà thật tinh tế.</p></header>
   <div className="deal-panel"><div className="deal-toolbar"><div className="deal-tabs" role="tablist" aria-label="Bộ sưu tập gợi ý">{choices.map((item,index)=><button role="tab" tabIndex={tab===item.key?0:-1} onKeyDown={event=>tabKey(event,index)} key={item.key} id={"tab-"+item.key} aria-selected={tab===item.key} aria-controls="home-deal-products" onClick={()=>setTab(item.key)}><strong>{item.title}</strong><span>{item.subtitle}</span></button>)}</div><div className="welcome-coupon"><Icon name="bag" size={17}/><span>Đơn đầu giảm <strong>10%</strong></span><code>WELCOME10</code></div></div>
    <div id="home-deal-products" role="tabpanel" aria-labelledby={"tab-"+tab}><CatalogState loading={loading} error={error}/>{!loading&&!error&&<ProductRail key={tab} products={featured} label={selected.title}/>}</div>
    <div className="deal-footnote"><span>Giá demo được hiển thị rõ ràng. WELCOME10 dùng một lần cho mỗi số điện thoại.</span><Link href="/shop">Xem toàn bộ sản phẩm <Icon name="arrow" size={15}/></Link></div>
   </div>
  </section>
  <section className="wrap home-feature-banners" aria-label="Bộ sưu tập nổi bật"><Link href="/shop/discovery-kit" className="feature-banner feature-kit"><div><p className="eyebrow">MỘT BỘ KIT · BA CÁ TÍNH</p><h2>Chưa biết chọn mùi?<br/><em>Bắt đầu từ đây.</em></h2><span className="text-link">Khám phá Trial Kit <Icon name="arrow" size={17}/></span></div><div className="feature-banner-image"><CampaignImage src="/products/trial-kit-detail.png" alt="Bộ thử ba mùi Ocean, Woody và Citrus" sizes="(max-width:768px) 40vw, 300px" className="object-cover"/></div></Link><Link href="/shop/lan-khu-mui-ocean" className="feature-banner feature-ocean"><div><p className="eyebrow">OCEAN / LĂN KHỬ MÙI NAM</p><h2>Một chút tươi mới.<br/><em>Cả ngày phong độ.</em></h2><span className="text-link">Khám phá Ocean <Icon name="arrow" size={17}/></span></div><div className="feature-banner-image"><CampaignImage src="/products/ocean-campaign.png" alt="Lăn khử mùi Ocean 50 ml" cropRollOn sizes="(max-width:768px) 40vw, 300px"/></div></Link></section>
  <section className="wrap home-daily"><div className="home-section-title"><div><p className="eyebrow">NHỮNG ĐIỀU NHỎ LÀM NÊN PHONG THÁI</p><h2>Chăm sóc mỗi ngày</h2></div><Link href="/shop?category=tam-goi" className="text-link">Xem thêm <Icon name="arrow" size={17}/></Link></div><CatalogState loading={loading} error={error}/>{!loading&&!error&&<ProductRail products={daily} label="Chăm sóc mỗi ngày"/>}</section>
 </>;
}
