# NK Izola Store

Headless Shopify storefront for NK Izola Football Club, built with Next.js (App Router), TypeScript and Tailwind CSS. Deployed on Vercel.

## Getting started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env.local` and fill in your Shopify credentials:

   ```bash
   cp .env.example .env.local
   ```

3. Run the development server:

   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) to see the store.

## Environment variables

| Variable | Description |
| --- | --- |
| `SHOPIFY_STORE_DOMAIN` | Your Shopify store domain, e.g. `nk-izola.myshopify.com` |
| `SHOPIFY_STOREFRONT_ACCESS_TOKEN` | Storefront API access token (Shopify admin → Settings → Apps and sales channels → Develop apps → Storefront API) |
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL used for metadata and the sitemap, e.g. `https://store.nkizola.si` |

Without Shopify credentials the site still builds and renders with empty catalog states, so previews never break.

## Architecture

- `src/lib/shopify/` — all Shopify Storefront API access (GraphQL client, queries, types). Shopify is the source of truth; nothing is hardcoded.
- `src/lib/cart.ts` — server-side cart reads (cart id lives in an httpOnly cookie).
- `src/app/cart/actions.ts` — cart mutations as Server Actions (add, update quantity, remove).
- `src/components/` — shared UI (header, footer, product grid, variant selector).
- Checkout is handled entirely by Shopify via the cart's `checkoutUrl`.

Catalog data is cached for 5 minutes (tagged `catalog`); cart data is always fetched fresh.

## Deployment

Deploy on [Vercel](https://vercel.com) and set the three environment variables above in the project settings. `npm run build` must pass before shipping.
