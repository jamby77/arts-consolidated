import Image from "next/image";
import Link from "next/link";
import { fetchProduct } from "@/lib/api";
import { AddToCartButton } from "@/components/add-to-cart-button";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = await fetchProduct(id);
  return { title: `${product.title} – Next Shop` };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await fetchProduct(id);
  const {
    discountPercentage,
    description,
    rating,
    title,
    images,
    price,
    thumbnail,
  } = product;
  const mainImage = images?.[0] ?? thumbnail ?? "/next.svg";

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-4 text-sm">
        <Link href="/products" className="hover:underline">
          ← Back to products
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-black/5 dark:bg-white/10">
          <Image
            src={mainImage}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
        <div>
          <h1 className="mb-2 text-2xl font-semibold">{title}</h1>
          <div className="mb-4 flex items-center gap-4 text-zinc-700 dark:text-zinc-300">
            <span className="text-xl font-medium">${price.toFixed(2)}</span>
            {discountPercentage !== undefined && (
              <span className="text-emerald-600">-{discountPercentage}%</span>
            )}
            <span className="ml-auto text-amber-600">
              ★ {rating.toFixed(1)}
            </span>
          </div>
          <p className="mb-6 text-zinc-700 dark:text-zinc-300">{description}</p>
          <AddToCartButton product={product} />
        </div>
      </div>
      {images && images.length > 1 && (
        <div className="mt-8">
          <h2 className="mb-3 font-medium">More images</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {images.slice(1).map((src, idx) => (
              <div
                key={idx}
                className="relative aspect-square w-full overflow-hidden rounded-lg bg-black/5 dark:bg-white/10"
              >
                <Image
                  src={src}
                  alt={`${title} ${idx + 2}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
