const imageFragment = /* GraphQL */ `
  fragment image on Image {
    url
    altText
    width
    height
  }
`;

const productFragment = /* GraphQL */ `
  fragment product on Product {
    id
    handle
    title
    description
    descriptionHtml
    availableForSale
    options {
      id
      name
      optionValues {
        name
      }
    }
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
      maxVariantPrice {
        amount
        currencyCode
      }
    }
    featuredImage {
      ...image
    }
    images(first: 10) {
      edges {
        node {
          ...image
        }
      }
    }
    variants(first: 100) {
      edges {
        node {
          id
          title
          availableForSale
          selectedOptions {
            name
            value
          }
          price {
            amount
            currencyCode
          }
        }
      }
    }
    seo {
      title
      description
    }
    updatedAt
  }
  ${imageFragment}
`;

const cartFragment = /* GraphQL */ `
  fragment cart on Cart {
    id
    checkoutUrl
    totalQuantity
    cost {
      subtotalAmount {
        amount
        currencyCode
      }
      totalAmount {
        amount
        currencyCode
      }
      totalTaxAmount {
        amount
        currencyCode
      }
    }
    lines(first: 100) {
      edges {
        node {
          id
          quantity
          cost {
            totalAmount {
              amount
              currencyCode
            }
          }
          merchandise {
            ... on ProductVariant {
              id
              title
              selectedOptions {
                name
                value
              }
              product {
                handle
                title
                featuredImage {
                  ...image
                }
              }
            }
          }
        }
      }
    }
  }
  ${imageFragment}
`;

export const getProductsQuery = /* GraphQL */ `
  query getProducts($first: Int!, $sortKey: ProductSortKeys, $reverse: Boolean) {
    products(first: $first, sortKey: $sortKey, reverse: $reverse) {
      edges {
        node {
          ...product
        }
      }
    }
  }
  ${productFragment}
`;

export const getProductQuery = /* GraphQL */ `
  query getProduct($handle: String!) {
    product(handle: $handle) {
      ...product
    }
  }
  ${productFragment}
`;

export const getCollectionsQuery = /* GraphQL */ `
  query getCollections($first: Int!) {
    collections(first: $first, sortKey: TITLE) {
      edges {
        node {
          id
          handle
          title
          description
          image {
            ...image
          }
          updatedAt
        }
      }
    }
  }
  ${imageFragment}
`;

export const getCollectionQuery = /* GraphQL */ `
  query getCollection($handle: String!) {
    collection(handle: $handle) {
      id
      handle
      title
      description
      image {
        ...image
      }
      updatedAt
    }
  }
  ${imageFragment}
`;

export const getCollectionProductsQuery = /* GraphQL */ `
  query getCollectionProducts($handle: String!, $first: Int!) {
    collection(handle: $handle) {
      products(first: $first, sortKey: BEST_SELLING) {
        edges {
          node {
            ...product
          }
        }
      }
    }
  }
  ${productFragment}
`;

export const getCartQuery = /* GraphQL */ `
  query getCart($cartId: ID!) {
    cart(id: $cartId) {
      ...cart
    }
  }
  ${cartFragment}
`;

export const createCartMutation = /* GraphQL */ `
  mutation createCart($lines: [CartLineInput!]) {
    cartCreate(input: { lines: $lines }) {
      cart {
        ...cart
      }
    }
  }
  ${cartFragment}
`;

export const addToCartMutation = /* GraphQL */ `
  mutation addToCart($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        ...cart
      }
    }
  }
  ${cartFragment}
`;

export const updateCartMutation = /* GraphQL */ `
  mutation updateCart($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart {
        ...cart
      }
    }
  }
  ${cartFragment}
`;

export const removeFromCartMutation = /* GraphQL */ `
  mutation removeFromCart($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart {
        ...cart
      }
    }
  }
  ${cartFragment}
`;
