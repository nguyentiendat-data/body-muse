# Tiến độ

Quy ước: sau mỗi giai đoạn ghi đã xong gì, còn gì, quyết định đã đưa ra.

- [x] Giai đoạn 1: khung dự án và dữ liệu
- [x] Giai đoạn 2: cơ sở dữ liệu và API
- [x] Giai đoạn 3: tài khoản khách hàng (OTP)
- [x] Giai đoạn 4: trang quản trị
- [x] Giai đoạn 5: giao diện khách
- [x] Giai đoạn 6: bảo mật, chất lượng, kiểm tra (kiểm thử cục bộ; giới hạn xem bên dưới)
- [ ] Giai đoạn 7: đã chuẩn bị deploy Vercel; chưa có Neon/Vercel Preview để xác minh thực tế

## Ghi chú và quyết định
### Giai đoạn 1 — hoàn tất
- Cài npm và tạo package-lock.json; Next.js 15.5.28, React 19, TypeScript strict.
- Thêm hợp đồng API, 12 sản phẩm đúng mã/giá/dung tích/ảnh, tồn kho 50; ba tầng hương và 5 câu trắc nghiệm, kết quả và sản phẩm gợi ý.
- Kiểm tra: `npm run build` và `npm run check` đều thành công (lint, typecheck, 2 tests).
- Không thay đổi ảnh public hoặc design. Giữ trang chủ tạm đến giai đoạn 5.
- npm install báo 31 cảnh báo bảo mật dependency; cần kiểm tra và xử lý trong giai đoạn 6, không tự nâng major bằng audit fix --force.
- Tiếp theo: giai đoạn 2 (schema Postgres, seed, API). Chưa có DATABASE_URL; chưa kiểm chứng với Neon thật.

### Giai đoạn 2 — hoàn tất mã nguồn
- Schema Drizzle đầy đủ, kết nối Neon khởi tạo khi có request; seed idempotent không ghi đè giá/tồn kho đã sửa. Thêm bảng rate_limits/reset_tokens phục vụ nhiều instance và reset một lần.
- API sản phẩm, đơn, tra cứu, email, đánh giá và quiz; Zod, lỗi tiếng Việt, giới hạn POST 10/phút/IP. Đơn transaction khóa hàng theo thứ tự, khóa theo số điện thoại để chống dùng coupon đồng thời, sequence mã đơn và snapshot giá.
- Chuẩn bị đọc phiên khách để gắn user_id; tài khoản triển khai tiếp ở giai đoạn 3.
- `npm run build` không cần DATABASE_URL và `npm run lint` đạt. Chưa chạy db:push/db:seed hay kiểm thử transaction trên Neon vì chưa có chuỗi kết nối; cần làm khi cấu hình môi trường.

### Giai đoạn 3 — hoàn tất mã nguồn
- 7 endpoint tài khoản; scrypt muối riêng, timingSafeEqual, cookie Secure/httpOnly/SameSite=Lax 30 ngày, JWT HS256 có purpose.
- OTP demo 123456; SMS sinh randomInt và giao diện sendSms có TODO (chưa có nhà cung cấp). OTP lưu HMAC, hạn 5 phút, tối đa 5 lần; gửi cách 60 giây, tối đa 3/giờ. Không tiết lộ tài khoản qua forgot.
- Reset JWT 10 phút với bản ghi dùng một lần trong transaction; khóa đăng nhập theo số và IP sau 5 lần sai trong 15 phút. Không log mật khẩu/OTP/thông tin cá nhân.
- Build và lint đạt. Cần kiểm thử tích hợp tài khoản với Postgres khi có DATABASE_URL; kiểm thử đơn vị bảo mật ở giai đoạn 6.

### Giai đoạn 4 — hoàn tất mã nguồn
- Admin cookie riêng 7 ngày, middleware chỉ dùng jose, trang và API chưa đăng nhập trả 401. Login ở /admin/login; API kiểm tra lại quyền quản trị.
- Tổng quan, đơn hàng lọc/đổi trạng thái, sản phẩm sửa giá/tồn kho/ẩn bán, đánh giá duyệt/trả lời, email và xuất CSV có chống công thức bảng tính. Doanh thu tính đơn đã giao.
- Bám mẫu Admin: sidebar tối, nền kem xám, thẻ trắng bo 20px viền 2px. Các mục quản trị dùng /admin?tab=... để dùng chung khung.
- Build không có DB và lint đều đạt; chưa xác minh thao tác với DB thật.

