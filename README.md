# Arts Consolidated Task

Monorepo with a Next.js frontend (fe/) and a Node.js backend API (be/) implementing a simple e-commerce experience using DummyJSON data, MySQL, and Elasticsearch.

## Structure

- `fe/` — Next.js 16 + React 19 storefront
  - Product listing/detail, cart with Zustand persistence
  - Tailwind CSS v4
- `be/` — Express 5 REST API with MySQL 8 and Elasticsearch 8/9
  - Seed script fetches products from DummyJSON and populates DB + ES
  - Text search via ES, non-text filters via MySQL

## Quick start

- Frontend (dev):
  1) `cd fe`
  2) `pnpm install` (or npm/yarn/bun)
  3) `pnpm dev` → http://localhost:3000
  4) Configure envs if needed in `fe/.env.local`:
     - `USE_MOCKS=true` (offline) or `API_BASE_URL=https://dummyjson.com`

- Backend (Docker, recommended):
  1) `cd be`
  2) `cp .env.example .env` (optional; defaults are OK)
  3) `docker compose up -d --build`
  4) The API container auto-runs the seed on start. When healthy:
     - API: http://localhost:3001
     - MySQL: localhost:3306
     - Elasticsearch: http://localhost:9200

- Backend (local dev alternative):
  1) `cd be && npm install && cp .env.example .env`
  2) Ensure MySQL and Elasticsearch are running locally or adjust `.env`
  3) `npm run dev`
  4) `npm run seed` to populate DB and ES

## API endpoints (be/)

- `GET /health` — service health + route hints
- `GET /categories` — list all categories (MySQL)
- `GET /products` —
  - With `q` → Elasticsearch multi_match over `title`, `description`, `brand`
  - Without `q` → MySQL with filters
  - Filters: `category`, `minPrice`, `maxPrice`, `limit` (<=100), `offset`
- `GET /products/aggs` — ES aggregations (category, brand, price ranges)
- `GET /products/:id` — product by id (MySQL)

Request examples: see `be/test/product.http`.

## Tech highlights

- Frontend: Next.js App Router, RSC for data fetching; Zustand for cart; Tailwind v4
- Backend: Express 5, MySQL schema (`categories`, `products`), ES index with simple mapping
- Seeding: Fetches all products from DummyJSON, upserts into MySQL, indexes ES; container entrypoint runs seed at start

## Known limitations

- No auth, rate limiting, or tests
- Basic error/loading states on FE
- Text search relevance is basic; ES mapping can be improved
- Cart is client-only (not synced across devices)
