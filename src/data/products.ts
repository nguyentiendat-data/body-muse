import type { Notes, Product, Scent } from "@/types/api";

export const scentNotes: Record<Exclude<Scent, "all">, Notes> = {
  "daisy-blue": { top: "Cam bergamot", mid: "Hoa cúc", base: "Xạ hương trắng" },
  "peony-amber": { top: "Quýt và tiêu hồng", mid: "Mẫu đơn", base: "Hổ phách và gỗ tuyết tùng" },
  "mint-soda": { top: "Bạc hà và chanh", mid: "Lá xanh", base: "Gỗ nhẹ" },
};
export const scentNames: Record<Scent, string> = { "daisy-blue": "Daisy Blue", "peony-amber": "Peony Amber", "mint-soda": "Mint Soda", all: "Cả ba mùi" };
type Seed = [string, string, string, Product["category"], Scent, string, number, number | null, Product["unitBasis"]];
const rows: Seed[] = [
  ["xit-khu-mui-daisy-blue", "xit-khu-mui", "Xịt khử mùi Daisy Blue", "xit-khu-mui", "daisy-blue", "104 g", 129000, 124000, "100 g"],
  ["xit-khu-mui-peony-amber", "xit-khu-mui", "Xịt khử mùi Peony Amber", "xit-khu-mui", "peony-amber", "104 g", 129000, 124000, "100 g"],
  ["xit-khu-mui-mint-soda", "xit-khu-mui", "Xịt khử mùi Mint Soda", "xit-khu-mui", "mint-soda", "104 g", 129000, 124000, "100 g"],
  ["sua-tam-gel-mint-soda", "sua-tam-gel", "Sữa tắm gel Mint Soda", "tam-goi", "mint-soda", "350 ml", 149000, 42600, "100 ml"],
  ["sua-tam-gel-peony-amber", "sua-tam-gel", "Sữa tắm gel Peony Amber", "tam-goi", "peony-amber", "350 ml", 149000, 42600, "100 ml"],
  ["sua-tam-goi-2in1-daisy-blue", "sua-tam-goi-2in1", "Sữa tắm gội 2 trong 1 Daisy Blue", "tam-goi", "daisy-blue", "400 ml", 159000, 39800, "100 ml"],
  ["dau-goi-mint-soda", "dau-goi", "Dầu gội Mint Soda", "tam-goi", "mint-soda", "350 ml", 169000, 48300, "100 ml"],
  ["duong-the-peony-amber", "duong-the", "Dưỡng thể Peony Amber", "duong-the", "peony-amber", "250 ml", 179000, 71600, "100 ml"],
  ["lan-khu-mui-daisy-blue", "lan-khu-mui", "Lăn khử mùi Daisy Blue", "lan-nuoc-hoa", "daisy-blue", "50 ml", 99000, 198000, "100 ml"],
  ["nuoc-hoa-daisy-blue-edt", "nuoc-hoa", "Nước hoa Daisy Blue EDT", "lan-nuoc-hoa", "daisy-blue", "50 ml", 489000, 978000, "100 ml"],
  ["discovery-kit", "discovery-kit", "Discovery Kit (5 mẫu x 2 ml)", "bo-qua", "all", "10 ml", 99000, 990000, "100 ml"],
  ["muse-box", "muse-box", "Muse Box (xịt + sữa tắm + lăn + kit)", "bo-qua", "all", "4 món", 399000, null, null],
];
export const products: Product[] = rows.map(([slug, line, name, category, scent, size, priceVnd, unitPriceVnd, unitBasis], index) => {
  const number = String(index + 1).padStart(2, "0");
  return { id: `BM-${number}`, slug, line, name, category, scent, size, priceVnd, unitPriceVnd, unitBasis, notes: scent === "all" ? null : scentNotes[scent], stock: 50, image: `/products/bm-${number}.jpg`, isActive: true };
});
