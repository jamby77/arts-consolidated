# E-commerce (DummyJSON) Project Plan

## Goals
- **Build a minimal e-commerce** using Next.js 16 + React 19 and Tailwind v4.
- **Data source**: DummyJSON products API.
- **Features**: Product list, product detail, cart with persistence, navigation, and shadcn/ui components.

## Tech Stack
- **Framework**: Next.js 16 (App Router `src/app/`)
- **Language**: TypeScript (strict)
- **UI**: Tailwind CSS v4 + shadcn/ui
- **State**: Zustand for cart with persistence
- **Fonts**: `next/font` (Geist)
- **Linting**: ESLint 9 + `eslint-config-next`

## Architecture
- **App routes**:
  - `src/app/page.tsx` → redirect to `/products`
  - `src/app/products/page.tsx` → product list
  - `src/app/products/[id]/page.tsx` → product detail
  - `src/app/cart/page.tsx` → cart
- **UI**: `src/components/` for header and shared components (to be migrated to shadcn/ui)
- **Lib**: `src/lib/api.ts` fetchers for DummyJSON
- **Store**: `src/store/cart.ts` Zustand cart store with persistence

## Conventions
- Prefer server components for data fetching.
- Client components only for interactive cart actions.
- Use path alias `@/*`.

## Milestones
1) Foundation
- Create `src/lib/api.ts` for products list/detail.
- Create Zustand cart store with persistence.
- Navigation header with cart count.

2) Pages
- Product list page with image, title, price, rating and links to detail.
- Product detail with title, main image, description, price, discount %, rating.
- Cart page to add/remove, show count and totals.

3) UI polish
- Initialize shadcn/ui and add base components (button, card, badge, input, separator, skeleton, sheet).
- Replace ad-hoc components with shadcn/ui equivalents.
- Add loading and error states for list/detail pages.

4) Docs
- Update README with setup, scripts, and notes.

## Tasks (High-level)
- [ ] Initialize shadcn/ui and generate base components
- [ ] Create `src/lib/api.ts`
- [ ] Implement `/products` list page
- [ ] Implement `/products/[id]` detail page
- [ ] Create cart store with persistence
- [ ] Implement `/cart` page
- [ ] Add header with navigation and cart count
- [ ] Add loading/error states
- [ ] Update README
