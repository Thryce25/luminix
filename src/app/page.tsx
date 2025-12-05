import { getFeaturedProducts, getNewArrivals, ShopifyProduct } from '@/lib/shopify';
import HomePageClient from '@/components/home/HomePageClient';

export const revalidate = 60; // Revalidate every 60 seconds for fresh data

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
    <HomePageClient 
      featuredProducts={featuredProducts} 
      newArrivals={newArrivals} 
    />
  );
}
