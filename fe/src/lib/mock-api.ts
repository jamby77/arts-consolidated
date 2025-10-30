import mockProducts from "@/mocks/products.json";
import { Product, ProductsResponse } from "@/types/products";

export async function mockFetchProducts(
  {
    limit,
    skip,
  }: {
    limit: number;
    skip: number;
  } = {
    limit: 24,
    skip: 0,
  },
) {
  const all = (mockProducts.products ?? []) as Product[];
  const sliced = all.slice(skip, skip + limit);
  const total = (mockProducts as any).total ?? all.length;
  return {
    products: sliced,
    total,
    skip: skip,
    limit: limit,
  } as ProductsResponse;
}

export async function mockFetchProduct(id: string | number) {
  const numericId = typeof id === "string" ? Number(id) : id;
  const found = (mockProducts.products as Product[]).find(
    (p) => p.id === numericId,
  );
  if (!found) {
    throw new Error(`Mock product not found for id ${id}`);
  }
  return found;
}
