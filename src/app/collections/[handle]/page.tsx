import { Metadata } from 'next';
import { getProductsByCollection, ShopifyProduct } from '@/lib/shopify';
import CollectionPageClient from './CollectionPageClient';

interface CollectionInfo {
  title: string;
  description: string;
  gradient: string;
  bgPattern: string;
}

const collectionData: Record<string, CollectionInfo> = {
  'mens-essentials': {
    title: "Men's Fashion",
    description: 'Premium streetwear for the modern man. Hoodies, sweatshirts, and tees crafted for style and comfort.',
    gradient: 'from-slate-900 via-gray-800 to-black',
    bgPattern: 'masculine',
  },
  'new-arrivals': {
    title: 'New Arrivals',
    description: 'Fresh drops and latest styles. Be the first to rock our newest designs.',
    gradient: 'from-purple-900 via-indigo-800 to-black',
    bgPattern: 'dynamic',
  },
  'womens-essentials': {
    title: "Women's Fashion",
    description: 'Elegant boyfriend tees and stylish tops. Comfort meets fashion.',
    gradient: 'from-rose-900 via-pink-800 to-black',
    bgPattern: 'elegant',
  },
};

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ handle: string }> 
}): Promise<Metadata> {
  const { handle } = await params;
  const info = collectionData[handle] || { title: 'Collection', description: 'Browse our collection' };
  
  return {
    title: info.title,
    description: info.description,
  };
}

export default async function CollectionPage({ 
  params,
  searchParams 
}: { 
  params: Promise<{ handle: string }>;
  searchParams: Promise<{ type?: string; sort?: string }>;
}) {
  const { handle } = await params;
  const { type, sort } = await searchParams;
  
  const info = collectionData[handle] || {
    title: 'Collection',
    description: 'Browse our collection',
    gradient: 'from-gray-900 to-black',
    bgPattern: 'default',
  };

  let products: ShopifyProduct[] = [];
  
  try {
    products = await getProductsByCollection(
      handle, 
      50, 
      (sort as 'newest' | 'price-asc' | 'price-desc' | 'best-selling') || 'newest'
    );
    
    // Filter by type if specified
    if (type) {
      products = products.filter(p => 
        p.productType?.toLowerCase().includes(type.toLowerCase())
      );
    }
  } catch (error) {
    console.error('Error fetching collection:', error);
  }

  // Get unique product types for filtering
  const productTypes = [...new Set(products.map(p => p.productType).filter(Boolean))];

  return (
    <CollectionPageClient
      handle={handle}
      info={info}
      products={products}
      productTypes={productTypes}
      currentType={type}
      currentSort={sort || 'newest'}
    />
  );
}
