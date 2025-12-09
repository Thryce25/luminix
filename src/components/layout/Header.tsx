'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import CartDrawer from '../cart/CartDrawer';
import SearchModal from './SearchModal';

const collections = [
  {
    name: "Men's Fashion",
    href: '/collections/mens-essentials',
    subcategories: [
      { name: 'All', href: '/collections/mens-essentials' },
      { name: 'Hoodies', href: '/collections/mens-essentials?type=Hoodie' },
      { name: 'Sweatshirts', href: '/collections/mens-essentials?type=Sweatshirt' },
      { name: 'T-Shirts', href: '/collections/mens-essentials?type=T-Shirt' },
    ],
  },
  {
    name: 'New Arrivals',
    href: '/collections/new-arrivals',
    subcategories: [
      { name: 'All New', href: '/collections/new-arrivals' },
      { name: 'Hoodies', href: '/collections/new-arrivals?type=Hoodie' },
      { name: 'T-Shirts', href: '/collections/new-arrivals?type=T-Shirt' },
    ],
  },
  {
    name: "Women's Fashion",
    href: '/collections/womens-essentials',
    subcategories: [
      { name: 'All', href: '/collections/womens-essentials' },
      { name: 'Boyfriend Tees', href: '/collections/womens-essentials?type=T-Shirt' },
      { name: 'Tops', href: '/collections/womens-essentials?type=Top' },
    ],
  },
  {
    name: 'All Products',
    href: '/products',
  },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [expandedMobileCategory, setExpandedMobileCategory] = useState<string | null>(null);
  const { cart, setCartOpen } = useCart();

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
              <span className="text-xl sm:text-2xl lg:text-3xl font-serif font-bold gradient-text tracking-wider">
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

          {/* Mobile Menu - Full Screen Overlay */}
          {mobileMenuOpen && (
            <div className="lg:hidden fixed inset-0 top-14 sm:top-16 bg-black z-40 overflow-y-auto">
              <div className="px-4 py-6 space-y-1 pb-24">
                {collections.map((collection) => (
                  <div key={collection.name} className="border-b border-deep-purple/20 last:border-0">
                    {collection.subcategories ? (
                      <>
                        <button
                          onClick={() => toggleMobileCategory(collection.name)}
                          className="flex items-center justify-between w-full py-4 text-lg uppercase tracking-wider font-medium text-mist-lilac touch-manipulation"
                        >
                          {collection.name}
                          <svg
                            className={`w-5 h-5 transition-transform duration-300 ${
                              expandedMobileCategory === collection.name ? 'rotate-180' : ''
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                        
                        {/* Expanded subcategories */}
                        <div 
                          className={`overflow-hidden transition-all duration-300 ${
                            expandedMobileCategory === collection.name ? 'max-h-96 pb-4' : 'max-h-0'
                          }`}
                        >
                          <div className="pl-4 space-y-1">
                            {collection.subcategories.map((sub) => (
                              <Link
                                key={sub.name}
                                href={sub.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className="block py-3 text-base text-mist-lilac/70 hover:text-burnt-lilac transition-colors touch-manipulation"
                              >
                                {sub.name}
                              </Link>
                            ))}
                          </div>
                        </div>
                      </>
                    ) : (
                      <Link
                        href={collection.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className="block py-4 text-lg uppercase tracking-wider font-medium text-mist-lilac touch-manipulation"
                      >
                        {collection.name}
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </nav>
      </header>

      <CartDrawer />
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
