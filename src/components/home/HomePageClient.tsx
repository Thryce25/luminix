'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShopifyProduct } from '@/lib/shopify';
import { useCart } from '@/context/CartContext';
import FloatingBackground from '@/components/common/FloatingBackground';

interface HomePageClientProps {
  featuredProducts: ShopifyProduct[];
  newArrivals: ShopifyProduct[];
}

export default function HomePageClient({ featuredProducts, newArrivals }: HomePageClientProps) {
  const [scrollY, setScrollY] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeCollection, setActiveCollection] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsLoaded(true);
    // Check for mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    // Disable parallax on mobile for performance
    if (isMobile) return;
    
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isMobile]);

  // Auto-rotate collections
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveCollection((prev) => (prev + 1) % 3);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const collections = [
    { name: "Men's Fashion", href: '/products?category=mens-essentials', image: '/images/mens.jpg' },
    { name: 'New Arrivals', href: '/products?category=new-arrivals', image: '/images/new_arrivals.jpg' },
    { name: "Women's Fashion", href: '/products?category=womens-essentials', image: '/images/womens.jpg' },
  ];

  return (
    <div className="min-h-screen bg-black overflow-hidden -mt-20">
      {/* ===== ANIMATED BACKGROUND ===== */}
      <FloatingBackground />

      {/* ===== HERO SECTION ===== */}
      <section ref={heroRef} className="relative min-h-screen flex items-start justify-center overflow-hidden pt-20">
        {/* Floating shapes - Desktop only for performance */}
        {!isMobile && (
          <div className="absolute inset-0 z-0" style={{ transform: `translateY(${scrollY * 0.2}px)` }}>
            {/* Floating circles - reduced */}
            <div className="absolute top-[20%] right-[15%] w-32 h-32 border border-mist-lilac/10 rounded-full" />
            <div className="absolute top-[60%] left-[10%] w-48 h-48 border border-burnt-lilac/10 rounded-full" />
            <div className="absolute bottom-[20%] right-[20%] w-24 h-24 border-2 border-deep-purple/20 rounded-full" />
          </div>
        )}

        {/* Hero Content */}
        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto pt-8 sm:pt-12">
          {/* Tagline */}
          <p className={`text-burnt-lilac uppercase tracking-[0.3em] text-xs sm:text-sm mb-6 transition-all duration-700 delay-200 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            Designed for the Fearless
          </p>

          {/* Main Heading with Gradient */}
          <h1 className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-serif leading-tight mb-6 transition-all duration-700 delay-300 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <span className="block text-mist-lilac">Embrace the</span>
            <span className="block bg-linear-to-r from-burnt-lilac via-mist-lilac to-burnt-lilac bg-clip-text text-transparent">
              Extraordinary
            </span>
          </h1>

          {/* Subtitle */}
          <p className={`text-mist-lilac/60 text-base sm:text-lg md:text-xl max-w-2xl mx-auto mb-10 transition-all duration-700 delay-400 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            Where darkness meets elegance. Premium streetwear crafted for those who dare to stand out.
          </p>

          {/* CTA Buttons */}
          <div className={`flex flex-col sm:flex-row gap-4 justify-center mb-16 transition-all duration-700 delay-500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <Link
              href="/products"
              className="group relative px-10 py-4 bg-linear-to-r from-burnt-lilac to-purple-600 rounded-xl text-white font-medium overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-burnt-lilac/30 hover:scale-105"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                Shop Collection
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
              <div className="absolute inset-0 bg-linear-to-r from-purple-600 to-burnt-lilac opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Link>
            <Link
              href="/products?category=new-arrivals"
              className="px-10 py-4 bg-white/5 backdrop-blur-sm rounded-xl text-mist-lilac font-medium border border-white/10 hover:bg-white/10 hover:border-burnt-lilac/30 transition-all duration-300"
            >
              New Arrivals
            </Link>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className={`absolute bottom-24 left-1/2 -translate-x-1/2 transition-all duration-700 delay-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
          <div className="flex flex-col items-center gap-2 text-mist-lilac/40">
            <span className="text-xs uppercase tracking-widest">Scroll</span>
            <div className="w-6 h-10 border border-mist-lilac/30 rounded-full flex justify-center pt-2">
              <div className="w-1.5 h-3 bg-burnt-lilac/50 rounded-full animate-bounce" />
            </div>
          </div>
        </div>
      </section>

      {/* ===== COLLECTIONS SHOWCASE ===== */}
      <section className="relative py-24 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16">
            <p className="text-burnt-lilac uppercase tracking-[0.2em] text-xs sm:text-sm mb-4">
              Curated Collections
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif">
              <span className="bg-linear-to-r from-white via-mist-lilac to-burnt-lilac bg-clip-text text-transparent">
                Shop by Style
              </span>
            </h2>
          </div>

          {/* Collection Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {collections.map((collection, index) => (
              <Link
                key={collection.name}
                href={collection.href}
                className={`group relative overflow-hidden rounded-2xl aspect-3/4 transition-all duration-500 ${
                  activeCollection === index ? 'scale-105 z-10' : 'scale-100'
                }`}
                onMouseEnter={() => setActiveCollection(index)}
              >
                {/* Background Image */}
                <Image
                  src={collection.image}
                  alt={collection.name}
                  fill
                  className={`transition-transform duration-700 group-hover:scale-110 ${
                    collection.name === "Women's Fashion" ? 'object-cover object-[50%_20%]' : 'object-cover'
                  }`}
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                
                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-all duration-500" />

                {/* Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center z-10">
                  <div className={`w-20 h-20 mb-6 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:bg-white/20`}>
                    <span className="text-3xl font-serif text-white">{index + 1}</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-serif text-white mb-3 group-hover:scale-105 transition-transform">
                    {collection.name}
                  </h3>
                  <p className="text-white/80 text-sm mb-6">
                    Explore the collection
                  </p>
                  <div className="px-6 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white text-sm border border-white/20 group-hover:bg-white/20 group-hover:scale-105 transition-all">
                    View All →
                  </div>
                </div>

                {/* Hover border effect */}
                <div className={`absolute inset-0 border-2 rounded-2xl transition-all duration-300 ${
                  activeCollection === index ? 'border-white/30' : 'border-transparent'
                }`} />
              </Link>
            ))}
          </div>

          {/* Collection Indicators */}
          <div className="hidden md:flex justify-center gap-3 mt-8">
            {collections.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveCollection(i)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  activeCollection === i ? 'w-8 bg-burnt-lilac' : 'bg-mist-lilac/30'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURED PRODUCTS ===== */}
      <section className="relative py-24 sm:py-32">
        {/* Background decoration */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-burnt-lilac/30 to-transparent" />
          <div className="absolute bottom-0 left-0 w-full h-px bg-linear-to-r from-transparent via-burnt-lilac/30 to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-12 gap-6">
            <div>
              <p className="text-burnt-lilac uppercase tracking-[0.2em] text-xs sm:text-sm mb-4">
                Handpicked Selection
              </p>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif">
                <span className="bg-linear-to-r from-white via-mist-lilac to-burnt-lilac bg-clip-text text-transparent">
                  Featured Products
                </span>
              </h2>
            </div>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 text-burnt-lilac hover:text-mist-lilac transition-colors group"
            >
              View All
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>

          {/* Products Grid */}
          {featuredProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {featuredProducts.slice(0, 8).map((product, index) => (
                <ProductCardEnhanced key={product.id} product={product} index={index} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-burnt-lilac/10 flex items-center justify-center">
                <svg className="w-10 h-10 text-mist-lilac/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <p className="text-mist-lilac/50">Products loading...</p>
            </div>
          )}
        </div>
      </section>

      {/* ===== NEW ARRIVALS ===== */}
      <section className="relative py-24 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-12 gap-6">
            <div>
              <p className="text-burnt-lilac uppercase tracking-[0.2em] text-xs sm:text-sm mb-4">
                Fresh Drops
              </p>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif">
                <span className="bg-linear-to-r from-white via-mist-lilac to-burnt-lilac bg-clip-text text-transparent">
                  New Arrivals
                </span>
              </h2>
            </div>
            <Link
              href="/products?category=new-arrivals"
              className="inline-flex items-center gap-2 text-burnt-lilac hover:text-mist-lilac transition-colors group"
            >
              View All
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>

          {/* Horizontal Scroll */}
          {newArrivals.length > 0 ? (
            <div className="flex gap-4 sm:gap-6 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
              {newArrivals.map((product, index) => (
                <div key={product.id} className="shrink-0 w-64 sm:w-72">
                  <ProductCardEnhanced product={product} index={index} />
                </div>
              ))}
              
              {/* View More Card */}
              <Link
                href="/products?category=new-arrivals"
                className="shrink-0 w-64 sm:w-72 flex flex-col items-center justify-center bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:border-burnt-lilac/30 hover:bg-white/10 transition-all group aspect-3/4"
              >
                <div className="w-16 h-16 rounded-full bg-burnt-lilac/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <svg className="w-8 h-8 text-burnt-lilac" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
                <span className="text-mist-lilac font-medium">View All</span>
                <span className="text-mist-lilac/50 text-sm">New Arrivals</span>
              </Link>
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-mist-lilac/50">New arrivals coming soon...</p>
            </div>
          )}
        </div>
      </section>

      {/* Decorative bottom gradient */}
      <div className="fixed bottom-0 left-0 right-0 h-32 bg-linear-to-t from-black to-transparent pointer-events-none z-0" />

      {/* Custom styles */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(2deg); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-spin-slow {
          animation: spin-slow 30s linear infinite;
        }
        .animate-gradient {
          background-size: 200% auto;
          animation: gradient 4s ease infinite;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}

// Enhanced Product Card Component
function ProductCardEnhanced({ product, index }: { product: ShopifyProduct; index: number }) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const { addItem, setCartOpen } = useCart();

  const image = product.images?.edges?.[0]?.node;
  const secondImage = product.images?.edges?.[1]?.node;
  const price = product.priceRange?.minVariantPrice;
  const comparePrice = product.compareAtPriceRange?.minVariantPrice;
  const hasDiscount = comparePrice && parseFloat(comparePrice.amount) > parseFloat(price?.amount || '0');

  const handleQuickAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const variant = product.variants?.edges?.[0]?.node;
    if (variant) {
      await addItem(variant.id, 1);
      setCartOpen(true);
    }
  };

  return (
    <Link
      href={`/products/${product.handle}`}
      className="group relative block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        animation: 'fadeInUp 0.6s ease-out forwards',
        animationDelay: `${index * 100}ms`,
        opacity: 0,
      }}
    >
      {/* Image Container */}
      <div className="relative aspect-3/4 rounded-xl overflow-hidden bg-deep-purple/20">
        {/* Skeleton */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-linear-to-br from-deep-purple/30 to-burnt-lilac/10 animate-pulse" />
        )}

        {/* Primary Image */}
        {image && (
          <Image
            src={image.url}
            alt={image.altText || product.title}
            fill
            className={`object-cover transition-all duration-700 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            } ${isHovered && secondImage ? 'opacity-0 scale-110' : 'opacity-100 scale-100'}`}
            onLoad={() => setImageLoaded(true)}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        )}

        {/* Secondary Image */}
        {secondImage && (
          <Image
            src={secondImage.url}
            alt={secondImage.altText || product.title}
            fill
            className={`object-cover transition-all duration-700 absolute inset-0 ${
              isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-110'
            }`}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        )}

        {/* Sale Badge */}
        {hasDiscount && (
          <div className="absolute top-3 left-3 px-2 py-1 bg-linear-to-r from-red-500 to-pink-500 text-white text-xs font-bold rounded-lg shadow-lg">
            SALE
          </div>
        )}

        {/* Quick Add Overlay */}
        <div className={`absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent flex items-end justify-center pb-4 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <button
            onClick={handleQuickAdd}
            className="px-6 py-2.5 bg-burnt-lilac hover:bg-burnt-lilac/80 text-white text-sm font-medium rounded-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 shadow-lg"
          >
            Quick Add
          </button>
        </div>

        {/* Hover Border */}
        <div className={`absolute inset-0 border-2 rounded-xl transition-colors duration-300 ${isHovered ? 'border-burnt-lilac' : 'border-transparent'}`} />
      </div>

      {/* Product Info */}
      <div className="mt-4 space-y-1">
        <h3 className="text-mist-lilac font-medium text-sm sm:text-base line-clamp-2 group-hover:text-burnt-lilac transition-colors">
          {product.title}
        </h3>
        <p className="text-mist-lilac/50 text-xs">{product.productType}</p>
        <div className="flex items-center gap-2">
          <span className="text-burnt-lilac font-semibold text-sm sm:text-base">
            Rs.{parseFloat(price?.amount || '0').toFixed(0)}
          </span>
          {hasDiscount && (
            <span className="text-mist-lilac/40 line-through text-xs sm:text-sm">
              Rs.{parseFloat(comparePrice.amount).toFixed(0)}
            </span>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </Link>
  );
}
