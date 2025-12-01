'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import CartDrawer from '../cart/CartDrawer';
import SearchModal from './SearchModal';

const categories = [
  {
    name: 'New Arrivals',
    href: '/products?sort=newest',
    featured: true,
  },
  {
    name: 'Clothing',
    href: '/products?category=clothing',
    subcategories: ['Dresses', 'Tops', 'Bottoms', 'Outerwear'],
  },
  {
    name: 'Accessories',
    href: '/products?category=accessories',
    subcategories: ['Jewelry', 'Bags', 'Belts', 'Scarves'],
  },
  {
    name: 'Footwear',
    href: '/products?category=footwear',
    subcategories: ['Boots', 'Heels', 'Flats', 'Platforms'],
  },
  {
    name: 'Sale',
    href: '/products?sale=true',
    featured: true,
  },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const { cart, setCartOpen } = useCart();

  const cartItemCount = cart?.totalQuantity || 0;

  return (
    <>
      {/* Promo Banner */}
      <div className="bg-linear-to-r from-deep-purple via-burnt-lilac to-deep-purple text-white text-center py-2 text-sm">
        <p>✨ Free Shipping on Orders Over $100 | Use Code: <span className="font-semibold">DARK20</span> for 20% Off ✨</p>
      </div>

      <header className="sticky top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-md border-b border-deep-purple/30">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-mist-lilac hover:text-burnt-lilac transition-colors"
              aria-label="Toggle menu"
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
              <span className="text-2xl lg:text-3xl font-serif font-bold gradient-text tracking-wider">
                LUMINIX
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              <NavLink href="/">Home</NavLink>
              {categories.map((category) => (
                <div
                  key={category.name}
                  className="relative"
                  onMouseEnter={() => setActiveCategory(category.name)}
                  onMouseLeave={() => setActiveCategory(null)}
                >
                  <NavLink href={category.href} featured={category.featured}>
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
              <NavLink href="/about">About</NavLink>
              <NavLink href="/contact">Contact</NavLink>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-2 lg:space-x-4">
              {/* Search Button */}
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 text-mist-lilac hover:text-burnt-lilac transition-colors"
                aria-label="Search"
              >
                <svg className="w-5 h-5 lg:w-6 lg:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>

              {/* Account Button */}
              <Link
                href="/account"
                className="hidden sm:block p-2 text-mist-lilac hover:text-burnt-lilac transition-colors"
                aria-label="Account"
              >
                <svg className="w-5 h-5 lg:w-6 lg:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </Link>

              {/* Wishlist Button */}
              <Link
                href="/wishlist"
                className="hidden sm:block p-2 text-mist-lilac hover:text-burnt-lilac transition-colors"
                aria-label="Wishlist"
              >
                <svg className="w-5 h-5 lg:w-6 lg:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </Link>

              {/* Cart Button */}
              <button
                onClick={() => setCartOpen(true)}
                className="relative p-2 text-mist-lilac hover:text-burnt-lilac transition-colors"
                aria-label="Shopping cart"
              >
                <svg className="w-5 h-5 lg:w-6 lg:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-burnt-lilac text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium animate-scale-in">
                    {cartItemCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="lg:hidden py-4 border-t border-deep-purple/30 animate-fade-in">
              <div className="flex flex-col space-y-1">
                <MobileNavLink href="/" onClick={() => setMobileMenuOpen(false)}>
                  Home
                </MobileNavLink>
                {categories.map((category) => (
                  <div key={category.name}>
                    <MobileNavLink href={category.href} onClick={() => setMobileMenuOpen(false)} featured={category.featured}>
                      {category.name}
                    </MobileNavLink>
                  </div>
                ))}
                <MobileNavLink href="/about" onClick={() => setMobileMenuOpen(false)}>
                  About
                </MobileNavLink>
                <MobileNavLink href="/contact" onClick={() => setMobileMenuOpen(false)}>
                  Contact
                </MobileNavLink>
                <div className="pt-4 border-t border-deep-purple/30 mt-4">
                  <MobileNavLink href="/account" onClick={() => setMobileMenuOpen(false)}>
                    My Account
                  </MobileNavLink>
                  <MobileNavLink href="/wishlist" onClick={() => setMobileMenuOpen(false)}>
                    Wishlist
                  </MobileNavLink>
                </div>
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

function NavLink({ href, children, featured }: { href: string; children: React.ReactNode; featured?: boolean }) {
  return (
    <Link
      href={href}
      className={`text-sm uppercase tracking-widest font-medium relative group transition-colors ${
        featured ? 'text-burnt-lilac hover:text-mist-lilac' : 'text-mist-lilac hover:text-burnt-lilac'
      }`}
    >
      {children}
      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-linear-to-r from-mist-lilac to-burnt-lilac transition-all group-hover:w-full" />
    </Link>
  );
}

function MobileNavLink({
  href,
  onClick,
  children,
  featured,
}: {
  href: string;
  onClick: () => void;
  children: React.ReactNode;
  featured?: boolean;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`block py-3 px-2 text-base uppercase tracking-wider font-medium transition-colors rounded-lg hover:bg-deep-purple/20 ${
        featured ? 'text-burnt-lilac' : 'text-mist-lilac'
      }`}
    >
      {children}
    </Link>
  );
}
