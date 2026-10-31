import { spawnSync } from "node:child_process";
const env = {
  ...process.env,
  DATABASE_URL: "",
  NEXT_PUBLIC_USE_MOCK: "1",
  NEXT_PUBLIC_OTP_DEMO: "1",
  NEXT_PUBLIC_GA_ID: "",
  NEXT_PUBLIC_META_PIXEL_ID: "",
};
for (const args of [
  ["node_modules/next/dist/bin/next", "build"],
  ["node_modules/@playwright/test/cli.js", "test", ...process.argv.slice(2)],
]) {
  const result = spawnSync(process.execPath, args, { env, stdio: "inherit" });
  if (result.status !== 0) process.exit(result.status || 1);
}
console.info(
  "Kiểm thử đã dùng bản mock. Chạy npm run build trước khi deploy bản kết nối Postgres.",
);
