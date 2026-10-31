# BODY MUSE

Website bán hàng minh họa cho đồ án E-marketing: Next.js 15 App Router, React 19, TypeScript strict, Tailwind 3, Drizzle + Neon Postgres, Zod, jose, Vitest. Giao diện tiếng Việt, ưu tiên mobile. **Không thu tiền thật.**

## Chạy local

Node.js >=22.12.0 và npm. Cài bằng lockfile:

```sh
npm ci
```

PowerShell:

```powershell
Copy-Item .env.example .env.local
```

macOS/Linux dùng `cp .env.example .env.local`. Không commit `.env`, `.env.local` hoặc các file môi trường tải từ Vercel.

### Xem thử khi chưa có DB

Đặt `NEXT_PUBLIC_USE_MOCK=1`, `NEXT_PUBLIC_OTP_DEMO=1` trong `.env.local`, rồi:

```sh
npm run dev
```

Mở URL Local do Next.js in ra. Mock lưu sản phẩm/tồn kho/đơn, UTM, email và quiz trên trình duyệt; tài khoản demo trong `bm_mock_users` dùng PBKDF2, không lưu mật khẩu rõ. OTP là `123456`. Admin vẫn yêu cầu Postgres thật, không hiển thị dữ liệu mock. Muốn bắt đầu lại: xóa các khóa `bm_mock_*` và `bm_cart` trong dữ liệu trang của trình duyệt.

### Dùng Postgres thật

Điền `DATABASE_URL` pooled của Neon, `ADMIN_PASSWORD` và `SESSION_SECRET`; để trống `NEXT_PUBLIC_USE_MOCK` rồi chạy:

```sh
npm run db:push
npm run db:seed
npm run dev
```

Hai lệnh DB đọc `.env.local`, sau đó `.env`; biến đã có trong môi trường được ưu tiên. Seed nạp 12 sản phẩm, chạy lại không nhân đôi và giữ nguyên giá/tồn kho đã sửa. Mã đơn dùng sequence Postgres (`BM-0001`, …); có thể có khoảng trống số khi transaction bị hủy, đây là hành vi bình thường của sequence.

Admin: `/admin/login`. Tài khoản khách ở `/register`, `/login`, `/forgot-password`. Cookie khách `bm_session` và admin `bm_admin` tách biệt, Secure/httpOnly/SameSite=Lax; dùng HTTPS khi triển khai. Khi thử trên điện thoại qua IP LAN, dùng HTTPS hoặc chế độ mock.

## Biến môi trường

| Biến | Bắt buộc | Nội dung |
|---|---|---|
| `DATABASE_URL` | Khi dùng API thật | Chuỗi Neon/Postgres **pooled**, có SSL. Build không cần biến này. |
| `ADMIN_PASSWORD` | Khi đăng nhập admin | Mật khẩu riêng, khuyến nghị ít nhất 12 ký tự. |
| `SESSION_SECRET` | Khi dùng tài khoản/admin/OTP | Khóa ngẫu nhiên ít nhất 32 ký tự, dùng ký JWT/HMAC OTP. Đổi khóa sẽ làm hết hiệu lực các phiên cũ. |
| `OTP_MODE` | Không | Mặc định `demo`, mã `123456`; `sms` sinh mã ngẫu nhiên. |
| `SMS_API_KEY` | Sau khi tự tích hợp SMS | Chưa có nhà cung cấp; `src/lib/sms.ts` để TODO. Đặt `sms` trước khi tích hợp sẽ báo không thể xử lý, không giả gửi thành công. |
| `NEXT_PUBLIC_SITE_URL` | Không, nên điền khi deploy | URL HTTPS thật, dùng metadataBase và ảnh chia sẻ. Thiếu biến thì bỏ qua ảnh OG tuyệt đối. |
| `NEXT_PUBLIC_USE_MOCK` | Không | `1` để xem demo trên trình duyệt. Để trống khi cần đơn/UTM đi vào DB và admin. |
| `NEXT_PUBLIC_OTP_DEMO` | Không | `1` mới hiện dòng gợi ý OTP demo. Đồng bộ với `OTP_MODE`. |
| `NEXT_PUBLIC_GA_ID` | Không | GA4 Measurement ID (`G-…`); chỉ tải sau đồng ý cookie. |
| `NEXT_PUBLIC_META_PIXEL_ID` | Không | ID Meta Pixel dạng số; chỉ tải sau đồng ý cookie. |
| `NEXT_PUBLIC_MESSENGER_PAGE` | Không | Username/ID Messenger; thiếu biến thì ẩn nút. |

Tạo khóa phiên bằng `node -e "console.log(require('node:crypto').randomBytes(32).toString('base64'))"` rồi đưa vào môi trường riêng. Chỉ các biến `NEXT_PUBLIC_` xuất hiện trong bundle trình duyệt; tuyệt đối không dùng tiền tố này cho khóa bí mật. Biến công khai được Next.js chốt lúc build: sửa xong cần build/redeploy.

## Kiểm tra

```sh
npm run check
npm run build
npm run start
```

`check` = lint + typecheck + Vitest. Build không truy cập DB; ứng dụng không ghi dữ liệu ra đĩa khi chạy. `node:crypto` chỉ ở route Node; middleware chỉ dùng jose. Không tự cài thư viện native; ảnh dùng Next Image và ảnh gốc trong `public/`.

