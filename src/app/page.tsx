import { getFeaturedProducts, getNewArrivals, ShopifyProduct } from '@/lib/shopify';
import HeroBanner from '@/components/home/HeroBanner';
import PromotionalBanners from '@/components/home/PromotionalBanners';
import CategoryGrid from '@/components/home/CategoryGrid';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import TrendingSection from '@/components/home/TrendingSection';
import NewArrivals from '@/components/home/NewArrivals';
import Features from '@/components/home/Features';

export const revalidate = 60; // Revalidate every 60 seconds

export default async function HomePage() {
  let featuredProducts: ShopifyProduct[] = [];
  let newArrivals: ShopifyProduct[] = [];

  try {
    [featuredProducts, newArrivals] = await Promise.all([
      getFeaturedProducts(8),
      getNewArrivals(8),
    ]);
  } catch (error) {
    console.error('Error fetching products:', error);
  }

  return (
    <div className="-mt-20">
      <HeroBanner />
      <PromotionalBanners />
      <CategoryGrid />
      <FeaturedProducts products={featuredProducts} />
      <TrendingSection />
      <NewArrivals products={newArrivals} />
      <Features />
    </div>
  );
}
