import {
  HeroBannerSkeleton,
  CategoryGridSkeleton,
  FeaturedProductsSkeleton,
  NewArrivalsSkeleton,
} from '@/components/common/Skeletons';

export default function Loading() {
  return (
    <div className="min-h-screen bg-black">
      <HeroBannerSkeleton />
      <CategoryGridSkeleton />
      <FeaturedProductsSkeleton />
      <NewArrivalsSkeleton />
    </div>
  );
}
