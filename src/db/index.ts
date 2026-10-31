import { Pool } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import * as schema from "./schema";

let connection: ReturnType<typeof drizzle<typeof schema>> | undefined;
export function getDb() {
  if (!process.env.DATABASE_URL) throw new Error("Chưa cấu hình cơ sở dữ liệu.");
  connection ??= drizzle(new Pool({ connectionString: process.env.DATABASE_URL }), { schema });
  return connection;
}
