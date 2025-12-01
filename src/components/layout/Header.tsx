'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import CartDrawer from '../cart/CartDrawer';
import SearchModal from './SearchModal';

const categories = [
  {
    name: 'New Arrivals',
    href: '/products?sort=newest',
  },
  {
    name: 'Men',
    href: '/products?category=men',
    subcategories: ['Shirts', 'T-Shirts', 'Jeans', 'Trousers', 'Jackets', 'Hoodies'],
  },
  {
    name: 'Women',
    href: '/products?category=women',
    subcategories: ['Shirts', 'T-Shirts', 'Dresses', 'Jeans', 'Tops', 'Jackets'],
  },
  {
    name: 'Store',
    href: '/products',
  },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
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
              {categories.map((category) => (
                <div
                  key={category.name}
                  className="relative"
                  onMouseEnter={() => setActiveCategory(category.name)}
                  onMouseLeave={() => setActiveCategory(null)}
                >
                  <NavLink href={category.href}>
                    {category.name}
                  </NavLink>
                  
                  {/* Dropdown Menu */}
                  {category.subcategories && activeCategory === category.name && (
                    <div className="absolute top-full left-0 mt-2 w-48 bg-black/95 border border-deep-purple/30 rounded-lg shadow-xl py-2 animate-fade-in">
                      {category.subcategories.map((sub) => (
                        <Link
                          key={sub}
                          href={`${category.href}&sub=${sub.toLowerCase()}`}
                          className="block px-4 py-2 text-sm text-mist-lilac/80 hover:text-mist-lilac hover:bg-deep-purple/20 transition-colors"
                        >
                          {sub}
                        </Link>
                      ))}
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
                  <span className="absolute top-0.5 right-0.5 sm:-top-1 sm:-right-1 bg-burnt-lilac text-white text-[10px] sm:text-xs min-w-[18px] sm:min-w-[20px] h-[18px] sm:h-[20px] rounded-full flex items-center justify-center font-medium animate-scale-in">
                    {cartItemCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu - Full Screen Overlay */}
          {mobileMenuOpen && (
            <div className="lg:hidden fixed inset-0 top-14 sm:top-16 bg-black z-40 animate-fade-in overflow-y-auto">
              <div className="px-4 py-6 space-y-2 pb-24">
                {categories.map((category) => (
                  <div key={category.name} className="border-b border-deep-purple/20 last:border-0">
                    {category.subcategories ? (
                      <>
                        <button
                          onClick={() => toggleMobileCategory(category.name)}
                          className="flex items-center justify-between w-full py-4 text-lg uppercase tracking-wider font-medium text-mist-lilac touch-manipulation"
                        >
                          {category.name}
                          <svg
                            className={`w-5 h-5 transition-transform duration-300 ${
                              expandedMobileCategory === category.name ? 'rotate-180' : ''
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                        {expandedMobileCategory === category.name && (
                          <div className="pb-4 pl-4 space-y-1 animate-fade-in">
                            <Link
                              href={category.href}
                              onClick={() => setMobileMenuOpen(false)}
                              className="block py-3 text-base text-burnt-lilac touch-manipulation"
                            >
                              View All {category.name}
                            </Link>
                            {category.subcategories.map((sub) => (
                              <Link
                                key={sub}
                                href={`${category.href}&sub=${sub.toLowerCase()}`}
                                onClick={() => setMobileMenuOpen(false)}
                                className="block py-3 text-base text-mist-lilac/70 hover:text-mist-lilac transition-colors touch-manipulation"
                              >
                                {sub}
                              </Link>
                            ))}
                          </div>
                        )}
                      </>
                    ) : (
                      <Link
                        href={category.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className="block py-4 text-lg uppercase tracking-wider font-medium text-mist-lilac touch-manipulation"
                      >
                        {category.name}
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

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="text-sm uppercase tracking-widest font-medium relative group transition-colors text-mist-lilac hover:text-burnt-lilac"
    >
      {children}
      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-linear-to-r from-mist-lilac to-burnt-lilac transition-all group-hover:w-full" />
    </Link>
  );
}
