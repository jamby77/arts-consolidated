"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { Product } from "@/types/products";
import { CartItem } from "@/types/cart";

type CartState = {
  items: Record<number, CartItem>;
  add: (product: Product, qty?: number) => void;
  remove: (id: number) => void;
  clear: () => void;
  count: () => number;
  total: () => number;
  asArray: () => CartItem[];
};

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: {},
      add: (product, qty = 1) =>
        set((state) => {
          const existing = state.items[product.id];
          const nextQty = (existing?.quantity ?? 0) + qty;
          return {
            items: {
              ...state.items,
              [product.id]: {
                id: product.id,
                title: product.title,
                price: product.price,
                thumbnail: product.thumbnail ?? product.images?.[0],
                quantity: nextQty,
              },
            },
          };
        }),
      remove: (id) =>
        set((state) => {
          const copy = { ...state.items };
          delete copy[id];
          return { items: copy };
        }),
      clear: () => set({ items: {} }),
      count: () =>
        Object.values(get().items).reduce((acc, it) => acc + it.quantity, 0),
      total: () =>
        Object.values(get().items).reduce(
          (acc, it) => acc + it.price * it.quantity,
          0,
        ),
      asArray: () => Object.values(get().items),
    }),
    {
      name: "cart-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
    },
  ),
);
