import express from "express";
import { config } from "./config";
import { ensureSchema, getProductById, listCategories, listProducts } from "./db/mysql";
import { ensureIndex, es, PRODUCT_INDEX } from "./es/client";

const app = express();
app.use(express.json());

app.get('/', async (_req, res) => {
  // redirect to /health
  res.redirect("/health");
});

app.get("/health", async (_req, res) => {
  res.json({ ok: true });
});

app.get("/categories", async (_req, res) => {
  try {
    const cats = await listCategories();
    res.json(cats);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

app.get("/products", async (req, res) => {
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
});

app.get("/products/aggs", async (_req, res) => {
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
});

app.get("/products/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const row = await getProductById(id);
    if (!row) return res.status(404).json({ error: "Not found" });
    res.json(row);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

async function start() {
  await ensureSchema();
  try {
    await ensureIndex();
  } catch (_e) {
    // Elasticsearch may not be ready; server still runs for DB-backed endpoints
  }
  app.listen(config.port, () => {
    console.log(`API listening on :${config.port}`);
  });
}

start().catch((e) => {
  console.error(e);
  process.exit(1);
});
