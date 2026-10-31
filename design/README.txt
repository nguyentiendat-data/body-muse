Mã nguồn các màn hình mẫu của website BODY MUSE (Claude Design).
Mỗi file .dc.html là một màn hình: 
  Main = trang chủ, Shop = cửa hàng, Product = chi tiết sản phẩm, Checkout = giỏ hàng và thanh toán,
  Quiz = trắc nghiệm mùi hương, Admin = trang quản trị, Login = đăng nhập, Register = đăng ký,
  Forgot = quên mật khẩu (OTP), MobileHome / MobileProduct = bản mobile 390 px.
canvas.json cho biết kích thước từng màn hình.
Dùng để lấy đúng màu, khoảng cách, chữ, nội dung. Thẻ <x-dc>, {{...}}, sc-if, sc-for là cú pháp của công cụ thiết kế, hãy viết lại bằng React/Tailwind.
Đường dẫn ảnh dạng /_blob/... bỏ qua, dùng ảnh trong public/ (giải nén BODY_MUSE_anh_san_pham.zip).
