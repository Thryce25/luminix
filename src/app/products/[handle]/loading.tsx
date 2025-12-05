import { ProductDetailsSkeleton, ProductGridSkeleton } from '@/components/common/Skeletons';

export default function ProductLoading() {
  return (
    <div className="min-h-screen bg-black gothic-texture">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <ProductDetailsSkeleton />
        
        {/* Related Products */}
        <section className="mt-20 pt-12 border-t border-deep-purple/20">
          <div className="mb-8 animate-pulse">
            <div className="h-8 w-48 bg-deep-purple/30 rounded mb-2" />
            <div className="h-4 w-64 bg-deep-purple/30 rounded" />
          </div>
          <ProductGridSkeleton count={4} />
        </section>
      </div>
    </div>
  );
}
