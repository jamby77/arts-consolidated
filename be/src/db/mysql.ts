import mysql from "mysql2/promise";
import { config } from "../config";

export type ProductRow = {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string | null;
  category_id: number | null;
  thumbnail: string | null;
  images: any; // JSON
};

export type CategoryRow = {
  id: number;
  name: string;
};

export const pool = mysql.createPool({
  host: config.mysql.host,
  port: config.mysql.port,
  user: config.mysql.user,
  password: config.mysql.password,
  database: config.mysql.database,
  waitForConnections: true,
  connectionLimit: 10,
  maxIdle: 10, // max idle connections, the default value is the same as `connectionLimit`
  idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
});

export async function ensureSchema() {
  await pool.query(`CREATE TABLE IF NOT EXISTS categories
                    (
                        id   INT AUTO_INCREMENT PRIMARY KEY,
                        name VARCHAR(255) NOT NULL UNIQUE
                    ) ENGINE = InnoDB
                      DEFAULT CHARSET = utf8mb4;`);

  await pool.query(`CREATE TABLE IF NOT EXISTS products
                    (
                        id                 INT PRIMARY KEY,
                        title              VARCHAR(255)   NOT NULL,
                        description        TEXT,
                        price              DECIMAL(10, 2) NOT NULL,
                        discountPercentage DECIMAL(5, 2) DEFAULT 0,
                        rating             DECIMAL(3, 2) DEFAULT 0,
                        stock              INT           DEFAULT 0,
                        brand              VARCHAR(255),
                        category_id        INT,
                        thumbnail          TEXT,
                        images             JSON,
                        CONSTRAINT fk_category FOREIGN KEY (category_id) REFERENCES categories (id)
                            ON UPDATE CASCADE ON DELETE SET NULL
                    ) ENGINE = InnoDB
                      DEFAULT CHARSET = utf8mb4;`);
}

export async function upsertCategory(name: string): Promise<number> {
  const [res] = await pool.query<mysql.ResultSetHeader>(
    "INSERT INTO categories (name) VALUES (?) ON DUPLICATE KEY UPDATE name = VALUES(name)",
    [name],
  );
  if (res.insertId) return res.insertId;
  const [rows] = await pool.query<mysql.RowDataPacket[]>(
    "SELECT id FROM categories WHERE name = ?",
    [name],
  );
  return rows[0].id as number;
}

export async function upsertProduct(row: ProductRow) {
  await pool.query(
    `REPLACE INTO products
     (id, title, description, price, discountPercentage, rating, stock, brand, category_id, thumbnail, images)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      row.id,
      row.title,
      row.description,
      row.price,
      row.discountPercentage,
      row.rating,
      row.stock,
      row.brand,
      row.category_id,
      row.thumbnail,
      JSON.stringify(row.images ?? []),
    ],
  );
}

export async function listCategories(): Promise<CategoryRow[]> {
  const [rows] = await pool.query<mysql.RowDataPacket[]>(
    "SELECT id, name FROM categories ORDER BY name ASC",
  );
  return rows as unknown as CategoryRow[];
}

export type ProductFilters = {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  limit?: number;
  offset?: number;
};

export async function listProducts(filters: ProductFilters = {}) {
  const where: string[] = [];
  const params: any[] = [];
  if (filters.category) {
    where.push("category_id = (SELECT id FROM categories WHERE name = ?)");
    params.push(filters.category);
  }

  if (typeof filters.minPrice === "number") {
    where.push("price >= ?");
    params.push(filters.minPrice);
  }
  if (typeof filters.maxPrice === "number") {
    where.push("price <= ?");
    params.push(filters.maxPrice);
  }
  const sql = `SELECT p.*, c.name as category
               FROM products p
                        LEFT JOIN categories c ON p.category_id = c.id
                   ${where.length ? "WHERE " + where.join(" AND ") : ""}
               ORDER BY p.id ASC
               LIMIT ? OFFSET ?`;
  params.push(filters.limit ?? 24, filters.offset ?? 0);
  const [rows] = await pool.query<mysql.RowDataPacket[]>(sql, params);
  return rows;
}

export async function getProductById(id: number) {
  const sql = `SELECT p.*, c.name as category
               FROM products p
                        LEFT JOIN categories c ON p.category_id = c.id
               WHERE p.id = ?`;
  const [rows] = await pool.query<mysql.RowDataPacket[]>(sql, [id]);
  return rows[0] ?? null;
}
