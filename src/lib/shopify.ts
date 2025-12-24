const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN!;
const storefrontAccessToken = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN!;
const endpoint = `https://${domain}/api/2024-01/graphql.json`;

// Helper to ensure checkout URL is absolute and properly formatted
function ensureAbsoluteCheckoutUrl(checkoutUrl: string): string {
  if (!checkoutUrl) {
    console.warn('No checkout URL provided');
    return checkoutUrl;
  }
  
  // If it's an absolute URL with custom domain, replace with Shopify domain
  if (checkoutUrl.startsWith('https://') || checkoutUrl.startsWith('http://')) {
    try {
      const url = new URL(checkoutUrl);
      // Replace any custom domain with the Shopify store domain
      if (!url.hostname.includes('myshopify.com')) {
        url.hostname = domain;
        const correctedUrl = url.toString();
        console.log('Checkout URL (corrected domain):', correctedUrl);
        return correctedUrl;
      }
      console.log('Checkout URL (absolute):', checkoutUrl);
      return checkoutUrl;
    } catch (error) {
      console.error('Invalid checkout URL:', checkoutUrl);
      return checkoutUrl;
    }
  }
  
  // If relative URL, prepend the Shopify store domain
  const absoluteUrl = `https://${domain}${checkoutUrl.startsWith('/') ? '' : '/'}${checkoutUrl}`;
  
  // Log for debugging
  console.log('Checkout URL (converted to absolute):', absoluteUrl);
  
  return absoluteUrl;
}

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

// Sort key mapping
type SortOption = 'newest' | 'price-asc' | 'price-desc' | 'best-selling' | 'title-asc';

function getSortKey(sort: SortOption): { sortKey: string; reverse: boolean } {
  switch (sort) {
    case 'newest':
      return { sortKey: 'CREATED_AT', reverse: true };
    case 'price-asc':
      return { sortKey: 'PRICE', reverse: false };
    case 'price-desc':
      return { sortKey: 'PRICE', reverse: true };
    case 'best-selling':
      return { sortKey: 'BEST_SELLING', reverse: false };
    case 'title-asc':
      return { sortKey: 'TITLE', reverse: false };
    default:
      return { sortKey: 'CREATED_AT', reverse: true };
  }
}

// Helper function to normalize product types for comparison
// Maps URL-friendly type names (e.g., 't-shirt') to actual Shopify productType values
function normalizeProductType(type: string): string {
  const typeMap: Record<string, string[]> = {
    't-shirt': ['T-Shirts', 't-shirts', 't-shirt', 'tshirt', 'tee', 'tees'],
    'shirt': ['Shirts', 'shirts', 'shirt'],
    'hoodie': ['Hoodies', 'hoodies', 'hoodie'],
    'sweatshirt': ['Sweatshirts', 'sweatshirts', 'sweatshirt'],
    'pants': ['Pants', 'pants', 'trousers'],
    'shorts': ['Shorts', 'shorts'],
    'jacket': ['Jackets', 'jackets', 'jacket'],
    'dress': ['Dresses', 'dresses', 'dress'],
    'top': ['Tops', 'tops', 'top'],
  };

  const normalized = type.toLowerCase().replace(/\s+/g, '-');
  
  // Return all possible variations for this type
  return typeMap[normalized]?.[0] || type;
}

