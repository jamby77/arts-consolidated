import type { Request, Response } from "express";
import { listCategories } from "../db/mysql";

export async function categoriesHandler(_req: Request, res: Response) {
  try {
    const cats = await listCategories();
    res.json(cats);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
}
