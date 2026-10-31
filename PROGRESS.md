# Tiến độ

Quy ước: sau mỗi giai đoạn ghi đã xong gì, còn gì, quyết định đã đưa ra.

- [x] Giai đoạn 1: khung dự án và dữ liệu
- [x] Giai đoạn 2: cơ sở dữ liệu và API
- [x] Giai đoạn 3: tài khoản khách hàng (OTP)
- [ ] Giai đoạn 4: trang quản trị
- [ ] Giai đoạn 5: giao diện khách
- [ ] Giai đoạn 6: bảo mật, chất lượng, kiểm tra
- [ ] Giai đoạn 7: deploy Vercel

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
