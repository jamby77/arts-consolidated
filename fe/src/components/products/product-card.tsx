import Link from "next/link";
import Image from "next/image";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { Product } from "@/types/products";

export function ProductCard({ product }: { product: Product }) {
  return (
    <li
      key={product.id}
      className="flex flex-col rounded-xl border border-black/10 bg-white p-4 dark:border-white/15 dark:bg-black/40"
    >
      <Link href={`/products/${product.id}`} className="mb-3 block">
        <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-black/5 dark:bg-white/10">
          <Image
            src={product.thumbnail ?? product.images?.[0] ?? "/next.svg"}
            alt={product.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover"
          />
        </div>
      </Link>
      <Link
        href={`/products/${product.id}`}
        className="mb-1 line-clamp-1 font-medium"
      >
        {product.title}
      </Link>
      <div className="mb-3 flex items-center justify-between text-sm text-zinc-600 dark:text-zinc-300">
        <span>${product.price.toFixed(2)}</span>
        <span className="text-amber-600">★ {product.rating.toFixed(1)}</span>
      </div>
      <AddToCartButton product={product} className="mt-auto" />
    </li>
  );
}
