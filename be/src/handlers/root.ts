import type { Request, Response } from "express";

export function rootRedirectHandler(_req: Request, res: Response) {
  res.redirect("/health");
}
