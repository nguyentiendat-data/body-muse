import { Pool } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import { products as catalog } from "../data/products";
import { products } from "./schema";

async function seed() {
  if (!process.env.DATABASE_URL) throw new Error("Vui lòng cấu hình DATABASE_URL trước khi nạp dữ liệu.");
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  try {
    const db = drizzle(pool);
    for (const product of catalog) await db.insert(products).values(product).onConflictDoNothing({ target: products.id });
    console.info("Đã nạp danh mục 12 sản phẩm; giữ nguyên dữ liệu đã có.");
  } finally { await pool.end(); }
}
seed().catch(() => { console.error("Không thể nạp dữ liệu. Kiểm tra cấu hình và schema cơ sở dữ liệu."); process.exitCode = 1; });
