"use client";
import { createContext, useContext, useEffect, useState } from "react";
import type { Product, Scent } from "@/types/api";
import { track } from "./analytics";
export type CartItem = { productId: string; qty: number; scent?: Scent };
const CartContext = createContext<{
  items: CartItem[];
  add: (product: Product, qty?: number) => void;
  update: (id: string, qty: number) => void;
  clear: () => void;
  open: boolean;
  setOpen: (value: boolean) => void;
}>({
  items: [],
  add: () => {},
  update: () => {},
  clear: () => {},
  open: false,
  setOpen: () => {},
});
export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    try {
      const saved: unknown = JSON.parse(
        localStorage.getItem("bm_cart") || "[]",
      );
      if (Array.isArray(saved))
        setItems(
          saved
            .filter(
              (item) =>
                typeof item.productId === "string" &&
                Number.isInteger(item.qty) &&
                item.qty > 0 &&
                item.qty <= 9,
            )
            .map((item) => ({
              productId: item.productId,
              qty: item.qty,
              scent: item.scent,
            })),
        );
    } catch {}
    setReady(true);
  }, []);
  useEffect(() => {
    if (ready) {
      try {
        localStorage.setItem("bm_cart", JSON.stringify(items));
      } catch {}
    }
  }, [items, ready]);
  function add(product: Product, qty = 1) {
    if (product.stock < 1) return;
    setItems((previous) => {
      const found = previous.find((item) => item.productId === product.id);
      return found
        ? previous.map((item) =>
            item.productId === product.id
              ? { ...item, qty: Math.min(9, product.stock, item.qty + qty) }
              : item,
          )
        : [
            ...previous,
            {
              productId: product.id,
              qty: Math.min(qty, product.stock, 9),
              scent: product.scent,
            },
          ];
    });
    track("add_to_cart", {
      value: product.priceVnd * qty,
      items: [{ item_id: product.id, quantity: qty }],
    });
    setOpen(true);
  }
  return (
    <CartContext.Provider
      value={{
        items,
        add,
        update: (id, qty) =>
          setItems((previous) =>
            previous
              .map((item) =>
                item.productId === id
                  ? { ...item, qty: Math.min(9, qty) }
                  : item,
              )
              .filter((item) => item.qty > 0),
          ),
        clear: () => setItems([]),
        open,
        setOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
export function useCart() {
  return useContext(CartContext);
}
