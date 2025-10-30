export type Product = {
  id: number;
  sku: string;
  title: string;
  description: string;
  price: number;
  weight: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand?: string;
  category?: string;
  thumbnail?: string;
  images?: string[];
  tags?: string[];
  dimensions?: {
    width?: number;
    height?: number;
    depth?: number;
  };
  warrantyInformation?: string;
  shippingInformation?: string;
  availabilityStatus?: string;
  reviews?: {
    rating: number;
    comment?: string;
    date: string;
    reviewerName: string;
    reviewerEmail: string;
  }[];
  returnPolicy?: string;
  minimumOrderQuantity?: number;
  meta?: {
    createdAt: string;
    updatedAt: string;
    barcode: string;
    qrCode: string;
  };
};

export type ProductsResponse = {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
};
import mockProducts from "@/mocks/products.json";

const USE_MOCKS = process.env.USE_MOCKS === "true";
const BASE = process.env.API_BASE_URL;

export async function fetchProducts(
  {
    limit,
    skip,
  }: {
    limit?: number;
    skip?: number;
  } = {
    limit: 24,
    skip: 0,
  },
) {
  const effectiveLimit = typeof limit === "number" ? limit : 24;
  const effectiveSkip = typeof skip === "number" ? skip : 0;

  if (USE_MOCKS) {
    const all = (mockProducts.products ?? []) as Product[];
    const sliced = all.slice(effectiveSkip, effectiveSkip + effectiveLimit);
    const total = (mockProducts as any).total ?? all.length;
    return {
      products: sliced,
      total,
      skip: effectiveSkip,
      limit: effectiveLimit,
    } as ProductsResponse;
  }

  if (!BASE) {
    throw new Error("API_BASE_URL is not set (and USE_MOCKS is not 'true')");
  }

  const params = new URLSearchParams();
  params.set("limit", String(effectiveLimit));
  params.set("skip", String(effectiveSkip));
  const url = `${BASE}/products?${params.toString()}`;
  const res = await fetch(url, { next: { revalidate: 60 } });
  if (!res.ok) {
    throw new Error(`Failed to fetch products: ${res.status}`);
  }
  return (await res.json()) as ProductsResponse;
}

export async function fetchProduct(id: string | number) {
  if (USE_MOCKS) {
    const numericId = typeof id === "string" ? Number(id) : id;
    const found = (mockProducts.products as Product[]).find(
      (p) => p.id === numericId,
    );
    if (!found) {
      throw new Error(`Mock product not found for id ${id}`);
    }
    return found;
  }

  if (!BASE) {
    throw new Error("API_BASE_URL is not set (and USE_MOCKS is not 'true')");
  }

  const res = await fetch(`${BASE}/products/${id}`, {
    next: { revalidate: 300 },
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch product ${id}: ${res.status}`);
  }
  return (await res.json()) as Product;
}
