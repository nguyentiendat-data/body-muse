# Kiểm tra BODY MUSE

## Môi trường

Windows, Chrome cài sẵn, Next.js 15.5.28 production, NEXT_PUBLIC_USE_MOCK=1, không có DATABASE_URL. Mobile 390×844 và desktop 1440×1000. Không dùng dữ liệu khách thật.

## Kết quả

- `npm run check`: lint và TypeScript strict đạt, 10 kiểm thử Vitest đạt.
- Playwright: 8 kịch bản đạt (4 kịch bản × 2 kích thước). Mua hàng từ trang chủ → shop → sản phẩm → giỏ → checkout → thành công → tra cứu; giữ first-touch UTM Facebook; tổng 141.100đ với WELCOME10; đăng ký/đăng xuất/OTP/đổi mật khẩu/đăng nhập; quiz và thêm bộ 3; admin trả 401 và POST khác origin bị chặn. Ảnh được kiểm tra giải mã thành công trước khi chụp; trang chủ mobile không tràn ngang.
- Vitest: phí ship tại ngưỡng 399.000đ, giảm giá/làm tròn/dùng lại, đầu vào sai, scrypt muối riêng, OTP đúng/sai/hết hạn/quá 5 lần/đã dùng, JWT tách mục đích và hết hạn, origin và CSV injection.
- `npm audit --omit=dev`: 0 lỗ hổng runtime. Còn 22 cảnh báo moderate trong công cụ phát triển (chủ yếu ESLint/Drizzle Kit); không dùng `audit fix --force` vì đề bài giữ Next.js 15 và bộ công cụ hiện có.

## Lighthouse mobile trang chủ

Đo localhost production bằng Chrome, cookie đo lường chưa đồng ý, không tải GA/Meta. Điểm có thể thay đổi theo máy và môi trường hosting.

| Phương pháp | Performance | Accessibility | Best practices | SEO | LCP |
|---|---:|---:|---:|---:|---:|
| Throttling trực tiếp DevTools | 94 | 100 | 100 | 100 | 1,8 giây |
| Mô phỏng mặc định Lighthouse | 86 | 100 | 100 | 100 | 4,1 giây |

Đạt mốc 90 ở phép đo DevTools; mô phỏng mặc định còn dưới mục tiêu. Cần đo lại trên Vercel Preview với DB và cache ảnh thực tế. Đã tối ưu: server component cho phần tĩnh trang chủ, tách validation khỏi GET mock, giảm font tải sớm, AVIF/WebP, ưu tiên/giải mã ảnh hero. Ảnh hero AVIF khoảng 17KB; ảnh gốc public không thay đổi.

Report JSON và ảnh chụp cục bộ nằm trong `artifacts/` (gitignore): `lighthouse-mobile.json`, `lighthouse-mobile-devtools.json`, `mobile-home.png`, `desktop-home.png`, `mobile-product.png`, `desktop-product.png`.

## Chưa xác minh với hạ tầng thật

- Chưa có DATABASE_URL nên chưa chạy schema/seed hay kiểm tra transaction, OUT_OF_STOCK đồng thời, giới hạn POST 429 và khóa đăng nhập trên Postgres thật.
- Chưa xác minh luồng UTM trong admin DB, chỉnh sản phẩm/đánh giá, xuất CSV và cookie HTTPS qua Vercel.
- Chưa có Vercel Preview. Giao diện bám mẫu về bố cục/màu/font; không cam kết trùng từng pixel. Thành phần sản phẩm, liên hệ, ngân hàng và QR vẫn là [placeholder].

## Chạy lại

`npm run test:e2e` tạo bản production mock và chạy Chrome; máy cần cài Google Chrome. Bộ kiểm thử tạo dữ liệu trong browser context độc lập. Chạy lại `npm run build` để tạo bản Postgres trước khi deploy.
