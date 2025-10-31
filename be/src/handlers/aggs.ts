import type { Request, Response } from "express";
import { es, PRODUCT_INDEX } from "../es/client";

export async function productsAggsHandler(_req: Request, res: Response) {
  try {
    const body: any = {
      size: 0,
      aggs: {
        by_category: { terms: { field: "category" } },
        by_brand: { terms: { field: "brand" } },
        price_ranges: {
          range: {
            field: "price",
            ranges: [
              { to: 50 },
              { from: 50, to: 100 },
              { from: 100, to: 250 },
              { from: 250 },
            ],
          },
        },
      },
    };
    const resp = await es.search({ index: PRODUCT_INDEX, ...body });
    res.json(resp.aggregations ?? {});
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
}
