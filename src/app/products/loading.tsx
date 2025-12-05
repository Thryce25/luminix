import { ProductGridSkeleton } from '@/components/common/Skeletons';

export default function ProductsLoading() {
  return (
    <div className="min-h-screen bg-black gothic-texture">
      {/* Hero Section */}
      <section className="relative py-20 bg-linear-to-b from-deep-purple/20 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center animate-pulse">
          <div className="h-12 w-64 bg-deep-purple/30 rounded mx-auto mb-6" />
          <div className="h-5 w-96 max-w-full bg-deep-purple/30 rounded mx-auto" />
        </div>
      </section>

      {/* Products */}
      <section className="py-12 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Filters Bar Skeleton */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 animate-pulse">
            <div className="h-5 w-32 bg-deep-purple/30 rounded" />
            <div className="flex gap-3">
              <div className="h-10 w-32 bg-deep-purple/30 rounded" />
              <div className="h-10 w-32 bg-deep-purple/30 rounded" />
            </div>
          </div>
          
          <ProductGridSkeleton count={12} />
        </div>
      </section>
    </div>
  );
}
