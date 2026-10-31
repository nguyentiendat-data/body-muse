import type { Metadata } from "next";
import { Shop } from "@/components/storefront";
export const metadata: Metadata = {
  title: "Cửa hàng | BODY MUSE",
  description: "Khám phá nước hoa, xịt khử mùi và chăm sóc cơ thể BODY MUSE.",
};
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; scent?: string; sort?: string }>;
}) {
  return <Shop {...await searchParams} />;
}
