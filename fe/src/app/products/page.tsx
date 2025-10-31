import type { Metadata } from "next";
import { fetchProducts } from "@/lib/api";
import { ProductListing } from "@/components/products/product-listing";

export const metadata: Metadata = {
  title: "Products",
};

export default async function ProductsPage() {
  const { products } = await fetchProducts({ limit: 24, skip: 0 });
  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-semibold">Products</h1>
      <ProductListing products={products} />
    </div>
  );
}
