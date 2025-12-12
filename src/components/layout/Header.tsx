'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import CartDrawer from '../cart/CartDrawer';
import SearchModal from './SearchModal';

const collections = [
  {
    name: "Men's Collection",
    href: '/collections/mens-essentials',
    description: 'Refined essentials',
    subcategories: [
      { name: 'View All', href: '/collections/mens-essentials' },
      { name: 'Hoodies', href: '/collections/mens-essentials?type=Hoodie' },
      { name: 'Sweatshirts', href: '/collections/mens-essentials?type=Sweatshirt' },
      { name: 'T-Shirts', href: '/collections/mens-essentials?type=T-Shirt' },
    ],
  },
  {
    name: 'New Arrivals',
    href: '/collections/new-arrivals',
    description: 'Latest drops',
    subcategories: [
      { name: 'View All', href: '/collections/new-arrivals' },
      { name: 'Hoodies', href: '/collections/new-arrivals?type=Hoodie' },
      { name: 'T-Shirts', href: '/collections/new-arrivals?type=T-Shirt' },
    ],
  },
  {
    name: "Women's Collection",
    href: '/collections/womens-essentials',
    description: 'Curated pieces',
    subcategories: [
      { name: 'View All', href: '/collections/womens-essentials' },
      { name: 'Boyfriend Tees', href: '/collections/womens-essentials?type=T-Shirt' },
      { name: 'Tops', href: '/collections/womens-essentials?type=Top' },
    ],
  },
  {
    name: 'Shop All',
    href: '/products',
    description: 'Full catalog',
  },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [expandedMobileCategory, setExpandedMobileCategory] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const { cart, setCartOpen } = useCart();
  const { user } = useAuth();
  const isAuthenticated = !!user;

  const cartItemCount = cart?.totalQuantity || 0;

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  const toggleMobileCategory = (categoryName: string) => {
    setExpandedMobileCategory(expandedMobileCategory === categoryName ? null : categoryName);
  };

  return (
    <>
      <header className="sticky top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-md border-b border-deep-purple/30">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16 lg:h-20">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 -ml-2 text-mist-lilac hover:text-burnt-lilac transition-colors touch-manipulation"
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>

            {/* Logo */}
            <Link href="/" className="flex items-center group">
              <span className="text-xl sm:text-2xl lg:text-3xl font-[family-name:var(--font-bodoni)] gradient-text tracking-wider">
                LUMINIX
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              {collections.map((collection) => (
                <div
                  key={collection.name}
                  className="relative group"
                >
                  <Link
                    href={collection.href}
                    className="text-sm uppercase tracking-widest font-medium relative transition-colors text-mist-lilac hover:text-burnt-lilac flex items-center gap-1 py-4"
                  >
                    {collection.name}
                    {collection.subcategories && (
                      <svg 
                        className="w-3 h-3 transition-transform duration-200 group-hover:rotate-180" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    )}
                    <span className="absolute bottom-3 left-0 w-0 h-0.5 bg-linear-to-r from-mist-lilac to-burnt-lilac transition-all group-hover:w-full" />
                  </Link>
                  
                  {/* Dropdown Menu */}
                  {collection.subcategories && (
                    <div 
                      className="absolute top-full left-1/2 -translate-x-1/2 pt-2 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50"
                    >
                      <div className="bg-black/95 backdrop-blur-md border border-deep-purple/30 rounded-lg shadow-2xl py-2">
                        {/* Arrow */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-black/95 border-l border-t border-deep-purple/30 rotate-45" />
                        
                        <div className="relative">
                          {collection.subcategories.map((sub) => (
                            <Link
                              key={sub.name}
                              href={sub.href}
                              className="block px-4 py-2.5 text-sm text-mist-lilac/80 hover:text-mist-lilac hover:bg-deep-purple/30 transition-colors"
                            >
                              {sub.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-1 sm:space-x-2 lg:space-x-4">
              {/* Search Button */}
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2.5 sm:p-2 text-mist-lilac hover:text-burnt-lilac transition-colors touch-manipulation"
                aria-label="Search"
              >
                <svg className="w-5 h-5 sm:w-5 sm:h-5 lg:w-6 lg:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>

              {/* Account Button */}
              <Link
                href="/account"
                className="p-2.5 sm:p-2 text-mist-lilac hover:text-burnt-lilac transition-colors touch-manipulation relative"
                aria-label={isAuthenticated ? 'My Account' : 'Sign In'}
              >
                <svg className="w-5 h-5 sm:w-5 sm:h-5 lg:w-6 lg:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                {isAuthenticated && (
                  <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-green-500 rounded-full" />
                )}
              </Link>

              {/* Cart Button */}
              <button
                onClick={() => setCartOpen(true)}
                className="relative p-2.5 sm:p-2 text-mist-lilac hover:text-burnt-lilac transition-colors touch-manipulation"
                aria-label="Shopping cart"
              >
                <svg className="w-5 h-5 sm:w-5 sm:h-5 lg:w-6 lg:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                {cartItemCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 sm:-top-1 sm:-right-1 bg-burnt-lilac text-white text-[10px] sm:text-xs min-w-4.5 sm:min-w-5 h-4.5 sm:h-5 rounded-full flex items-center justify-center font-medium animate-scale-in">
                    {cartItemCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile Menu - Premium Full Screen Experience */}
      <div 
        className={`lg:hidden fixed inset-0 z-100 transition-opacity duration-500 ${mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      >
        {/* Sophisticated Dark Backdrop */}
        <div 
          className="absolute inset-0"
          onClick={() => setMobileMenuOpen(false)}
        >
          {/* Deep black background */}
          <div className="absolute inset-0 bg-[#0a0a0a]" />
          
          {/* Subtle ambient glow - reduced blur for mobile performance */}
          <div className={`absolute inset-0 transition-opacity duration-500 ${mobileMenuOpen ? 'opacity-100' : 'opacity-0'}`}>
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-burnt-lilac/6 rounded-full blur-[80px]" />
          </div>
        </div>
        
        {/* Menu Container */}
        <div 
          ref={menuRef}
          className="absolute inset-0 flex flex-col"
        >
          {/* Header */}
          <div className={`relative flex items-center justify-between px-6 py-5 transition-all duration-500 ${mobileMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'}`}>
            <span className="text-2xl font-[family-name:var(--font-bodoni)] tracking-[0.2em] text-white/90">LUMINIX</span>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="relative w-10 h-10 flex items-center justify-center touch-manipulation group"
              aria-label="Close menu"
            >
              <div className="absolute inset-0 rounded-full border border-white/10 group-active:border-white/20 group-active:bg-white/5 transition-all" />
              <svg className="w-5 h-5 text-white/60 group-active:text-white/80 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Divider line with fade */}
          <div className={`mx-6 h-px bg-linear-to-r from-transparent via-white/10 to-transparent transition-all duration-700 delay-100 ${mobileMenuOpen ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'}`} />
          
          {/* Main Navigation */}
          <nav className="flex-1 overflow-y-auto px-6 py-10">
            <div className="space-y-2">
              {collections.map((collection, index) => (
                <div 
                  key={collection.name}
                  className={`transition-all duration-700 ease-out ${mobileMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
                  style={{ transitionDelay: `${200 + index * 100}ms` }}
                >
                  {collection.subcategories ? (
                    <div>
                      <button
                        onClick={() => toggleMobileCategory(collection.name)}
                        className="w-full group py-4 touch-manipulation"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h2 className="text-xl font-light tracking-wide text-white/90 group-active:text-white transition-colors text-left">
                              {collection.name}
                            </h2>
                            <p className="text-xs tracking-widest uppercase text-white/30 mt-1 text-left">
                              {collection.description}
                            </p>
                          </div>
                          <div className={`w-8 h-8 rounded-full border border-white/10 flex items-center justify-center transition-all duration-500 ${expandedMobileCategory === collection.name ? 'rotate-180 border-white/20 bg-white/5' : ''}`}>
                            <svg className="w-3.5 h-3.5 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </div>
                        
                        {/* Underline animation */}
                        <div className="mt-4 h-px w-full bg-white/5 relative overflow-hidden">
                          <div className={`absolute inset-y-0 left-0 bg-linear-to-r from-burnt-lilac/50 to-transparent transition-all duration-500 ${expandedMobileCategory === collection.name ? 'w-full' : 'w-0'}`} />
                        </div>
                      </button>
                      
                      {/* Subcategories */}
                      <div className={`overflow-hidden transition-all duration-500 ease-out ${expandedMobileCategory === collection.name ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'}`}>
                        <div className="py-4 pl-4 space-y-1">
                          {collection.subcategories.map((sub, subIndex) => (
                            <Link
                              key={sub.name}
                              href={sub.href}
                              onClick={() => setMobileMenuOpen(false)}
                              className={`block py-3 text-white/50 hover:text-white/90 active:text-white transition-all duration-300 touch-manipulation ${expandedMobileCategory === collection.name ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'}`}
                              style={{ transitionDelay: `${subIndex * 50}ms` }}
                            >
                              <span className="text-sm tracking-wide">{sub.name}</span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <Link
                      href={collection.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block py-4 group touch-manipulation"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h2 className="text-xl font-light tracking-wide text-white/90 group-active:text-white transition-colors">
                            {collection.name}
                          </h2>
                          <p className="text-xs tracking-widest uppercase text-white/30 mt-1">
                            {collection.description}
                          </p>
                        </div>
                        <svg className="w-5 h-5 text-white/20 group-active:text-white/40 group-active:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </div>
                      <div className="mt-4 h-px w-full bg-white/5" />
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </nav>
          
          {/* Footer Actions */}
          <div className={`px-6 py-8 border-t border-white/5 transition-all duration-700 ${mobileMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`} style={{ transitionDelay: '600ms' }}>
            <div className="flex items-center justify-between">
              {/* Quick Actions */}
              <div className="flex items-center gap-6">
                <button
                  onClick={() => { setMobileMenuOpen(false); setSearchOpen(true); }}
                  className="flex items-center gap-3 text-white/40 active:text-white/70 transition-colors touch-manipulation"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <span className="text-xs tracking-widest uppercase">Search</span>
                </button>
              </div>
              
              {/* Cart & Wishlist */}
              <div className="flex items-center gap-4">
                <Link
                  href="/wishlist"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/40 active:text-white/70 active:border-white/20 transition-all touch-manipulation"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </Link>
                <button
                  onClick={() => { setMobileMenuOpen(false); setCartOpen(true); }}
                  className="relative w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/40 active:text-white/70 active:border-white/20 transition-all touch-manipulation"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  {cartItemCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-white text-black text-[9px] font-medium rounded-full flex items-center justify-center">
                      {cartItemCount}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <CartDrawer />
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
