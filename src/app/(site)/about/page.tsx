import Link from "next/link";
import { siteConfig } from "@/lib/site-config";
export const metadata = {
  title: "Về chúng mình | BODY MUSE",
  description: `BODY MUSE — dự án môn ${siteConfig.course} về mùi hương và chăm sóc cơ thể dành cho nam.`,
};
export default function Page() {
  return (
    <main id="main" className="page max-w-4xl">
      <p className="font-bold mb-4">CHÀO BẠN, CHÚNG MÌNH LÀ BODY MUSE</p>
      <h1 className="title">
        Chăm sóc mình.
        <br />
        Theo cách của mình.
      </h1>
      <section className="panel !bg-mint text-lg leading-relaxed">
        <p>
          BODY MUSE là thương hiệu minh họa trong đồ án môn {siteConfig.course}{" "}
          về nước hoa và chăm sóc cơ thể dành cho nam.
        </p>
        <p className="mt-5 font-bold">{siteConfig.slogan}</p>
        <p className="mt-5">
          Chúng mình xây dựng ba cá tính mùi hương: Daisy Blue tươi sạch, Peony
          Amber ấm mềm và Mint Soda sảng khoái. Bạn chọn một mùi, hoặc thay đổi
          theo từng ngày.
        </p>
        <p className="mt-5">
          Website phục vụ học tập, không thu tiền thật. Tên, giá, dung tích và
          chính sách là giả định.
        </p>
        <p className="mt-5">Nhóm thực hiện: {siteConfig.teamName}</p>
        <p className="mt-5">
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
            Fanpage Facebook
          </a>
        </p>
      </section>
      <Link className="btn primary mt-8" href="/quiz">
        Tìm mùi của bạn
      </Link>
    </main>
  );
}
