import { Request, Response } from "express";

export function healthHandler(_req: Request, res: Response) {
  res.json({
    ok: true,
    categories: '/categories',
    products: '/products',
    productsAggs: '/products/aggs',
    productById: '/products/:id',
  });
}