E2E cần Google Chrome cài sẵn:

```sh
npm run test:e2e
```

Lệnh này tạo **bản build mock**, tự chạy server kiểm thử cổng 3100 và 8 kịch bản ở 390px/desktop. Trước deploy API thật, để trống `NEXT_PUBLIC_USE_MOCK` và chạy lại `npm run build`. Kết quả, phương pháp Lighthouse và giới hạn xác minh: [QA.md](QA.md).

## Deploy Vercel — 7 bước

1. Đẩy nhánh `main` đã commit lên GitHub. Kiểm tra không có `.env*` chứa khóa (chỉ commit `.env.example`).
2. Vercel → **Import Project**, chọn repo BODY MUSE, preset **Next.js**, thư mục gốc repo. Install `npm ci`, Build `npm run build`, Output mặc định Next.js. Chọn Node đáp ứng >=22.12.0.
3. Trong **Storage**, tạo/kết nối Postgres qua **Neon** và liên kết với project. Lấy chuỗi **pooled** có SSL, ánh xạ vào `DATABASE_URL`. Dùng DB/branch riêng cho Preview nếu không muốn Preview ghi vào dữ liệu Production.
4. Thêm `DATABASE_URL`, `ADMIN_PASSWORD`, `SESSION_SECRET` cho các môi trường cần dùng. Để trống `NEXT_PUBLIC_USE_MOCK`; OTP demo có thể giữ mặc định. Điền `NEXT_PUBLIC_SITE_URL` khi biết URL deploy; đo lường/Messenger tùy chọn.
5. **Deploy**. Build phải đạt kể cả khi DB chưa có bảng vì app chỉ kết nối DB khi có request. Chưa đặt đơn lúc này; cần nạp schema và dữ liệu trước.
6. Tại checkout local, dùng Vercel CLI liên kết đúng project, chạy `vercel env pull .env.local` (chọn đúng môi trường; dùng `--environment=production` nếu nạp Production). Kiểm tra project/môi trường đích rồi chạy `npm run db:push` và `npm run db:seed`. Đây là bước đổi schema DB: dùng DB demo riêng và kiểm tra diff Drizzle trước khi chấp nhận thay đổi.
7. **Redeploy** sau khi bổ sung URL/biến công khai. Kiểm tra các luồng dưới đây trên URL HTTPS Preview; sau khi đạt mới chuyển sang Production.

Không chạy db:push/db:seed trong build Vercel: tránh đổi schema/nạp dữ liệu mỗi lần tạo Preview. Repo đã chuẩn bị để deploy; chưa có bằng chứng Vercel Preview trong phiên triển khai hiện tại.

### Kiểm tra sau deploy với DB thật

- Mở `/?utm_source=facebook&utm_medium=social&utm_campaign=ra_mat`, thêm hàng và đặt đơn demo. Đăng nhập `/admin/login`, xem đủ source/medium/campaign trong Đơn hàng.
- Tra cứu đơn cần đúng cả mã và điện thoại; sai số không được trả thông tin đơn.
- Sửa tồn kho về 1 trong admin, đặt 2 món: nhận `OUT_OF_STOCK`, không tạo đơn/trừ kho dở dang. Thử hai đơn đồng thời để kiểm tra khóa tồn kho.
- Hơn 10 POST/phút cùng IP: 429. WELCOME10 một lần/số điện thoại, kể cả hai checkout đồng thời.
- Đăng ký, đăng xuất, đăng nhập, OTP demo đổi mật khẩu; sai đăng nhập 5 lần thì 429/khóa 15 phút. OTP hạn 5 phút/tối đa 5 lần sai; reset token dùng một lần.
- Chưa đăng nhập mở `/admin` hoặc `/api/admin/export?type=orders`: 401. Kiểm tra sửa sản phẩm, duyệt/trả lời đánh giá và CSV email/đơn.
- Đo Lighthouse trên Preview có DB/cache ảnh. Cục bộ: DevTools throttling performance 94; mô phỏng mặc định 86, cần cải thiện tiếp để đạt 90 ở phương pháp mặc định.

## Nội dung cần nhóm bổ sung

Giá/tên/dung tích seed là giả định. Cần xác nhận thành phần/cách dùng, tên nhóm, liên hệ, điều kiện đổi trả, thời hạn lưu dữ liệu, ngân hàng và QR. Đang để `[placeholder]`; không có giao dịch thật. Tích hợp SMS sau khi có nhà cung cấp thật.

## Cấu trúc

| Đường dẫn | Nội dung |
|---|---|
| `src/app/(site)` | Trang khách |
| `src/app/admin`, `src/app/api/admin` | Quản trị và API có kiểm tra phiên |
| `src/app/api` | Danh mục, đơn, email, review, quiz, tài khoản |
| `src/db` | Schema, kết nối lazy, nạp seed |
| `src/lib` | Giỏ, UTM, đo lường, xác thực, validation, mock |
| `src/data`, `src/types` | 12 sản phẩm, quiz và hợp đồng API |
| `e2e`, `src/**/*.test.ts` | Kiểm thử luồng và logic |
| `public` | Ảnh có sẵn, giữ nguyên |
| `design` | 11 mẫu tham khảo, loại khỏi build/lint |

Đề bài: [CODEX_PROMPT.md](CODEX_PROMPT.md). Tiến độ: [PROGRESS.md](PROGRESS.md).
