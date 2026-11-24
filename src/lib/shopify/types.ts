export type Money = {
  amount: string;
  currencyCode: string;
};

export type Image = {
  url: string;
  altText: string | null;
  width: number;
  height: number;
};

export type ProductOptionValue = {
  /** Stable across translations — used to key personalization off a value. */
  id: string;
  name: string;
};

export type ProductOption = {
  id: string;
  name: string;
  values: ProductOptionValue[];
};

export type ProductVariant = {
  id: string;
  title: string;
  availableForSale: boolean;
  selectedOptions: {
    name: string;
    value: string;
  }[];
  price: Money;
  /** The pre-sale price; null when the variant isn't marked down. */
  compareAtPrice: Money | null;
};

export type Product = {
  id: string;
  handle: string;
  title: string;
  description: string;
  descriptionHtml: string;
  availableForSale: boolean;
  options: ProductOption[];
  priceRange: {
    minVariantPrice: Money;
    maxVariantPrice: Money;
  };
  featuredImage: Image | null;
  images: Image[];
  variants: ProductVariant[];
  /**
   * `custom.print_trigger` metafield: the `ProductOptionValue` id that turns on
   * custom-print fields. Null on every product that doesn't offer printing.
   */
  printTriggerValueId: string | null;
  seo: {
    title: string | null;
    description: string | null;
  };
  updatedAt: string;
};

export type Collection = {
  id: string;
  handle: string;
  title: string;
  description: string;
  image: Image | null;
  updatedAt: string;
};

export type CartAttribute = {
  key: string;
  value: string | null;
};

export type CartLine = {
  id: string;
  quantity: number;
  /** Line item properties — e.g. the custom print name and number. */
  attributes: CartAttribute[];
  cost: {
    totalAmount: Money;
    amountPerQuantity: Money;
    compareAtAmountPerQuantity: Money | null;
  };
  merchandise: {
    id: string;
    title: string;
    selectedOptions: {
      name: string;
      value: string;
    }[];
    product: {
      handle: string;
      title: string;
      featuredImage: Image | null;
    };
  };
};

export type Cart = {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: {
    subtotalAmount: Money;
    totalAmount: Money;
    totalTaxAmount: Money | null;
  };
  lines: CartLine[];
};

/** Shape of a GraphQL connection before it is flattened into an array. */
export type Connection<T> = {
  edges: { node: T }[];
};
