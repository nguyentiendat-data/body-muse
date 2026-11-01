import { siteConfig } from "@/lib/site-config";
export const metadata = {
  title: "Chính sách | BODY MUSE",
  description:
    "Chính sách giao hàng, đổi trả và bảo mật áp dụng cho bản demo BODY MUSE.",
};
export default function Page() {
  return (
    <main id="main" className="page max-w-4xl">
      <h1 className="title">Mua nhẹ đầu hơn.</h1>
      <p className="notice bg-sun mb-6">
        Chính sách giả định cho đồ án. Nhóm cần xác nhận trước khi kinh doanh
        thật.
      </p>
      <div className="grid gap-5">
        {[
          [
            "Giao hàng",
            "Thời gian dự kiến 2–4 ngày. Phí giao hàng 25.000đ, miễn phí khi tạm tính từ 399.000đ trước giảm giá.",
          ],
          [
            "Đổi trả trong 30 ngày",
            "Bạn có thể yêu cầu đổi trả trong vòng 30 ngày từ khi nhận hàng. Điều kiện, bằng chứng và quy trình cụ thể: [Nhóm bổ sung chính sách chính thức].",
          ],
          [
            "Thanh toán demo",
            "Chỉ mô phỏng COD và chuyển khoản thủ công. Không thu tiền thật. Không nhập thông tin thẻ và không chuyển tiền vào tài khoản minh họa.",
          ],
          [
            "Bảo mật và cookie",
            "Đơn hàng, email và kết quả trắc nghiệm được lưu cùng nguồn truy cập UTM để phục vụ báo cáo đồ án. UTM lưu lần chạm đầu trong 30 ngày. Cookie đăng nhập chỉ được đọc bởi máy chủ. Giỏ hàng lưu trên trình duyệt. GA4 và Meta Pixel chỉ hoạt động sau khi bạn đồng ý cookie.",
          ],
          [
            "Quyền đối với dữ liệu",
            `Bạn có thể liên hệ ${siteConfig.email} để yêu cầu xem, sửa hoặc xóa dữ liệu. Thời hạn lưu trữ và đơn vị quản lý dữ liệu: [Nhóm bổ sung]. Không sử dụng thông tin nhạy cảm thật để thử nghiệm.`,
          ],
          [
            "Liên hệ",
            `Email: ${siteConfig.email}. Fanpage: ${siteConfig.facebookUrl}. Messenger: ${siteConfig.messengerUrl}. Địa chỉ: [Địa chỉ liên hệ].`,
          ],
        ].map(([title, body]) => (
          <section className="panel" key={title}>
            <h2 className="font-display text-2xl mb-4">{title}</h2>
            <p className="leading-relaxed">{body}</p>
          </section>
        ))}
      </div>
    </main>
  );
}
