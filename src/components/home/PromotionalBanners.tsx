'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

const promotions = [
  {
    id: 1,
    title: 'Summer Sale',
    subtitle: 'Up to 60% Off',
    description: 'Dark summer essentials at unbeatable prices',
    cta: 'Shop Sale',
    href: '/products?sale=true',
    bgGradient: 'from-deep-purple via-burnt-lilac/30 to-black',
  },
  {
    id: 2,
    title: 'New Arrivals',
    subtitle: 'Just Dropped',
    description: 'Discover the latest gothic fashion trends',
    cta: 'Explore Now',
    href: '/products?sort=newest',
    bgGradient: 'from-black via-deep-purple/50 to-burnt-lilac/20',
  },
  {
    id: 3,
    title: 'Free Shipping',
    subtitle: 'Orders $100+',
    description: 'Plus easy 30-day returns on all orders',
    cta: 'Start Shopping',
    href: '/products',
    bgGradient: 'from-burnt-lilac/30 via-deep-purple to-black',
  },
];

export default function PromotionalBanners() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % promotions.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    // Resume autoplay after 10 seconds of inactivity
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % promotions.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + promotions.length) % promotions.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  return (
    <section className="py-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl">
          {/* Slides */}
          <div 
            className="flex transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {promotions.map((promo) => (
              <div
                key={promo.id}
                className={`w-full shrink-0 bg-linear-to-r ${promo.bgGradient}`}
              >
                <div className="flex flex-col md:flex-row items-center justify-between p-8 md:p-12 lg:p-16 min-h-[280px] md:min-h-[320px]">
                  <div className="text-center md:text-left mb-6 md:mb-0 md:max-w-xl">
                    <span className="inline-block text-burnt-lilac text-sm uppercase tracking-wider mb-2">
                      {promo.subtitle}
                    </span>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif text-mist-lilac mb-4">
                      {promo.title}
                    </h2>
                    <p className="text-mist-lilac/70 text-base md:text-lg mb-6">
                      {promo.description}
                    </p>
                    <Link
                      href={promo.href}
                      className="inline-flex items-center gap-2 btn-gothic px-6 py-3"
                    >
                      {promo.cta}
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>

                  {/* Decorative Element */}
                  <div className="hidden lg:block">
                    <div className="w-48 h-48 border-2 border-burnt-lilac/30 rounded-full flex items-center justify-center">
                      <div className="w-36 h-36 border-2 border-burnt-lilac/50 rounded-full flex items-center justify-center">
                        <span className="text-4xl font-serif text-burnt-lilac">
                          {promo.id === 1 ? '60%' : promo.id === 2 ? '✦' : '🚚'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-mist-lilac transition-colors"
            aria-label="Previous slide"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-mist-lilac transition-colors"
            aria-label="Next slide"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Dots */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {promotions.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  currentSlide === index 
                    ? 'w-8 bg-burnt-lilac' 
                    : 'bg-mist-lilac/30 hover:bg-mist-lilac/50'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
