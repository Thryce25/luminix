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

const trendingCategories = [
  { name: 'Men', href: '/products?category=men' },
  { name: 'Women', href: '/products?category=women' },
  { name: 'New Arrivals', href: '/products?sort=newest' },
  { name: 'All Products', href: '/products' },
];

// Futuristic SVG icons for categories
const CategoryIcon = ({ name }: { name: string }) => {
  switch (name) {
    case 'Men':
      return (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      );
    case 'Women':
      return (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
        </svg>
      );
    case 'New Arrivals':
      return (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      );
    case 'All Products':
      return (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      );
    default:
      return null;
  }
};

export default function SearchModal({ open, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
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

  // Handle escape key
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
      {/* Animated Backdrop with Particles */}
      <div
        className={`fixed inset-0 z-50 transition-all duration-500 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
      >
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" />
        
        {/* Animated Gradient Orbs - Smaller on mobile */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-48 sm:w-96 h-48 sm:h-96 bg-burnt-lilac/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-40 sm:w-80 h-40 sm:h-80 bg-deep-purple/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[600px] h-[300px] sm:h-[600px] bg-mist-lilac/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }} />
        </div>

        {/* Floating Particles - Fewer on mobile */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none hidden sm:block">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-burnt-lilac/40 rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 4}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Modal Container */}
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-4 sm:pt-[10vh] px-3 sm:px-4 pointer-events-none overflow-y-auto">
        <div
          className={`w-full max-w-2xl pointer-events-auto transition-all duration-500 ease-out my-4 sm:my-0 ${
            isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-8 scale-95'
          }`}
        >
          {/* Glowing Border Container */}
          <div className="relative group">
            {/* Animated Glow Effect */}
            <div className="absolute -inset-0.5 bg-linear-to-r from-burnt-lilac via-mist-lilac to-burnt-lilac rounded-2xl sm:rounded-3xl blur opacity-30 group-hover:opacity-50 transition-opacity animate-gradient-x" />
            
            {/* Main Modal */}
            <div className="relative bg-black/95 backdrop-blur-2xl rounded-2xl sm:rounded-3xl border border-burnt-lilac/20 overflow-hidden shadow-2xl shadow-burnt-lilac/10">
              {/* Search Header */}
              <div className="relative">
                {/* Animated Top Border */}
                <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-burnt-lilac to-transparent animate-shimmer" />
                
                <div className="flex items-center gap-3 sm:gap-4 p-4 sm:p-6">
                  {/* Animated Search Icon */}
                  <div className="relative shrink-0">
                    <div className={`transition-all duration-300 ${loading ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}>
                      <svg
                        className="w-5 h-5 sm:w-6 sm:h-6 text-burnt-lilac"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                    </div>
                    {/* Loading Spinner */}
                    <div className={`absolute inset-0 transition-all duration-300 ${loading ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}>
                      <div className="w-5 h-5 sm:w-6 sm:h-6 border-2 border-burnt-lilac/30 border-t-burnt-lilac rounded-full animate-spin" />
                    </div>
                  </div>

                  {/* Input Field */}
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search products..."
                    className="flex-1 bg-transparent text-base sm:text-xl text-mist-lilac placeholder-mist-lilac/40 focus:outline-none font-light tracking-wide min-w-0"
                  />

                  {/* Clear/Close Button */}
                  <button
                    onClick={query ? () => setQuery('') : onClose}
                    className="group/btn relative p-2 rounded-full hover:bg-burnt-lilac/10 active:bg-burnt-lilac/20 transition-all duration-300 touch-manipulation shrink-0"
                  >
                    <svg 
                      className="w-5 h-5 text-mist-lilac/60 group-hover/btn:text-burnt-lilac transition-colors group-hover/btn:rotate-90 duration-300" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Keyboard Shortcut Hint */}
                <div className="absolute right-16 sm:right-20 top-1/2 -translate-y-1/2 hidden md:flex items-center gap-1">
                  <kbd className="px-2 py-0.5 text-xs text-mist-lilac/40 bg-deep-purple/20 rounded border border-deep-purple/30">
                    ESC
                  </kbd>
                </div>
              </div>

              {/* Divider with Glow */}
              <div className="relative h-px">
                <div className="absolute inset-0 bg-linear-to-r from-transparent via-burnt-lilac/50 to-transparent" />
              </div>

              {/* Content Area */}
              <div className="max-h-[65vh] sm:max-h-[60vh] overflow-y-auto scrollbar-thin scrollbar-thumb-burnt-lilac/20 scrollbar-track-transparent">
                {loading ? (
                  /* Skeleton Loading */
                  <div className="p-4 sm:p-6 space-y-4">
                    <div className="flex items-center gap-2 mb-4 sm:mb-6">
                      <div className="w-24 h-4 bg-deep-purple/30 rounded-full animate-pulse" />
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                      {[...Array(4)].map((_, i) => (
                        <div key={i} className="space-y-2 sm:space-y-3 animate-pulse" style={{ animationDelay: `${i * 0.1}s` }}>
                          <div className="aspect-square bg-deep-purple/20 rounded-xl sm:rounded-2xl" />
                          <div className="h-3 sm:h-4 bg-deep-purple/20 rounded-full w-3/4" />
                          <div className="h-2.5 sm:h-3 bg-deep-purple/20 rounded-full w-1/2" />
                        </div>
                      ))}
                    </div>
                  </div>
                ) : results.length > 0 ? (
                  /* Search Results */
                  <div className="p-4 sm:p-6">
                    <div className="flex items-center justify-between mb-4 sm:mb-6">
                      <p className="text-mist-lilac/60 text-xs sm:text-sm">
                        Found <span className="text-burnt-lilac font-medium">{results.length}</span> results
                      </p>
                      <Link
                        href={`/products?search=${encodeURIComponent(query)}`}
                        onClick={onClose}
                        className="text-xs sm:text-sm text-burnt-lilac hover:text-mist-lilac transition-colors flex items-center gap-1 group/link touch-manipulation"
                      >
                        View all
                        <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover/link:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </div>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                      {results.map((product, index) => (
                        <Link
                          key={product.id}
                          href={`/products/${product.handle}`}
                          onClick={onClose}
                          className="group/card relative touch-manipulation"
                          style={{ animationDelay: `${index * 50}ms` }}
                        >
                          {/* Product Card */}
                          <div className="relative aspect-square rounded-xl sm:rounded-2xl overflow-hidden bg-deep-purple/10 mb-2 sm:mb-3">
                            {/* Hover Glow */}
                            <div className="absolute inset-0 bg-linear-to-t from-burnt-lilac/20 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 z-10" />
                            
                            {product.featuredImage && (
                              <Image
                                src={product.featuredImage.url}
                                alt={product.featuredImage.altText || product.title}
                                fill
                                className="object-cover group-hover/card:scale-110 transition-transform duration-500"
                              />
                            )}
                            
                            {/* Quick View Badge - Hidden on mobile */}
                            <div className="hidden sm:flex absolute inset-0 items-center justify-center opacity-0 group-hover/card:opacity-100 transition-all duration-300 z-20">
                              <span className="px-3 py-1.5 bg-black/80 backdrop-blur-sm text-xs text-mist-lilac rounded-full border border-burnt-lilac/30">
                                Quick View
                              </span>
                            </div>
                          </div>
                          
                          <h3 className="text-mist-lilac text-xs sm:text-sm font-medium group-hover/card:text-burnt-lilac transition-colors line-clamp-1">
                            {product.title}
                          </h3>
                          <p className="text-burnt-lilac text-xs sm:text-sm font-light">
                            {formatPrice(product.priceRange.minVariantPrice)}
                          </p>
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : query.length >= 2 ? (
                  /* No Results */
                  <div className="p-8 sm:p-12 text-center">
                    <div className="relative w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6">
                      <div className="absolute inset-0 bg-burnt-lilac/10 rounded-full animate-ping" />
                      <div className="relative w-16 h-16 sm:w-20 sm:h-20 bg-deep-purple/20 rounded-full flex items-center justify-center">
                        <svg
                          className="w-8 h-8 sm:w-10 sm:h-10 text-burnt-lilac/50"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                    </div>
                    <h3 className="text-mist-lilac text-base sm:text-lg font-medium mb-2">No results found</h3>
                    <p className="text-mist-lilac/50 text-xs sm:text-sm mb-4 sm:mb-6">
                      We couldn&apos;t find anything for &quot;{query}&quot;
                    </p>
                    <button
                      onClick={() => setQuery('')}
                      className="text-burnt-lilac hover:text-mist-lilac active:text-mist-lilac transition-colors text-xs sm:text-sm touch-manipulation"
                    >
                      Clear search
                    </button>
                  </div>
                ) : (
                  /* Default State - Popular & Categories */
                  <div className="p-4 sm:p-6 space-y-6 sm:space-y-8">
                    {/* Popular Searches */}
                    <div>
                      <h3 className="text-mist-lilac/60 text-[10px] sm:text-xs uppercase tracking-widest mb-3 sm:mb-4 flex items-center gap-2">
                        <span className="w-6 sm:w-8 h-px bg-linear-to-r from-burnt-lilac to-transparent" />
                        Popular Searches
                      </h3>
                      <div className="flex flex-wrap gap-1.5 sm:gap-2">
                        {popularSearches.map((term, index) => (
                          <button
                            key={term}
                            onClick={() => setQuery(term)}
                            className="group/tag relative px-3 sm:px-4 py-1.5 sm:py-2 rounded-full transition-all duration-300 hover:scale-105 active:scale-95 touch-manipulation"
                            style={{ animationDelay: `${index * 50}ms` }}
                          >
                            {/* Tag Background with Gradient Border */}
                            <div className="absolute inset-0 bg-deep-purple/20 rounded-full border border-deep-purple/30 group-hover/tag:border-burnt-lilac/50 group-hover/tag:bg-burnt-lilac/10 transition-all duration-300" />
                            <span className="relative text-xs sm:text-sm text-mist-lilac/80 group-hover/tag:text-mist-lilac transition-colors">
                              {term}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Trending Categories */}
                    <div>
                      <h3 className="text-mist-lilac/60 text-[10px] sm:text-xs uppercase tracking-widest mb-3 sm:mb-4 flex items-center gap-2">
                        <span className="w-6 sm:w-8 h-px bg-linear-to-r from-burnt-lilac to-transparent" />
                        Browse Categories
                      </h3>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                        {trendingCategories.map((category, index) => (
                          <Link
                            key={category.name}
                            href={category.href}
                            onClick={onClose}
                            className="group/cat relative p-3 sm:p-4 rounded-xl sm:rounded-2xl overflow-hidden transition-all duration-300 hover:scale-105 active:scale-95 touch-manipulation"
                            style={{ animationDelay: `${index * 50}ms` }}
                          >
                            {/* Background */}
                            <div className="absolute inset-0 bg-linear-to-br from-deep-purple/30 to-deep-purple/10 border border-deep-purple/30 rounded-xl sm:rounded-2xl group-hover/cat:border-burnt-lilac/50 group-hover/cat:from-burnt-lilac/20 group-hover/cat:to-deep-purple/20 transition-all duration-300" />
                            
                            {/* Glow Effect on Hover */}
                            <div className="absolute inset-0 opacity-0 group-hover/cat:opacity-100 transition-opacity duration-300">
                              <div className="absolute inset-0 bg-burnt-lilac/5 rounded-xl sm:rounded-2xl" />
                            </div>
                            
                            {/* Content */}
                            <div className="relative text-center flex flex-col items-center">
                              <div className="w-10 h-10 sm:w-12 sm:h-12 mb-2 sm:mb-3 rounded-lg sm:rounded-xl bg-burnt-lilac/10 border border-burnt-lilac/20 flex items-center justify-center text-burnt-lilac group-hover/cat:bg-burnt-lilac/20 group-hover/cat:border-burnt-lilac/40 group-hover/cat:scale-110 transition-all duration-300">
                                <CategoryIcon name={category.name} />
                              </div>
                              <span className="text-xs sm:text-sm text-mist-lilac group-hover/cat:text-burnt-lilac transition-colors">
                                {category.name}
                              </span>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>

                    {/* Pro Tip */}
                    <div className="relative p-3 sm:p-4 rounded-xl sm:rounded-2xl overflow-hidden">
                      <div className="absolute inset-0 bg-linear-to-r from-burnt-lilac/5 to-transparent" />
                      <div className="relative flex items-center gap-2.5 sm:gap-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-burnt-lilac/10 flex items-center justify-center shrink-0">
                          <svg className="w-4 h-4 sm:w-5 sm:h-5 text-burnt-lilac" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-mist-lilac text-xs sm:text-sm">Quick Tip</p>
                          <p className="text-mist-lilac/50 text-[10px] sm:text-xs">Start typing to search our entire collection</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CSS for Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) scale(1);
            opacity: 0.4;
          }
          50% {
            transform: translateY(-20px) scale(1.2);
            opacity: 0.8;
          }
        }
        
        @keyframes gradient-x {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 3s ease infinite;
        }
        
        .animate-shimmer {
          animation: shimmer 2s ease-in-out infinite;
        }
      `}</style>
    </>
  );
}
