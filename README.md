# BODY MUSE

Website bán hàng demo cho thương hiệu nước hoa và chăm sóc cơ thể dành cho nam (đồ án E-marketing). Không thu tiền thật.

## Bắt đầu

```bash
npm install
cp .env.example .env.local   # điền DATABASE_URL, ADMIN_PASSWORD, SESSION_SECRET
npm run dev
```

Muốn xem giao diện khi chưa có cơ sở dữ liệu: đặt `NEXT_PUBLIC_USE_MOCK=1` trong `.env.local`.

## Cấu trúc

| Thư mục | Nội dung |
|---|---|
| `src/app/(site)` | trang khách: trang chủ, cửa hàng, sản phẩm, giỏ, thanh toán, trắc nghiệm, tài khoản |
| `src/app/admin` | trang quản trị |
| `src/app/api` | API |
| `src/components` | thành phần giao diện dùng chung |
| `src/db` | schema, kết nối, seed |
| `src/lib` | giỏ hàng, UTM, đo lường, xác thực, giới hạn tốc độ |
| `src/data` | dữ liệu 12 sản phẩm và nội dung trắc nghiệm |
| `src/types` | kiểu dùng chung giữa giao diện và API |
| `public` | ảnh |
| `design` | mã nguồn các màn hình mẫu (chỉ để tham khảo) |

Đề bài đầy đủ: `CODEX_PROMPT.md`. Tiến độ: `PROGRESS.md`. README này sẽ được Codex hoàn thiện ở giai đoạn 7 (biến môi trường và các bước deploy Vercel).
