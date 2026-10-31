import { z } from "zod";
import { getDb } from "@/db";
import { orders, subscribers } from "@/db/schema";
import { adminApi, csv } from "@/lib/admin";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const GET = adminApi(async request => {
  const type = z.enum(["orders", "subscribers"]).parse(new URL(request.url).searchParams.get("type"));
  const rows = type === "orders" ? await getDb().select({ code: orders.code, name: orders.name, phone: orders.phone, address: orders.address, status: orders.status, total: orders.total, source: orders.utmSource, medium: orders.utmMedium, campaign: orders.utmCampaign, createdAt: orders.createdAt }).from(orders) : await getDb().select().from(subscribers);
  const headers = type === "orders" ? ["Mã đơn", "Khách", "Điện thoại", "Địa chỉ", "Trạng thái", "Tổng VND", "Nguồn", "Phương tiện", "Chiến dịch", "Ngày tạo"] : ["ID", "Email", "Nguồn", "Phương tiện", "Chiến dịch", "Ngày tạo"];
  return new Response(csv([headers, ...rows.map(row => Object.values(row).map(value => value instanceof Date ? value.toISOString() : value))]), { headers: { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": `attachment; filename="${type}.csv"`, "Cache-Control": "no-store" } });
});
