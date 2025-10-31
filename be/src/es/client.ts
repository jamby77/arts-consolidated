import { Client } from "@elastic/elasticsearch";
import { config } from "../config";

export const es = new Client({
  node: config.elastic.node,
  auth: {
    username: config.elastic.username,
    password: config.elastic.password,
  },
});

export const PRODUCT_INDEX = config.elastic.index;

export const productMapping = {
  mappings: {
    properties: {
      id: { type: "integer" },
      title: { type: "text" },
      description: { type: "text" },
      price: { type: "float" },
      discountPercentage: { type: "float" },
      rating: { type: "float" },
      stock: { type: "integer" },
      brand: { type: "keyword" },
      category: { type: "keyword" },
      thumbnail: { type: "keyword" },
      images: { type: "keyword" },
    },
  },
} as const;

export async function ensureIndex() {
  const exists = await es.indices.exists({ index: PRODUCT_INDEX });
  if (!exists) {
    await es.indices.create({ index: PRODUCT_INDEX, ...productMapping });
  }
}
