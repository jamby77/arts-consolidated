"use client";

import { useCart } from "@/store/cart";
import { Empty } from "./empty";
import { Item } from "@/components/cart/item";
import { Summary } from "@/components/cart/summary";

export function Cart() {
  const items = useCart((s) => s.asArray());
  if (items.length === 0) {
    return <Empty />;
  }
  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
      <div className="space-y-4 md:col-span-2">
        {items.map((it) => (
          <Item item={it} key={it.id} />
        ))}
      </div>
      <Summary />
    </div>
  );
}
