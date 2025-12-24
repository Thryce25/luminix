'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { ShopifyProduct } from '@/lib/shopify';
import { useCart } from '@/context/CartContext';

interface CollectionInfo {
  title: string;
  description: string;
  gradient: string;
  bgPattern: string;
}

interface CollectionPageClientProps {
  handle: string;
  info: CollectionInfo;
  products: ShopifyProduct[];
  productTypes: string[];
  currentType?: string;
  currentSort: string;
}

const sortOptions = [
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'best-selling', label: 'Best Selling' },
];

export default function CollectionPageClient({
  handle,
  info,
  products,
  productTypes,
  currentType,
  currentSort,
}: CollectionPageClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [isAnimating, setIsAnimating] = useState(true);
  const [activeFilter, setActiveFilter] = useState(currentType || 'all');
  const [sortBy, setSortBy] = useState(currentSort);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const sortDropdownRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  // Initial animation
  useEffect(() => {
    const timer = setTimeout(() => setIsAnimating(false), 100);
    return () => clearTimeout(timer);
  }, []);

  // Filter products when type changes
  useEffect(() => {
    console.log('🎨 CollectionPageClient filtering:', {
      activeFilter,
      totalProducts: products.length,
      productTypes: products.map(p => p.productType)
    });
    
    if (activeFilter === 'all') {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(p => {
        const productType = p.productType?.toLowerCase().replace(/\s+/g, '-') || '';
        const filter = activeFilter.toLowerCase().replace(/\s+/g, '-');
        const productTitle = p.title.toLowerCase();
        
        console.log('🔍 Client filtering:', {
          product: p.title,
          productType: p.productType,
          normalizedProductType: productType,
          filter: activeFilter,
          normalizedFilter: filter
        });
        
        // If productType is empty, fall back to title matching
        if (!productType || productType === '') {
          console.log('⚠️ Empty productType, using title matching');
          
          const titleKeywords: Record<string, string[]> = {
            't-shirt': ['t-shirt', 'tshirt', 'tee'],
            't-shirts': ['t-shirt', 'tshirt', 'tee'],
            'shirt': ['shirt'],
            'shirts': ['shirt'],
            'hoodie': ['hoodie'],
            'hoodies': ['hoodie'],
            'sweatshirt': ['sweatshirt'],
            'sweatshirts': ['sweatshirt'],
            'top': ['top', 'crop top'],
            'tops': ['top', 'crop top'],
            'pants': ['pant', 'trouser', 'bottom'],
            'bottoms': ['pant', 'trouser', 'bottom', 'jogger'],
          };
          
          const keywords = titleKeywords[filter] || [filter];
          
          for (const keyword of keywords) {
            if (productTitle.includes(keyword)) {
              // Special case: don't match "t-shirt" when looking for "shirt"
              if (filter === 'shirt' || filter === 'shirts') {
                if (productTitle.includes('t-shirt') || productTitle.includes('tshirt') || productTitle.includes('tee')) {
                  console.log('❌ Title contains t-shirt, not a regular shirt');
                  continue;
                }
              }
              console.log('✅ Title match:', p.title);
              return true;
            }
          }
          console.log('❌ No title match:', p.title);
          return false;
        }
        
        // Direct match
        if (productType === filter) {
          console.log('✅ Direct match:', p.title);
          return true;
        }
        
        // Handle variations (e.g., 't-shirt' should match 't-shirts')
        const typeVariations: Record<string, string[]> = {
          't-shirt': ['t-shirt', 't-shirts', 'tshirt', 'tshirts', 'tee', 'tees'],
          't-shirts': ['t-shirt', 't-shirts', 'tshirt', 'tshirts', 'tee', 'tees'],
          'shirt': ['shirt', 'shirts'],
          'shirts': ['shirt', 'shirts'],
          'hoodie': ['hoodie', 'hoodies'],
          'hoodies': ['hoodie', 'hoodies'],
          'sweatshirt': ['sweatshirt', 'sweatshirts'],
          'sweatshirts': ['sweatshirt', 'sweatshirts'],
          'top': ['top', 'tops'],
          'tops': ['top', 'tops'],
          'pants': ['pants', 'pant', 'trousers', 'bottoms', 'joggers'],
          'bottoms': ['pants', 'pant', 'trousers', 'bottoms', 'joggers'],
        };
        
        const filterVariations = typeVariations[filter] || [filter];
        const productVariations = typeVariations[productType] || [productType];
        
        const matches = filterVariations.some(fv => productVariations.includes(fv));
        console.log(matches ? '✅ Variation match:' : '❌ No match:', p.title);
        return matches;
      });
      
      console.log('📦 Filtered results:', filtered.length, 'products');
      setFilteredProducts(filtered);
    }
  }, [activeFilter, products]);

  // Update URL when filters change
  const updateFilters = (type: string) => {
    setActiveFilter(type);
    const params = new URLSearchParams(searchParams.toString());
    if (type === 'all') {
      params.delete('type');
    } else {
      params.set('type', type);
    }
    router.push(`/collections/${handle}?${params.toString()}`, { scroll: false });
  };

  const updateSort = (sort: string) => {
    setSortBy(sort);
    const params = new URLSearchParams(searchParams.toString());
    params.set('sort', sort);
    router.push(`/collections/${handle}?${params.toString()}`, { scroll: false });
  };

  // Parallax effect on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current) {
        const scrolled = window.scrollY;
        heroRef.current.style.transform = `translateY(${scrolled * 0.4}px)`;
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close sort dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target as Node)) {
        setSortDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSortSelect = (value: string) => {
    updateSort(value);
    setSortDropdownOpen(false);
  };

  const currentSortOption = sortOptions.find(opt => opt.value === sortBy) || sortOptions[0];

  return (
    <div className="min-h-screen bg-black overflow-hidden">
      {/* Animated Hero Section */}
      <section className={`relative h-[50vh] sm:h-[60vh] overflow-hidden`}>
        {/* Parallax Background */}
        <div 
          ref={heroRef}
          className={`absolute inset-0 bg-linear-to-br ${info.gradient}`}
        >
          {/* Animated Particles */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-white/10 rounded-full animate-float"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 5}s`,
                  animationDuration: `${5 + Math.random() * 10}s`,
                }}
              />
            ))}
          </div>
          
          {/* Gradient Orbs */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-burnt-lilac/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-mist-lilac/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          
          {/* Grid Pattern Overlay */}
          <div 
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                               linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
              backgroundSize: '50px 50px',
            }}
          />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
          <h1 
            className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif text-white mb-4 sm:mb-6 transition-all duration-1000 ${
              isAnimating ? 'opacity-0 translate-y-10' : 'opacity-100 translate-y-0'
            }`}
          >
            {info.title}
          </h1>
          <p 
            className={`text-mist-lilac/80 max-w-2xl text-sm sm:text-base md:text-lg transition-all duration-1000 delay-200 ${
              isAnimating ? 'opacity-0 translate-y-10' : 'opacity-100 translate-y-0'
            }`}
          >
            {info.description}
          </p>
          
          {/* Product Count Badge */}
          <div 
            className={`mt-6 sm:mt-8 px-6 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 transition-all duration-1000 delay-300 ${
              isAnimating ? 'opacity-0 scale-90' : 'opacity-100 scale-100'
            }`}
          >
            <span className="text-white text-sm">{filteredProducts.length} Products</span>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Filters Bar */}
      <section className="sticky top-14 sm:top-16 lg:top-20 z-40 bg-black/95 backdrop-blur-md border-b border-deep-purple/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            {/* Category Filters */}
            <div className="flex flex-wrap gap-2">
              <FilterButton
                active={activeFilter === 'all'}
                onClick={() => updateFilters('all')}
              >
                All
              </FilterButton>
              {productTypes.map((type) => (
                <FilterButton
                  key={type}
                  active={activeFilter === type}
                  onClick={() => updateFilters(type)}
                >
                  {type}
                </FilterButton>
              ))}
            </div>

            {/* Sort & View Options */}
            <div className="flex items-center gap-3">
              {/* Modern Sort Dropdown */}
              <div className="relative" ref={sortDropdownRef}>
                <button
                  onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
                  className="group flex items-center gap-2 px-4 py-2.5 bg-linear-to-r from-deep-purple/40 to-deep-purple/20 border border-mist-lilac/20 hover:border-burnt-lilac/50 rounded-xl text-mist-lilac text-sm transition-all duration-300 hover:shadow-lg hover:shadow-burnt-lilac/10"
                >
                  <span className="hidden sm:inline">{currentSortOption.label}</span>
                  <span className="sm:hidden">Sort</span>
                  <svg 
                    className={`w-4 h-4 transition-transform duration-300 ${sortDropdownOpen ? 'rotate-180' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                <div 
                  className={`absolute right-0 mt-2 w-56 py-2 bg-linear-to-b from-deep-purple to-[#0f0512] border border-mist-lilac/20 rounded-xl shadow-2xl shadow-black/50 backdrop-blur-xl z-50 transition-all duration-300 origin-top ${sortDropdownOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'}`}
                >
                  {sortOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleSortSelect(option.value)}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-all duration-200 ${sortBy === option.value ? 'bg-burnt-lilac/20 text-burnt-lilac' : 'text-mist-lilac/70 hover:bg-mist-lilac/5 hover:text-mist-lilac'}`}
                    >
                      <span>{option.label}</span>
                      {sortBy === option.value && (
                        <svg className="w-4 h-4 ml-auto text-burnt-lilac" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* View Toggle */}
              <div className="hidden sm:flex items-center gap-1 bg-deep-purple/30 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded transition-colors ${viewMode === 'grid' ? 'bg-burnt-lilac text-white' : 'text-mist-lilac/60 hover:text-mist-lilac'}`}
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M1 2.5A1.5 1.5 0 0 1 2.5 1h3A1.5 1.5 0 0 1 7 2.5v3A1.5 1.5 0 0 1 5.5 7h-3A1.5 1.5 0 0 1 1 5.5v-3zm8 0A1.5 1.5 0 0 1 10.5 1h3A1.5 1.5 0 0 1 15 2.5v3A1.5 1.5 0 0 1 13.5 7h-3A1.5 1.5 0 0 1 9 5.5v-3zm-8 8A1.5 1.5 0 0 1 2.5 9h3A1.5 1.5 0 0 1 7 10.5v3A1.5 1.5 0 0 1 5.5 15h-3A1.5 1.5 0 0 1 1 13.5v-3zm8 0A1.5 1.5 0 0 1 10.5 9h3a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 9 13.5v-3z"/>
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded transition-colors ${viewMode === 'list' ? 'bg-burnt-lilac text-white' : 'text-mist-lilac/60 hover:text-mist-lilac'}`}
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-8 sm:py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredProducts.length > 0 ? (
            <div className={viewMode === 'grid' ? 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6' : 'flex flex-col gap-4'}>
              {filteredProducts.map((product, index) => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  index={index}
                  viewMode={viewMode}
                />
              ))}
            </div>
          ) : (
            <EmptyState />
          )}
        </div>
      </section>
    </div>
  );
}

// Filter Button Component
function FilterButton({ 
  children, 
  active, 
  onClick 
}: { 
  children: React.ReactNode; 
  active: boolean; 
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 text-sm rounded-full transition-all duration-300 touch-manipulation ${
        active
          ? 'bg-burnt-lilac text-white shadow-lg shadow-burnt-lilac/25 scale-105'
          : 'bg-deep-purple/30 text-mist-lilac/80 hover:bg-deep-purple/50 hover:text-mist-lilac border border-mist-lilac/10'
      }`}
    >
      {children}
    </button>
  );
}

