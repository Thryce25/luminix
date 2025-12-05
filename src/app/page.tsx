import { getFeaturedProducts, getNewArrivals, getProductsByCollection, ShopifyProduct } from '@/lib/shopify';
import HeroBanner from '@/components/home/HeroBanner';
import PromotionalBanners from '@/components/home/PromotionalBanners';
import CategoryGrid from '@/components/home/CategoryGrid';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import NewArrivals from '@/components/home/NewArrivals';
import AnimeCollection from '@/components/home/AnimeCollection';
import Features from '@/components/home/Features';

export const revalidate = 60; // Revalidate every 60 seconds for fresh data

export default async function HomePage() {
  let featuredProducts: ShopifyProduct[] = [];
  let newArrivals: ShopifyProduct[] = [];
  let animeProducts: ShopifyProduct[] = [];

  try {
    [featuredProducts, newArrivals, animeProducts] = await Promise.all([
      getFeaturedProducts(8),
      getNewArrivals(8),
      getProductsByCollection('anime-collection', 8),
    ]);
  } catch (error) {
    console.error('Error fetching products:', error);
  }

  return (
    <div className="-mt-20">
      <HeroBanner />
      <PromotionalBanners />
      <CategoryGrid />
      <AnimeCollection products={animeProducts} />
      <FeaturedProducts products={featuredProducts} />
      <NewArrivals products={newArrivals} />
      <Features />
    </div>
  );
}
