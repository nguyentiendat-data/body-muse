// Chỉ dùng cho CLI schema/seed, không import vào các route chạy trên Vercel.
import { existsSync } from "node:fs";
for (const path of [".env.local", ".env"]) {
  if (existsSync(path)) process.loadEnvFile(path);
}