### Giai đoạn 5 — hoàn tất mã nguồn
- Chuyển trang chủ vào (site), đầy đủ shop/chi tiết, giỏ và drawer dialog, checkout/success, quiz/result, about/policies/track, login/register/forgot 3 bước. Header responsive, thanh mua mobile, ảnh next/image và font next/font/google.
- Đã đọc 11 mẫu thiết kế: giữ màu, font, bo góc/viền, tỷ lệ ảnh 3:4, bố cục hero và admin. Viết lại React; không đưa design vào build. Chưa xác minh pixel-perfect bằng trình duyệt.
- Cart chỉ lưu ID/qty/scent; first-touch UTM 30 ngày; mọi POST client gắn UTM. Cookie consent mới tải GA/Meta, có sự kiện theo đề bài. Messenger ẩn nếu chưa cấu hình trang thật.
- Mock qua NEXT_PUBLIC_USE_MOCK=1: danh mục, đơn/tồn kho/coupon/tra cứu, subscribe/quiz, tài khoản lưu bm_mock_users với PBKDF2 (không lưu mật khẩu rõ), phiên demo, OTP 123456 và reset một lần. Dữ liệu mock chỉ ở trình duyệt, không vào admin DB.
- Thành phần/cách dùng chính thức, liên hệ, ngân hàng/QR để [placeholder]. Không tạo thông tin thương mại chưa xác minh; checkout nhắc không chuyển tiền.
- Build và npm run check đạt. Tiếp theo: rà soát bảo mật, kiểm thử và tối ưu giai đoạn 6.

### Giai đoạn 6 — kiểm tra cục bộ hoàn tất
- Header an toàn, kiểm tra origin, admin timingSafeEqual, JWT tách purpose, CSV chống công thức, mã lỗi mật khẩu đúng hợp đồng. Giới hạn đăng nhập giữ cửa sổ 15 phút và khóa 15 phút từ lần sai thứ 5.
- Nâng Drizzle ORM/Kit, Zod, Vitest/Vite, PostCSS theo audit; yêu cầu Node >=22.12.0 cho bộ kiểm thử mới. `npm audit --omit=dev`: 0 lỗ hổng runtime; còn 22 moderate ở công cụ phát triển. Định dạng source để bàn giao.
- `npm run check` đạt (lint, strict typecheck, 10 Vitest). `npm run test:e2e` build production mock rồi 8/8 kịch bản Chrome đạt (mobile 390 và desktop), kiểm tra ảnh giải mã, UTM, mua hàng/tra cứu, tài khoản/OTP, quiz, chặn admin/origin.
- Lighthouse mobile: DevTools throttling trực tiếp 94/100/100/100; mô phỏng mặc định 86/100/100/100, vẫn dưới mục tiêu performance 90 ở phương pháp mặc định. Cần đo/tối ưu tiếp trên Preview thật. Chi tiết và phương pháp đầy đủ trong QA.md.
- Tối ưu server component trang chủ, validation tải khi cần, AVIF/WebP và font; public/design không đổi. Khác mẫu: placeholder thông tin chưa xác minh, Messenger ẩn khi chưa có Page, admin dùng tab URL; không bảo đảm pixel-perfect.
- Chưa kiểm thử tích hợp Postgres (transaction/429/UTM admin/OTP thật) do thiếu DATABASE_URL. Giai đoạn 7 tiếp theo: hoàn thiện tài liệu và cấu hình deploy, không giả nhận đã deploy.

### Giai đoạn 7 — chuẩn bị hoàn tất, triển khai thực tế còn chờ
- README có chạy local/mock/Postgres, bảng toàn bộ biến môi trường, 7 bước deploy và kiểm tra sau deploy. .env.example không chứa khóa; .gitignore chặn mọi .env* trừ .env.example.
- CLI Drizzle và seed đọc .env.local/.env bằng Node, ưu tiên biến môi trường có sẵn. Kết nối DB lazy, driver Neon Pool dùng Node có WebSocket; transaction Node, middleware jose Edge. Không ghi file ứng dụng khi chạy.
- Build production bàn giao đã chạy với DATABASE_URL trống và NEXT_PUBLIC_USE_MOCK trống: đạt; npm run check đạt (lint/typecheck/10 tests). Bản .next cuối cùng là chế độ API thật, không phải build mock của E2E.
- Chưa chạy db:push/db:seed với Neon; chưa có Vercel Preview; chưa push remote. Repo origin đã có, commit giữ trên main theo yêu cầu. Không có .env bí mật được tạo/commit.
- Cần tiếp tục khi có cấu hình: tạo Neon/Vercel, thêm DATABASE_URL/ADMIN_PASSWORD/SESSION_SECRET, đẩy nhánh và deploy theo README, chạy schema/seed đúng môi trường, xác minh transaction/tồn kho/429/OTP/UTM trong admin trên HTTPS, đo Lighthouse Preview (mô phỏng mặc định hiện 86, mục tiêu >=90).
- Các placeholder nội dung/QR/ngân hàng/liên hệ và TODO nhà cung cấp SMS giữ rõ ràng cho nhóm bổ sung. Giao diện giữ phong cách/màu/font của mẫu, đã xem screenshot mobile; không khẳng định trùng từng pixel.
