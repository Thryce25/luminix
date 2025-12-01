'use client';

import Link from 'next/link';
import { useRef, useState, useEffect } from 'react';
import { ShopifyProduct } from '@/lib/shopify';
import ProductCard from '../products/ProductCard';

interface NewArrivalsProps {
  products: ShopifyProduct[];
}

export default function NewArrivals({ products }: NewArrivalsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [products]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth * 0.8;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className="py-16 lg:py-24 bg-linear-to-b from-black via-deep-purple/5 to-black relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-burnt-lilac uppercase tracking-[0.2em] text-xs mb-2">
              ✦ Just Dropped
            </p>
            <h2 className="text-3xl md:text-4xl font-serif text-mist-lilac">
              New Arrivals
            </h2>
          </div>
          
          {/* Navigation Controls */}
          <div className="hidden md:flex items-center gap-4">
            <div className="flex gap-2">
              <button
                onClick={() => scroll('left')}
                disabled={!canScrollLeft}
                className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-300 ${
                  canScrollLeft
                    ? 'border-mist-lilac/30 text-mist-lilac hover:border-burnt-lilac hover:text-burnt-lilac'
                    : 'border-mist-lilac/10 text-mist-lilac/30 cursor-not-allowed'
                }`}
                aria-label="Scroll left"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={() => scroll('right')}
                disabled={!canScrollRight}
                className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-300 ${
                  canScrollRight
                    ? 'border-mist-lilac/30 text-mist-lilac hover:border-burnt-lilac hover:text-burnt-lilac'
                    : 'border-mist-lilac/10 text-mist-lilac/30 cursor-not-allowed'
                }`}
                aria-label="Scroll right"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
            
            <Link 
              href="/products?sort=newest" 
              className="text-burnt-lilac hover:text-mist-lilac flex items-center gap-1 text-sm transition-colors"
            >
              View All
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Scrollable Products */}
        {products.length > 0 ? (
          <div 
            ref={scrollRef}
            onScroll={checkScroll}
            className="flex gap-4 lg:gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {products.slice(0, 10).map((product, index) => (
              <div
                key={product.id}
                className="shrink-0 w-[280px] lg:w-[300px] snap-start"
              >
                <ProductCard product={product} />
              </div>
            ))}
            
            {/* View More Card */}
            <Link
              href="/products?sort=newest"
              className="shrink-0 w-[280px] lg:w-[300px] snap-start flex flex-col items-center justify-center bg-deep-purple/10 rounded-lg border border-mist-lilac/10 hover:border-burnt-lilac/30 transition-colors group aspect-3/4"
            >
              <div className="w-16 h-16 rounded-full bg-burnt-lilac/20 flex items-center justify-center mb-4 group-hover:bg-burnt-lilac/30 transition-colors">
                <svg className="w-8 h-8 text-burnt-lilac" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <span className="text-mist-lilac font-medium">View All New</span>
              <span className="text-mist-lilac/50 text-sm">Arrivals</span>
            </Link>
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-deep-purple/20 flex items-center justify-center">
              <svg className="w-8 h-8 text-mist-lilac/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-mist-lilac/50">New arrivals coming soon</p>
          </div>
        )}

        {/* Mobile View All */}
        <div className="mt-8 text-center md:hidden">
          <Link 
            href="/products?sort=newest" 
            className="btn-gothic-outline inline-flex items-center gap-2"
          >
            Explore All New Arrivals
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
