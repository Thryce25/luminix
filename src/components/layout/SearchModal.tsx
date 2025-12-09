'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { searchProducts, ShopifyProduct, formatPrice } from '@/lib/shopify';

interface SearchModalProps {
  open: boolean;
  onClose: () => void;
}

const popularSearches = ['Hoodies', 'T-Shirts', 'Sweatshirts', 'New Arrivals'];

const categories = [
  { name: "Men's", href: '/collections/mens-essentials' },
  { name: "Women's", href: '/collections/womens-essentials' },
  { name: 'New Arrivals', href: '/collections/new-arrivals' },
  { name: 'All Products', href: '/products' },
];

export default function SearchModal({ open, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setIsVisible(true);
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = 'hidden';
    } else {
      setIsVisible(false);
      document.body.style.overflow = 'unset';
      setQuery('');
      setResults([]);
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [open]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    if (open) {
      window.addEventListener('mousemove', handleMouseMove);
    }
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [open]);

  useEffect(() => {
    const searchTimeout = setTimeout(async () => {
      if (query.length >= 2) {
        setLoading(true);
        try {
          const products = await searchProducts(query, 8);
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

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (open) window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-50 transition-all duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
      >
        <div className="absolute inset-0 bg-black/95 backdrop-blur-xl" />
        
        {/* Mouse-following gradient */}
        <div
          className="absolute w-[600px] h-[600px] rounded-full blur-[120px] pointer-events-none transition-all duration-700"
          style={{
            background: 'radial-gradient(circle, rgba(111,78,124,0.15) 0%, transparent 70%)',
            left: mousePosition.x - 300,
            top: mousePosition.y - 300,
          }}
        />
        
        {/* Static orbs */}
        <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-burnt-lilac/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-deep-purple/20 rounded-full blur-[80px] pointer-events-none" />
        
        {/* Grid pattern */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(214,197,220,0.3) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(214,197,220,0.3) 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh] sm:pt-[15vh] px-4 pointer-events-none">
        <div
          className={`w-full max-w-2xl pointer-events-auto transition-all duration-500 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8'
          }`}
        >
          {/* Search Container */}
          <div className="relative bg-white/5 backdrop-blur-2xl rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
            
            {/* Search Input */}
            <div className="flex items-center gap-4 p-5 sm:p-6 border-b border-white/10">
              {/* Search Icon / Loading */}
              <div className="relative w-5 h-5 shrink-0">
                {loading ? (
                  <div className="w-5 h-5 border-2 border-burnt-lilac/30 border-t-burnt-lilac rounded-full animate-spin" />
                ) : (
                  <svg className="w-5 h-5 text-burnt-lilac" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                )}
              </div>

              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products..."
                className="flex-1 bg-transparent text-lg text-mist-lilac placeholder-mist-lilac/40 focus:outline-none"
              />

              {/* Close Button */}
              <button
                onClick={query ? () => setQuery('') : onClose}
                className="p-2 rounded-lg hover:bg-white/5 transition-colors"
              >
                <svg className="w-5 h-5 text-mist-lilac/60 hover:text-mist-lilac transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* ESC hint */}
              <kbd className="hidden sm:block px-2 py-1 text-xs text-mist-lilac/40 bg-white/5 rounded border border-white/10">
                ESC
              </kbd>
            </div>

            {/* Content */}
            <div className="max-h-[60vh] overflow-y-auto">
              {loading ? (
                /* Loading Skeleton */
                <div className="p-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="space-y-3 animate-pulse">
                      <div className="aspect-square bg-white/5 rounded-xl" />
                      <div className="h-4 bg-white/5 rounded w-3/4" />
                      <div className="h-3 bg-white/5 rounded w-1/2" />
                    </div>
                  ))}
                </div>
              ) : results.length > 0 ? (
                /* Search Results */
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-mist-lilac/60 text-sm">
                      {results.length} results found
                    </p>
                    <Link
                      href={`/products?search=${encodeURIComponent(query)}`}
                      onClick={onClose}
                      className="text-sm text-burnt-lilac hover:text-mist-lilac transition-colors flex items-center gap-1"
                    >
                      View all
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {results.map((product, index) => (
                      <Link
                        key={product.id}
                        href={`/products/${product.handle}`}
                        onClick={onClose}
                        className="group"
                        style={{
                          animation: 'fadeIn 0.3s ease-out forwards',
                          animationDelay: `${index * 50}ms`,
                          opacity: 0,
                        }}
                      >
                        <div className="relative aspect-square rounded-xl overflow-hidden bg-white/5 mb-3 border border-white/5 group-hover:border-burnt-lilac/30 transition-all">
                          {product.featuredImage && (
                            <Image
                              src={product.featuredImage.url}
                              alt={product.featuredImage.altText || product.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          )}
                        </div>
                        <h3 className="text-mist-lilac text-sm group-hover:text-burnt-lilac transition-colors line-clamp-1">
                          {product.title}
                        </h3>
                        <p className="text-burnt-lilac text-sm">
                          {formatPrice(product.priceRange.minVariantPrice)}
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
              ) : query.length >= 2 ? (
                /* No Results */
                <div className="p-12 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
                    <svg className="w-8 h-8 text-mist-lilac/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <h3 className="text-mist-lilac text-lg mb-2">No results found</h3>
                  <p className="text-mist-lilac/50 text-sm mb-4">
                    No products match &quot;{query}&quot;
                  </p>
                  <button
                    onClick={() => setQuery('')}
                    className="text-burnt-lilac hover:text-mist-lilac transition-colors text-sm"
                  >
                    Clear search
                  </button>
                </div>
              ) : (
                /* Default State */
                <div className="p-6 space-y-8">
                  {/* Popular Searches */}
                  <div>
                    <h3 className="text-mist-lilac/50 text-xs uppercase tracking-wider mb-3">
                      Popular Searches
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {popularSearches.map((term) => (
                        <button
                          key={term}
                          onClick={() => setQuery(term)}
                          className="px-4 py-2 bg-white/5 hover:bg-burnt-lilac/10 border border-white/10 hover:border-burnt-lilac/30 rounded-lg text-sm text-mist-lilac/80 hover:text-mist-lilac transition-all"
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Categories */}
                  <div>
                    <h3 className="text-mist-lilac/50 text-xs uppercase tracking-wider mb-3">
                      Browse Categories
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {categories.map((category) => (
                        <Link
                          key={category.name}
                          href={category.href}
                          onClick={onClose}
                          className="group p-4 bg-white/5 hover:bg-burnt-lilac/10 border border-white/10 hover:border-burnt-lilac/30 rounded-xl text-center transition-all"
                        >
                          <span className="text-sm text-mist-lilac group-hover:text-burnt-lilac transition-colors">
                            {category.name}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}
