'use client';

import Link from 'next/link';

const trendingItems = [
  {
    id: 1,
    title: 'Dark Academia',
    count: '248 Products',
    href: '/products?style=dark-academia',
  },
  {
    id: 2,
    title: 'Victorian Gothic',
    count: '186 Products',
    href: '/products?style=victorian',
  },
  {
    id: 3,
    title: 'Witchy Vibes',
    count: '312 Products',
    href: '/products?style=witchy',
  },
  {
    id: 4,
    title: 'Punk Revival',
    count: '194 Products',
    href: '/products?style=punk',
  },
  {
    id: 5,
    title: 'Romantic Goth',
    count: '156 Products',
    href: '/products?style=romantic',
  },
  {
    id: 6,
    title: 'Cyber Goth',
    count: '98 Products',
    href: '/products?style=cyber',
  },
];

const trendingSearches = [
  'Black dresses',
  'Velvet tops',
  'Platform boots',
  'Silver jewelry',
  'Lace accessories',
  'Corset tops',
  'Gothic rings',
  'Chokers',
];

export default function TrendingSection() {
  return (
    <section className="py-8 sm:py-12 lg:py-16 bg-deep-purple/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Trending Styles */}
        <div className="mb-10 sm:mb-16">
          <div className="flex items-center justify-between mb-5 sm:mb-8">
            <div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-serif text-mist-lilac mb-1 sm:mb-2">
                Trending Styles
              </h2>
              <p className="text-mist-lilac/60 text-xs sm:text-sm">
                Explore what's popular this season
              </p>
            </div>
            <Link
              href="/products"
              className="hidden sm:flex items-center gap-2 text-burnt-lilac hover:text-mist-lilac transition-colors text-sm"
            >
              View All
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3 lg:gap-4">
            {trendingItems.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className="group p-4 sm:p-5 lg:p-6 bg-black/40 rounded-lg sm:rounded-xl border border-mist-lilac/10 hover:border-burnt-lilac/50 active:bg-black/80 hover:bg-black/60 transition-all duration-300 text-center touch-manipulation"
              >
                <h3 className="font-medium text-mist-lilac mb-0.5 sm:mb-1 text-xs sm:text-sm lg:text-base group-hover:text-burnt-lilac transition-colors">
                  {item.title}
                </h3>
                <p className="text-mist-lilac/50 text-[10px] sm:text-xs">
                  {item.count}
                </p>
              </Link>
            ))}
          </div>
        </div>

        {/* Trending Searches */}
        <div>
          <h3 className="text-base sm:text-lg lg:text-xl font-serif text-mist-lilac mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-burnt-lilac" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            Trending Searches
          </h3>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {trendingSearches.map((search, index) => (
              <Link
                key={index}
                href={`/products?search=${encodeURIComponent(search.toLowerCase())}`}
                className="px-3 sm:px-4 py-1.5 sm:py-2 bg-black/30 rounded-full text-mist-lilac/80 text-xs sm:text-sm hover:bg-burnt-lilac/20 active:bg-burnt-lilac/30 hover:text-mist-lilac border border-mist-lilac/10 hover:border-burnt-lilac/30 transition-all duration-300 touch-manipulation"
              >
                {search}
              </Link>
            ))}
          </div>
        </div>

        {/* Mobile View All Link */}
        <div className="mt-6 sm:mt-8 text-center sm:hidden">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-burnt-lilac text-sm touch-manipulation"
          >
            View All Styles
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
