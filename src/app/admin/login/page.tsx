import { AdminForm } from "@/components/admin-controls";
import { safeAdminNext } from "@/lib/admin-redirect";
export default async function Login({
  searchParams,
}: {
  searchParams: Promise<{ next?: string | string[] }>;
}) {
  const { next } = await searchParams;
  return (
    <main className="max-w-md mx-auto p-8">
      <h1 className="text-3xl font-display mb-8">Đăng nhập quản trị</h1>
      <AdminForm
        endpoint="/api/admin/login"
        mode="POST"
        redirectTo={safeAdminNext(next)}
      >
        <label>
          Mật khẩu quản trị
          <input
            className="block w-full border-2 border-ink rounded-xl p-3"
            name="password"
            type="password"
            required
            autoComplete="current-password"
          />
        </label>
      </AdminForm>
    </main>
  );
}
