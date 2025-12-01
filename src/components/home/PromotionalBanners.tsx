'use client';

import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';

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
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Minimum swipe distance
  const minSwipeDistance = 50;

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
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % promotions.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + promotions.length) % promotions.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  }, []);

  // Touch handlers for swipe
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }
  };

  return (
    <section className="py-4 sm:py-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div 
          className="relative overflow-hidden rounded-xl sm:rounded-2xl"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
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
                <div className="flex flex-col md:flex-row items-center justify-between p-5 sm:p-8 md:p-12 lg:p-16 min-h-[200px] sm:min-h-[250px] md:min-h-[320px]">
                  <div className="text-center md:text-left mb-4 sm:mb-6 md:mb-0 md:max-w-xl">
                    <span className="inline-block text-burnt-lilac text-[10px] sm:text-xs md:text-sm uppercase tracking-wider mb-1 sm:mb-2">
                      {promo.subtitle}
                    </span>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif text-mist-lilac mb-2 sm:mb-4">
                      {promo.title}
                    </h2>
                    <p className="text-mist-lilac/70 text-xs sm:text-sm md:text-base lg:text-lg mb-4 sm:mb-6">
                      {promo.description}
                    </p>
                    <Link
                      href={promo.href}
                      className="inline-flex items-center gap-1.5 sm:gap-2 btn-gothic px-4 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm md:text-base touch-manipulation"
                    >
                      {promo.cta}
                      <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>

                  {/* Decorative Element - Hidden on mobile */}
                  <div className="hidden lg:block">
                    <div className="w-36 h-36 xl:w-48 xl:h-48 border-2 border-burnt-lilac/30 rounded-full flex items-center justify-center">
                      <div className="w-28 h-28 xl:w-36 xl:h-36 border-2 border-burnt-lilac/50 rounded-full flex items-center justify-center">
                        <span className="text-2xl xl:text-4xl font-serif text-burnt-lilac">
                          {promo.id === 1 ? '60%' : promo.id === 2 ? 'NEW' : 'FREE'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Arrows - Larger touch targets on mobile */}
          <button
            onClick={prevSlide}
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 bg-black/50 hover:bg-black/70 active:bg-black/80 rounded-full flex items-center justify-center text-mist-lilac transition-colors touch-manipulation"
            aria-label="Previous slide"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 bg-black/50 hover:bg-black/70 active:bg-black/80 rounded-full flex items-center justify-center text-mist-lilac transition-colors touch-manipulation"
            aria-label="Next slide"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Dots */}
          <div className="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 sm:gap-2">
            {promotions.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 touch-manipulation ${
                  currentSlide === index 
                    ? 'w-6 sm:w-8 bg-burnt-lilac' 
                    : 'w-1.5 sm:w-2 bg-mist-lilac/30 hover:bg-mist-lilac/50'
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
