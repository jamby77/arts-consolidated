import type { Request, Response } from "express";
import { getProductById } from "../db/mysql";

export async function productByIdHandler(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const row = await getProductById(id);
    if (!row) return res.status(404).json({ error: "Not found" });
    res.json(row);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
}
