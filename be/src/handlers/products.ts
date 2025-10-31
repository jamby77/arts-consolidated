import type { Request, Response } from "express";
import { listProducts } from "../db/mysql";

export async function productsHandler(req: Request, res: Response) {
  try {
    const { category, q, minPrice, maxPrice, limit, offset } = req.query as any;
    const rows = await listProducts({
      category,
      q,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      limit: limit ? Number(limit) : undefined,
      offset: offset ? Number(offset) : undefined,
    });
    res.json(rows);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
}
