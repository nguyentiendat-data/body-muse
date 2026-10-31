import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { products } from "@/data/products";
import { ProductDetail } from "@/components/storefront";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = products.find((item) => item.slug === slug);
  return {
    title: `${product?.name || "Sản phẩm"} | BODY MUSE`,
    description: product
      ? `${product.name}, ${product.size}. Tìm mùi hương của riêng bạn.`
      : "Khám phá sản phẩm BODY MUSE.",
    openGraph: {
      images: process.env.NEXT_PUBLIC_SITE_URL
        ? [product?.image || "/logo-badge.png"]
        : [],
    },
  };
}
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!products.some((item) => item.slug === slug)) notFound();
  return <ProductDetail slug={slug} />;
}