// Helper to check if a product matches a given type
function productMatchesType(product: ShopifyProduct, typeFilter: string): boolean {
  if (!typeFilter) return true;
  
  const normalizedFilter = typeFilter.toLowerCase().replace(/\s+/g, '-');
  const productType = product.productType?.toLowerCase().replace(/\s+/g, '-') || '';
  const productTitle = product.title.toLowerCase();
  
  console.log('🔍 Matching:', {
    productTitle: product.title,
    productType: product.productType,
    normalizedProductType: productType,
    filter: typeFilter,
    normalizedFilter: normalizedFilter
  });
  
  // If productType is empty, fall back to title matching
  if (!productType || productType === '') {
    console.log('⚠️ Empty productType, using title matching');
    
    // Map filter to title keywords
    const titleKeywords: Record<string, string[]> = {
      't-shirt': ['t-shirt', 'tshirt', 'tee'],
      't-shirts': ['t-shirt', 'tshirt', 'tee'],
      'shirt': ['shirt'],
      'shirts': ['shirt'],
      'hoodie': ['hoodie'],
      'hoodies': ['hoodie'],
      'sweatshirt': ['sweatshirt'],
      'sweatshirts': ['sweatshirt'],
      'top': ['top', 'crop top'],
      'tops': ['top', 'crop top'],
      'pants': ['pant', 'trouser', 'bottom'],
      'bottoms': ['pant', 'trouser', 'bottom', 'jogger'],
    };
    
    const keywords = titleKeywords[normalizedFilter] || [normalizedFilter];
    
    for (const keyword of keywords) {
      if (productTitle.includes(keyword)) {
        // Special case: don't match "t-shirt" when looking for "shirt"
        if (normalizedFilter === 'shirt' || normalizedFilter === 'shirts') {
          if (productTitle.includes('t-shirt') || productTitle.includes('tshirt') || productTitle.includes('tee')) {
            console.log('❌ Title contains t-shirt, not a regular shirt');
            continue;
          }
        }
        console.log('✅ Title match!');
        return true;
      }
    }
    console.log('❌ No title match');
    return false;
  }
  
  // Direct match
  if (productType === normalizedFilter) {
    console.log('✅ Direct match!');
    return true;
  }
  
  // Check variations (e.g., 't-shirt' should match 't-shirts')
  const typeVariations: Record<string, string[]> = {
    't-shirt': ['t-shirt', 't-shirts', 'tshirt', 'tshirts', 'tee', 'tees'],
    't-shirts': ['t-shirt', 't-shirts', 'tshirt', 'tshirts', 'tee', 'tees'],
    'shirt': ['shirt', 'shirts'],
    'shirts': ['shirt', 'shirts'],
    'hoodie': ['hoodie', 'hoodies'],
    'hoodies': ['hoodie', 'hoodies'],
    'sweatshirt': ['sweatshirt', 'sweatshirts'],
    'sweatshirts': ['sweatshirt', 'sweatshirts'],
    'top': ['top', 'tops'],
    'tops': ['top', 'tops'],
    'pants': ['pants', 'pant', 'trousers', 'bottoms', 'joggers'],
    'bottoms': ['pants', 'pant', 'trousers', 'bottoms', 'joggers'],
  };
  
  const filterVariations = typeVariations[normalizedFilter] || [normalizedFilter];
  const productVariations = typeVariations[productType] || [productType];
  
  console.log('🔄 Checking variations:', { filterVariations, productVariations });
  
  // Check if any variation matches
  const matches = filterVariations.some(fv => productVariations.includes(fv));
  console.log(matches ? '✅ Variation match!' : '❌ No match');
  return matches;
}

// Product Queries with filtering and sorting
export interface ProductQueryOptions {
  first?: number;
  sort?: SortOption;
  collection?: string;
  productType?: string;
  minPrice?: number;
  maxPrice?: number;
  query?: string;
}

