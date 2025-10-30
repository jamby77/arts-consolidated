"use client";
import { useCart } from "@/store/cart";

export function Counter() {
  const count = useCart((s) => s.count());
  return (
    <span className="bg-foreground text-background inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-xs">
      {count}
    </span>
  );
}
