# Thiết kế BODY MUSE — 13/11/2026

## Nguồn tham khảo
- Aesop Shop all: https://www.aesop.com/shop-all/ — phân nhóm chăm sóc và mùi hương, nội dung sản phẩm ngắn, phân tầng danh mục.
- Apple Store: https://www.apple.com/store — các khối trưng bày rõ ràng, hình ảnh sản phẩm là trọng tâm, thứ bậc tiêu đề và hành động mua.
- Shopify Help / Viewing and filtering orders: https://help.shopify.com/en/manual/fulfillment/managing-orders/viewing-orders — bảng đơn có tìm kiếm, lọc trạng thái và quản lý từng đơn.

Đây là các nguyên tắc được áp dụng cho BODY MUSE, không sao chép mã nguồn, hình ảnh hay nhận diện của các thương hiệu trên.

## Quyết định
- Cửa hàng: trắng ngà, navy và xanh xám; header hai tầng, tìm kiếm tên/mùi hương, bộ lọc bên trên desktop và thu gọn trên điện thoại; ảnh đúng tỷ lệ, nhãn kit/Ocean; trang chi tiết và giỏ/checkout dùng cùng hệ thống nút, khoảng cách, biểu mẫu.
- Giữ nguyên ảnh gốc do nhóm cung cấp. Không tạo số lượng đã bán, đánh giá hay mức tăng trưởng giả. Ưu đãi poster không tự thay giá demo.
- Admin: sidebar navy và mặt làm việc xám nhạt; thẻ số liệu thật, bảng đơn tìm theo mã/tên/số điện thoại và lọc trạng thái; sản phẩm chỉnh trong dòng mở rộng; đánh giá và email có trạng thái rỗng; đăng nhập riêng.
- URL hiện có, phân quyền, cookie và các API lưu/duyệt/xuất CSV được giữ. Không thêm dependency giao diện. Các kiểu admin tách trong src/app/admin/admin.css.
- Tìm kiếm cửa hàng lọc trong danh mục đã tải và giữ từ khóa trên URL; tìm kiếm admin được lọc tại cơ sở dữ liệu, giới hạn 200 đơn mới nhất. Lượt kiểm tra admin chỉ đọc và đăng nhập, không sửa dữ liệu kinh doanh.

## Kiểm tra
Kết quả kiểm thử và giới hạn triển khai được ghi trong PROGRESS.md. Các ảnh chụp kiểm tra nằm trong artifacts (không commit vì có thể chứa dữ liệu quản trị).
