"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { Product } from "@/types/products";
import { CartItem } from "@/types/cart";
import { useMemo } from "react";

type CartState = {
  items: Record<number, CartItem>;
  add: (product: Product, qty?: number) => void;
  remove: (id: number) => void;
  increment: (id: number) => void;
  decrement: (id: number) => void;
  clear: () => void;
};

function removeItem(id: number, state: CartState) {
  const copy = { ...state.items };
  delete copy[id];
  return { items: copy };
}

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: {},
      add: (product, qty = 1) =>
        set((state) => {
          const existing = state.items[product.id];
          const nextQty = (existing?.quantity ?? 0) + qty;
          let discountRate = product.discountPercentage ?? 0;
          return {
            items: {
              ...state.items,
              [product.id]: {
                id: product.id,
                title: product.title,
                discountPercentage: discountRate,
                finalPrice:
                  product.price - (product.price * discountRate) / 100,
                price: product.price,
                thumbnail: product.thumbnail ?? product.images?.[0],
                quantity: nextQty,
              },
            },
          };
        }),
      remove: (id) => set((state) => removeItem(id, state)),
      increment: (id) =>
        set((state) => {
          if (!state.items[id]) {
            return state;
          }
          const copy = { ...state.items };
          // obviously, if this is real e-commerce app, we should check if the quantity is available
          copy[id].quantity++;
          return { items: copy };
        }),
      decrement: (id) =>
        set((state) => {
          if (!state.items[id] || state.items[id].quantity === 0) {
            return state;
          }
          if (state.items[id].quantity === 1) {
            return removeItem(id, state);
          }
          const copy = { ...state.items };
          copy[id].quantity--;
          return { items: copy };
        }),
      clear: () => set({ items: {} }),
    }),
    {
      name: "cart-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
    },
  ),
);

export const useCartTotal = () => {
  const items = useCart((s) => s.items);
  return useMemo(
    () =>
      Object.values(items).reduce(
        (acc, it) => acc + it.finalPrice * it.quantity,
        0,
      ),
    [items],
  );
};

export const useCartSavings = () => {
  const items = useCart((s) => s.items);
  return useMemo(
    () =>
      Object.values(items).reduce(
        (acc, it) => acc + (it.price - it.finalPrice) * it.quantity,
        0,
      ),
    [items],
  );
};

export const useCartCount = () => {
  const items = useCart((s) => s.items);
  return useMemo(
    () => Object.values(items).reduce((acc, it) => acc + it.quantity, 0),
    [items],
  );
};

export const useCartItemsAsArray = () => {
  const items = useCart((s) => s.items);
  return useMemo(() => Object.values(items), [items]);
};
