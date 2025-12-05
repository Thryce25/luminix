'use client';

import Link from 'next/link';

const categories = [
  {
    id: 1,
    name: 'Anime Collection',
    description: 'One Piece, Dragon Ball & More',
    href: '/products?collection=anime-collection',
    gradient: 'from-purple-900 via-indigo-900 to-black',
    icon: '🔥',
    featured: true,
  },
  {
    id: 2,
    name: 'Hoodies',
    description: 'Premium Streetwear',
    href: '/products?type=Hoodie',
    gradient: 'from-slate-800 via-gray-900 to-black',
    icon: '🧥',
    featured: true,
  },
  {
    id: 3,
    name: 'Sweatshirts',
    description: 'Cozy & Stylish',
    href: '/products?type=Sweatshirt',
    gradient: 'from-rose-900 via-pink-900 to-black',
    icon: '👕',
  },
  {
    id: 4,
    name: 'T-Shirts',
    description: 'Everyday Essentials',
    href: '/products?type=T-Shirt',
    gradient: 'from-emerald-900 via-teal-900 to-black',
    icon: '👚',
  },
  {
    id: 5,
    name: "Women's",
    description: 'Boyfriend Tees & More',
    href: '/products?collection=womens-essentials',
    gradient: 'from-fuchsia-900 via-purple-900 to-black',
    icon: '👗',
  },
  {
    id: 6,
    name: 'Pajamas',
    description: 'Comfort Collection',
    href: '/products?type=Pajama',
    gradient: 'from-blue-900 via-cyan-900 to-black',
    icon: '🌙',
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
            Explore our premium streetwear collections
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
              {/* Gradient Background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient}`} />
              
              {/* Animated Background Pattern */}
              <div className="absolute inset-0 opacity-20">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_0%,transparent_50%)]" />
              </div>
              
              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-burnt-lilac/20 opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity duration-300" />

              {/* Content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center p-3 sm:p-4 text-center">
                {/* Icon */}
                <span className={`mb-2 sm:mb-3 transform group-hover:scale-125 transition-transform duration-300 ${
                  category.featured ? 'text-3xl sm:text-4xl lg:text-5xl' : 'text-2xl sm:text-3xl'
                }`}>
                  {category.icon}
                </span>
                
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
