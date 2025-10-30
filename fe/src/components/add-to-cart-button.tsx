"use client";

import { ButtonHTMLAttributes } from "react";
import { useCart } from "@/store/cart";
import { Product } from "@/types/products";

export function AddToCartButton({
  product,
  className = "",
  ...props
}: { product: Product } & ButtonHTMLAttributes<HTMLButtonElement>) {
  const add = useCart((s) => s.add);
  return (
    <button
      onClick={() => add(product, 1)}
      className={`bg-foreground text-background inline-flex h-10 items-center justify-center rounded-full px-4 text-sm font-medium transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] ${className}`}
      {...props}
    >
      Add to cart
    </button>
  );
}
