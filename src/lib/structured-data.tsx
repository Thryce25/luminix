import { ShopifyProduct } from '@/lib/shopify';

// Generate JSON-LD structured data for a product
export function generateProductJsonLd(product: ShopifyProduct, url: string) {
  const price = product.priceRange.minVariantPrice;
  const compareAtPrice = product.compareAtPriceRange?.minVariantPrice;
  const isOnSale = compareAtPrice && parseFloat(compareAtPrice.amount) > parseFloat(price.amount);

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.description,
    image: product.images.edges.map((edge) => edge.node.url),
    brand: {
      '@type': 'Brand',
      name: product.vendor || 'Luminix',
    },
    sku: product.variants.edges[0]?.node.id,
    offers: {
      '@type': 'AggregateOffer',
      lowPrice: price.amount,
      highPrice: product.priceRange.maxVariantPrice.amount,
      priceCurrency: price.currencyCode,
      availability: product.availableForSale
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      url: url,
      ...(isOnSale && {
        priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      }),
    },
    ...(product.seo?.description && {
      description: product.seo.description,
    }),
  };
}

// Generate JSON-LD for the organization/website
export function generateOrganizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Luminix',
    description: 'Gothic Fashion & Accessories - Where elegance meets the extraordinary.',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://luminixclothing.com',
    logo: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://luminixclothing.com'}/logo.png`,
    sameAs: [
      'https://instagram.com/luminix',
      'https://facebook.com/luminix',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      email: 'support@luminix.store',
    },
  };
}

// Generate JSON-LD for breadcrumbs
export function generateBreadcrumbJsonLd(
  items: Array<{ name: string; url: string }>
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

// Generate JSON-LD for a collection/category page
export function generateCollectionJsonLd(
  collection: { title: string; description: string; handle: string },
  products: ShopifyProduct[],
  baseUrl: string
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: collection.title,
    description: collection.description,
    url: `${baseUrl}/products?category=${collection.handle}`,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: products.length,
      itemListElement: products.slice(0, 10).map((product, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: `${baseUrl}/products/${product.handle}`,
        name: product.title,
      })),
    },
  };
}

// Generate JSON-LD for search action (sitelinks search box)
export function generateWebsiteJsonLd(baseUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Luminix',
    url: baseUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${baseUrl}/products?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

// Component to render JSON-LD script tag
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
