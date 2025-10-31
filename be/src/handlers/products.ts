import type { Request, Response } from "express";
import { listProducts } from "../db/mysql";
import { es, PRODUCT_INDEX } from "../es/client";
import { z } from "zod";

// Query validation schema
const QuerySchema = z.object({
  category: z.string().min(1).optional(),
  q: z.string().min(1).optional(),
  minPrice: z.coerce.number<number>().nonnegative().optional(),
  maxPrice: z.coerce.number<number>().nonnegative().optional(),
  limit: z.coerce.number<number>().int().positive().max(100).default(24),
  offset: z.coerce.number<number>().int().min(0).default(0),
});

// Output product schema to normalize/validate response
const ProductSchema = z.object({
  id: z.number().int(),
  title: z.string(),
  description: z.string().optional().nullable(),
  price: z.coerce.number<number>(),
  discountPercentage: z.coerce.number<number>().optional().nullable(),
  rating: z.coerce.number<number>().optional().nullable(),
  stock: z.coerce.number<number>().optional().nullable(),
  brand: z.string().optional().nullable(),
  category: z.string().optional().nullable(),
  thumbnail: z.url().optional().nullable(),
  images: z.array(z.url()).optional().nullable(),
});
const ProductsResponseSchema = z.array(ProductSchema);

async function esProductHandler(
  {
    category,
    limit,
    maxPrice,
    minPrice,
    offset,
    q
  }: z.infer<typeof QuerySchema>) {
  const must: any[] = [
    {
      multi_match: {
        query: q,
        fields: ["title^3", "description", "brand^2"],
        type: "best_fields",
        operator: "and",
      },
    },
  ];
  const filter: any[] = [];
  if (category) {
    filter.push({term: {category}});
  }
  if (typeof minPrice === "number" || typeof maxPrice === "number") {
    const range: any = {};
    if (typeof minPrice === "number") range.gte = minPrice;
    if (typeof maxPrice === "number") range.lte = maxPrice;
    filter.push({range: {price: range}});
  }

  const body: any = {
    from: offset,
    size: limit,
    query: {
      bool: {
        must,
        filter,
      },
    },
  };

  const resp = await es.search({index: PRODUCT_INDEX, ...body});
  const docs = (resp.hits?.hits || []).map((h: any) => h._source);
  return ProductsResponseSchema.parse(
    docs.map((d: any) => ({
      id: Number(d.id),
      title: d.title,
      description: d.description,
      price: Number(d.price),
      discountPercentage: d.discountPercentage ?? null,
      rating: d.rating ?? null,
      stock: d.stock ?? null,
      brand: d.brand ?? null,
      category: d.category ?? null,
      thumbnail: d.thumbnail ?? null,
      images: Array.isArray(d.images) ? d.images.map(String) : [],
    })),
  );
}

export async function productsHandler(req: Request, res: Response) {
  try {
    const parsed = QuerySchema.optional().parse(req.query);

    // If q is provided, prefer Elasticsearch for text search + filters
    if (parsed?.q) {
      return res.json(await esProductHandler(parsed));
    }

    // Fallback to MySQL when no text query
    const rows = await listProducts({
      category: parsed?.category,
      minPrice: parsed?.minPrice,
      maxPrice: parsed?.maxPrice,
      limit: parsed?.limit ?? 24,
      offset: parsed?.offset ?? 0,
    });

    const validated = ProductsResponseSchema.parse(rows);
    res.json(validated);
  } catch (e: any) {
    if (e instanceof z.ZodError) {
      return res.status(400).json({
        error: "Invalid request",
        details: z.prettifyError(e)
      });
    }
    res.status(500).json({error: e.message});
  }
}
