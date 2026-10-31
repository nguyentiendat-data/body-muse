import { describe, expect, it } from "vitest";
import { products } from "./products";
import { resolveQuiz } from "./quiz";

describe("Dữ liệu danh mục và trắc nghiệm", () => {
  it("có đủ 12 sản phẩm và mã duy nhất", () => {
    expect(products).toHaveLength(12);
    expect(new Set(products.map(product => product.id)).size).toBe(12);
    expect(products.every(product => product.stock === 50 && product.image)).toBe(true);
  });
  it("chọn theo đa số, hòa theo câu đầu", () => {
    expect(resolveQuiz([0, 1, 1, 1, 2])).toBe("peony-amber");
    expect(resolveQuiz([2, 0, 0, 2, 1])).toBe("mint-soda");
    expect(() => resolveQuiz([0])).toThrow();
  });
});
