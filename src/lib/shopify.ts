const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN!;
const storefrontAccessToken = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN!;
const endpoint = `https://${domain}/api/2024-01/graphql.json`;

interface ShopifyResponse<T> {
  data: T;
  errors?: Array<{ message: string }>;
}

async function shopifyFetch<T>({
  query,
  variables = {},
  cache = 'force-cache',
}: {
  query: string;
  variables?: Record<string, unknown>;
  cache?: RequestCache;
}): Promise<T> {
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': storefrontAccessToken,
      },
      body: JSON.stringify({ query, variables }),
      cache,
    });

    const json: ShopifyResponse<T> = await response.json();

    if (json.errors) {
      console.error('Shopify API Errors:', json.errors);
      throw new Error(json.errors[0]?.message || 'Shopify API Error');
    }

    return json.data;
  } catch (error) {
    console.error('Shopify Fetch Error:', error);
    throw error;
  }
}

// Types
export interface ShopifyImage {
  url: string;
  altText: string | null;
  width: number;
  height: number;
}

export interface ShopifyPrice {
  amount: string;
  currencyCode: string;
}

export interface ShopifyProductVariant {
  id: string;
  title: string;
  availableForSale: boolean;
  price: ShopifyPrice;
  compareAtPrice: ShopifyPrice | null;
  selectedOptions: Array<{
    name: string;
    value: string;
  }>;
  image: ShopifyImage | null;
}

