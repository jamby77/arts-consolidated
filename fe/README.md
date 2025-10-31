This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Run the app locally

- **Install dependencies**
  - Recommended: `pnpm install` (repo includes `pnpm-lock.yaml`)
  - Also works: `npm install`, `yarn install`, or `bun install`

- **Environment variables** (create `fe/.env.local`)
  - To use live DummyJSON API:
    - `API_BASE_URL=https://dummyjson.com`
    - `USE_MOCKS=false`
  - To use local mocks (no network):
    - `USE_MOCKS=true` (then `API_BASE_URL` is not required)

- **Start the dev server**
  - `pnpm dev` (or `npm run dev` / `yarn dev` / `bun dev`)
  - Open http://localhost:3000

- **Build and run production**
  - `pnpm build` then `pnpm start`

- **Lint**
  - `pnpm lint`

Notes:
- Remote images are allowed from `i.dummyjson.com` and `cdn.dummyjson.com` via `next.config.ts`.
- If `USE_MOCKS` is not `true`, `API_BASE_URL` must be set or product requests will throw (see `src/lib/api.ts`).

## Thought process and trade-offs

- **Framework choice**: Next.js App Router with React Server Components for data fetching; Client Components only where interactivity is needed (cart UI). Trade-off: simpler mental model per page, but requires clear server/client boundaries. And no API for native mobile app for example.
- **State management**: Zustand for cart with persistence. Trade-off: lightweight and ergonomic vs. fewer built-in patterns than Redux. Persistence favors UX but adds localStorage coupling on the client.
- **Styling**: Tailwind CSS v4. Trade-off: speed and consistency vs. initial setup overhead.
- **Caching**: `fetch(..., { next: { revalidate } })` for basic ISR on product list/detail. Trade-off: good default performance with eventual consistency.

## Known limitations

- **Features**: No search, filtering, or checkout flow; focus is product browsing and a local cart.
- **Cart persistence**: Uses client-side storage; cart is not synced across devices or sessions outside the browser.
- **Error/loading states**: Basic handling is present but not yet comprehensive across all pages.
- **Tests**: No automated tests included yet.
- **API constraints**: When using live `dummyjson.com`, you are subject to its availability and any rate limits.
