'use client';

import { useState, useEffect, useRef } from 'react';
import CartPageContent from '@/components/cart/CartPageContent';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';

export default function CartPageClient() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isLoaded, setIsLoaded] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const { cart } = useCart();

  const itemCount = cart?.lines?.edges?.length || 0;

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Parallax effect
  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current) {
        const scrolled = window.scrollY;
        heroRef.current.style.transform = `translateY(${scrolled * 0.3}px)`;
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-black overflow-hidden">
      {/* Animated Background Orbs */}
      <div
        className="fixed inset-0 pointer-events-none z-0 transition-opacity duration-500"
        style={{ opacity: isLoaded ? 1 : 0 }}
      >
        <div
          className="absolute w-[600px] h-[600px] rounded-full blur-[100px] transition-transform duration-1000"
          style={{
            background: 'radial-gradient(circle, rgba(111,78,124,0.15) 0%, transparent 70%)',
            left: mousePosition.x - 300,
            top: mousePosition.y - 300,
          }}
        />
        <div
          className="absolute w-[400px] h-[400px] rounded-full blur-[80px]"
          style={{
            background: 'radial-gradient(circle, rgba(214,197,220,0.1) 0%, transparent 70%)',
            right: '10%',
            top: '20%',
          }}
        />
        <div
          className="absolute w-[300px] h-[300px] rounded-full blur-[60px] animate-pulse"
          style={{
            background: 'radial-gradient(circle, rgba(111,78,124,0.2) 0%, transparent 70%)',
            left: '5%',
            bottom: '30%',
          }}
        />
      </div>

      {/* Grid Pattern Overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-5"
        style={{
          backgroundImage: `linear-gradient(rgba(214,197,220,0.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(214,197,220,0.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px',
        }}
      />

      {/* Hero Section */}
      <section className="relative pt-24 pb-12 sm:pt-32 sm:pb-16 overflow-hidden">
        <div ref={heroRef} className="absolute inset-0 z-0">
          {/* Floating Shapes */}
          <div className="absolute top-20 left-[10%] w-20 h-20 border border-burnt-lilac/20 rounded-full animate-float" />
          <div className="absolute top-40 right-[15%] w-32 h-32 border border-mist-lilac/10 rounded-full animate-float" style={{ animationDelay: '1s' }} />
          <div className="absolute bottom-20 left-[20%] w-16 h-16 bg-burnt-lilac/5 rounded-lg rotate-45 animate-float" style={{ animationDelay: '2s' }} />
          <div className="absolute top-32 left-[40%] w-8 h-8 bg-mist-lilac/10 rounded-full animate-pulse" />
          <div className="absolute bottom-32 right-[30%] w-24 h-24 border border-burnt-lilac/10 rotate-12 animate-float" style={{ animationDelay: '1.5s' }} />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Breadcrumb */}
            <nav 
              className={`flex items-center justify-center gap-2 text-sm text-mist-lilac/60 mb-8 transition-all duration-700 ${
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              <Link href="/" className="hover:text-burnt-lilac transition-colors">Home</Link>
              <span>/</span>
              <span className="text-mist-lilac">Cart</span>
            </nav>

            {/* Animated Shopping Bag Icon */}
            <div 
              className={`relative mx-auto w-24 h-24 mb-8 transition-all duration-700 delay-100 ${
                isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
              }`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-burnt-lilac/30 to-mist-lilac/20 rounded-2xl rotate-6 animate-pulse" />
              <div className="absolute inset-0 bg-gradient-to-br from-deep-purple/80 to-burnt-lilac/50 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/10">
                <svg className="w-12 h-12 text-mist-lilac" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              {/* Item count badge */}
              {itemCount > 0 && (
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-burnt-lilac rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-burnt-lilac/50 animate-bounce">
                  {itemCount}
                </div>
              )}
            </div>

            <h1 
              className={`text-4xl sm:text-5xl md:text-6xl font-serif mb-4 transition-all duration-700 delay-200 ${
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              <span className="bg-gradient-to-r from-white via-purple-200 to-burnt-lilac bg-clip-text text-transparent">
                Shopping Cart
              </span>
            </h1>
            <p 
              className={`text-mist-lilac/70 max-w-2xl mx-auto text-base sm:text-lg transition-all duration-700 delay-300 ${
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              Review your selections before proceeding to checkout
            </p>

            {/* Decorative Line */}
            <div 
              className={`mt-8 flex items-center justify-center gap-4 transition-all duration-700 delay-400 ${
                isLoaded ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <div className="h-px w-16 bg-gradient-to-r from-transparent to-burnt-lilac/50" />
              <div className="w-2 h-2 rounded-full bg-burnt-lilac animate-pulse" />
              <div className="h-px w-16 bg-gradient-to-l from-transparent to-burnt-lilac/50" />
            </div>
          </div>
        </div>
      </section>

      {/* Cart Content Section */}
      <section className="relative z-10 py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Glassmorphic Container */}
          <div 
            className={`bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-4 sm:p-8 transition-all duration-700 delay-500 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <CartPageContent />
          </div>
        </div>
      </section>

      {/* Continue Shopping Section */}
      <section className="relative z-10 pb-16 sm:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div 
            className={`text-center transition-all duration-700 delay-600 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <h2 className="text-xl sm:text-2xl font-serif text-mist-lilac mb-4">
              Looking for more?
            </h2>
            <p className="text-mist-lilac/60 mb-8 max-w-lg mx-auto">
              Discover our latest collections and exclusive styles
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link 
                href="/products" 
                className="group relative px-8 py-3 bg-gradient-to-r from-burnt-lilac to-purple-600 rounded-xl text-white font-medium overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-burnt-lilac/30 hover:scale-105"
              >
                <span className="relative z-10">Browse Products</span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-burnt-lilac opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Link>
              <Link 
                href="/collections/new-arrivals" 
                className="px-8 py-3 bg-white/5 backdrop-blur-sm rounded-xl text-mist-lilac font-medium border border-white/10 hover:bg-white/10 hover:border-burnt-lilac/30 transition-all duration-300"
              >
                New Arrivals
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Decorative bottom fade */}
      <div className="fixed bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent pointer-events-none z-0" />
    </div>
  );
}
