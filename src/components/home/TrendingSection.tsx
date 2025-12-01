'use client';

import Link from 'next/link';

const trendingItems = [
  {
    id: 1,
    title: 'Dark Academia',
    count: '248 Products',
    icon: '📚',
    href: '/products?style=dark-academia',
  },
  {
    id: 2,
    title: 'Victorian Gothic',
    count: '186 Products',
    icon: '🏰',
    href: '/products?style=victorian',
  },
  {
    id: 3,
    title: 'Witchy Vibes',
    count: '312 Products',
    icon: '🌙',
    href: '/products?style=witchy',
  },
  {
    id: 4,
    title: 'Punk Revival',
    count: '194 Products',
    icon: '⚡',
    href: '/products?style=punk',
  },
  {
    id: 5,
    title: 'Romantic Goth',
    count: '156 Products',
    icon: '🖤',
    href: '/products?style=romantic',
  },
  {
    id: 6,
    title: 'Cyber Goth',
    count: '98 Products',
    icon: '🔮',
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
    <section className="py-12 lg:py-16 bg-deep-purple/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Trending Styles */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-serif text-mist-lilac mb-2">
                Trending Styles
              </h2>
              <p className="text-mist-lilac/60 text-sm">
                Explore what's popular this season
              </p>
            </div>
            <Link
              href="/products"
              className="hidden sm:flex items-center gap-2 text-burnt-lilac hover:text-mist-lilac transition-colors"
            >
              View All
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {trendingItems.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className="group p-6 bg-black/40 rounded-xl border border-mist-lilac/10 hover:border-burnt-lilac/50 hover:bg-black/60 transition-all duration-300 text-center"
              >
                <span className="text-4xl mb-4 block group-hover:scale-110 transition-transform">
                  {item.icon}
                </span>
                <h3 className="font-medium text-mist-lilac mb-1 text-sm lg:text-base">
                  {item.title}
                </h3>
                <p className="text-mist-lilac/50 text-xs">
                  {item.count}
                </p>
              </Link>
            ))}
          </div>
        </div>

        {/* Trending Searches */}
        <div>
          <h3 className="text-xl font-serif text-mist-lilac mb-6 flex items-center gap-3">
            <svg className="w-5 h-5 text-burnt-lilac" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            Trending Searches
          </h3>
          <div className="flex flex-wrap gap-3">
            {trendingSearches.map((search, index) => (
              <Link
                key={index}
                href={`/products?search=${encodeURIComponent(search.toLowerCase())}`}
                className="px-4 py-2 bg-black/30 rounded-full text-mist-lilac/80 text-sm hover:bg-burnt-lilac/20 hover:text-mist-lilac border border-mist-lilac/10 hover:border-burnt-lilac/30 transition-all duration-300"
              >
                {search}
              </Link>
            ))}
          </div>
        </div>

        {/* Mobile View All Link */}
        <div className="mt-8 text-center sm:hidden">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-burnt-lilac"
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
