"use client";

import { useEffect, useState } from "react";

import { useCart } from "@/store/cart";

export function Counter() {
  const [count, setCount] = useState(0);
  const counter = useCart((s) =>
    Object.values(s.items).reduce((acc, it) => acc + it.quantity, 0),
  );
  useEffect(() => {
    setCount(counter);
  }, [counter]);

  return (
    <span className="bg-foreground text-background inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-xs">
      {count}
    </span>
  );
}
