import type { Metadata } from "next";
import { fetchProducts } from "@/lib/api";
import { Listing } from "@/components/products/listing";

export const metadata: Metadata = {
  title: "Products",
};

export default async function ProductsPage() {
  const { products } = await fetchProducts({ limit: 24 });
  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-semibold">Products</h1>
      <Listing products={products} />
    </div>
  );
}
