import { mockFetchProduct, mockFetchProducts } from "@/lib/mock-api";
import { Product, ProductsResponse } from "@/types/products";

const USE_MOCKS = process.env.USE_MOCKS === "true";
const BASE = process.env.API_BASE_URL;

export async function fetchProducts(
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
  if (USE_MOCKS) {
    console.log("fetchProducts", { limit, skip });
    return mockFetchProducts({ limit, skip });
  }

  if (!BASE) {
    throw new Error("API_BASE_URL is not set (and USE_MOCKS is not 'true')");
  }

  const params = new URLSearchParams();
  params.set("limit", String(limit));
  params.set("skip", String(skip));
  const url = `${BASE}/products?${params.toString()}`;
  const res = await fetch(url, { next: { revalidate: 60 } });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to fetch products: ${res.status} ${text}`);
  }
  return (await res.json()) as ProductsResponse;
}

export async function fetchProduct(id: string | number) {
  if (USE_MOCKS) {
    return mockFetchProduct(id);
  }

  if (!BASE) {
    throw new Error("API_BASE_URL is not set (and USE_MOCKS is not 'true')");
  }

  const res = await fetch(`${BASE}/products/${id}`, {
    next: { revalidate: 300 },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to fetch product ${id}: ${res.status} ${text}`);
  }
  return (await res.json()) as Product;
}
