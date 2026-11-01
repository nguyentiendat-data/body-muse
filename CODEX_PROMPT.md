# Prompt cho Codex: làm toàn bộ website BODY MUSE

VAI TRÒ
Bạn là kỹ sư full-stack, làm MỘT MÌNH toàn bộ website: giao diện khách, back-end, cơ sở dữ liệu, trang quản trị, tài khoản khách và chuẩn bị để deploy lên Vercel.

DỰ ÁN
Website bán hàng demo cho BODY MUSE, thương hiệu nước hoa và chăm sóc cơ thể dành cho nam (đồ án Công nghệ marketing). Website là trang đích cho bài đăng TikTok, Facebook, Instagram, Threads, nên mọi đơn hàng, email và kết quả trắc nghiệm phải lưu kèm UTM. Không thu tiền thật: chỉ COD và chuyển khoản thủ công. Toàn bộ giao diện và thông báo lỗi bằng tiếng Việt, ưu tiên mobile (390 px), khách chủ yếu là nam 18 đến 30 tuổi dùng điện thoại.

CÔNG NGHỆ
Next.js 15 (App Router), TypeScript strict, Tailwind CSS 3, Drizzle ORM, Postgres (Neon, nối qua Vercel), Zod, jose, Vitest, npm. Font qua next/font/google (subset vietnamese), gán vào biến CSS --font-fraunces và --font-be-vietnam (tailwind.config.ts đã dùng hai biến này). Không thêm thư viện giao diện nặng.

HIỆN TRẠNG REPO (đã có sẵn, đừng tạo lại)
- Khung Next.js tạo tay: package.json, tsconfig.json, tailwind.config.ts (đã có màu thương hiệu), postcss, eslint, drizzle.config.ts, .env.example, .gitignore, src/app/layout.tsx, src/app/page.tsx (trang tạm, sẽ xóa ở giai đoạn 5).
- Thư mục rỗng đã đặt đúng chỗ: src/app/(site), src/app/admin, src/app/api, src/components, src/db, src/lib, src/data, src/types.
- public/: logo-badge.png, hero.jpg, products/bm-01.jpg đến bm-12.jpg, detail-*.jpg, set-*.jpg (xem mục ẢNH). Không xóa, không tạo lại ảnh.
- design/: mã nguồn 11 màn hình giao diện mẫu (xem mục BÁM SÁT BỐ CỤC). Không xóa; không để design/ lọt vào build (đã loại khỏi tsconfig và eslint).
- Khung này tạo tay nên CHƯA từng chạy. Việc đầu tiên: npm install, rồi npm run build. Nếu lỗi phiên bản thư viện thì sửa package.json cho đến khi build chạy được.

CÁCH LÀM (quan trọng vì việc dài)
- Làm theo 7 GIAI ĐOẠN bên dưới, đúng thứ tự. Xong mỗi giai đoạn: chạy npm run build và npm run lint, commit với message rõ ràng, rồi mới sang giai đoạn sau.
- Sau mỗi giai đoạn cập nhật PROGRESS.md: đã xong gì, còn gì, quyết định đã đưa ra. Nếu phiên làm việc bị ngắt, đọc PROGRESS.md và làm tiếp từ giai đoạn đang dở.
- Làm thẳng trên nhánh main, commit nhỏ.
- Thiếu thông tin thì chọn mặc định hợp lý, ghi vào PROGRESS.md, không dừng lại hỏi.

