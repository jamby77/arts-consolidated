import type { Request, Response } from "express";
import { listProducts } from "../db/mysql";
import { es, PRODUCT_INDEX } from "../es/client";

export async function productsHandler(req: Request, res: Response) {
  try {
    const { category, q, minPrice, maxPrice, limit, offset } = req.query as any;
    const parsed = {
      category: category as string | undefined,
      q: q as string | undefined,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      limit: limit ? Number(limit) : 24,
      offset: offset ? Number(offset) : 0,
    };

    // If q is provided, prefer Elasticsearch for text search + filters
    if (parsed.q) {
      const must: any[] = [
        {
          multi_match: {
            query: parsed.q,
            fields: ["title^3", "description", "brand^2"],
            type: "best_fields",
            operator: "and",
          },
        },
      ];
      const filter: any[] = [];
      if (parsed.category) {
        filter.push({ term: { category: parsed.category } });
      }
      if (typeof parsed.minPrice === "number" || typeof parsed.maxPrice === "number") {
        const range: any = {};
        if (typeof parsed.minPrice === "number") range.gte = parsed.minPrice;
        if (typeof parsed.maxPrice === "number") range.lte = parsed.maxPrice;
        filter.push({ range: { price: range } });
      }

      const body: any = {
        from: parsed.offset,
        size: parsed.limit,
        query: {
          bool: {
            must,
            filter,
          },
        },
      };

      const resp = await es.search({ index: PRODUCT_INDEX, ...body });
      const docs = (resp.hits?.hits || []).map((h: any) => h._source);
      return res.json(docs);
    }

    // Fallback to MySQL when no text query
    const rows = await listProducts({
      category: parsed.category,
      q: undefined,
      minPrice: parsed.minPrice,
      maxPrice: parsed.maxPrice,
      limit: parsed.limit,
      offset: parsed.offset,
    });
    res.json(rows);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
}
