import express from "express";
import { config } from "./config";
import { ensureSchema } from "./db/mysql";
import { ensureIndex } from "./es/client";
import { rootRedirectHandler } from "./handlers/root";
import { healthHandler } from "./handlers/health";
import { categoriesHandler } from "./handlers/categories";
import { productsHandler } from "./handlers/products";
import { productsAggsHandler } from "./handlers/aggs";
import { productByIdHandler } from "./handlers/productById";

const app = express();
app.use(express.json());

app.get('/', rootRedirectHandler);
app.get("/health", healthHandler);
app.get("/categories", categoriesHandler);
app.get("/products", productsHandler);
app.get("/products/aggs", productsAggsHandler);
app.get("/products/:id", productByIdHandler);

async function start() {
  try {
    ensureSchema();
    ensureIndex();
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