// Product Card Component with animations
function ProductCard({ 
  product, 
  index,
  viewMode 
}: { 
  product: ShopifyProduct; 
  index: number;
  viewMode: 'grid' | 'list';
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const { addItem, setCartOpen } = useCart();
  
  const image = product.images?.edges?.[0]?.node;
  const secondImage = product.images?.edges?.[1]?.node;
  const price = product.priceRange?.minVariantPrice;
  const comparePrice = product.compareAtPriceRange?.minVariantPrice;
  const hasDiscount = comparePrice && parseFloat(comparePrice.amount) > parseFloat(price?.amount || '0');

  const handleQuickAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const variant = product.variants?.edges?.[0]?.node;
    if (variant) {
      await addItem(variant.id, 1);
      setCartOpen(true);
    }
  };

  if (viewMode === 'list') {
    return (
      <Link
        href={`/products/${product.handle}`}
        className="group flex gap-4 sm:gap-6 p-4 bg-deep-purple/10 rounded-xl border border-mist-lilac/10 hover:border-burnt-lilac/30 transition-all duration-300"
        style={{ animationDelay: `${index * 50}ms` }}
      >
        {/* Image */}
        <div className="relative w-24 h-24 sm:w-32 sm:h-32 shrink-0 rounded-lg overflow-hidden bg-deep-purple/20">
          {image && (
            <Image
              src={image.url}
              alt={image.altText || product.title}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
            />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col justify-center">
          <h3 className="text-mist-lilac font-medium text-sm sm:text-base group-hover:text-burnt-lilac transition-colors line-clamp-2">
            {product.title}
          </h3>
          <p className="text-mist-lilac/50 text-xs sm:text-sm mt-1">{product.productType}</p>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-burnt-lilac font-semibold">
              Rs.{parseFloat(price?.amount || '0').toFixed(0)}
            </span>
            {hasDiscount && (
              <span className="text-mist-lilac/40 line-through text-sm">
                Rs.{parseFloat(comparePrice.amount).toFixed(0)}
              </span>
            )}
          </div>
        </div>

        {/* Quick Add */}
        <button
          onClick={handleQuickAdd}
          className="self-center px-4 py-2 bg-burnt-lilac text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
        >
          Add
        </button>
      </Link>
    );
  }

  return (
    <Link
      href={`/products/${product.handle}`}
      className="group relative block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ 
        animation: 'fadeInUp 0.6s ease-out forwards',
        animationDelay: `${index * 50}ms`,
        opacity: 0,
      }}
    >
      {/* Image Container */}
      <div className="relative aspect-3/4 rounded-xl overflow-hidden bg-deep-purple/20">
        {/* Skeleton Loader */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-deep-purple/30 animate-pulse" />
        )}
        
        {/* Primary Image */}
        {image && (
          <Image
            src={image.url}
            alt={image.altText || product.title}
            fill
            className={`object-cover transition-all duration-700 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            } ${isHovered && secondImage ? 'opacity-0 scale-110' : 'opacity-100 scale-100'}`}
            onLoad={() => setImageLoaded(true)}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        )}
        
        {/* Secondary Image (on hover) */}
        {secondImage && (
          <Image
            src={secondImage.url}
            alt={secondImage.altText || product.title}
            fill
            className={`object-cover transition-all duration-700 absolute inset-0 ${
              isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-110'
            }`}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        )}

        {/* Discount Badge */}
        {hasDiscount && (
          <div className="absolute top-3 left-3 px-2 py-1 bg-red-500 text-white text-xs font-bold rounded">
            SALE
          </div>
        )}

        {/* Quick Actions Overlay */}
        <div className={`absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent flex items-end justify-center pb-4 transition-opacity duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}>
          <button
            onClick={handleQuickAdd}
            className="px-6 py-2.5 bg-burnt-lilac hover:bg-burnt-lilac/80 text-white text-sm font-medium rounded-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 shadow-lg"
          >
            Quick Add
          </button>
        </div>

        {/* Hover Border Effect */}
        <div className={`absolute inset-0 border-2 rounded-xl transition-colors duration-300 ${
          isHovered ? 'border-burnt-lilac' : 'border-transparent'
        }`} />
      </div>

      {/* Product Info */}
      <div className="mt-4 space-y-1">
        <h3 className="text-mist-lilac font-medium text-sm sm:text-base line-clamp-2 group-hover:text-burnt-lilac transition-colors">
          {product.title}
        </h3>
        <p className="text-mist-lilac/50 text-xs">{product.productType}</p>
        <div className="flex items-center gap-2">
          <span className="text-burnt-lilac font-semibold text-sm sm:text-base">
            Rs.{parseFloat(price?.amount || '0').toFixed(0)}
          </span>
          {hasDiscount && (
            <span className="text-mist-lilac/40 line-through text-xs sm:text-sm">
              Rs.{parseFloat(comparePrice.amount).toFixed(0)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

// Empty State Component
function EmptyState() {
  return (
    <div className="text-center py-20">
      <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-deep-purple/20 flex items-center justify-center">
        <svg className="w-12 h-12 text-mist-lilac/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      </div>
      <h3 className="text-xl text-mist-lilac mb-2">No products found</h3>
      <p className="text-mist-lilac/50 mb-6">Try adjusting your filters or check back later</p>
      <Link
        href="/products"
        className="inline-flex items-center gap-2 px-6 py-3 bg-burnt-lilac text-white rounded-lg hover:bg-burnt-lilac/80 transition-colors"
      >
        Browse All Products
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
        </svg>
      </Link>
    </div>
  );
}