export async function getProducts(
  firstOrOptions: number | ProductQueryOptions = 20
): Promise<ShopifyProduct[]> {
  // Support both old signature (just number) and new options object
  const options: ProductQueryOptions = typeof firstOrOptions === 'number' 
    ? { first: firstOrOptions }
    : firstOrOptions;
    
  const { first = 20, sort = 'newest', collection, productType, minPrice, maxPrice, query: searchQuery } = options;
  const { sortKey, reverse } = getSortKey(sort);

  // If collection is specified, fetch from collection
  if (collection) {
    console.log('🏷️ Fetching collection:', collection);
    const collectionProducts = await getProductsByCollection(collection, first, sort);
    console.log('📦 Collection products:', collectionProducts.length);
    // Apply productType filter client-side for collection products too
    if (productType) {
      console.log('🎯 Filtering collection by productType:', productType);
      const filtered = collectionProducts.filter(p => productMatchesType(p, productType));
      console.log('📦 Filtered collection products:', filtered.length);
      return filtered;
    }
    return collectionProducts;
  }

  // Build search query for filtering - Shopify Storefront API syntax
  const queryParts: string[] = [];
  
  if (searchQuery) {
    queryParts.push(searchQuery);
  }
  
  // Price filtering
  if (minPrice !== undefined) {
    queryParts.push(`variants.price:>=${minPrice}`);
  }
  if (maxPrice !== undefined) {
    queryParts.push(`variants.price:<=${maxPrice}`);
  }

  const queryString = queryParts.join(' ');

  const query = queryString
    ? `
      ${PRODUCT_FRAGMENT}
      query GetProductsFiltered($first: Int!, $query: String!, $sortKey: ProductSortKeys!, $reverse: Boolean!) {
        products(first: $first, query: $query, sortKey: $sortKey, reverse: $reverse) {
          edges {
            node {
              ...ProductFragment
            }
          }
        }
      }
    `
    : `
      ${PRODUCT_FRAGMENT}
      query GetProducts($first: Int!, $sortKey: ProductSortKeys!, $reverse: Boolean!) {
        products(first: $first, sortKey: $sortKey, reverse: $reverse) {
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
    variables: queryString 
      ? { first, query: queryString, sortKey, reverse }
      : { first, sortKey, reverse },
    cache: 'no-store',
  });

  let products = data.products.edges.map((edge) => edge.node);
  
  console.log('📦 Fetched products:', products.length);
  
  // Apply productType filter client-side for accurate matching
  if (productType) {
    console.log('🎯 Filtering by productType:', productType);
    products = products.filter(p => productMatchesType(p, productType));
    console.log('📦 Filtered products:', products.length);
  }
  
  return products;
}

// Get products by collection handle with sorting
export async function getProductsByCollection(
  collectionHandle: string,
  first: number = 20,
  sort: SortOption = 'newest'
): Promise<ShopifyProduct[]> {
  const { sortKey, reverse } = getSortKey(sort);
  
  // Map product sort keys to collection product sort keys
  const collectionSortKey = sortKey === 'CREATED_AT' ? 'CREATED' : 
                           sortKey === 'BEST_SELLING' ? 'BEST_SELLING' :
                           sortKey === 'PRICE' ? 'PRICE' :
                           sortKey === 'TITLE' ? 'TITLE' : 'CREATED';

  const query = `
    ${PRODUCT_FRAGMENT}
    query GetCollectionProducts($handle: String!, $first: Int!, $sortKey: ProductCollectionSortKeys!, $reverse: Boolean!) {
      collection(handle: $handle) {
        products(first: $first, sortKey: $sortKey, reverse: $reverse) {
          edges {
            node {
              ...ProductFragment
            }
          }
        }
      }
    }
  `;

  const data = await shopifyFetch<{
    collection: { products: { edges: Array<{ node: ShopifyProduct }> } } | null;
  }>({
    query,
    variables: { handle: collectionHandle, first, sortKey: collectionSortKey, reverse },
    cache: 'no-store',
  });

  const products = data.collection?.products.edges.map((edge) => edge.node) || [];
  
  console.log('📋 Raw products from Shopify:');
  products.forEach(p => {
    console.log(`  - ${p.title}`);
    console.log(`    productType: "${p.productType}"`);
    console.log(`    tags: [${p.tags?.join(', ')}]`);
  });
  
  return products;
}

// Get all unique product types (from productType field, tags, or title patterns)
export async function getProductTypes(): Promise<string[]> {
  const query = `
    query GetProductTypes {
      products(first: 250) {
        edges {
          node {
            productType
            tags
            title
          }
        }
      }
    }
  `;

  const data = await shopifyFetch<{
    products: { edges: Array<{ node: { productType: string; tags: string[]; title: string } }> };
  }>({
    query,
    cache: 'no-store',
  });

  const types = new Set<string>();
  
  // Known category keywords to look for in tags and titles
  const categoryKeywords = [
    'Hoodie', 'Hoodies',
    'Sweatshirt', 'Sweatshirts',
    'T-Shirt', 'T-Shirts', 'Tee', 'Tees',
    'Jacket', 'Jackets',
    'Pants', 'Trousers',
    'Shorts',
    'Dress', 'Dresses',
    'Top', 'Tops',
    'Shirt', 'Shirts',
    'Accessories',
    'Cap', 'Caps', 'Hat', 'Hats'
  ];

  data.products.edges.forEach((edge) => {
    const { productType, tags, title } = edge.node;
    
    // First, try productType field
    if (productType && productType.trim() !== '') {
      const cleanType = productType.trim();
      // Normalize to standard form
      const normalized = cleanType.toLowerCase().replace(/s$/, '');
      if (normalized === 't-shirt' || normalized === 'tee') types.add('T-Shirts');
      else if (normalized === 'hoodie' || normalized === 'hoody') types.add('Hoodies');
      else if (normalized === 'sweatshirt') types.add('Sweatshirts');
      else if (normalized === 'jacket') types.add('Jackets');
      else if (normalized === 'pant' || normalized === 'trouser') types.add('Pants');
      else if (normalized === 'short') types.add('Shorts');
      else if (normalized === 'dress') types.add('Dresses');
      else if (normalized === 'top') types.add('Tops');
      else if (normalized === 'shirt') types.add('Shirts');
      else types.add(cleanType);
    }
    
    // Then check tags for category-like values
    if (tags && tags.length > 0) {
      tags.forEach(tag => {
        const normalizedTag = tag.trim().toLowerCase();
        // Check if tag matches known categories and normalize
        if (normalizedTag === 't-shirt' || normalizedTag === 't-shirts' || normalizedTag === 'tee' || normalizedTag === 'tees') {
          types.add('T-Shirts');
        } else if (normalizedTag === 'hoodie' || normalizedTag === 'hoodies') {
          types.add('Hoodies');
        } else if (normalizedTag === 'sweatshirt' || normalizedTag === 'sweatshirts') {
          types.add('Sweatshirts');
        } else if (normalizedTag === 'shirt' || normalizedTag === 'shirts') {
          types.add('Shirts');
        } else if (normalizedTag === 'jacket' || normalizedTag === 'jackets') {
          types.add('Jackets');
        } else if (normalizedTag === 'pants' || normalizedTag === 'trousers' || normalizedTag === 'bottoms') {
          types.add('Pants');
        } else if (normalizedTag === 'top' || normalizedTag === 'tops') {
          types.add('Tops');
        }
      });
    }
    
    // Finally, check title for category keywords
    if (title) {
      const lowerTitle = title.toLowerCase();
      if ((lowerTitle.includes('t-shirt') || lowerTitle.includes('tee')) && !lowerTitle.includes('shirt')) {
        types.add('T-Shirts');
      } else if (lowerTitle.includes('hoodie')) {
        types.add('Hoodies');
      } else if (lowerTitle.includes('sweatshirt')) {
        types.add('Sweatshirts');
      } else if (lowerTitle.includes('jacket')) {
        types.add('Jackets');
      } else if (lowerTitle.includes('shirt') && !lowerTitle.includes('t-shirt') && !lowerTitle.includes('sweatshirt')) {
        types.add('Shirts');
      } else if (lowerTitle.includes('pant') || lowerTitle.includes('trouser') || lowerTitle.includes('bottom')) {
        types.add('Pants');
      } else if (lowerTitle.includes(' top') || lowerTitle.includes('crop top')) {
        types.add('Tops');
      }
    }
  });

  // Always include these standard types even if no products match yet
  const standardTypes = ['Hoodies', 'T-Shirts', 'Sweatshirts', 'Shirts', 'Tops', 'Pants', 'Bottoms'];
  standardTypes.forEach(type => types.add(type));

  return Array.from(types).sort();
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

// Get related products based on product type, tags, or vendor
export async function getRelatedProducts(
  product: ShopifyProduct,
  first: number = 4
): Promise<ShopifyProduct[]> {
  // Build a query that finds similar products
  const searchTerms: string[] = [];
  
  // Add product type if available
  if (product.productType) {
    searchTerms.push(`product_type:${product.productType}`);
  }
  
  // Add vendor/brand
  if (product.vendor) {
    searchTerms.push(`vendor:${product.vendor}`);
  }
  
  // Use tags if no product type
  if (!product.productType && product.tags.length > 0) {
    const tagQuery = product.tags.slice(0, 3).map(tag => `tag:${tag}`).join(' OR ');
    searchTerms.push(`(${tagQuery})`);
  }

  // If we have search terms, use them
  if (searchTerms.length > 0) {
    const query = `
      ${PRODUCT_FRAGMENT}
      query GetRelatedProducts($query: String!, $first: Int!) {
        products(first: $first, query: $query) {
          edges {
            node {
              ...ProductFragment
            }
          }
        }
      }
    `;

    try {
      const data = await shopifyFetch<{
        products: { edges: Array<{ node: ShopifyProduct }> };
      }>({
        query,
        variables: { 
          query: searchTerms.join(' OR '), 
          first: first + 1 // Fetch one extra in case current product is included
        },
        cache: 'no-store',
      });

      // Filter out the current product
      const related = data.products.edges
        .map((edge) => edge.node)
        .filter((p) => p.handle !== product.handle)
        .slice(0, first);

      if (related.length >= first) {
        return related;
      }
    } catch (error) {
      console.error('Error fetching related products:', error);
    }
  }

  // Fallback: get random products excluding current
  const fallbackQuery = `
    ${PRODUCT_FRAGMENT}
    query GetFallbackRelated($first: Int!) {
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
    variables: { first: first + 1 },
    cache: 'no-store',
  });

  return fallbackData.products.edges
    .map((edge) => edge.node)
    .filter((p) => p.handle !== product.handle)
    .slice(0, first);
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

  const cart = data.cartCreate.cart;
  return {
    ...cart,
    checkoutUrl: ensureAbsoluteCheckoutUrl(cart.checkoutUrl),
  };
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

  if (!data.cart) return null;
  return {
    ...data.cart,
    checkoutUrl: ensureAbsoluteCheckoutUrl(data.cart.checkoutUrl),
  };
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

  const cart = data.cartLinesAdd.cart;
  return {
    ...cart,
    checkoutUrl: ensureAbsoluteCheckoutUrl(cart.checkoutUrl),
  };
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

  const cart = data.cartLinesUpdate.cart;
  return {
    ...cart,
    checkoutUrl: ensureAbsoluteCheckoutUrl(cart.checkoutUrl),
  };
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

  const cart = data.cartLinesRemove.cart;
  return {
    ...cart,
    checkoutUrl: ensureAbsoluteCheckoutUrl(cart.checkoutUrl),
  };
}

// Utility Functions
export function formatPrice(price: ShopifyPrice): string {
  const amount = parseFloat(price.amount);
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
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
