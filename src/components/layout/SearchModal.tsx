'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { searchProducts, ShopifyProduct, formatPrice } from '@/lib/shopify';

interface SearchModalProps {
  open: boolean;
  onClose: () => void;
}

const popularSearches = [
  'Gothic Dress',
  'Black Lace',
  'Victorian',
  'Corset',
  'Dark Academia',
];

export default function SearchModal({ open, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      setQuery('');
      setResults([]);
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [open]);

  useEffect(() => {
    const searchTimeout = setTimeout(async () => {
      if (query.length >= 2) {
        setLoading(true);
        try {
          const products = await searchProducts(query, 6);
          setResults(products);
        } catch (error) {
          console.error('Search error:', error);
          setResults([]);
        }
        setLoading(false);
      } else {
        setResults([]);
      }
    }, 300);

    return () => clearTimeout(searchTimeout);
  }, [query]);

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-x-0 top-0 z-50 animate-fade-in px-4">
        <div className="max-w-3xl mx-auto mt-20 bg-black border border-deep-purple/30 rounded-2xl shadow-2xl overflow-hidden">
          {/* Search Input */}
          <div className="relative border-b border-deep-purple/30">
            <svg
              className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-mist-lilac/50"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for products..."
              className="w-full pl-14 pr-14 py-5 bg-transparent text-mist-lilac placeholder-mist-lilac/50 text-lg focus:outline-none"
            />
            <button
              onClick={onClose}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-mist-lilac/50 hover:text-mist-lilac transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="max-h-[60vh] overflow-y-auto p-5">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-2 border-burnt-lilac border-t-transparent rounded-full animate-spin" />
              </div>
            ) : results.length > 0 ? (
              <div>
                <p className="text-mist-lilac/50 text-sm mb-4">
                  {results.length} result{results.length !== 1 ? 's' : ''} for &quot;{query}&quot;
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {results.map((product) => (
                    <Link
                      key={product.id}
                      href={`/products/${product.handle}`}
                      onClick={onClose}
                      className="group"
                    >
                      <div className="relative aspect-square rounded-lg overflow-hidden bg-deep-purple/10 mb-2">
                        {product.featuredImage && (
                          <Image
                            src={product.featuredImage.url}
                            alt={product.featuredImage.altText || product.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        )}
                      </div>
                      <h3 className="text-mist-lilac text-sm font-medium group-hover:text-burnt-lilac transition-colors line-clamp-1">
                        {product.title}
                      </h3>
                      <p className="text-burnt-lilac text-sm">
                        {formatPrice(product.priceRange.minVariantPrice)}
                      </p>
                    </Link>
                  ))}
                </div>
                <Link
                  href={`/products?search=${encodeURIComponent(query)}`}
                  onClick={onClose}
                  className="block mt-6 text-center text-burnt-lilac hover:text-mist-lilac transition-colors text-sm"
                >
                  View all results →
                </Link>
              </div>
            ) : query.length >= 2 ? (
              <div className="text-center py-12">
                <svg
                  className="w-12 h-12 text-deep-purple mx-auto mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="text-mist-lilac/70">No products found for &quot;{query}&quot;</p>
              </div>
            ) : (
              <div>
                <p className="text-mist-lilac/50 text-sm mb-4">Popular Searches</p>
                <div className="flex flex-wrap gap-2">
                  {popularSearches.map((term) => (
                    <button
                      key={term}
                      onClick={() => setQuery(term)}
                      className="px-4 py-2 bg-deep-purple/20 border border-deep-purple/30 rounded-full text-mist-lilac text-sm hover:border-burnt-lilac hover:bg-deep-purple/30 transition-all"
                    >
                      {term}
                    </button>
                  ))}
                </div>

                <div className="mt-8">
                  <p className="text-mist-lilac/50 text-sm mb-4">Browse Categories</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {['Clothing', 'Accessories', 'Footwear', 'Sale'].map((category) => (
                      <Link
                        key={category}
                        href={`/products?category=${category.toLowerCase()}`}
                        onClick={onClose}
                        className="p-4 bg-deep-purple/10 border border-deep-purple/30 rounded-lg text-center text-mist-lilac hover:border-burnt-lilac hover:bg-deep-purple/20 transition-all"
                      >
                        {category}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
