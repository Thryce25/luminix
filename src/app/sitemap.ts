import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.luminixclothing.com';
  
  // Static pages
  const routes = [
    '',
    '/about',
    '/products',
    '/collections/mens-fashion',
    '/collections/anime-collection',
    '/contact',
    '/privacy',
    '/terms',
    '/shipping',
    '/returns',
    '/size-guide',
    '/cookies',
    '/cart',
    '/wishlist',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : route === '/products' ? 0.9 : 0.8,
  }));

  return routes;
}