SẢN PHẨM (id, slug, line, tên, nhóm, mùi, quy cách, giá VND, giá trên 100 ml hay 100 g)
BM-01, xit-khu-mui-daisy-blue, xit-khu-mui, Xịt khử mùi Daisy Blue, xit-khu-mui, daisy-blue, 104 g, 129000, 124000 / 100 g
BM-02, xit-khu-mui-peony-amber, xit-khu-mui, Xịt khử mùi Peony Amber, xit-khu-mui, peony-amber, 104 g, 129000, 124000 / 100 g
BM-03, xit-khu-mui-mint-soda, xit-khu-mui, Xịt khử mùi Mint Soda, xit-khu-mui, mint-soda, 104 g, 129000, 124000 / 100 g
BM-04, sua-tam-gel-mint-soda, sua-tam-gel, Sữa tắm gel Mint Soda, tam-goi, mint-soda, 350 ml, 149000, 42600 / 100 ml
BM-05, sua-tam-gel-peony-amber, sua-tam-gel, Sữa tắm gel Peony Amber, tam-goi, peony-amber, 350 ml, 149000, 42600 / 100 ml
BM-06, sua-tam-goi-2in1-daisy-blue, sua-tam-goi-2in1, Sữa tắm gội 2 trong 1 Daisy Blue, tam-goi, daisy-blue, 400 ml, 159000, 39800 / 100 ml
BM-07, dau-goi-mint-soda, dau-goi, Dầu gội Mint Soda, tam-goi, mint-soda, 350 ml, 169000, 48300 / 100 ml
BM-08, duong-the-peony-amber, duong-the, Dưỡng thể Peony Amber, duong-the, peony-amber, 250 ml, 179000, 71600 / 100 ml
BM-09, lan-khu-mui-daisy-blue, lan-khu-mui, Lăn khử mùi Daisy Blue, lan-nuoc-hoa, daisy-blue, 50 ml, 99000, 198000 / 100 ml
BM-10, nuoc-hoa-daisy-blue-edt, nuoc-hoa, Nước hoa Daisy Blue EDT, lan-nuoc-hoa, daisy-blue, 50 ml, 489000, 978000 / 100 ml
BM-11, discovery-kit, discovery-kit, Discovery Kit (5 mẫu x 2 ml), bo-qua, all, 10 ml, 99000, 990000 / 100 ml
BM-12, muse-box, muse-box, Muse Box (xịt + sữa tắm + lăn + kit), bo-qua, all, 4 món, 399000, không có
Tầng hương: daisy-blue = đầu cam bergamot, giữa hoa cúc, cuối xạ hương trắng. peony-amber = đầu quýt và tiêu hồng, giữa mẫu đơn, cuối hổ phách và gỗ tuyết tùng. mint-soda = đầu bạc hà và chanh, giữa lá xanh, cuối gỗ nhẹ.
Giá, tên và dung tích là số giả định cho bản demo, chỉ cần sửa ở seed khi nhóm có số thật.

HỢP ĐỒNG API (src/types/api.ts)
Category = xit-khu-mui | tam-goi | duong-the | lan-nuoc-hoa | bo-qua
Scent = daisy-blue | peony-amber | mint-soda | all
Product = { id, slug, line, name, category, scent, size, priceVnd, unitPriceVnd | null, unitBasis: "100 ml" | "100 g" | null, notes: { top, mid, base } | null, stock, image | null, isActive }
Utm = { source?, medium?, campaign? }
OrderStatus = new | shipping | done | cancelled
Review = { id, stars (1-5), name, body, reply | null, createdAt }
User = { id, phone }
Lỗi: HTTP 400, 401, 404 hoặc 429 với { error: { code, message } }, message bằng tiếng Việt, hiển thị nguyên văn cho khách.
GET  /api/products?category=&scent=&sort=popular|price_asc|unit_asc  ->  { products: Product[] }
GET  /api/products/[slug]  ->  { product, related: Product[] (cùng line), reviews: Review[] (chỉ đã duyệt) }
POST /api/orders  { customer: { name, phone, address, note? }, paymentMethod: cod | bank, items: [{ productId, qty 1-9, scent? }], couponCode?, utm }  ->  201 { code: "BM-0001", subtotalVnd, shippingVnd, discountVnd, totalVnd }
GET  /api/orders/[code]?phone=  ->  { code, status, totalVnd, items: [{ name, qty, priceVnd }], createdAt }
POST /api/subscribe  { email, utm }  ->  { ok: true, couponCode: "WELCOME10" }
POST /api/reviews  { productId, stars, name, body }  ->  { ok: true, status: "pending" }
POST /api/quiz  { answers: number[5] (mỗi số 0, 1 hoặc 2), scent, utm }  ->  { ok: true }
TÀI KHOẢN (chỉ cần số điện thoại và mật khẩu; phiên là cookie httpOnly tên bm_session do server đặt, token không nằm trong body)
POST /api/auth/register  { phone, password, confirmPassword }  ->  201 { user } (đăng ký xong là đăng nhập luôn)
POST /api/auth/login  { phone, password }  ->  { user }
POST /api/auth/logout  ->  { ok: true }
GET  /api/auth/me  ->  { user | null }
POST /api/auth/forgot  { phone }  ->  { ok: true, resendAfterSec: 60 } (luôn trả ok, kể cả số chưa đăng ký, để không lộ số nào có tài khoản)
POST /api/auth/verify-otp  { phone, otp }  ->  { ok: true, resetToken }
POST /api/auth/reset  { phone, resetToken, password, confirmPassword }  ->  { ok: true }
Quy tắc tài khoản: số điện thoại 10 số bắt đầu bằng 0; mật khẩu từ 8 ký tự, có cả chữ và số; confirmPassword phải khớp; OTP 6 số, hiệu lực 5 phút, nhập sai tối đa 5 lần. Mã lỗi: PHONE_TAKEN, BAD_CREDENTIALS, WEAK_PASSWORD, PASSWORD_MISMATCH, OTP_INVALID, OTP_EXPIRED, TOO_MANY_ATTEMPTS.
Quy tắc tiền: phí ship 25000, miễn phí khi tạm tính từ 399000. Mã WELCOME10 giảm 10% tạm tính, mỗi số điện thoại dùng một lần. Server luôn tính lại giá từ DB, không tin giá client gửi.

