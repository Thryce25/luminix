'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ShopifyProduct, formatPrice, getProductImageUrl } from '@/lib/shopify';
import { useCart } from '@/context/CartContext';
import { useState } from 'react';

interface ProductCardProps {
  product: ShopifyProduct;
  priority?: boolean;
}

export default function ProductCard({ product, priority = false }: ProductCardProps) {
  const { addItem, loading } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const variant = product.variants.edges[0]?.node;
    if (!variant) return;

    setIsAdding(true);
    await addItem(variant.id, 1);
    setIsAdding(false);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  const imageUrl = getProductImageUrl(product);
  const secondImage = product.images.edges[1]?.node?.url;
  const price = product.priceRange.minVariantPrice;
  const compareAtPrice = product.compareAtPriceRange?.minVariantPrice;
  const isOnSale = compareAtPrice && parseFloat(compareAtPrice.amount) > parseFloat(price.amount);
  const discount = isOnSale
    ? Math.round((1 - parseFloat(price.amount) / parseFloat(compareAtPrice.amount)) * 100)
    : 0;

  return (
    <Link
      href={`/products/${product.handle}`}
      className="group block touch-manipulation"
    >
      <div className="card-gothic">
        {/* Image Container */}
        <div className="relative aspect-4/5 overflow-hidden bg-deep-purple/10">
          {/* Primary Image */}
          <Image
            src={imageUrl}
            alt={product.featuredImage?.altText || product.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className={`object-cover transition-all duration-500 ${
              secondImage ? 'group-hover:opacity-0' : 'group-hover:scale-110'
            }`}
            priority={priority}
          />
          
          {/* Secondary Image (hover - desktop only) */}
          {secondImage && (
            <Image
              src={secondImage}
              alt={`${product.title} - alternate view`}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500 hidden sm:block"
            />
          )}

          {/* Badges */}
          <div className="absolute top-2 sm:top-3 left-2 sm:left-3 flex flex-col gap-1.5 sm:gap-2 z-10">
            {isOnSale && (
              <span className="bg-burnt-lilac text-white text-[10px] sm:text-xs font-bold px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded">
                -{discount}%
              </span>
            )}
            {!product.availableForSale && (
              <span className="bg-black/80 text-mist-lilac text-[10px] sm:text-xs font-medium px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded">
                Sold Out
              </span>
            )}
          </div>

          {/* Wishlist Button - Always visible on mobile */}
          <button
            onClick={handleWishlist}
            className="absolute top-2 sm:top-3 right-2 sm:right-3 z-10 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-mist-lilac hover:bg-burnt-lilac hover:text-white transition-all sm:opacity-0 sm:group-hover:opacity-100 touch-manipulation"
          >
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5"
              fill={isWishlisted ? 'currentColor' : 'none'}
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </button>

          {/* Quick Actions - Desktop only */}
          <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4 translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-10 hidden sm:block">
            <div className="flex gap-2">
              <button
                onClick={handleAddToCart}
                disabled={isAdding || loading || !product.availableForSale}
                className="flex-1 btn-gothic text-xs sm:text-sm py-2.5 sm:py-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {!product.availableForSale ? (
                  'Sold Out'
                ) : isAdding ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Adding...
                  </span>
                ) : (
                  <>
                    <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    Add to Bag
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Overlay for sold out */}
          {!product.availableForSale && (
            <div className="absolute inset-0 bg-black/40" />
          )}
        </div>

        {/* Product Info */}
        <div className="p-3 sm:p-4">
          {/* Brand/Vendor */}
          {product.vendor && (
            <p className="text-burnt-lilac/70 text-[10px] sm:text-xs uppercase tracking-wider mb-0.5 sm:mb-1">
              {product.vendor}
            </p>
          )}
          
          <h3 className="text-mist-lilac font-medium text-xs sm:text-sm group-hover:text-burnt-lilac transition-colors line-clamp-2 min-h-8 sm:min-h-10">
            {product.title}
          </h3>
          
          <div className="mt-1.5 sm:mt-2 flex items-center gap-1.5 sm:gap-2 flex-wrap">
            <span className="text-mist-lilac font-semibold text-sm sm:text-base">
              {formatPrice(price)}
            </span>
            {isOnSale && compareAtPrice && (
              <span className="text-mist-lilac/40 text-xs sm:text-sm line-through">
                {formatPrice(compareAtPrice)}
              </span>
            )}
          </div>

          {/* Mobile Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={isAdding || loading || !product.availableForSale}
            className="sm:hidden w-full mt-3 btn-gothic text-xs py-2.5 disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
          >
            {!product.availableForSale ? 'Sold Out' : isAdding ? 'Adding...' : 'Add to Bag'}
          </button>

          {/* Color variants indicator - Hidden on mobile */}
          {product.options.find(opt => opt.name.toLowerCase() === 'color') && (
            <div className="mt-2 sm:mt-3 hidden sm:flex items-center gap-1">
              <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-black border border-deep-purple/50" />
              <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-deep-purple border border-deep-purple/50" />
              <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-burnt-lilac border border-deep-purple/50" />
              <span className="text-mist-lilac/50 text-[10px] sm:text-xs ml-1">+3</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
