import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProduct, getRelatedProducts, ShopifyProduct } from '@/lib/shopify';
import { generateProductJsonLd, generateBreadcrumbJsonLd, JsonLd } from '@/lib/structured-data';
import ProductDetails from '@/components/products/ProductDetails';
import ProductGrid from '@/components/products/ProductGrid';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://luminixclothing.com';

interface Props {
  params: Promise<{ handle: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { handle } = await params;
  const product = await getProduct(handle);

  if (!product) {
    return {
      title: 'Product Not Found',
    };
  }

  return {
    title: product.seo?.title || product.title,
    description: product.seo?.description || product.description,
    openGraph: {
      title: product.title,
      description: product.description,
      images: product.featuredImage
        ? [{ url: product.featuredImage.url, alt: product.featuredImage.altText || product.title }]
        : [],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { handle } = await params;
  const product = await getProduct(handle);

  if (!product) {
    notFound();
  }

  // Get related products based on product type/tags/vendor
  let relatedProducts: ShopifyProduct[] = [];
  try {
    relatedProducts = await getRelatedProducts(product, 4);
  } catch (error) {
    console.error('Error fetching related products:', error);
  }

  // Generate structured data
  const productUrl = `${BASE_URL}/products/${handle}`;
  const productJsonLd = generateProductJsonLd(product, productUrl);
  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: 'Home', url: BASE_URL },
    { name: 'Shop', url: `${BASE_URL}/products` },
    { name: product.title, url: productUrl },
  ]);

  return (
    <>
      {/* Structured Data */}
      <JsonLd data={productJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />
      
      <div className="min-h-screen bg-black gothic-texture">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <ProductDetails product={product} />

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <section className="mt-20 pt-12 border-t border-deep-purple/20">
              <ProductGrid
                products={relatedProducts}
                title="You May Also Like"
                subtitle="Explore similar pieces from our collection"
              />
            </section>
          )}
        </div>
      </div>
    </>
  );
}
