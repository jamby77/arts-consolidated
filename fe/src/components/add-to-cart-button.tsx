"use client";

import { ButtonHTMLAttributes } from "react";
import { useCart } from "@/store/cart";
import type { Product } from "@/lib/api";

export function AddToCartButton({ product, className = "", ...props }: { product: Product } & ButtonHTMLAttributes<HTMLButtonElement>) {
  const add = useCart((s) => s.add);
  return (
    <button
      onClick={() => add(product, 1)}
      className={`inline-flex items-center justify-center rounded-full px-4 h-10 text-sm font-medium transition-colors bg-foreground text-background hover:bg-[#383838] dark:hover:bg-[#ccc] ${className}`}
      {...props}
    >
      Add to cart
    </button>
  );
}
