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

export type ProductOption = {
  id: string;
  name: string;
  values: string[];
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

export type CartLine = {
  id: string;
  quantity: number;
  cost: {
    totalAmount: Money;
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
