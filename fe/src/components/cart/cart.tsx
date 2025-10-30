"use client";

import { useEffect, useState } from "react";

import { useCart } from "@/store/cart";
import { CartItem } from "@/types/cart";

import { Item } from "./item";
import { Summary } from "./summary";
import { Empty } from "./empty";

export function Cart() {
  const [items, setItems] = useState<CartItem[]>([]);
  const asArray = useCart((s) => s.asArray);
  useEffect(() => {
    setItems(asArray());
  }, [asArray]);

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
