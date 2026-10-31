"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { Product } from "@/types/api";
import { request } from "@/lib/client-api";
import { useCart } from "@/lib/cart";
export const money = (value: number) => `${value.toLocaleString("vi-VN")}đ`;
export const categories = [["", "Tất cả"], ["xit-khu-mui", "Xịt khử mùi"], ["tam-goi", "Tắm gội"], ["duong-the", "Dưỡng thể"], ["lan-nuoc-hoa", "Lăn, nước hoa"], ["bo-qua", "Bộ quà"]];
export function useProducts(query = "") {
  const [products, setProducts] = useState<Product[]>([]); const [error, setError] = useState(""); const [loading, setLoading] = useState(true);
  useEffect(() => { let active = true; setLoading(true); setError(""); request<{ products: Product[] }>(`/api/products${query}`).then(result => { if (active) setProducts(result.products); }).catch(error => { if (active) setError(error.message); }).finally(() => { if (active) setLoading(false); }); return () => { active = false; }; }, [query]);
  return { products, error, loading };
}
export function ProductCard({ product }: { product: Product }) {
  const cart = useCart(); return <article className="product-card"><Link href={`/shop/${product.slug}`} className="block"><div className="photo">{product.image && <Image src={product.image} alt={product.name} fill sizes="(max-width: 640px) 46vw, (max-width: 1024px) 30vw, 280px" />}</div><div className="p-3 md:p-5"><p className="text-sm mb-1">{product.size}</p><h3 className="font-bold leading-snug min-h-12">{product.name}</h3><p className="text-cobalt-text font-bold text-xl mt-3">{money(product.priceVnd)}</p><p className="text-sm mt-1">{product.unitPriceVnd ? `${money(product.unitPriceVnd)} / ${product.unitBasis}` : "Bộ 4 món"}</p></div></Link><div className="px-3 pb-4 md:px-5"><button className="btn w-full" disabled={product.stock < 1} onClick={() => cart.add(product)}>{product.stock < 1 ? "Tạm hết hàng" : "Thêm vào giỏ"}</button></div></article>;
}
export function ProductGrid({ products }: { products: Product[] }) { return <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">{products.map(product => <ProductCard product={product} key={product.id} />)}</div>; }
export function CatalogState({ loading, error }: { loading: boolean; error: string }) { return loading ? <p role="status" className="py-8">Đang tải sản phẩm…</p> : error ? <p role="alert" className="notice error">{error}</p> : null; }
