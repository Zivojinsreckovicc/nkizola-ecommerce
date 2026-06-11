import {
  addToCartMutation,
  createCartMutation,
  getCartQuery,
  getCollectionProductsQuery,
  getCollectionQuery,
  getCollectionsQuery,
  getProductQuery,
  getProductsQuery,
  removeFromCartMutation,
  updateCartMutation,
} from "./queries";
import type {
  Cart,
  CartLine,
  Collection,
  Connection,
  Image,
  Product,
  ProductVariant,
} from "./types";

const API_VERSION = "2025-07";

const domain = process.env.SHOPIFY_STORE_DOMAIN;
const accessToken = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;

export function isShopifyConfigured(): boolean {
  return Boolean(domain && accessToken);
}

type ShopifyFetchOptions = {
  query: string;
  variables?: Record<string, unknown>;
  tags?: string[];
  revalidate?: number;
  cache?: RequestCache;
};

async function shopifyFetch<T>({
  query,
  variables,
  tags,
  revalidate,
  cache,
}: ShopifyFetchOptions): Promise<T> {
  if (!domain || !accessToken) {
    throw new Error(
      "Shopify is not configured. Set SHOPIFY_STORE_DOMAIN and SHOPIFY_STOREFRONT_ACCESS_TOKEN."
    );
  }

  const result = await fetch(
    `https://${domain}/api/${API_VERSION}/graphql.json`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": accessToken,
      },
      body: JSON.stringify({ query, variables }),
      cache,
      next: { tags, revalidate },
    }
  );

  const body = await result.json();

  if (body.errors) {
    throw new Error(
      `Shopify request failed: ${body.errors[0]?.message ?? "unknown error"}`
    );
  }

  return body.data as T;
}

function flattenConnection<T>(connection: Connection<T>): T[] {
  return connection.edges.map((edge) => edge.node);
}

/* Raw API shapes that differ from the app-facing types. */

type RawProduct = Omit<Product, "images" | "variants" | "options"> & {
  options: { id: string; name: string; optionValues: { name: string }[] }[];
  images: Connection<Image>;
  variants: Connection<ProductVariant>;
};

type RawCart = Omit<Cart, "lines"> & {
  lines: Connection<CartLine>;
};

function reshapeProduct(product: RawProduct): Product {
  return {
    ...product,
    options: product.options.map((option) => ({
      id: option.id,
      name: option.name,
      values: option.optionValues.map((value) => value.name),
    })),
    images: flattenConnection(product.images),
    variants: flattenConnection(product.variants),
  };
}

function reshapeCart(cart: RawCart): Cart {
  return {
    ...cart,
    lines: flattenConnection(cart.lines),
  };
}

/* Catalog */

const CATALOG_CACHE = { tags: ["catalog"], revalidate: 300 };

export async function getProducts(first = 100): Promise<Product[]> {
  if (!isShopifyConfigured()) return [];

  const data = await shopifyFetch<{ products: Connection<RawProduct> }>({
    query: getProductsQuery,
    variables: { first, sortKey: "CREATED_AT", reverse: true },
    ...CATALOG_CACHE,
  });

  return flattenConnection(data.products).map(reshapeProduct);
}

export async function getProduct(handle: string): Promise<Product | null> {
  if (!isShopifyConfigured()) return null;

  const data = await shopifyFetch<{ product: RawProduct | null }>({
    query: getProductQuery,
    variables: { handle },
    ...CATALOG_CACHE,
  });

  return data.product ? reshapeProduct(data.product) : null;
}

export async function getCollections(first = 20): Promise<Collection[]> {
  if (!isShopifyConfigured()) return [];

  const data = await shopifyFetch<{ collections: Connection<Collection> }>({
    query: getCollectionsQuery,
    variables: { first },
    ...CATALOG_CACHE,
  });

  return flattenConnection(data.collections);
}

export async function getCollection(
  handle: string
): Promise<Collection | null> {
  if (!isShopifyConfigured()) return null;

  const data = await shopifyFetch<{ collection: Collection | null }>({
    query: getCollectionQuery,
    variables: { handle },
    ...CATALOG_CACHE,
  });

  return data.collection;
}

export async function getCollectionProducts(
  handle: string,
  first = 100
): Promise<Product[]> {
  if (!isShopifyConfigured()) return [];

  const data = await shopifyFetch<{
    collection: { products: Connection<RawProduct> } | null;
  }>({
    query: getCollectionProductsQuery,
    variables: { handle, first },
    ...CATALOG_CACHE,
  });

  if (!data.collection) return [];

  return flattenConnection(data.collection.products).map(reshapeProduct);
}

/* Cart — always fetched fresh, never cached. */

export async function getCart(cartId: string): Promise<Cart | null> {
  const data = await shopifyFetch<{ cart: RawCart | null }>({
    query: getCartQuery,
    variables: { cartId },
    cache: "no-store",
  });

  return data.cart ? reshapeCart(data.cart) : null;
}

type CartLineInput = { merchandiseId: string; quantity: number };

export async function createCart(lines: CartLineInput[]): Promise<Cart> {
  const data = await shopifyFetch<{ cartCreate: { cart: RawCart } }>({
    query: createCartMutation,
    variables: { lines },
    cache: "no-store",
  });

  return reshapeCart(data.cartCreate.cart);
}

export async function addCartLines(
  cartId: string,
  lines: CartLineInput[]
): Promise<Cart> {
  const data = await shopifyFetch<{ cartLinesAdd: { cart: RawCart } }>({
    query: addToCartMutation,
    variables: { cartId, lines },
    cache: "no-store",
  });

  return reshapeCart(data.cartLinesAdd.cart);
}

export async function updateCartLines(
  cartId: string,
  lines: { id: string; quantity: number }[]
): Promise<Cart> {
  const data = await shopifyFetch<{ cartLinesUpdate: { cart: RawCart } }>({
    query: updateCartMutation,
    variables: { cartId, lines },
    cache: "no-store",
  });

  return reshapeCart(data.cartLinesUpdate.cart);
}

export async function removeCartLines(
  cartId: string,
  lineIds: string[]
): Promise<Cart> {
  const data = await shopifyFetch<{ cartLinesRemove: { cart: RawCart } }>({
    query: removeFromCartMutation,
    variables: { cartId, lineIds },
    cache: "no-store",
  });

  return reshapeCart(data.cartLinesRemove.cart);
}
