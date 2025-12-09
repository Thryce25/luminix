import { Metadata } from 'next';
import { getProducts, getCollections, getProductTypes, ShopifyProduct } from '@/lib/shopify';
import ProductsPageClient from './ProductsPageClient';

export const metadata: Metadata = {
  title: 'Shop All Products | Luminix',
  description: 'Discover our curated collection of premium streetwear. Shop hoodies, tees, and fashion essentials.',
};

export const revalidate = 60;

interface SearchParams {
  sort?: string;
  category?: string;
  collection?: string;
  type?: string;
  price?: string;
}

function parsePriceRange(price: string): { minPrice?: number; maxPrice?: number } {
  if (!price) return {};
  const [min, max] = price.split('-');
  return {
    minPrice: min ? parseInt(min) : undefined,
    maxPrice: max === 'above' ? undefined : (max ? parseInt(max) : undefined),
  };
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const { sort = 'newest', category, collection, type, price } = params;
  const { minPrice, maxPrice } = parsePriceRange(price || '');
  const collectionHandle = collection || category;

  const [products, collections, productTypes] = await Promise.all([
    getProducts({
      first: 60,
      sort: sort as 'newest' | 'price-asc' | 'price-desc' | 'best-selling' | 'title-asc',
      collection: collectionHandle,
      productType: type,
      minPrice,
      maxPrice,
    }).catch((error) => {
      console.error('Error fetching products:', error);
      return [] as ShopifyProduct[];
    }),
    getCollections(20).catch(() => []),
    getProductTypes().catch(() => []),
  ]);

  const collectionOptions = collections.map((c) => ({
    label: c.title,
    value: c.handle,
  }));

  // Use product types from Shopify (now extracted from productType, tags, and titles)
  const typeOptions = productTypes.map((t) => ({
    label: t,
    value: t.toLowerCase().replace(/\s+/g, '-'),
  }));

  return (
    <ProductsPageClient
      initialProducts={products}
      collections={collectionOptions}
      productTypes={typeOptions}
    />
  );
}
