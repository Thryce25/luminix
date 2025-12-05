import { Metadata } from 'next';
import { Suspense } from 'react';
import { getProducts, getCollections, getProductTypes, ShopifyProduct } from '@/lib/shopify';
import ProductGrid from '@/components/products/ProductGrid';
import ProductFilters from '@/components/products/ProductFilters';
import { ProductGridSkeleton } from '@/components/common/Skeletons';

export const metadata: Metadata = {
  title: 'Shop',
  description: 'Browse our curated collection of gothic-inspired fashion and accessories.',
};

export const revalidate = 60; // Revalidate every 60 seconds

interface SearchParams {
  sort?: string;
  category?: string;
  collection?: string;
  type?: string;
  price?: string;
}

// Parse price range string to min/max values
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
  
  // Support both 'category' and 'collection' URL params
  const collectionHandle = collection || category;

  // Fetch data in parallel
  const [products, collections, productTypes] = await Promise.all([
    getProducts({
      first: 48,
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

  // Format collections for filters
  const collectionOptions = collections.map((c) => ({
    label: c.title,
    value: c.handle,
  }));

  // Format product types for filters
  const typeOptions = productTypes.map((t) => ({
    label: t,
    value: t.toLowerCase().replace(/\s+/g, '-'),
  }));

  return (
    <div className="min-h-screen bg-black gothic-texture">
      {/* Hero Section */}
      <section className="relative py-12 sm:py-16 lg:py-20 bg-linear-to-b from-deep-purple/20 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif text-mist-lilac mb-4 sm:mb-6">
            Shop Collection
          </h1>
          <p className="text-mist-lilac/70 max-w-2xl mx-auto text-sm sm:text-base">
            Explore our carefully curated selection of gothic-inspired fashion and accessories. 
            Each piece is chosen to embody elegance, mystery, and timeless dark beauty.
          </p>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-8 sm:py-12 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Filters */}
          <ProductFilters
            collections={collectionOptions}
            productTypes={typeOptions}
          />
          
          {/* Products Grid with Sidebar on Desktop */}
          <div className="flex gap-8">
            {/* Sidebar spacer for desktop */}
            <div className="hidden lg:block w-64 shrink-0" />
            
            {/* Products */}
            <div className="flex-1">
              {products.length > 0 ? (
                <>
                  <p className="text-mist-lilac/50 text-sm mb-6">
                    {products.length} product{products.length !== 1 ? 's' : ''}
                  </p>
                  <Suspense fallback={<ProductGridSkeleton count={12} />}>
                    <ProductGrid products={products} />
                  </Suspense>
                </>
              ) : (
                <div className="text-center py-16">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-deep-purple/20 flex items-center justify-center">
                    <svg className="w-8 h-8 text-mist-lilac/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <p className="text-mist-lilac/50 mb-4">No products found</p>
                  <p className="text-mist-lilac/30 text-sm">Try adjusting your filters</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
