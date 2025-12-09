'use client';

import Link from 'next/link';
import ProductCard from '@/components/products/ProductCard';
import { ShopifyProduct } from '@/lib/shopify';

interface AnimeCollectionProps {
  products: ShopifyProduct[];
}

export default function AnimeCollection({ products }: AnimeCollectionProps) {
  if (products.length === 0) return null;

  return (
    <section className="py-12 sm:py-16 lg:py-24 bg-linear-to-b from-black via-purple-950/20 to-black relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 sm:mb-12 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl text-orange-500">*</span>
              <span className="text-burnt-lilac text-xs sm:text-sm uppercase tracking-wider font-medium">
                Trending
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-mist-lilac">
              Anime Collection
            </h2>
            <p className="text-mist-lilac/60 mt-2 text-sm sm:text-base max-w-xl">
              One Piece, Dragon Ball, Solo Leveling, Demon Slayer & more
            </p>
          </div>
          <Link
            href="/products?collection=anime-collection"
            className="group inline-flex items-center text-burnt-lilac hover:text-mist-lilac transition-colors text-sm sm:text-base"
          >
            View All
            <svg
              className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          {products.slice(0, 8).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* CTA Button */}
        <div className="text-center mt-8 sm:mt-12">
          <Link
            href="/products?collection=anime-collection"
            className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-lg font-medium transition-all transform hover:scale-105 shadow-lg shadow-purple-500/25"
          >
            <span>Explore Full Anime Collection</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
