import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Quản trị | BODY MUSE",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-screen bg-[#F4EFEA] text-ink">{children}</div>;
}
