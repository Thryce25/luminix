'use client';

import Link from 'next/link';

const collections = [
  {
    id: 1,
    name: "Men's Fashion",
    description: 'Hoodies, Sweatshirts & T-Shirts',
    href: '/collections/mens-essentials',
    gradient: 'from-slate-800 via-gray-900 to-black',
    categories: [
      { name: 'Hoodies', href: '/collections/mens-essentials?type=Hoodie' },
      { name: 'Sweatshirts', href: '/collections/mens-essentials?type=Sweatshirt' },
      { name: 'T-Shirts', href: '/collections/mens-essentials?type=T-Shirt' },
    ],
  },
  {
    id: 2,
    name: 'New Arrivals',
    description: 'Latest Drops',
    href: '/collections/new-arrivals',
    gradient: 'from-purple-900 via-indigo-900 to-black',
    categories: [
      { name: 'All New', href: '/collections/new-arrivals' },
      { name: 'Hoodies', href: '/collections/new-arrivals?type=Hoodie' },
      { name: 'T-Shirts', href: '/collections/new-arrivals?type=T-Shirt' },
    ],
  },
  {
    id: 3,
    name: "Women's Fashion",
    description: 'Boyfriend Tees & More',
    href: '/collections/womens-essentials',
    gradient: 'from-rose-900 via-pink-900 to-black',
    categories: [
      { name: 'Boyfriend Tees', href: '/collections/womens-essentials?type=T-Shirt' },
      { name: 'Tops', href: '/collections/womens-essentials?type=Top' },
      { name: 'All', href: '/collections/womens-essentials' },
    ],
  },
];

export default function CategoryGrid() {
  return (
    <section className="py-12 sm:py-16 lg:py-24 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-mist-lilac mb-3 sm:mb-4">
            Shop by Collection
          </h2>
          <p className="text-mist-lilac/60 max-w-2xl mx-auto text-sm sm:text-base px-4">
            Explore our premium streetwear collections
          </p>
        </div>

        {/* 3 Column Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          {collections.map((collection) => (
            <div
              key={collection.id}
              className="group relative overflow-hidden rounded-lg aspect-4/3 sm:aspect-square lg:aspect-3/4"
            >
              {/* Gradient Background */}
              <div className={`absolute inset-0 bg-linear-to-br ${collection.gradient}`} />
              
              {/* Animated Background Pattern */}
              <div className="absolute inset-0 opacity-20">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_0%,transparent_50%)]" />
              </div>

              {/* Content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center p-4 sm:p-6 text-center">
                {/* Collection Title */}
                <Link 
                  href={collection.href}
                  className="hover:text-burnt-lilac transition-colors"
                >
                  <h3 className="font-serif text-mist-lilac text-xl sm:text-2xl lg:text-3xl mb-2">
                    {collection.name}
                  </h3>
                </Link>
                <p className="text-mist-lilac/60 text-xs sm:text-sm mb-4 sm:mb-6">
                  {collection.description}
                </p>

                {/* Category Links */}
                <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
                  {collection.categories.map((category) => (
                    <Link
                      key={category.name}
                      href={category.href}
                      className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm bg-white/10 hover:bg-burnt-lilac/80 text-mist-lilac hover:text-white rounded-full border border-mist-lilac/20 hover:border-burnt-lilac transition-all duration-300 touch-manipulation"
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>

                {/* View All Link */}
                <Link
                  href={collection.href}
                  className="mt-4 sm:mt-6 inline-flex items-center text-burnt-lilac hover:text-mist-lilac text-xs sm:text-sm transition-colors"
                >
                  View All
                  <svg className="w-3 h-3 sm:w-4 sm:h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>

              {/* Border Effect */}
              <div className="absolute inset-0 border border-mist-lilac/20 rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
