'use client';

// Product Card Skeleton
export function ProductCardSkeleton() {
  return (
    <div className="card-gothic animate-pulse">
      {/* Image Container */}
      <div className="relative aspect-4/5 overflow-hidden bg-deep-purple/20 rounded-t-lg" />
      
      {/* Product Info */}
      <div className="p-3 sm:p-4 space-y-3">
        {/* Brand */}
        <div className="h-3 w-16 bg-deep-purple/30 rounded" />
        
        {/* Title */}
        <div className="h-4 w-3/4 bg-deep-purple/30 rounded" />
        
        {/* Price */}
        <div className="h-5 w-20 bg-deep-purple/30 rounded" />
      </div>
    </div>
  );
}

// Product Grid Skeleton
export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

// Featured Products Skeleton
export function FeaturedProductsSkeleton() {
  return (
    <section className="py-10 sm:py-16 lg:py-24 bg-black relative overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-6 sm:mb-10 gap-4 sm:gap-6">
          <div className="text-center sm:text-left">
            <div className="h-3 w-24 bg-deep-purple/30 rounded mb-2 mx-auto sm:mx-0" />
            <div className="h-8 w-48 bg-deep-purple/30 rounded mx-auto sm:mx-0" />
          </div>
          
          {/* Tabs Skeleton */}
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-9 w-20 bg-deep-purple/30 rounded-full" />
            ))}
          </div>
        </div>
        
        {/* Grid */}
        <ProductGridSkeleton count={8} />
      </div>
    </section>
  );
}

// New Arrivals Skeleton
export function NewArrivalsSkeleton() {
  return (
    <section className="py-10 sm:py-16 lg:py-24 bg-linear-to-b from-black via-deep-purple/5 to-black relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-end justify-between mb-6 sm:mb-8">
          <div>
            <div className="h-3 w-20 bg-deep-purple/30 rounded mb-2" />
            <div className="h-8 w-40 bg-deep-purple/30 rounded" />
          </div>
        </div>
        
        {/* Scrollable Products */}
        <div className="flex gap-3 sm:gap-4 lg:gap-6 overflow-hidden">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="shrink-0 w-40 sm:w-56 md:w-64 lg:w-72">
              <ProductCardSkeleton />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Hero Banner Skeleton
export function HeroBannerSkeleton() {
  return (
    <section className="relative h-screen min-h-[600px] max-h-[900px] flex items-center justify-center overflow-hidden animate-pulse">
      <div className="absolute inset-0 bg-deep-purple/20" />
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <div className="h-4 w-32 bg-deep-purple/30 rounded mx-auto mb-6" />
        <div className="h-16 w-3/4 bg-deep-purple/30 rounded mx-auto mb-6" />
        <div className="h-6 w-2/3 bg-deep-purple/30 rounded mx-auto mb-8" />
        <div className="flex gap-4 justify-center">
          <div className="h-12 w-36 bg-deep-purple/30 rounded-lg" />
          <div className="h-12 w-36 bg-deep-purple/30 rounded-lg" />
        </div>
      </div>
    </section>
  );
}

// Category Grid Skeleton
export function CategoryGridSkeleton() {
  return (
    <section className="py-12 sm:py-16 lg:py-24 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12">
          <div className="h-8 w-48 bg-deep-purple/30 rounded mx-auto mb-4" />
          <div className="h-4 w-64 bg-deep-purple/30 rounded mx-auto" />
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 lg:gap-6 animate-pulse">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className={`bg-deep-purple/20 rounded-lg ${
                i < 2 ? 'aspect-square lg:col-span-2 lg:row-span-2' : 'aspect-square'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

// Product Details Skeleton
export function ProductDetailsSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 animate-pulse">
      {/* Images */}
      <div className="space-y-4">
        <div className="aspect-square bg-deep-purple/20 rounded-lg" />
        <div className="flex gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="w-20 h-20 bg-deep-purple/20 rounded" />
          ))}
        </div>
      </div>
      
      {/* Info */}
      <div className="space-y-6">
        <div className="h-4 w-24 bg-deep-purple/30 rounded" />
        <div className="h-10 w-3/4 bg-deep-purple/30 rounded" />
        <div className="h-8 w-32 bg-deep-purple/30 rounded" />
        <div className="space-y-2">
          <div className="h-4 w-full bg-deep-purple/30 rounded" />
          <div className="h-4 w-5/6 bg-deep-purple/30 rounded" />
          <div className="h-4 w-4/6 bg-deep-purple/30 rounded" />
        </div>
        <div className="flex gap-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="w-12 h-12 bg-deep-purple/30 rounded" />
          ))}
        </div>
        <div className="h-14 w-full bg-deep-purple/30 rounded-lg" />
      </div>
    </div>
  );
}

// Search Result Skeleton
export function SearchResultSkeleton() {
  return (
    <div className="flex gap-4 p-4 animate-pulse">
      <div className="w-16 h-20 bg-deep-purple/20 rounded" />
      <div className="flex-1 space-y-2">
        <div className="h-4 w-3/4 bg-deep-purple/30 rounded" />
        <div className="h-5 w-20 bg-deep-purple/30 rounded" />
      </div>
    </div>
  );
}

// Filter Sidebar Skeleton
export function FilterSidebarSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {[1, 2, 3].map((section) => (
        <div key={section} className="space-y-3">
          <div className="h-5 w-24 bg-deep-purple/30 rounded" />
          <div className="space-y-2">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="h-4 w-32 bg-deep-purple/20 rounded" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
