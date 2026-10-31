# Tiến độ

Quy ước: sau mỗi giai đoạn ghi đã xong gì, còn gì, quyết định đã đưa ra.

- [x] Giai đoạn 1: khung dự án và dữ liệu
- [ ] Giai đoạn 2: cơ sở dữ liệu và API
- [ ] Giai đoạn 3: tài khoản khách hàng (OTP)
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
