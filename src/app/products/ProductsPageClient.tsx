'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ShopifyProduct, formatPrice, getProductImageUrl } from '@/lib/shopify';
import { useCart } from '@/context/CartContext';

interface FilterOption {
  label: string;
  value: string;
}

interface ProductsPageClientProps {
  initialProducts: ShopifyProduct[];
  collections: FilterOption[];
  productTypes: FilterOption[];
}

const sortOptions = [
  { label: 'Latest', value: 'newest', icon: '✦' },
  { label: 'Price ↑', value: 'price-asc', icon: '↑' },
  { label: 'Price ↓', value: 'price-desc', icon: '↓' },
  { label: 'Popular', value: 'best-selling', icon: '★' },
  { label: 'A-Z', value: 'title-asc', icon: 'Aa' },
];

const priceRanges = [
  { label: 'Under ₹500', value: '0-500' },
  { label: '₹500 - ₹800', value: '500-800' },
  { label: '₹800 - ₹1,000', value: '800-1000' },
  { label: 'Over ₹1,000', value: '1000-above' },
];

export default function ProductsPageClient({
  initialProducts,
  collections,
  productTypes,
}: ProductsPageClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [products] = useState(initialProducts);
  const [viewMode, setViewMode] = useState<'grid' | 'masonry' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);

  const currentSort = searchParams.get('sort') || 'newest';
  const currentCategory = searchParams.get('category') || searchParams.get('collection') || '';
  const currentType = searchParams.get('type') || '';
  const currentPrice = searchParams.get('price') || '';

  // Track scroll for parallax
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Track mouse for interactive effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const updateFilters = useCallback((key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (key === 'category') params.delete('collection');
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/products?${params.toString()}`, { scroll: false });
  }, [router, searchParams]);

  const clearFilters = () => {
    router.push('/products', { scroll: false });
  };

  const hasActiveFilters = currentCategory || currentType || currentPrice;
  const activeFilterCount = [currentCategory, currentType, currentPrice].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-black overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Gradient Orbs */}
        <div 
          className="absolute w-[800px] h-[800px] rounded-full opacity-20 blur-3xl transition-transform duration-1000"
          style={{
            background: 'radial-gradient(circle, rgba(111,78,124,0.4) 0%, transparent 70%)',
            left: `${mousePosition.x * 0.02}px`,
            top: `${mousePosition.y * 0.02 - scrollY * 0.1}px`,
          }}
        />
        <div 
          className="absolute w-[600px] h-[600px] rounded-full opacity-15 blur-3xl"
          style={{
            background: 'radial-gradient(circle, rgba(214,197,220,0.3) 0%, transparent 70%)',
            right: '10%',
            bottom: '20%',
            transform: `translateY(${scrollY * 0.05}px)`,
          }}
        />
        
        {/* Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `
              linear-gradient(rgba(214,197,220,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(214,197,220,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
            transform: `translateY(${scrollY * 0.1}px)`,
          }}
        />
      </div>

      {/* Hero Section */}
      <section 
        ref={heroRef}
        className="relative min-h-[60vh] flex items-center justify-center overflow-hidden"
      >
        {/* Parallax Background Elements */}
        <div className="absolute inset-0">
          {/* Floating Shapes */}
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full mix-blend-overlay animate-float"
              style={{
                width: `${Math.random() * 100 + 20}px`,
                height: `${Math.random() * 100 + 20}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                background: i % 2 === 0 
                  ? 'linear-gradient(135deg, rgba(111,78,124,0.3), transparent)'
                  : 'linear-gradient(135deg, rgba(214,197,220,0.2), transparent)',
                animationDelay: `${i * 0.5}s`,
                animationDuration: `${10 + Math.random() * 10}s`,
                transform: `translateY(${scrollY * (0.1 + Math.random() * 0.2)}px)`,
              }}
            />
          ))}
        </div>

        {/* Hero Content */}
        <div 
          className="relative z-10 text-center px-4"
          style={{ transform: `translateY(${scrollY * 0.3}px)` }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-burnt-lilac/10 border border-burnt-lilac/20 mb-6">
            <span className="w-2 h-2 bg-burnt-lilac rounded-full animate-pulse" />
            <span className="text-burnt-lilac text-sm font-medium tracking-wider uppercase">
              {products.length} Products Available
            </span>
          </div>
          
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-serif text-transparent bg-clip-text bg-gradient-to-b from-white via-mist-lilac to-burnt-lilac/50 mb-6 leading-tight">
            Discover
            <br />
            <span className="italic">Your Style</span>
          </h1>
          
          <p className="text-mist-lilac/60 max-w-xl mx-auto text-base sm:text-lg mb-10">
            Curated streetwear and fashion pieces designed for those who dare to stand out.
          </p>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
            <span className="text-mist-lilac/40 text-xs uppercase tracking-widest">Scroll</span>
            <div className="w-px h-16 bg-gradient-to-b from-burnt-lilac/50 to-transparent relative">
              <div className="absolute top-0 w-full h-1/2 bg-burnt-lilac animate-scroll-down" />
            </div>
          </div>
        </div>
      </section>

      {/* Filter Bar - Sticky */}
      <div className="sticky top-0 z-40 bg-black/80 backdrop-blur-xl border-b border-mist-lilac/10">
        <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4 gap-4">
            {/* Left Side - Filter Button & Active Filters */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full border transition-all duration-300 ${
                  showFilters 
                    ? 'bg-burnt-lilac border-burnt-lilac text-white' 
                    : 'bg-transparent border-mist-lilac/20 text-mist-lilac hover:border-burnt-lilac/50'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                <span className="font-medium">Filters</span>
                {activeFilterCount > 0 && (
                  <span className="w-5 h-5 bg-white text-burnt-lilac text-xs font-bold rounded-full flex items-center justify-center">
                    {activeFilterCount}
                  </span>
                )}
              </button>

              {/* Active Filter Pills */}
              {hasActiveFilters && (
                <div className="hidden sm:flex items-center gap-2">
                  {currentCategory && (
                    <FilterPill 
                      label={collections.find(c => c.value === currentCategory)?.label || currentCategory}
                      onRemove={() => updateFilters('category', '')}
                    />
                  )}
                  {currentType && (
                    <FilterPill 
                      label={productTypes.find(t => t.value === currentType)?.label || currentType}
                      onRemove={() => updateFilters('type', '')}
                    />
                  )}
                  {currentPrice && (
                    <FilterPill 
                      label={priceRanges.find(p => p.value === currentPrice)?.label || currentPrice}
                      onRemove={() => updateFilters('price', '')}
                    />
                  )}
                  <button
                    onClick={clearFilters}
                    className="text-burnt-lilac/70 text-sm hover:text-burnt-lilac transition-colors"
                  >
                    Clear all
                  </button>
                </div>
              )}
            </div>

            {/* Right Side - Sort & View Toggle */}
            <div className="flex items-center gap-3">
              {/* Sort Pills */}
              <div className="hidden md:flex items-center gap-1 p-1 rounded-full bg-deep-purple/20 border border-mist-lilac/10">
                {sortOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => updateFilters('sort', option.value)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${
                      currentSort === option.value
                        ? 'bg-burnt-lilac text-white'
                        : 'text-mist-lilac/60 hover:text-mist-lilac'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>

              {/* Mobile Sort */}
              <select
                value={currentSort}
                onChange={(e) => updateFilters('sort', e.target.value)}
                className="md:hidden appearance-none px-4 py-2.5 bg-deep-purple/20 border border-mist-lilac/20 rounded-full text-mist-lilac text-sm"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value} className="bg-black">
                    {option.label}
                  </option>
                ))}
              </select>

              {/* View Toggle */}
              <div className="hidden sm:flex items-center gap-1 p-1 rounded-full bg-deep-purple/20 border border-mist-lilac/10">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-full transition-all ${viewMode === 'grid' ? 'bg-burnt-lilac text-white' : 'text-mist-lilac/50'}`}
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M1 2.5A1.5 1.5 0 012.5 1h3A1.5 1.5 0 017 2.5v3A1.5 1.5 0 015.5 7h-3A1.5 1.5 0 011 5.5v-3zm8 0A1.5 1.5 0 0110.5 1h3A1.5 1.5 0 0115 2.5v3A1.5 1.5 0 0113.5 7h-3A1.5 1.5 0 019 5.5v-3zm-8 8A1.5 1.5 0 012.5 9h3A1.5 1.5 0 017 10.5v3A1.5 1.5 0 015.5 15h-3A1.5 1.5 0 011 13.5v-3zm8 0A1.5 1.5 0 0110.5 9h3a1.5 1.5 0 011.5 1.5v3a1.5 1.5 0 01-1.5 1.5h-3A1.5 1.5 0 019 13.5v-3z"/>
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode('masonry')}
                  className={`p-2 rounded-full transition-all ${viewMode === 'masonry' ? 'bg-burnt-lilac text-white' : 'text-mist-lilac/50'}`}
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M1 2a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H2a1 1 0 01-1-1V2zm5 0a1 1 0 011-1h3a1 1 0 011 1v5a1 1 0 01-1 1H7a1 1 0 01-1-1V2zm5 0a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1V2zM1 9a1 1 0 011-1h3a1 1 0 011 1v5a1 1 0 01-1 1H2a1 1 0 01-1-1V9zm5 0a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H7a1 1 0 01-1-1V9zm5 0a1 1 0 011-1h3a1 1 0 011 1v5a1 1 0 01-1 1h-3a1 1 0 01-1-1V9z"/>
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-full transition-all ${viewMode === 'list' ? 'bg-burnt-lilac text-white' : 'text-mist-lilac/50'}`}
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M2.5 12a.5.5 0 01.5-.5h10a.5.5 0 010 1H3a.5.5 0 01-.5-.5zm0-4a.5.5 0 01.5-.5h10a.5.5 0 010 1H3a.5.5 0 01-.5-.5zm0-4a.5.5 0 01.5-.5h10a.5.5 0 010 1H3a.5.5 0 01-.5-.5z"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Panel - Expandable */}
      <div 
        className={`overflow-hidden transition-all duration-500 bg-gradient-to-b from-deep-purple/20 to-transparent border-b border-mist-lilac/10 ${
          showFilters ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Collections */}
            <div>
              <h3 className="text-mist-lilac font-semibold mb-4 flex items-center gap-2">
                <span className="w-1 h-4 bg-burnt-lilac rounded-full" />
                Collections
              </h3>
              <div className="flex flex-wrap gap-2">
                {collections.map((collection) => (
                  <button
                    key={collection.value}
                    onClick={() => updateFilters('category', currentCategory === collection.value ? '' : collection.value)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                      currentCategory === collection.value
                        ? 'bg-burnt-lilac text-white scale-105'
                        : 'bg-deep-purple/30 text-mist-lilac/70 hover:bg-deep-purple/50 hover:text-mist-lilac'
                    }`}
                  >
                    {collection.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Product Types */}
            <div>
              <h3 className="text-mist-lilac font-semibold mb-4 flex items-center gap-2">
                <span className="w-1 h-4 bg-burnt-lilac rounded-full" />
                Product Types
              </h3>
              <div className="flex flex-wrap gap-2">
                {productTypes.map((type) => (
                  <button
                    key={type.value}
                    onClick={() => updateFilters('type', currentType === type.value ? '' : type.value)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                      currentType === type.value
                        ? 'bg-burnt-lilac text-white scale-105'
                        : 'bg-deep-purple/30 text-mist-lilac/70 hover:bg-deep-purple/50 hover:text-mist-lilac'
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div>
              <h3 className="text-mist-lilac font-semibold mb-4 flex items-center gap-2">
                <span className="w-1 h-4 bg-burnt-lilac rounded-full" />
                Price Range
              </h3>
              <div className="flex flex-wrap gap-2">
                {priceRanges.map((range) => (
                  <button
                    key={range.value}
                    onClick={() => updateFilters('price', currentPrice === range.value ? '' : range.value)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                      currentPrice === range.value
                        ? 'bg-burnt-lilac text-white scale-105'
                        : 'bg-deep-purple/30 text-mist-lilac/70 hover:bg-deep-purple/50 hover:text-mist-lilac'
                    }`}
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <section className="relative z-10 py-12 sm:py-16">
        <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8">
          {products.length > 0 ? (
            <>
              {/* Grid View */}
              {viewMode === 'grid' && (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
                  {products.map((product, index) => (
                    <ProductCardAnimated
                      key={product.id}
                      product={product}
                      index={index}
                      isHovered={hoveredProduct === product.id}
                      onHover={() => setHoveredProduct(product.id)}
                      onLeave={() => setHoveredProduct(null)}
                    />
                  ))}
                </div>
              )}

              {/* Masonry View */}
              {viewMode === 'masonry' && (
                <div className="columns-2 sm:columns-3 lg:columns-4 xl:columns-5 gap-4 sm:gap-6">
                  {products.map((product, index) => (
                    <div key={product.id} className="break-inside-avoid mb-4 sm:mb-6">
                      <ProductCardMasonry
                        product={product}
                        index={index}
                        isHovered={hoveredProduct === product.id}
                        onHover={() => setHoveredProduct(product.id)}
                        onLeave={() => setHoveredProduct(null)}
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* List View */}
              {viewMode === 'list' && (
                <div className="space-y-4">
                  {products.map((product, index) => (
                    <ProductCardList
                      key={product.id}
                      product={product}
                      index={index}
                    />
                  ))}
                </div>
              )}
            </>
          ) : (
            <EmptyState onClear={clearFilters} />
          )}
        </div>
      </section>

      {/* Custom Styles */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        
        @keyframes scroll-down {
          0% { transform: translateY(0); opacity: 1; }
          100% { transform: translateY(100%); opacity: 0; }
        }
        
        .animate-float {
          animation: float 10s ease-in-out infinite;
        }
        
        .animate-scroll-down {
          animation: scroll-down 1.5s ease-in-out infinite;
        }
        
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        
        .shimmer-effect {
          background: linear-gradient(90deg, transparent 0%, rgba(214,197,220,0.1) 50%, transparent 100%);
          background-size: 200% 100%;
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  );
}

// Filter Pill Component
function FilterPill({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-burnt-lilac/20 border border-burnt-lilac/30 text-burnt-lilac text-sm">
      <span>{label}</span>
      <button onClick={onRemove} className="hover:text-white transition-colors">
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

// Animated Product Card Component
function ProductCardAnimated({
  product,
  index,
  isHovered,
  onHover,
  onLeave,
}: {
  product: ShopifyProduct;
  index: number;
  isHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
}) {
  const { addItem, loading } = useCart();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const variant = product.variants.edges[0]?.node;
    if (!variant) return;
    setIsAdding(true);
    await addItem(variant.id, 1);
    setIsAdding(false);
  };

  const imageUrl = getProductImageUrl(product);
  const secondImage = product.images.edges[1]?.node?.url;
  const price = product.priceRange.minVariantPrice;
  const compareAtPrice = product.compareAtPriceRange?.minVariantPrice;
  const isOnSale = compareAtPrice && parseFloat(compareAtPrice.amount) > parseFloat(price.amount);
  const discount = isOnSale
    ? Math.round((1 - parseFloat(price.amount) / parseFloat(compareAtPrice.amount)) * 100)
    : 0;

  return (
    <Link
      href={`/products/${product.handle}`}
      className="group block"
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      style={{
        animationDelay: `${index * 0.05}s`,
      }}
    >
      <div 
        className={`relative rounded-2xl overflow-hidden bg-gradient-to-br from-deep-purple/30 to-black border border-mist-lilac/10 transition-all duration-500 ${
          isHovered ? 'scale-[1.02] shadow-2xl shadow-burnt-lilac/20 border-burnt-lilac/30' : ''
        }`}
        style={{
          animation: `fade-in-up 0.6s ease-out ${index * 0.05}s both`,
        }}
      >
        {/* Image Container */}
        <div className="relative aspect-[3/4] overflow-hidden">
          <Image
            src={imageUrl}
            alt={product.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            className={`object-cover transition-all duration-700 ${
              isHovered && secondImage ? 'opacity-0 scale-110' : 'scale-100'
            }`}
          />
          {secondImage && (
            <Image
              src={secondImage}
              alt={`${product.title} - alternate`}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
              className={`object-cover transition-all duration-700 ${
                isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-110'
              }`}
            />
          )}

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
            {isOnSale && (
              <span className="px-2.5 py-1 bg-gradient-to-r from-burnt-lilac to-pink-500 text-white text-xs font-bold rounded-full">
                -{discount}%
              </span>
            )}
            {!product.availableForSale && (
              <span className="px-2.5 py-1 bg-black/80 text-mist-lilac text-xs font-medium rounded-full">
                Sold Out
              </span>
            )}
          </div>

          {/* Quick Add Button */}
          <div 
            className={`absolute bottom-3 left-3 right-3 transition-all duration-500 ${
              isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <button
              onClick={handleAddToCart}
              disabled={isAdding || loading || !product.availableForSale}
              className="w-full py-3 bg-white text-black font-semibold text-sm rounded-xl hover:bg-burnt-lilac hover:text-white transition-colors disabled:opacity-50"
            >
              {!product.availableForSale ? 'Sold Out' : isAdding ? 'Adding...' : 'Quick Add'}
            </button>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-4">
          {product.vendor && (
            <p className="text-burnt-lilac/70 text-xs uppercase tracking-wider mb-1">
              {product.vendor}
            </p>
          )}
          <h3 className="text-mist-lilac font-medium text-sm line-clamp-2 mb-2 group-hover:text-white transition-colors">
            {product.title}
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-white font-bold">{formatPrice(price)}</span>
            {isOnSale && compareAtPrice && (
              <span className="text-mist-lilac/40 text-sm line-through">
                {formatPrice(compareAtPrice)}
              </span>
            )}
          </div>
        </div>

        {/* Shimmer Effect on Hover */}
        {isHovered && (
          <div className="absolute inset-0 shimmer-effect pointer-events-none" />
        )}
      </div>
    </Link>
  );
}

// Masonry Product Card
function ProductCardMasonry({
  product,
  index,
  isHovered,
  onHover,
  onLeave,
}: {
  product: ShopifyProduct;
  index: number;
  isHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
}) {
  const imageUrl = getProductImageUrl(product);
  const price = product.priceRange.minVariantPrice;
  const aspectRatios = ['aspect-[3/4]', 'aspect-square', 'aspect-[4/5]', 'aspect-[3/5]'];
  const randomAspect = aspectRatios[index % aspectRatios.length];

  return (
    <Link
      href={`/products/${product.handle}`}
      className="group block"
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      <div 
        className={`relative rounded-2xl overflow-hidden bg-gradient-to-br from-deep-purple/30 to-black border border-mist-lilac/10 transition-all duration-500 ${
          isHovered ? 'shadow-2xl shadow-burnt-lilac/20 border-burnt-lilac/30' : ''
        }`}
        style={{
          animation: `fade-in-up 0.6s ease-out ${index * 0.08}s both`,
        }}
      >
        <div className={`relative ${randomAspect} overflow-hidden`}>
          <Image
            src={imageUrl}
            alt={product.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            className={`object-cover transition-all duration-700 ${isHovered ? 'scale-110' : 'scale-100'}`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
          
          {/* Info Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="text-white font-medium text-sm line-clamp-2 mb-1">
              {product.title}
            </h3>
            <span className="text-burnt-lilac font-bold">{formatPrice(price)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

// List Product Card
function ProductCardList({
  product,
  index,
}: {
  product: ShopifyProduct;
  index: number;
}) {
  const { addItem, loading } = useCart();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const variant = product.variants.edges[0]?.node;
    if (!variant) return;
    setIsAdding(true);
    await addItem(variant.id, 1);
    setIsAdding(false);
  };

  const imageUrl = getProductImageUrl(product);
  const price = product.priceRange.minVariantPrice;
  const compareAtPrice = product.compareAtPriceRange?.minVariantPrice;
  const isOnSale = compareAtPrice && parseFloat(compareAtPrice.amount) > parseFloat(price.amount);

  return (
    <Link
      href={`/products/${product.handle}`}
      className="group block"
      style={{
        animation: `fade-in-up 0.6s ease-out ${index * 0.05}s both`,
      }}
    >
      <div className="flex gap-6 p-4 rounded-2xl bg-gradient-to-r from-deep-purple/20 to-transparent border border-mist-lilac/10 hover:border-burnt-lilac/30 transition-all duration-300">
        {/* Image */}
        <div className="relative w-32 h-40 sm:w-40 sm:h-52 flex-shrink-0 rounded-xl overflow-hidden">
          <Image
            src={imageUrl}
            alt={product.title}
            fill
            sizes="160px"
            className="object-cover group-hover:scale-110 transition-transform duration-500"
          />
        </div>

        {/* Info */}
        <div className="flex-1 flex flex-col justify-between py-2">
          <div>
            {product.vendor && (
              <p className="text-burnt-lilac/70 text-xs uppercase tracking-wider mb-1">
                {product.vendor}
              </p>
            )}
            <h3 className="text-mist-lilac font-semibold text-lg mb-2 group-hover:text-white transition-colors">
              {product.title}
            </h3>
            <p className="text-mist-lilac/50 text-sm line-clamp-2 hidden sm:block">
              {product.description?.slice(0, 150)}...
            </p>
          </div>

          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-3">
              <span className="text-white font-bold text-xl">{formatPrice(price)}</span>
              {isOnSale && compareAtPrice && (
                <span className="text-mist-lilac/40 line-through">
                  {formatPrice(compareAtPrice)}
                </span>
              )}
            </div>

            <button
              onClick={handleAddToCart}
              disabled={isAdding || loading || !product.availableForSale}
              className="px-6 py-2.5 bg-burnt-lilac text-white font-semibold text-sm rounded-full hover:bg-burnt-lilac/80 transition-colors disabled:opacity-50"
            >
              {!product.availableForSale ? 'Sold Out' : isAdding ? 'Adding...' : 'Add to Cart'}
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}

// Empty State Component
function EmptyState({ onClear }: { onClear: () => void }) {
  return (
    <div className="text-center py-24">
      <div className="relative w-32 h-32 mx-auto mb-8">
        <div className="absolute inset-0 bg-burnt-lilac/20 rounded-full animate-ping" />
        <div className="relative w-full h-full bg-deep-purple/30 rounded-full flex items-center justify-center border border-mist-lilac/20">
          <svg className="w-12 h-12 text-mist-lilac/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>
      <h3 className="text-2xl font-serif text-mist-lilac mb-3">No products found</h3>
      <p className="text-mist-lilac/50 mb-8 max-w-md mx-auto">
        We couldn&apos;t find any products matching your criteria. Try adjusting your filters or browse our full collection.
      </p>
      <button
        onClick={onClear}
        className="px-8 py-3 bg-burnt-lilac text-white font-semibold rounded-full hover:bg-burnt-lilac/80 transition-colors"
      >
        Clear All Filters
      </button>
    </div>
  );
}
