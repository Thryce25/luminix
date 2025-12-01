import { Metadata } from 'next';
import { getProducts, ShopifyProduct } from '@/lib/shopify';
import ProductGrid from '@/components/products/ProductGrid';

export const metadata: Metadata = {
  title: 'Shop',
  description: 'Browse our curated collection of gothic-inspired fashion and accessories.',
};

export const revalidate = 60;

export default async function ProductsPage() {
  let products: ShopifyProduct[] = [];

  try {
    products = await getProducts(24);
  } catch (error) {
    console.error('Error fetching products:', error);
  }

  return (
    <div className="min-h-screen bg-black gothic-texture">
      {/* Hero Section */}
      <section className="relative py-20 bg-linear-to-b from-deep-purple/20 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-mist-lilac mb-6">
            Shop Collection
          </h1>
          <p className="text-mist-lilac/70 max-w-2xl mx-auto">
            Explore our carefully curated selection of gothic-inspired fashion and accessories. 
            Each piece is chosen to embody elegance, mystery, and timeless dark beauty.
          </p>
        </div>
      </section>

      {/* Products */}
      <section className="py-12 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ProductGrid products={products} />
        </div>
      </section>
    </div>
  );
}
