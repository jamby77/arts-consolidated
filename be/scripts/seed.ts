import { ensureSchema, upsertCategory, upsertProduct } from "../src/db/mysql.js";
import { ensureIndex, es, PRODUCT_INDEX } from "../src/es/client.js";

async function fetchAllProducts() {
  let products: any[] = [];
  let skip = 0;
  const limit = 100;
  while (true) {
    const url = `https://dummyjson.com/products?limit=${limit}&skip=${skip}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    products = products.concat(data.products);
    skip += data.products.length;
    if (skip >= data.total || data.products.length === 0) break;
  }
  return products;
}

async function run() {
  console.log("Ensuring DB schema and ES index...");
  await ensureSchema();
  await ensureIndex();

  console.log("Fetching products from DummyJSON...");
  const products = await fetchAllProducts();
  console.log(`Fetched ${products.length} products.`);

  for (const p of products) {
    const categoryId = await upsertCategory(p.category);
    await upsertProduct({
      id: p.id,
      title: p.title,
      description: p.description,
      price: p.price,
      discountPercentage: p.discountPercentage ?? 0,
      rating: p.rating ?? 0,
      stock: p.stock ?? 0,
      brand: p.brand ?? null,
      category_id: categoryId,
      thumbnail: p.thumbnail ?? null,
      images: p.images ?? [],
    });

    // Index into Elasticsearch
    try {
      await es.index({
        index: PRODUCT_INDEX,
        id: String(p.id),
        document: {
          id: p.id,
          title: p.title,
          description: p.description,
          price: p.price,
          discountPercentage: p.discountPercentage ?? 0,
          rating: p.rating ?? 0,
          stock: p.stock ?? 0,
          brand: p.brand ?? null,
          category: p.category,
          thumbnail: p.thumbnail ?? null,
          images: p.images ?? [],
        },
      });
    } catch (e: any) {
      console.warn(`Failed to index product ${p.id}: ${e.message}`);
    }
  }

  // Refresh index
  try {
    await es.indices.refresh({ index: PRODUCT_INDEX });
  } catch {}

  console.log("Seeding complete.");
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
