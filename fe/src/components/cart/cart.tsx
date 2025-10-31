"use client";

import { useCartItemsAsArray } from "@/store/cart";

import { Item } from "./item";
import { Summary } from "./summary";
import { Empty } from "./empty";

export function Cart() {
  const cartItems = useCartItemsAsArray();

  if (cartItems.length === 0) {
    return <Empty />;
  }
  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
      <div className="space-y-4 md:col-span-2">
        {cartItems.map((it) => (
          <Item item={it} key={it.id} />
        ))}
      </div>
      <Summary />
    </div>
  );
}