GIAI ĐOẠN 1: KHUNG DỰ ÁN VÀ DỮ LIỆU
1. npm install, npm run build. Sửa package.json nếu lỗi phiên bản. Chuyển dự án sang dùng src/app/(site) khi tới giai đoạn 5.
2. Tạo src/types/api.ts đúng theo HỢP ĐỒNG API.
3. Tạo src/data/products.ts (12 sản phẩm, tồn kho mặc định 50, kèm 3 tầng hương, trường image trỏ tới /products/bm-XX.jpg) và src/data/quiz.ts (nội dung ở mục TRẮC NGHIỆM bên dưới).
4. Thêm script npm run check = lint + typecheck + test (đã có trong package.json, kiểm tra chạy được).

GIAI ĐOẠN 2: CƠ SỞ DỮ LIỆU VÀ API
Drizzle + Postgres (driver @neondatabase/serverless). Schema trong src/db/schema.ts, kết nối trong src/db/index.ts, nạp dữ liệu trong src/db/seed.ts. Bảng: products; orders (code duy nhất, user_id không bắt buộc, name, phone, address, note, payment_method, status, subtotal, shipping, discount, total, coupon_code, utm_source, utm_medium, utm_campaign, created_at); order_items (order_id, product_id, name_snapshot, price_snapshot, qty, scent); subscribers (email duy nhất, utm_*, created_at); reviews (product_id, stars, name, body, status pending|approved|rejected, reply, created_at); quiz_results (answers jsonb, scent, utm_*, created_at); users (id, phone duy nhất, password_hash, created_at); otp_codes (phone, code_hash, expires_at, attempts, used_at, created_at).
Mã đơn BM-0001 tăng dần bằng sequence. Script: npm run db:push, npm run db:seed (nạp 12 sản phẩm từ src/data/products.ts, chạy lại không nhân đôi).
Làm đủ các endpoint trong hợp đồng (trừ /api/auth/* ở giai đoạn 3). Zod kiểm tra mọi đầu vào. Số điện thoại VN 10 số bắt đầu bằng 0. Tạo đơn trong một transaction: kiểm tồn kho, trừ tồn kho, lưu dòng hàng kèm giá tại thời điểm đặt; hết hàng trả 400 với code OUT_OF_STOCK. Nếu khách đã đăng nhập thì gắn user_id vào đơn. Giới hạn 10 request một phút mỗi IP cho các POST (trả 429). Tra cứu đơn phải đúng cả mã đơn và số điện thoại.

GIAI ĐOẠN 3: TÀI KHOẢN KHÁCH HÀNG (đăng ký, đăng nhập, quên mật khẩu bằng OTP)
Làm đủ 7 endpoint /api/auth/*. Mật khẩu băm bằng scrypt của node:crypto (muối ngẫu nhiên riêng cho từng người, so sánh bằng timingSafeEqual), không dùng thư viện native. Không bao giờ log hay trả về mật khẩu.
Phiên: cookie httpOnly, Secure, SameSite=Lax, tên bm_session, ký HS256 bằng jose với SESSION_SECRET, hạn 30 ngày, tách riêng cookie của admin. GET /api/auth/me đọc cookie này.
OTP: biến OTP_MODE. Mặc định demo: mã cố định 123456, không gửi SMS. OTP_MODE=sms: sinh mã 6 số bằng crypto.randomInt, chỉ lưu bản băm, gửi qua hàm sendSms(phone, text) trong src/lib/sms.ts; viết sẵn giao diện hàm và để TODO chỗ gắn nhà cung cấp SMS (nhóm điền khóa sau), không bịa khóa hay đường dẫn API.
verify-otp đúng thì trả resetToken (JWT 10 phút, dùng một lần) và đánh dấu used_at; reset chỉ nhận resetToken hợp lệ cho đúng số điện thoại đó.
Giới hạn: gửi OTP tối đa 3 lần mỗi giờ cho mỗi số và cách nhau ít nhất 60 giây; đăng nhập sai 5 lần trong 15 phút (tính theo số điện thoại và IP) thì khóa 15 phút, trả 429. Trả cùng một thông báo cho sai số điện thoại và sai mật khẩu.

GIAI ĐOẠN 4: TRANG QUẢN TRỊ (/admin, tiếng Việt)
Biến môi trường: DATABASE_URL, ADMIN_PASSWORD, SESSION_SECRET. Đăng nhập bằng mật khẩu, cookie httpOnly ký HS256 bằng jose, hạn 7 ngày. src/middleware.ts chặn /admin/* (trừ /admin/login) và /api/admin/*, chỉ dùng jose.
Trang: Tổng quan (4 thẻ số: đơn mới, doanh thu, email thu được, làm xong trắc nghiệm; bảng đơn gần đây; đơn theo utm_source); Đơn hàng (lọc theo trạng thái, đổi trạng thái, xuất CSV); Sản phẩm (sửa giá, tồn kho, bật tắt bán); Đánh giá (duyệt, từ chối, trả lời); Email (danh sách, xuất CSV).
API: POST /api/admin/login, PATCH /api/admin/orders/[id], PATCH /api/admin/products/[id], PATCH /api/admin/reviews/[id], GET /api/admin/export?type=orders|subscribers.
Giao diện bám design/Admin.dc.html: sidebar tối #14110F, nền #F4EFEA, thẻ trắng viền đen 2px bo góc 20px, nhãn trạng thái dạng viên thuốc.

GIAI ĐOẠN 5: GIAO DIỆN KHÁCH
THIẾT KẾ: màu nền #FBD9CF, chữ và viền #14110F, xanh cobalt #1F5FD0 (nền nút, thanh tiến độ), chữ xanh #1A52B8 (giá, liên kết; đủ tương phản trên nền hồng), mint #BFE5D3, vàng #F6C945, kem #FFF6EE, lỗi #B42318. Màu theo mùi: Daisy Blue #DCE8FB, Peony Amber #FFE0CC, Mint Soda #D6F0E2. Font: Fraunces 800 cho tiêu đề, Be Vietnam Pro cho nội dung. Phong cách: bo góc lớn (20 đến 32 px), viền đen 2 đến 3 px, nút dạng viên thuốc cao từ 48 px, chữ từ 16 px trên mobile. Không dùng emoji, không gradient. Giọng văn ngắn, hài nhẹ, gọi khách là "bạn".
BÁM SÁT BỐ CỤC trong thư mục design/: mỗi file .dc.html là một màn hình mẫu (Main = trang chủ, Shop, Product, Checkout, Quiz, Admin, Login, Register, Forgot, MobileHome, MobileProduct; xem design/README.txt). Đọc để lấy đúng màu, khoảng cách, chữ và nội dung. Các đường dẫn ảnh dạng /_blob/... trong đó bỏ qua; thẻ x-dc, sc-if, sc-for là cú pháp công cụ thiết kế, viết lại bằng React và Tailwind.
ẢNH (đã có sẵn trong public/): logo-badge.png, hero.jpg (ảnh gốc vuông, chỉ dùng ở hero), products/bm-01.jpg đến bm-12.jpg (ảnh thẻ sản phẩm 3:4, trùng số với mã BM-01 đến BM-12), products/detail-daisy.jpg, detail-peony.jpg, detail-mint.jpg (cận cảnh nhãn), set-daisy.jpg, set-peony.jpg, set-mint.jpg (lon xịt cùng chai sữa tắm). Mọi khung ảnh sản phẩm dùng aspect-ratio 3:4, object-fit cover, nền #F6C6BA, next/image; KHÔNG vẽ chai bằng CSS. Trang chi tiết: ảnh chính theo mùi đang chọn (Daisy Blue = bm-01, Peony Amber = bm-02, Mint Soda = bm-03), ảnh phụ là detail-* và set-* cùng mùi; sản phẩm không có ảnh phụ thì chỉ hiện 1 ảnh.
CÁC TRANG
1. / Trang chủ: thanh thông báo, header, hero (tiêu đề "Mùi hương của riêng bạn, từ đầu đến chân." + 2 nút + ba điểm tin cậy), chip nhóm sản phẩm, 4 sản phẩm nổi bật, khối mời làm trắc nghiệm, 3 thẻ cam kết, ô nhận email giảm 10% (gọi /api/subscribe), footer.
2. /shop: chip lọc theo nhóm và mùi, sắp xếp, lưới thẻ 3:4 hiển thị giá và giá trên 100 ml hay 100 g. Lọc đổi theo URL (?category=&scent=&sort=).
3. /shop/[slug]: thư viện ảnh, nút chọn mùi (chuyển sang sản phẩm cùng line), số lượng, giá cập nhật theo số lượng, hộp phí ship và đổi trả ngay gần nút mua, 3 tầng hương, thành phần và cách dùng, đánh giá đã duyệt và form gửi đánh giá, nút Messenger. Mobile có thanh mua cố định ở cuối màn hình.
4. Giỏ hàng: CartDrawer trượt từ phải và trang /cart; tăng giảm số lượng, xóa, thanh "còn X đồng là được miễn phí ship".
5. /checkout: form họ tên, số điện thoại, địa chỉ, ghi chú; chọn COD hoặc chuyển khoản; mã giảm giá; tóm tắt đơn; gọi POST /api/orders. Tự điền số điện thoại nếu đã đăng nhập; khách vẫn mua được khi chưa có tài khoản. /checkout/success: mã đơn, tổng tiền, hướng dẫn chuyển khoản (QR và số tài khoản để placeholder, nhóm điền sau).
6. /quiz và /quiz/result: 5 câu, thanh tiến độ, mỗi câu 3 đáp án tương ứng 0 = Daisy Blue, 1 = Peony Amber, 2 = Mint Soda. Mùi nào được chọn nhiều nhất thì thắng; hòa thì lấy mùi của câu 1. Kết quả gồm tên mùi, lý do, 3 tầng hương, 3 sản phẩm gợi ý, nút thêm cả 3 vào giỏ, nút làm lại. Gọi POST /api/quiz khi xong.
   TRẮC NGHIỆM (đặt trong src/data/quiz.ts):
   Câu 1: Cuối tuần lý tưởng của bạn là gì? (Cà phê và một cuốn sách / Đi chơi tối cùng bạn bè / Chạy bộ hay đá bóng ngoài trời)
   Câu 2: Thời tiết nào làm bạn thấy dễ chịu nhất? (Nắng nhẹ, trời trong / Trời mát, về chiều / Nắng nóng, đổ mồ hôi)
   Câu 3: Bạn muốn người khác nhớ gì về mình? (Gọn gàng, sạch sẽ / Quyến rũ, khó đoán / Năng lượng, vui vẻ)
   Câu 4: Bạn dùng mùi hương nhiều nhất khi nào? (Đi học, đi làm / Hẹn hò, tiệc tối / Tập gym, chơi thể thao)
   Câu 5: Bạn chọn màu nào? (Xanh cobalt / Cam đào / Xanh bạc hà)
   Lý do kết quả: Daisy Blue = "Bạn thích sự gọn gàng và dễ chịu. Daisy Blue tươi và sạch, dùng hằng ngày không bị nồng, hợp đi học và đi làm." Peony Amber = "Bạn thích sự quyến rũ và hơi khó đoán. Peony Amber ấm và mềm, hợp những buổi tối và những buổi hẹn." Mint Soda = "Bạn năng động và hay vận động. Mint Soda mát lạnh, tạo cảm giác sảng khoái kể cả khi trời nóng hay sau khi tập."
   3 sản phẩm gợi ý: Daisy Blue = BM-01, BM-09, BM-10. Peony Amber = BM-02, BM-05, BM-08. Mint Soda = BM-03, BM-04, BM-07
7. /about, /policies (đổi trả 30 ngày, giao hàng 2 đến 4 ngày, phí ship 25.000đ, bảo mật; đây là giả định, nhóm sửa sau), /track (nhập mã đơn và số điện thoại để xem trạng thái).
8. Mobile 390 px: menu hamburger, chip nhóm cuộn ngang, lưới sản phẩm 2 cột, nút Messenger nổi góc phải.
9. Tài khoản (mẫu: Login, Register, Forgot):
   /login: số điện thoại, mật khẩu (nút Hiện/Ẩn), link Quên mật khẩu, link sang Đăng ký. Thành công thì về trang ?next= hoặc /shop.
   /register: số điện thoại, mật khẩu, nhập lại mật khẩu. Kiểm tra trước khi gửi: 10 số bắt đầu bằng 0; mật khẩu từ 8 ký tự có cả chữ và số; hai mật khẩu khớp. Lỗi hiện ngay dưới ô nhập (chữ #B42318, viền đỏ), có role=alert.
   /forgot-password: 3 bước trên cùng một trang, có thanh tiến độ: (1) nhập số điện thoại, gọi POST /api/auth/forgot; (2) nhập OTP 6 số, nút Gửi lại mã đếm ngược 60 giây theo resendAfterSec, gọi POST /api/auth/verify-otp; (3) mật khẩu mới và nhập lại, gọi POST /api/auth/reset; xong thì hiện thông báo và nút Đăng nhập. Chỉ hiện dòng "Bản demo: mã OTP là 123456" khi NEXT_PUBLIC_OTP_DEMO=1.
   Header: chưa đăng nhập có nút Đăng nhập; đã đăng nhập hiện số điện thoại che bớt (090****567) và nút Đăng xuất. AuthContext gọi GET /api/auth/me khi tải trang (src/lib/session-client.ts). Không lưu mật khẩu hay token vào localStorage.
Khi làm xong giai đoạn này: chuyển trang chủ vào src/app/(site)/page.tsx và xóa src/app/page.tsx tạm.
HÀNH VI VÀ ĐO LƯỜNG (quan trọng với báo cáo đo lường của nhóm)
- Giỏ hàng: React Context + localStorage khóa bm_cart, chỉ lưu productId, qty, scent.
- UTM: src/lib/utm.ts đọc utm_source, utm_medium, utm_campaign từ URL, lưu localStorage khóa bm_utm (lần chạm đầu tiên, hết hạn 30 ngày) và gắn vào mọi request POST.
- GA4 (NEXT_PUBLIC_GA_ID) và Meta Pixel (NEXT_PUBLIC_META_PIXEL_ID): chỉ tải sau khi khách đồng ý cookie. Sự kiện: view_item / ViewContent, add_to_cart / AddToCart, begin_checkout / InitiateCheckout, purchase / Purchase (value theo VND, currency VND), quiz_complete (tùy chỉnh). Thiếu biến môi trường thì bỏ qua êm, không báo lỗi.
- Banner đồng ý cookie ở lần vào đầu tiên.
- Nút Messenger nổi: messengerUrl trong src/lib/site-config.ts (https://m.me/61595529898398)?ref=utm_source (không có thì ref=web).
- Ghi rõ "Bản demo cho đồ án, không thu tiền thật" ở footer và trang thanh toán.
- Khi NEXT_PUBLIC_USE_MOCK=1 thì giao diện chạy bằng dữ liệu từ src/data/products.ts, tài khoản giả lưu localStorage khóa bm_mock_users, OTP luôn là 123456 (để xem thử khi chưa có DB).

GIAI ĐOẠN 6: BẢO MẬT, CHẤT LƯỢNG, KIỂM TRA
Không log dữ liệu cá nhân. Không commit .env. Header an toàn trong next.config.mjs. Các API chỉ nhận cùng origin. So sánh mật khẩu admin bằng so sánh hằng thời gian. Button, link, label, alt thật; tương phản chữ từ 4,5:1; thao tác được bằng bàn phím. Dùng next/image, metadata và ảnh chia sẻ mỗi trang, điểm Lighthouse mobile từ 90. Có trạng thái đang tải và thông báo lỗi rõ ràng bằng tiếng Việt. Không bịa nội dung: thiếu số thật thì để placeholder có dấu [ ].
Vitest cho hàm tính tiền, mã giảm giá, băm mật khẩu và kiểm tra OTP (đúng, sai, hết hạn, quá 5 lần). npm run check = lint + typecheck + test.

GIAI ĐOẠN 7: DEPLOY TRÊN VERCEL
- npm run build chạy được khi KHÔNG có DATABASE_URL (không gọi DB lúc build; trang admin và API dùng dynamic hoặc runtime nodejs).
- Không ghi file lên đĩa lúc chạy (Vercel chỉ cho đọc). Không dùng thư viện native (bcrypt, sharp tự cài). Dùng driver Postgres chạy được serverless (@neondatabase/serverless) và chuỗi kết nối dạng pooled.
- Route dùng node:crypto hoặc jose khai báo export const runtime = 'nodejs'; src/middleware.ts chỉ dùng jose (chạy được ở Edge).
- Không hard-code localhost; metadataBase và link tuyệt đối lấy từ NEXT_PUBLIC_SITE_URL. Mọi biến môi trường ghi trong .env.example, thiếu biến NEXT_PUBLIC_* tùy chọn thì bỏ qua êm.
- README.md: chạy local, bảng biến môi trường (biến nào bắt buộc), và 7 bước deploy Vercel (đẩy GitHub, Import Project, tạo Postgres ở tab Storage, thêm biến môi trường, Deploy, vercel env pull rồi db:push và db:seed, Redeploy).

TIÊU CHÍ XONG
- npm run check và npm run build pass.
- Đi được luồng: trang chủ, cửa hàng, sản phẩm, thêm giỏ, thanh toán, trang thành công, ở cả mobile và desktop.
- Mở link có ?utm_source=facebook&utm_medium=social&utm_campaign=ra_mat, đặt đơn, thấy UTM trong /admin.
- Đặt quá tồn kho bị từ chối; gửi POST liên tục bị 429; /admin và /api/admin/* trả 401 khi chưa đăng nhập.
- Đăng ký, đăng nhập, đăng xuất, quên mật khẩu với OTP demo 123456 đổi được mật khẩu; đăng nhập sai 5 lần bị 429.
- Build thành công trên Vercel (Preview) khi chỉ có DATABASE_URL, ADMIN_PASSWORD, SESSION_SECRET.
- Cuối cùng tóm tắt: đã làm gì, còn gì, có điểm nào lệch so với bản thiết kế.
