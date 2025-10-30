import Image from "next/image";
import Link from "next/link";
import { fetchProduct } from "@/lib/api";
import { AddToCartButton } from "@/components/add-to-cart-button";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const product = await fetchProduct(params.id);
  return { title: `${product.title} – Next Shop` };
}

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  const product = await fetchProduct(params.id);
  const mainImage = product.images?.[0] ?? product.thumbnail ?? "/next.svg";

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-4 text-sm">
        <Link href="/products" className="hover:underline">← Back to products</Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-black/5 dark:bg-white/10">
          <Image src={mainImage} alt={product.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold mb-2">{product.title}</h1>
          <div className="flex items-center gap-4 text-zinc-700 dark:text-zinc-300 mb-4">
            <span className="text-xl font-medium">${product.price.toFixed(2)}</span>
            {typeof product.discountPercentage === "number" && (
              <span className="text-emerald-600">-{product.discountPercentage}%</span>
            )}
            <span className="text-amber-600 ml-auto">★ {product.rating.toFixed(1)}</span>
          </div>
          <p className="text-zinc-700 dark:text-zinc-300 mb-6">{product.description}</p>
          <AddToCartButton product={product} />
        </div>
      </div>
      {product.images && product.images.length > 1 && (
        <div className="mt-8">
          <h2 className="font-medium mb-3">More images</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {product.images.slice(1).map((src, idx) => (
              <div key={idx} className="relative w-full aspect-square overflow-hidden rounded-lg bg-black/5 dark:bg-white/10">
                <Image src={src} alt={`${product.title} ${idx + 2}`} fill className="object-cover" sizes="(max-width: 768px) 50vw, 25vw" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
