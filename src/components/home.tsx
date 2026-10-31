import Image from "next/image";
import Link from "next/link";
import { FeaturedProducts, SubscribeForm } from "./home-interactions";

export function Home() {
  return (
    <main id="main">
      <section className="wrap grid md:grid-cols-2 gap-8 md:gap-12 items-center pt-4 pb-10 md:pb-16">
        <div>
          <p className="font-bold tracking-widest text-sm mb-5">
            THƠM THEO CÁCH CỦA BẠN
          </p>
          <h1 className="font-display font-extrabold text-[40px] md:text-[64px] leading-[1.05]">
            Mùi hương của riêng bạn, từ đầu đến chân.
          </h1>
          <p className="my-6 text-lg max-w-lg">
            Từ một ngày đi học đến buổi hẹn tối. Chăm sóc cơ thể gọn nhẹ, để bạn
            tự tin là chính mình.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/shop" className="btn primary">
              Khám phá ngay
            </Link>
            <Link href="/quiz" className="btn">
              Tìm mùi của bạn
            </Link>
          </div>
          <div className="flex flex-wrap gap-3 mt-6 text-sm font-semibold">
            <span>Đổi trả 30 ngày</span>
            <span>Giao hàng 2–4 ngày</span>
            <span>Miễn ship từ 399k</span>
          </div>
        </div>
        <div className="relative aspect-square rounded-[32px] border-[3px] border-ink overflow-hidden bg-photo">
          <Image
            src="/hero.jpg"
            quality={50}
            decoding="sync"
            alt="Bộ sản phẩm chăm sóc cơ thể BODY MUSE với ba mùi hương"
            fill
            priority
            fetchPriority="high"
            sizes="(max-width: 768px) 92vw, 48vw"
            className="object-cover"
          />
        </div>
      </section>
      <div
        className="wrap flex gap-3 overflow-x-auto pb-8"
        aria-label="Nhóm sản phẩm"
      >
        {[
          ["xit-khu-mui", "Xịt khử mùi"],
          ["tam-goi", "Tắm gội"],
          ["duong-the", "Dưỡng thể"],
          ["lan-nuoc-hoa", "Lăn, nước hoa"],
          ["bo-qua", "Bộ quà"],
        ].map(([key, label]) => (
          <Link
            key={key}
            className="btn shrink-0"
            href={`/shop?category=${key}`}
          >
            {label}
          </Link>
        ))}
      </div>
      <section className="wrap pb-12">
        <div className="flex items-end justify-between gap-4 mb-6">
          <h2 className="section-title">Được chọn nhiều nhất</h2>
          <Link href="/shop" className="text-cobalt-text underline shrink-0">
            Xem tất cả
          </Link>
        </div>
        <FeaturedProducts />
      </section>
      <section className="wrap mb-12">
        <div className="panel !bg-cobalt text-cream md:!p-12 flex flex-wrap items-center justify-between gap-6">
          <div>
            <h2 className="section-title">Chưa biết chọn mùi nào?</h2>
            <p className="mt-4">
              5 câu hỏi. Một mùi hương hợp bạn. Không cần nghĩ nhiều.
            </p>
          </div>
          <Link href="/quiz" className="btn !bg-sun">
            Làm trắc nghiệm ngay
          </Link>
        </div>
      </section>
      <section className="wrap grid md:grid-cols-3 gap-4 mb-12">
        {[
          [
            "Thơm vừa đủ, gần mới biết",
            "Ba cá tính mùi hương, cho những nhịp sống khác nhau.",
          ],
          [
            "Chăm từ đầu đến chân",
            "Xịt khử mùi, tắm gội và dưỡng thể trong một thói quen gọn nhẹ.",
          ],
          [
            "Mua nhẹ đầu hơn",
            "Giá rõ ràng theo dung tích. Chính sách đổi trả trong 30 ngày.",
          ],
        ].map(([title, text], index) => (
          <div
            className={`panel ${index === 0 ? "!bg-daisy" : index === 1 ? "!bg-sun" : "!bg-mint"}`}
            key={title}
          >
            <p className="font-display text-3xl mb-6">0{index + 1}</p>
            <h3 className="font-bold text-xl mb-3">{title}</h3>
            <p>{text}</p>
          </div>
        ))}
      </section>
      <section className="wrap">
        <div className="panel !bg-mint grid md:grid-cols-2 gap-6 items-center">
          <div>
            <h2 className="section-title">Giảm 10% cho đơn đầu tiên</h2>
            <p className="mt-3">Để lại email, nhận mã ngay tại đây.</p>
          </div>
          <SubscribeForm />
        </div>
      </section>
    </main>
  );
}
