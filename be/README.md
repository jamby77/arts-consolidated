# Backend: Simple E-commerce API

Implements the assignment in `be/TASK.md` using Node.js (Express v5), MySQL 8, and Elasticsearch 8. Dummy data is pulled from https://dummyjson.com/products and stored in MySQL, with documents indexed into Elasticsearch.

## Project structure

- `src/server.ts` — Express API server
- `src/config.ts` — configuration from env vars
- `src/db/mysql.ts` — MySQL pool, schema, and queries
- `src/es/client.ts` — Elasticsearch client and index mapping
- `scripts/seed.ts` — Fetch DummyJSON, upsert into MySQL, index into ES
- `docker-compose.yml` — MySQL, Elasticsearch, API service
- `Dockerfile` — API Docker image
- `.env.example` — environment template

## Requirements

- Docker Desktop (or Docker Engine + Compose)
- Optional local dev: Node.js 20+

## Quick start (Docker)

1) Copy env template (optional for Docker default values)

```bash
cp .env.example .env
```

2) Start services

```bash
docker compose up -d --build
```

This brings up:
- MySQL 8 on `localhost:3306`
- Elasticsearch 8 on `localhost:9200`
- API on `http://localhost:3001`

3) Seed data (fetches DummyJSON → MySQL, indexes into ES)

```bash
docker compose exec api npm run seed
```

4) Test endpoints

- Categories: `GET http://localhost:3001/categories`
- Products (filters: `category`, `q`, `minPrice`, `maxPrice`, `limit`, `offset`):
  - `GET http://localhost:3001/products?category=smartphones&minPrice=50&maxPrice=500&limit=24&offset=0`
- Product by id: `GET http://localhost:3001/products/1`
- Aggregations (ES): `GET http://localhost:3001/products/aggs`

Stop services:

```bash
docker compose down -v
```

## Local development (without Docker)

```bash
# install deps
npm install

# copy envs
cp .env.example .env

# ensure you have MySQL and Elasticsearch running locally, or adjust envs
# run dev server with tsx (live reload)
npm run dev

# run the seeder
npm run seed
```

## Configuration

Environment variables (see `.env.example`):

- API
  - `PORT` (default `3001`)
- MySQL
  - `MYSQL_HOST`, `MYSQL_PORT`, `MYSQL_USER`, `MYSQL_PASSWORD`, `MYSQL_DATABASE`
- Elasticsearch
  - `ELASTIC_NODE`, `ELASTIC_USERNAME`, `ELASTIC_PASSWORD`, `ELASTIC_INDEX`

## Implementation notes & trade-offs

- **Data storage**: MySQL is the source of truth; Elasticsearch powers faceting/aggregations via `/products/aggs`.
- **Filters**: `/products` currently queries MySQL for category, text (`q` with LIKE), and price ranges. Could be extended to use ES for full-text relevance.
- **Schema**: Products and Categories tables with a FK. Images stored as JSON array; adequate for this assignment.
- **Index mapping**: Simple mapping; images/thumbnail stored as keyword. Can be refined for search features.
- **Resilience**: API boots even if ES is not ready; DB endpoints work, ES-only routes may return errors until ready.

## Known limitations

- No pagination metadata (only limit/offset inputs).
- Text search via SQL LIKE (simple). For better results, route `/products` could query ES.
- No auth/rate-limiting.
- No tests.
