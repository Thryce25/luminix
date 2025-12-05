'use client';

import { useState, useTransition } from 'react';
import { ShopifyProduct } from '@/lib/shopify';
import ProductCard from './ProductCard';

interface LoadMoreProductsProps {
  initialProducts: ShopifyProduct[];
  totalCount?: number;
  loadMoreAction: (cursor: string) => Promise<{
    products: ShopifyProduct[];
    hasNextPage: boolean;
    endCursor: string | null;
  }>;
}

export default function LoadMoreProducts({
  initialProducts,
  loadMoreAction,
}: LoadMoreProductsProps) {
  const [products, setProducts] = useState<ShopifyProduct[]>(initialProducts);
  const [hasMore, setHasMore] = useState(initialProducts.length >= 24);
  const [cursor, setCursor] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const loadMore = () => {
    if (!hasMore || isPending) return;

    startTransition(async () => {
      try {
        const result = await loadMoreAction(cursor || '');
        setProducts((prev) => [...prev, ...result.products]);
        setHasMore(result.hasNextPage);
        setCursor(result.endCursor);
      } catch (error) {
        console.error('Error loading more products:', error);
      }
    });
  };

  return (
    <div>
      {/* Products Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        {products.map((product, index) => (
          <div
            key={product.id}
            className="animate-fade-in-up"
            style={{ animationDelay: `${(index % 8) * 0.05}s` }}
          >
            <ProductCard product={product} priority={index < 8} />
          </div>
        ))}
      </div>

      {/* Load More Button */}
      {hasMore && (
        <div className="text-center mt-12">
          <button
            onClick={loadMore}
            disabled={isPending}
            className="btn-gothic-outline inline-flex items-center gap-2 min-w-[200px] justify-center"
          >
            {isPending ? (
              <>
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Loading...
              </>
            ) : (
              <>
                Load More
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </>
            )}
          </button>
        </div>
      )}

      {/* End Message */}
      {!hasMore && products.length > 0 && (
        <div className="text-center mt-12">
          <p className="text-mist-lilac/40 text-sm">You&apos;ve seen all products</p>
        </div>
      )}
    </div>
  );
}