export interface ShopifyProduct {
  id: string;
  handle: string;
  title: string;
  description: string;
  descriptionHtml: string;
  vendor: string;
  productType: string;
  tags: string[];
  availableForSale: boolean;
  priceRange: {
    minVariantPrice: ShopifyPrice;
    maxVariantPrice: ShopifyPrice;
  };
  compareAtPriceRange: {
    minVariantPrice: ShopifyPrice;
    maxVariantPrice: ShopifyPrice;
  };
  featuredImage: ShopifyImage | null;
  images: {
    edges: Array<{
      node: ShopifyImage;
    }>;
  };
  variants: {
    edges: Array<{
      node: ShopifyProductVariant;
    }>;
  };
  options: Array<{
    id: string;
    name: string;
    values: string[];
  }>;
  seo: {
    title: string | null;
    description: string | null;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ShopifyCollection {
  id: string;
  handle: string;
  title: string;
  description: string;
  image: ShopifyImage | null;
  products: {
    edges: Array<{
      node: ShopifyProduct;
    }>;
  };
}

export interface ShopifyCart {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: {
    subtotalAmount: ShopifyPrice;
    totalAmount: ShopifyPrice;
    totalTaxAmount: ShopifyPrice | null;
  };
  lines: {
    edges: Array<{
      node: {
        id: string;
        quantity: number;
        merchandise: {
          id: string;
          title: string;
          product: {
            id: string;
            handle: string;
            title: string;
            featuredImage: ShopifyImage | null;
          };
          price: ShopifyPrice;
          selectedOptions: Array<{
            name: string;
            value: string;
          }>;
        };
        cost: {
          totalAmount: ShopifyPrice;
        };
      };
    }>;
  };
}

// GraphQL Fragments
const PRODUCT_FRAGMENT = `
  fragment ProductFragment on Product {
    id
    handle
    title
    description
    descriptionHtml
    vendor
    productType
    tags
    availableForSale
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
    compareAtPriceRange {
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
      url
      altText
      width
      height
    }
    images(first: 10) {
      edges {
        node {
          url
          altText
          width
          height
        }
      }
    }
    variants(first: 100) {
      edges {
        node {
          id
          title
          availableForSale
          price {
            amount
            currencyCode
          }
          compareAtPrice {
            amount
            currencyCode
          }
          selectedOptions {
            name
            value
          }
          image {
            url
            altText
            width
            height
          }
        }
      }
    }
    options {
      id
      name
      values
    }
    seo {
      title
      description
    }
    createdAt
    updatedAt
  }
`;

const CART_FRAGMENT = `
  fragment CartFragment on Cart {
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
          merchandise {
            ... on ProductVariant {
              id
              title
              product {
                id
                handle
                title
                featuredImage {
                  url
                  altText
                  width
                  height
                }
              }
              price {
                amount
                currencyCode
              }
              selectedOptions {
                name
                value
              }
            }
          }
          cost {
            totalAmount {
              amount
              currencyCode
            }
          }
        }
      }
    }
  }
`;

// Product Queries
export async function getProducts(first: number = 20): Promise<ShopifyProduct[]> {
  const query = `
    ${PRODUCT_FRAGMENT}
    query GetProducts($first: Int!) {
      products(first: $first, sortKey: CREATED_AT, reverse: true) {
        edges {
          node {
            ...ProductFragment
          }
        }
      }
    }
  `;

  const data = await shopifyFetch<{
    products: { edges: Array<{ node: ShopifyProduct }> };
  }>({
    query,
    variables: { first },
    cache: 'no-store',
  });

  return data.products.edges.map((edge) => edge.node);
}

export async function getProduct(handle: string): Promise<ShopifyProduct | null> {
  const query = `
    ${PRODUCT_FRAGMENT}
    query GetProduct($handle: String!) {
      product(handle: $handle) {
        ...ProductFragment
      }
    }
  `;

  const data = await shopifyFetch<{ product: ShopifyProduct | null }>({
    query,
    variables: { handle },
    cache: 'no-store',
  });

  return data.product;
}

export async function getFeaturedProducts(first: number = 8): Promise<ShopifyProduct[]> {
  // Try to fetch from "featured" collection first
  const query = `
    ${PRODUCT_FRAGMENT}
    query GetFeaturedCollection($handle: String!, $first: Int!) {
      collection(handle: $handle) {
        products(first: $first) {
          edges {
            node {
              ...ProductFragment
            }
          }
        }
      }
    }
  `;

  try {
    const data = await shopifyFetch<{
      collection: { products: { edges: Array<{ node: ShopifyProduct }> } } | null;
    }>({
      query,
      variables: { handle: 'featured', first },
      cache: 'no-store',
    });

    // If collection exists and has products, return them
    if (data.collection?.products?.edges?.length) {
      return data.collection.products.edges.map((edge) => edge.node);
    }
  } catch (error) {
    console.log('Featured collection not found, falling back to best-selling products');
  }

  // Fallback: fetch best-selling products
  const fallbackQuery = `
    ${PRODUCT_FRAGMENT}
    query GetFeaturedProducts($first: Int!) {
      products(first: $first, sortKey: BEST_SELLING) {
        edges {
          node {
            ...ProductFragment
          }
        }
      }
    }
  `;

  const fallbackData = await shopifyFetch<{
    products: { edges: Array<{ node: ShopifyProduct }> };
  }>({
    query: fallbackQuery,
    variables: { first },
    cache: 'no-store',
  });

  return fallbackData.products.edges.map((edge) => edge.node);
}

export async function getNewArrivals(first: number = 8): Promise<ShopifyProduct[]> {
  // Try to fetch from "new-arrivals" collection first
  const query = `
    ${PRODUCT_FRAGMENT}
    query GetNewArrivalsCollection($handle: String!, $first: Int!) {
      collection(handle: $handle) {
        products(first: $first) {
          edges {
            node {
              ...ProductFragment
            }
          }
        }
      }
    }
  `;

  try {
    const data = await shopifyFetch<{
      collection: { products: { edges: Array<{ node: ShopifyProduct }> } } | null;
    }>({
      query,
      variables: { handle: 'new-arrivals', first },
      cache: 'no-store',
    });

    // If collection exists and has products, return them
    if (data.collection?.products?.edges?.length) {
      return data.collection.products.edges.map((edge) => edge.node);
    }
  } catch (error) {
    console.log('New Arrivals collection not found, falling back to newest products');
  }

  // Fallback: fetch newest products by creation date
  const fallbackQuery = `
    ${PRODUCT_FRAGMENT}
    query GetNewArrivals($first: Int!) {
      products(first: $first, sortKey: CREATED_AT, reverse: true) {
        edges {
          node {
            ...ProductFragment
          }
        }
      }
    }
  `;

  const fallbackData = await shopifyFetch<{
    products: { edges: Array<{ node: ShopifyProduct }> };
  }>({
    query: fallbackQuery,
    variables: { first },
    cache: 'no-store',
  });

  return fallbackData.products.edges.map((edge) => edge.node);
}

export async function searchProducts(searchQuery: string, first: number = 20): Promise<ShopifyProduct[]> {
  const query = `
    ${PRODUCT_FRAGMENT}
    query SearchProducts($query: String!, $first: Int!) {
      products(first: $first, query: $query) {
        edges {
          node {
            ...ProductFragment
          }
        }
      }
    }
  `;

  const data = await shopifyFetch<{
    products: { edges: Array<{ node: ShopifyProduct }> };
  }>({
    query,
    variables: { query: searchQuery, first },
    cache: 'no-store',
  });

  return data.products.edges.map((edge) => edge.node);
}

// Collection Queries
export async function getCollections(first: number = 10): Promise<ShopifyCollection[]> {
  const query = `
    query GetCollections($first: Int!) {
      collections(first: $first) {
        edges {
          node {
            id
            handle
            title
            description
            image {
              url
              altText
              width
              height
            }
          }
        }
      }
    }
  `;

  const data = await shopifyFetch<{
    collections: { edges: Array<{ node: ShopifyCollection }> };
  }>({
    query,
    variables: { first },
    cache: 'no-store',
  });

  return data.collections.edges.map((edge) => edge.node);
}

export async function getCollection(handle: string, first: number = 20): Promise<ShopifyCollection | null> {
  const query = `
    ${PRODUCT_FRAGMENT}
    query GetCollection($handle: String!, $first: Int!) {
      collection(handle: $handle) {
        id
        handle
        title
        description
        image {
          url
          altText
          width
          height
        }
        products(first: $first) {
          edges {
            node {
              ...ProductFragment
            }
          }
        }
      }
    }
  `;

  const data = await shopifyFetch<{ collection: ShopifyCollection | null }>({
    query,
    variables: { handle, first },
    cache: 'no-store',
  });

  return data.collection;
}

// Cart Mutations
export async function createCart(): Promise<ShopifyCart> {
  const query = `
    ${CART_FRAGMENT}
    mutation CreateCart {
      cartCreate {
        cart {
          ...CartFragment
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const data = await shopifyFetch<{
    cartCreate: { cart: ShopifyCart };
  }>({
    query,
    cache: 'no-store',
  });

  return data.cartCreate.cart;
}

export async function getCart(cartId: string): Promise<ShopifyCart | null> {
  const query = `
    ${CART_FRAGMENT}
    query GetCart($cartId: ID!) {
      cart(id: $cartId) {
        ...CartFragment
      }
    }
  `;

  const data = await shopifyFetch<{ cart: ShopifyCart | null }>({
    query,
    variables: { cartId },
    cache: 'no-store',
  });

  return data.cart;
}

export async function addToCart(
  cartId: string,
  lines: Array<{ merchandiseId: string; quantity: number }>
): Promise<ShopifyCart> {
  const query = `
    ${CART_FRAGMENT}
    mutation AddToCart($cartId: ID!, $lines: [CartLineInput!]!) {
      cartLinesAdd(cartId: $cartId, lines: $lines) {
        cart {
          ...CartFragment
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const data = await shopifyFetch<{
    cartLinesAdd: { cart: ShopifyCart };
  }>({
    query,
    variables: { cartId, lines },
    cache: 'no-store',
  });

  return data.cartLinesAdd.cart;
}

export async function updateCartLine(
  cartId: string,
  lineId: string,
  quantity: number
): Promise<ShopifyCart> {
  const query = `
    ${CART_FRAGMENT}
    mutation UpdateCartLine($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
      cartLinesUpdate(cartId: $cartId, lines: $lines) {
        cart {
          ...CartFragment
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const data = await shopifyFetch<{
    cartLinesUpdate: { cart: ShopifyCart };
  }>({
    query,
    variables: { cartId, lines: [{ id: lineId, quantity }] },
    cache: 'no-store',
  });

  return data.cartLinesUpdate.cart;
}

export async function removeFromCart(cartId: string, lineIds: string[]): Promise<ShopifyCart> {
  const query = `
    ${CART_FRAGMENT}
    mutation RemoveFromCart($cartId: ID!, $lineIds: [ID!]!) {
      cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
        cart {
          ...CartFragment
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const data = await shopifyFetch<{
    cartLinesRemove: { cart: ShopifyCart };
  }>({
    query,
    variables: { cartId, lineIds },
    cache: 'no-store',
  });

  return data.cartLinesRemove.cart;
}

// Utility Functions
export function formatPrice(price: ShopifyPrice): string {
  const amount = parseFloat(price.amount);
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: price.currencyCode,
  }).format(amount);
}

export function getProductImageUrl(product: ShopifyProduct, index: number = 0): string {
  if (product.featuredImage) {
    return product.featuredImage.url;
  }
  if (product.images.edges.length > index) {
    return product.images.edges[index].node.url;
  }
  return '/placeholder-product.jpg';
}
