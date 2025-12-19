'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ShopifyProduct, ShopifyProductVariant, formatPrice, getProductImageUrl } from '@/lib/shopify';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';

interface ProductDetailsProps {
  product: ShopifyProduct;
}

export default function ProductDetails({ product }: ProductDetailsProps) {
  const { addItem, loading } = useCart();
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlist();
  const [selectedVariant, setSelectedVariant] = useState<ShopifyProductVariant>(
    product.variants.edges[0]?.node
  );
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(
    product.variants.edges[0]?.node.selectedOptions.reduce(
      (acc, opt) => ({ ...acc, [opt.name]: opt.value }),
      {}
    ) || {}
  );
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [isTogglingWishlist, setIsTogglingWishlist] = useState(false);

  const isWishlisted = isInWishlist(product.id);

  // Map color names to hex codes for display
  const colorHexMap: Record<string, string> = {
    'Black': '#000000',
    'White': '#FFFFFF',
    'Gray': '#6B7280',
    'Grey': '#6B7280',
    'Navy': '#1E3A8A',
    'Navy Blazer': '#1E3A8A',
    'Red': '#DC2626',
    'Blue': '#3B82F6',
    'Royal Blue': '#2563EB',
    'Sky Blue': '#0EA5E9',
    'Green': '#10B981',
    'Forest Green': '#059669',
    'Yellow': '#EAB308',
    'Orange': '#F97316',
    'Pink': '#EC4899',
    'Purple': '#A855F7',
    'Brown': '#92400E',
    'Beige': '#D4A373',
    'Cream': '#FEF3C7',
    'Maroon': '#7F1D1D',
    'Burgundy': '#991B1B',
  };

  // Find the Color option from product options
  const colorOption = product.options.find(
    (opt) => opt.name.toLowerCase() === 'color' || opt.name.toLowerCase() === 'colour'
  );

  const images = product.images.edges.map((edge) => edge.node);
  const currentImage = images[selectedImageIndex] || product.featuredImage;

  // Find variant based on selected options
  const findVariant = (options: Record<string, string>) => {
    return product.variants.edges.find(({ node }) =>
      node.selectedOptions.every((opt) => options[opt.name] === opt.value)
    )?.node;
  };

  const handleOptionChange = (optionName: string, value: string) => {
    const newOptions = { ...selectedOptions, [optionName]: value };
    setSelectedOptions(newOptions);

    const variant = findVariant(newOptions);
    if (variant) {
      setSelectedVariant(variant);
      // Update image if variant has one
      if (variant.image) {
        const imageIndex = images.findIndex((img) => img.url === variant.image?.url);
        if (imageIndex !== -1) {
          setSelectedImageIndex(imageIndex);
        }
      }
    }
  };

  const handleAddToCart = async () => {
    if (!selectedVariant) return;

    setIsAdding(true);
    await addItem(selectedVariant.id, quantity);
    setIsAdding(false);
  };

  const handleToggleWishlist = async () => {
    setIsTogglingWishlist(true);
    try {
      if (isWishlisted) {
        await removeFromWishlist(product.id);
      } else {
        await addToWishlist(product);
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
    } finally {
      setIsTogglingWishlist(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 xl:gap-16">
      {/* Image Gallery */}
      <div className="space-y-3 sm:space-y-4">
        {/* Main Image */}
        <div className="relative aspect-square sm:aspect-square bg-deep-purple/10 rounded-lg overflow-hidden">
          {currentImage && (
            <Image
              src={currentImage.url}
              alt={currentImage.altText || product.title}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
              priority
            />
          )}
        </div>

        {/* Thumbnail Gallery - Horizontal scroll on mobile */}
        {images.length > 1 && (
          <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
            {images.map((image, index) => (
              <button
                key={image.url}
                onClick={() => setSelectedImageIndex(index)}
                className={`relative w-16 h-16 sm:w-20 sm:h-20 shrink-0 rounded-md overflow-hidden border-2 transition-all touch-manipulation ${
                  selectedImageIndex === index
                    ? 'border-burnt-lilac'
                    : 'border-deep-purple/30 hover:border-burnt-lilac/50'
                }`}
              >
                <Image
                  src={image.url}
                  alt={image.altText || `${product.title} - Image ${index + 1}`}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="lg:py-4">
        {/* Breadcrumb - Hidden on mobile */}
        <nav className="hidden sm:block text-sm text-mist-lilac/60 mb-4">
          <span className="hover:text-mist-lilac cursor-pointer">Shop</span>
          <span className="mx-2">/</span>
          <span className="text-mist-lilac">{product.title}</span>
        </nav>

        {/* Title & Price */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif text-mist-lilac mb-3 sm:mb-4">
          {product.title}
        </h1>

        <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
          <span className="text-xl sm:text-2xl text-burnt-lilac font-medium">
            {formatPrice(selectedVariant?.price || product.priceRange.minVariantPrice)}
          </span>
          {selectedVariant?.compareAtPrice &&
            parseFloat(selectedVariant.compareAtPrice.amount) >
              parseFloat(selectedVariant.price.amount) && (
              <span className="text-base sm:text-lg text-mist-lilac/50 line-through">
                {formatPrice(selectedVariant.compareAtPrice)}
              </span>
            )}
        </div>

        {/* Description - Collapsible on mobile */}
        <div
          className="prose prose-invert prose-sm max-w-none mb-6 sm:mb-8 text-mist-lilac/80 text-sm sm:text-base"
          dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
        />

        {/* Color Selection - Only show if product has color option */}
        {colorOption && (
          <div className="mb-4 sm:mb-6">
            <label className="block text-sm font-medium text-mist-lilac mb-2 sm:mb-3">
              {colorOption.name} {selectedOptions[colorOption.name] && <span className="text-burnt-lilac">- {selectedOptions[colorOption.name]}</span>}
            </label>
            <div className="flex flex-wrap gap-3">
              {colorOption.values.map((colorValue) => {
                const isSelected = selectedOptions[colorOption.name] === colorValue;
                // Check if this color combination is available
                const colorVariant = findVariant({
                  ...selectedOptions,
                  [colorOption.name]: colorValue,
                });
                const isAvailable = colorVariant?.availableForSale ?? false;
                const hexColor = colorHexMap[colorValue] || '#6B7280'; // Default to gray if color not mapped

                return (
                  <button
                    key={colorValue}
                    onClick={() => handleOptionChange(colorOption.name, colorValue)}
                    disabled={!isAvailable}
                    className={`group relative flex flex-col items-center gap-1.5 transition-all ${
                      isSelected ? 'scale-110' : isAvailable ? 'hover:scale-105' : 'opacity-50 cursor-not-allowed'
                    }`}
                    title={colorValue}
                  >
                    <div
                      className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 transition-all ${
                        isSelected
                          ? 'border-burnt-lilac ring-2 ring-burnt-lilac/30'
                          : isAvailable
                          ? 'border-deep-purple/30 hover:border-burnt-lilac/50'
                          : 'border-deep-purple/10'
                      } ${colorValue.toLowerCase().includes('white') ? 'ring-1 ring-inset ring-gray-300' : ''} ${!isAvailable ? 'relative' : ''}`}
                      style={{ backgroundColor: hexColor }}
                    >
                      {!isAvailable && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-full h-0.5 bg-red-500 rotate-45"></div>
                        </div>
                      )}
                    </div>
                    <span className={`text-xs transition-colors ${
                      isSelected ? 'text-burnt-lilac' : isAvailable ? 'text-mist-lilac/70 group-hover:text-burnt-lilac' : 'text-mist-lilac/30 line-through'
                    }`}>
                      {colorValue}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Options (excluding Color since we already displayed it) */}
        {product.options.filter(option => option.name.toLowerCase() !== 'color' && option.name.toLowerCase() !== 'colour').map((option) => (
          <div key={option.id} className="mb-4 sm:mb-6">
            <label className="block text-sm font-medium text-mist-lilac mb-2 sm:mb-3">
              {option.name}
            </label>
            <div className="flex flex-wrap gap-2">
              {option.values.map((value) => {
                const isSelected = selectedOptions[option.name] === value;
                // Check if this option combination is available
                const optionVariant = findVariant({
                  ...selectedOptions,
                  [option.name]: value,
                });
                const isAvailable = optionVariant?.availableForSale ?? false;

                return (
                  <button
                    key={value}
                    onClick={() => handleOptionChange(option.name, value)}
                    disabled={!isAvailable}
                    className={`px-3 sm:px-4 py-2 rounded border text-xs sm:text-sm transition-all touch-manipulation min-w-11 min-h-11 sm:min-w-0 sm:min-h-0 ${
                      isSelected
                        ? 'bg-burnt-lilac border-burnt-lilac text-white'
                        : isAvailable
                        ? 'border-deep-purple/50 text-mist-lilac hover:border-burnt-lilac active:bg-burnt-lilac/20'
                        : 'border-deep-purple/20 text-mist-lilac/30 cursor-not-allowed line-through'
                    }`}
                  >
                    {value}
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        {/* Quantity */}
        <div className="mb-6 sm:mb-8">
          <label className="block text-sm font-medium text-mist-lilac mb-2 sm:mb-3">
            Quantity
          </label>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-11 h-11 sm:w-10 sm:h-10 rounded border border-deep-purple/50 flex items-center justify-center text-mist-lilac hover:border-burnt-lilac transition-colors touch-manipulation"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </button>
            <span className="w-12 text-center text-mist-lilac text-base sm:text-lg">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-11 h-11 sm:w-10 sm:h-10 rounded border border-deep-purple/50 flex items-center justify-center text-mist-lilac hover:border-burnt-lilac transition-colors touch-manipulation"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
        </div>

        {/* Add to Cart Button - Sticky on mobile */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-black border-t border-deep-purple/30 sm:relative sm:p-0 sm:border-0 sm:bg-transparent z-40">
          <div className="flex gap-3">
            <button
              onClick={handleToggleWishlist}
              disabled={isTogglingWishlist}
              className="btn-gothic-outline py-4 px-6 disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
            >
              {isTogglingWishlist ? (
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : (
                <svg 
                  className="w-5 h-5" 
                  fill={isWishlisted ? 'currentColor' : 'none'} 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              )}
            </button>
            <button
              onClick={handleAddToCart}
              disabled={isAdding || loading || !selectedVariant?.availableForSale}
              className="flex-1 btn-gothic py-4 text-base sm:text-lg disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
            >
              {!selectedVariant?.availableForSale ? (
                'Sold Out'
              ) : isAdding ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Adding to Cart...
                </span>
              ) : (
                'Add to Cart'
              )}
            </button>
          </div>
        </div>

        {/* Spacer for fixed button on mobile */}
        <div className="h-20 sm:hidden" />

        {/* Product Details */}
        <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-deep-purple/20 space-y-3 sm:space-y-4">
          {product.vendor && (
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="text-mist-lilac/60">Vendor</span>
              <span className="text-mist-lilac">{product.vendor}</span>
            </div>
          )}
          {product.productType && (
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="text-mist-lilac/60">Type</span>
              <span className="text-mist-lilac">{product.productType}</span>
            </div>
          )}
          {product.tags.length > 0 && (
            <div className="flex items-start justify-between text-xs sm:text-sm">
              <span className="text-mist-lilac/60">Tags</span>
              <div className="flex flex-wrap gap-1.5 sm:gap-2 justify-end max-w-[180px] sm:max-w-[200px]">
                {product.tags.slice(0, 5).map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 bg-deep-purple/30 rounded text-[10px] sm:text-xs text-mist-lilac"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
