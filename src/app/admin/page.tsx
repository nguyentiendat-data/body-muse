import Link from "next/link";
import { count, desc, eq, sql } from "drizzle-orm";
import { getDb } from "@/db";
import {
  orders,
  products,
  quizResults,
  reviews,
  subscribers,
} from "@/db/schema";
import { requireAdmin } from "@/lib/admin";
import { AdminForm, AdminLogout } from "@/components/admin-controls";
const statuses = {
  new: "Mới",
  shipping: "Đang giao",
  done: "Đã giao",
  cancelled: "Đã hủy",
};
const money = (value: number) => `${value.toLocaleString("vi-VN")}đ`;
export default async function Admin({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string; status?: string }>;
}) {
  await requireAdmin();
  const { tab = "overview", status } = await searchParams;
  const navigation = [
    ["overview", "Tổng quan"],
    ["orders", "Đơn hàng"],
    ["products", "Sản phẩm"],
    ["reviews", "Đánh giá"],
    ["emails", "Email thu được"],
  ];
  if (!process.env.DATABASE_URL)
    return (
      <main className="p-8">
        Chưa cấu hình cơ sở dữ liệu. Vui lòng thêm DATABASE_URL.
      </main>
    );
  const db = getDb();
  const orderRows = ["overview", "orders"].includes(tab)
    ? await db
        .select()
        .from(orders)
        .where(
          status && status in statuses
            ? eq(orders.status, status as keyof typeof statuses)
            : undefined,
        )
        .orderBy(desc(orders.createdAt))
        .limit(tab === "overview" ? 10 : 200)
    : [];
  const [stats] = await db
    .select({
      newOrders: sql<number>`count(*) filter (where status = 'new')::int`,
      revenue: sql<number>`coalesce(sum(total) filter (where status = 'done'), 0)::int`,
    })
    .from(orders);
  const [emailCount] = await db.select({ value: count() }).from(subscribers);
  const [quizCount] = await db.select({ value: count() }).from(quizResults);
  const sources =
    tab === "overview"
      ? await db
          .select({ source: orders.utmSource, value: count() })
          .from(orders)
          .groupBy(orders.utmSource)
      : [];
  return (
    <div className="min-h-screen md:flex">
      <nav
        aria-label="Quản trị"
        className="md:w-60 shrink-0 bg-ink text-cream p-6 flex flex-col gap-3"
      >
        <Link className="font-display text-2xl mb-6" href="/">
          BODY MUSE
        </Link>
        {navigation.map(([key, name]) => (
          <Link
            className={`rounded-xl px-4 py-3 ${tab === key ? "bg-cobalt" : ""}`}
            key={key}
            href={`/admin?tab=${key}`}
          >
            {name}
          </Link>
        ))}
        <AdminLogout />
      </nav>
      <main className="p-5 md:p-10 flex-1 min-w-0">
        <h1 className="font-display text-4xl mb-8">
          {navigation.find(([key]) => key === tab)?.[1] || "Tổng quan"}
        </h1>
        {tab === "overview" && (
          <>
            <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
              {[
                ["Đơn mới", stats.newOrders],
                ["Doanh thu đơn demo đã giao", money(stats.revenue)],
                ["Email thu được", emailCount.value],
                ["Làm xong trắc nghiệm", quizCount.value],
              ].map(([label, value]) => (
                <section
                  className="bg-white border-2 border-ink rounded-[20px] p-5"
                  key={label}
                >
                  <p>{label}</p>
                  <strong className="text-3xl">{value}</strong>
                </section>
              ))}
            </div>
            <section className="bg-white border-2 border-ink rounded-[20px] p-6 mb-8">
              <h2 className="text-xl font-bold mb-4">
                Đơn theo nguồn truy cập
              </h2>
              {sources.length ? (
                sources.map((source) => (
                  <div
                    className="flex items-center gap-4 py-2"
                    key={source.source || "web"}
                  >
                    <span className="w-28 break-words">
                      {source.source || "Trực tiếp"}
                    </span>
                    <progress
                      className="flex-1 accent-cobalt"
                      value={source.value}
                      max={Math.max(...sources.map((item) => item.value), 1)}
                    />
                    <b>{source.value}</b>
                  </div>
                ))
              ) : (
                <p>Chưa có đơn hàng.</p>
              )}
            </section>
          </>
        )}
        {["overview", "orders"].includes(tab) && (
          <section className="bg-white border-2 border-ink rounded-[20px] p-5">
            <h2 className="text-xl font-bold">
              Đơn hàng {tab === "overview" ? "gần đây" : ""}
            </h2>
            <div className="flex flex-wrap gap-4 py-4">
              <Link href="/api/admin/export?type=orders">Xuất CSV</Link>
              <Link href="/admin?tab=orders">Tất cả</Link>
              {Object.entries(statuses).map(([key, label]) => (
                <Link key={key} href={`/admin?tab=orders&status=${key}`}>
                  {label}
                </Link>
              ))}
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr>
                    {["Mã đơn / Khách", "Tổng", "UTM", "Trạng thái"].map(
                      (label) => (
                        <th className="p-3 border-b-2 border-ink" key={label}>
                          {label}
                        </th>
                      ),
                    )}
                  </tr>
                </thead>
                <tbody>
                  {orderRows.map((order) => (
                    <tr key={order.id}>
                      <td className="p-3 border-b">
                        <b>{order.code}</b>
                        <p>
                          {order.name} · {order.phone}
                        </p>
                        <p>{order.address}</p>
                        <p>{order.note}</p>
                      </td>
                      <td className="p-3 border-b">
                        {money(order.total)}
                        <p>
                          {order.paymentMethod === "cod"
                            ? "COD"
                            : "Chuyển khoản"}
                        </p>
                      </td>
                      <td className="p-3 border-b">
                        {order.utmSource || "Trực tiếp"}
                        <p>{order.utmMedium}</p>
                        <p>{order.utmCampaign}</p>
                      </td>
                      <td className="p-3 border-b">
                        <AdminForm endpoint={`/api/admin/orders/${order.id}`}>
                          <label className="sr-only" htmlFor={order.id}>
                            Trạng thái {order.code}
                          </label>
                          <select
                            id={order.id}
                            name="status"
                            defaultValue={order.status}
                            className="border-2 border-ink rounded-full p-2 bg-sun"
                          >
                            {Object.entries(statuses).map(([key, label]) => (
                              <option key={key} value={key}>
                                {label}
                              </option>
                            ))}
                          </select>
                        </AdminForm>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {!orderRows.length && <p className="py-6">Chưa có đơn hàng.</p>}
            </div>
          </section>
        )}
        {tab === "products" && (
          <div className="grid lg:grid-cols-2 gap-4">
            {(await db.select().from(products).orderBy(products.id)).map(
              (product) => (
                <section
                  className="bg-white border-2 border-ink rounded-[20px] p-5"
                  key={product.id}
                >
                  <h2 className="font-bold mb-4">
                    {product.id} · {product.name}
                  </h2>
                  <AdminForm endpoint={`/api/admin/products/${product.id}`}>
                    <label>
                      Giá (VND)
                      <input
                        className="border rounded p-3 w-full"
                        name="priceVnd"
                        type="number"
                        min="1000"
                        required
                        defaultValue={product.priceVnd}
                      />
                    </label>
                    <label>
                      Tồn kho
                      <input
                        className="border rounded p-3 w-full"
                        name="stock"
                        type="number"
                        min="0"
                        required
                        defaultValue={product.stock}
                      />
                    </label>
                    <label>
                      Hiển thị
                      <select
                        className="border rounded p-3 w-full"
                        name="isActive"
                        defaultValue={String(product.isActive)}
                      >
                        <option value="true">Đang bán</option>
                        <option value="false">Tạm ẩn</option>
                      </select>
                    </label>
                  </AdminForm>
                </section>
              ),
            )}
          </div>
        )}
        {tab === "reviews" && (
          <div className="grid lg:grid-cols-2 gap-4">
            {(
              await db.select().from(reviews).orderBy(desc(reviews.createdAt))
            ).map((review) => (
              <section
                className="bg-white border-2 border-ink rounded-[20px] p-5"
                key={review.id}
              >
                <h2 className="font-bold">
                  {review.name} · {review.stars}/5 · {review.productId}
                </h2>
                <p className="my-4">{review.body}</p>
                <AdminForm endpoint={`/api/admin/reviews/${review.id}`}>
                  <label>
                    Trạng thái
                    <select
                      className="border rounded p-3 w-full"
                      name="status"
                      defaultValue={review.status}
                    >
                      <option value="pending">Chờ duyệt</option>
                      <option value="approved">Đã duyệt</option>
                      <option value="rejected">Từ chối</option>
                    </select>
                  </label>
                  <label>
                    Trả lời
                    <textarea
                      className="border rounded p-3 w-full"
                      name="reply"
                      maxLength={2000}
                      defaultValue={review.reply || ""}
                    />
                  </label>
                </AdminForm>
              </section>
            ))}
          </div>
        )}
        {tab === "emails" && (
          <section className="bg-white border-2 border-ink rounded-[20px] p-5">
            <Link href="/api/admin/export?type=subscribers">
              Xuất CSV email
            </Link>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr>
                    <th className="p-3">Email</th>
                    <th>Nguồn / Chiến dịch</th>
                    <th>Ngày tạo</th>
                  </tr>
                </thead>
                <tbody>
                  {(
                    await db
                      .select()
                      .from(subscribers)
                      .orderBy(desc(subscribers.createdAt))
                  ).map((subscriber) => (
                    <tr key={subscriber.id}>
                      <td className="p-3 border-t">{subscriber.email}</td>
                      <td className="border-t">
                        {subscriber.utmSource || "Trực tiếp"} /{" "}
                        {subscriber.utmCampaign}
                      </td>
                      <td className="border-t">
                        {subscriber.createdAt.toLocaleDateString("vi-VN", {
                          timeZone: "Asia/Ho_Chi_Minh",
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
