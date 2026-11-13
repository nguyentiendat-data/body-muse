// Scoped update for the two products explicitly requested by the user.
import "../src/db/env";
import { Pool } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import { eq } from "drizzle-orm";
import { products as catalog } from "../src/data/products";
import { products } from "../src/db/schema";

async function main() {
  if (!process.env.DATABASE_URL) throw new Error("Chưa cấu hình cơ sở dữ liệu.");
  const kit = catalog.find(p => p.id === "BM-11")!;
  const ocean = catalog.find(p => p.id === "BM-13")!;
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  try {
    const db = drizzle(pool);
    await db.transaction(async tx => {
      // Keep existing prices, stock, visibility and all order data intact.
      await tx.update(products).set({ name: kit.name, size: kit.size, image: kit.image, unitPriceVnd: null, unitBasis: null }).where(eq(products.id, kit.id));
      await tx.insert(products).values(ocean).onConflictDoUpdate({ target: products.id, set: { image: ocean.image } });
    });
    console.info("Đã cập nhật ảnh/quy cách BM-11 và bổ sung BM-13; giữ nguyên giá, tồn kho hiện có.");
  } finally { await pool.end(); }
}
main().catch(() => { console.error("Chưa thể cập nhật hai sản phẩm. Kiểm tra kết nối cơ sở dữ liệu."); process.exitCode = 1; });
