'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ShopifyProduct } from '@/lib/shopify';
import ProductCard from '../products/ProductCard';

interface FeaturedProductsProps {
  products: ShopifyProduct[];
}

const tabs = ['All', 'Women', 'Men', 'Accessories'];

export default function FeaturedProducts({ products }: FeaturedProductsProps) {
  const [activeTab, setActiveTab] = useState('All');

  return (
    <section className="py-10 sm:py-16 lg:py-24 bg-black relative overflow-hidden">
      {/* Decorative Background - Hidden on mobile for performance */}
      <div className="absolute inset-0 hidden sm:block">
        <div className="absolute top-0 left-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-burnt-lilac/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-deep-purple/10 rounded-full blur-3xl" />
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-6 sm:mb-10 gap-4 sm:gap-6">
          <div className="text-center sm:text-left">
            <p className="text-burnt-lilac uppercase tracking-[0.15em] sm:tracking-[0.2em] text-[10px] sm:text-xs mb-1 sm:mb-2">
              Curated Selection
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-mist-lilac">
              Featured Products
            </h2>
          </div>

          {/* Filter Tabs - Horizontally scrollable on mobile */}
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-2 lg:pb-0 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm whitespace-nowrap rounded-full transition-all duration-300 touch-manipulation ${
                  activeTab === tab
                    ? 'bg-burnt-lilac text-white'
                    : 'bg-mist-lilac/10 text-mist-lilac/70 hover:bg-mist-lilac/20 hover:text-mist-lilac active:bg-mist-lilac/30'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            {products.slice(0, 8).map((product, index) => (
              <div
                key={product.id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <ProductCard product={product} priority={index < 4} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 sm:py-16">
            <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 rounded-full bg-deep-purple/20 flex items-center justify-center">
              <svg className="w-6 h-6 sm:w-8 sm:h-8 text-mist-lilac/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <p className="text-mist-lilac/50 text-sm sm:text-base">No featured products available</p>
          </div>
        )}

        {/* View All Link */}
        <div className="text-center mt-8 sm:mt-12">
          <Link 
            href="/products" 
            className="inline-flex items-center gap-2 btn-gothic-outline text-sm sm:text-base touch-manipulation"
          >
            View All Products
            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
