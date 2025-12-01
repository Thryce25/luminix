'use client';

import Link from 'next/link';
import Image from 'next/image';

const categories = [
  {
    id: 1,
    name: 'Women',
    description: 'Gothic elegance redefined',
    image: '/images/category-women.jpg',
    href: '/products?category=women',
    featured: true,
  },
  {
    id: 2,
    name: 'Men',
    description: 'Dark sophistication',
    image: '/images/category-men.jpg',
    href: '/products?category=men',
    featured: true,
  },
  {
    id: 3,
    name: 'Accessories',
    description: 'Complete your look',
    image: '/images/category-accessories.jpg',
    href: '/products?category=accessories',
  },
  {
    id: 4,
    name: 'Jewelry',
    description: 'Mystical adornments',
    image: '/images/category-jewelry.jpg',
    href: '/products?category=jewelry',
  },
  {
    id: 5,
    name: 'Home',
    description: 'Dark decor',
    image: '/images/category-home.jpg',
    href: '/products?category=home',
  },
  {
    id: 6,
    name: 'Sale',
    description: 'Up to 60% off',
    image: '/images/category-sale.jpg',
    href: '/products?sale=true',
    badge: 'HOT',
  },
];

export default function CategoryGrid() {
  return (
    <section className="py-12 sm:py-16 lg:py-24 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-mist-lilac mb-3 sm:mb-4">
            Shop by Category
          </h2>
          <p className="text-mist-lilac/60 max-w-2xl mx-auto text-sm sm:text-base px-4">
            Explore our dark collections curated for the modern gothic soul
          </p>
        </div>

        {/* Mobile: 2 columns, Tablet: 3 columns, Desktop: 6 columns */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 lg:gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={category.href}
              className={`group relative overflow-hidden rounded-lg touch-manipulation ${
                category.featured 
                  ? 'aspect-square sm:aspect-3/4 sm:col-span-1 lg:col-span-2 lg:row-span-2' 
                  : 'aspect-square sm:aspect-3/4'
              }`}
            >
              {/* Background Placeholder */}
              <div className="absolute inset-0 bg-linear-to-br from-deep-purple/40 to-black/60" />
              
              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-burnt-lilac/20 opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity duration-300" />

              {/* Content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center p-3 sm:p-4 text-center">
                {category.badge && (
                  <span className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-red-600 text-white text-[10px] sm:text-xs font-bold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded">
                    {category.badge}
                  </span>
                )}
                
                <div className="transform group-hover:scale-110 group-active:scale-105 transition-transform duration-300">
                  <h3 className={`font-serif text-mist-lilac mb-1 sm:mb-2 ${
                    category.featured ? 'text-lg sm:text-xl lg:text-2xl xl:text-3xl' : 'text-base sm:text-lg lg:text-xl'
                  }`}>
                    {category.name}
                  </h3>
                  <p className={`text-mist-lilac/60 ${
                    category.featured ? 'text-xs sm:text-sm' : 'text-[10px] sm:text-xs hidden sm:block'
                  }`}>
                    {category.description}
                  </p>
                </div>

                <span className="mt-2 sm:mt-4 inline-flex items-center text-burnt-lilac text-xs sm:text-sm opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity duration-300">
                  Shop Now
                  <svg className="w-3 h-3 sm:w-4 sm:h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </div>

              {/* Border Effect */}
              <div className="absolute inset-0 border border-mist-lilac/20 rounded-lg group-hover:border-burnt-lilac/50 group-active:border-burnt-lilac/50 transition-colors duration-300" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
