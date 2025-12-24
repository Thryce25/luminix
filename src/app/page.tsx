import { getNewArrivals, ShopifyProduct } from '@/lib/shopify';
import HomePageClient from '@/components/home/HomePageClient';

// Mark as dynamic since Shopify fetches use no-store cache
export const dynamic = 'force-dynamic';

export default async function HomePage() {
  let newArrivals: ShopifyProduct[] = [];

  try {
    newArrivals = await getNewArrivals(8);
  } catch (error) {
    console.error('Error fetching products:', error);
  }

  return (
    <HomePageClient 
      newArrivals={newArrivals} 
    />
  );
}
