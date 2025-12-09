'use client';

import { useState, useEffect, Fragment } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShopifyProduct, formatPrice, getProductImageUrl } from '@/lib/shopify';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';

interface ProductQuickViewProps {
    product: ShopifyProduct | null;
    open: boolean;
    onClose: () => void;
}

export default function ProductQuickView({ product, open, onClose }: ProductQuickViewProps) {
    const [selectedVariant, setSelectedVariant] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState(0);
    const { addItem, loading } = useCart();
    const { addItem: addToWishlist, isInWishlist } = useWishlist();

    useEffect(() => {
        if (product) {
            setSelectedVariant(0);
            setQuantity(1);
            setSelectedImage(0);
        }
    }, [product]);

    if (!product) return null;

    const variant = product.variants.edges[selectedVariant]?.node;
    const images = product.images.edges.map((edge) => edge.node);
    const price = variant?.price || product.priceRange.minVariantPrice;
    const compareAtPrice = variant?.compareAtPrice;
    const isOnSale = compareAtPrice && parseFloat(compareAtPrice.amount) > parseFloat(price.amount);

    const handleAddToCart = async () => {
        if (!variant) return;
        await addItem(variant.id, quantity);
        onClose();
    };

    const handleWishlist = () => {
        addToWishlist({
            id: product.id,
            handle: product.handle,
            title: product.title,
            price,
            image: getProductImageUrl(product),
            addedAt: Date.now(),
        });
    };

    // Close on escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        if (open) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [open, onClose]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-black border border-deep-purple/50 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-scale-in">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-mist-lilac hover:text-burnt-lilac hover:bg-black/70 transition-all"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 md:p-8">
                    {/* Images */}
                    <div className="space-y-4">
                        {/* Main Image */}
                        <div className="relative aspect-4/5 rounded-lg overflow-hidden bg-deep-purple/10">
                            <Image
                                src={images[selectedImage]?.url || getProductImageUrl(product)}
                                alt={images[selectedImage]?.altText || product.title}
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 100vw, 50vw"
                            />
                            {isOnSale && (
                                <span className="absolute top-3 left-3 bg-burnt-lilac text-white text-xs font-bold px-3 py-1 rounded">
                                    SALE
                                </span>
                            )}
                        </div>

                        {/* Thumbnail Gallery */}
                        {images.length > 1 && (
                            <div className="flex gap-2 overflow-x-auto pb-2">
                                {images.map((image, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedImage(index)}
                                        className={`relative shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 transition-all ${selectedImage === index
                                                ? 'border-burnt-lilac'
                                                : 'border-deep-purple/30 hover:border-burnt-lilac/50'
                                            }`}
                                    >
                                        <Image
                                            src={image.url}
                                            alt={image.altText || `${product.title} view ${index + 1}`}
                                            fill
                                            className="object-cover"
                                            sizes="80px"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Info */}
                    <div className="flex flex-col">
                        {/* Vendor */}
                        {product.vendor && (
                            <p className="text-burnt-lilac/70 text-xs uppercase tracking-wider mb-2">
                                {product.vendor}
                            </p>
                        )}

                        {/* Title */}
                        <h2 className="text-2xl md:text-3xl font-serif text-mist-lilac mb-4">
                            {product.title}
                        </h2>

                        {/* Price */}
                        <div className="flex items-center gap-3 mb-6">
                            <span className="text-2xl font-semibold text-mist-lilac">
                                {formatPrice(price)}
                            </span>
                            {isOnSale && compareAtPrice && (
                                <span className="text-lg text-mist-lilac/40 line-through">
                                    {formatPrice(compareAtPrice)}
                                </span>
                            )}
                        </div>

                        {/* Description */}
                        <div
                            className="text-mist-lilac/70 text-sm leading-relaxed mb-6 max-h-32 overflow-y-auto"
                            dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
                        />

                        {/* Options */}
                        {product.options.map((option) => (
                            <div key={option.id} className="mb-4">
                                <label className="text-sm font-medium text-mist-lilac mb-2 block">
                                    {option.name}
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {option.values.map((value, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setSelectedVariant(index)}
                                            className={`px-4 py-2 text-sm rounded border transition-all ${selectedVariant === index
                                                    ? 'bg-burnt-lilac border-burnt-lilac text-white'
                                                    : 'border-deep-purple/50 text-mist-lilac hover:border-burnt-lilac/50'
                                                }`}
                                        >
                                            {value}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}

                        {/* Quantity */}
                        <div className="mb-6">
                            <label className="text-sm font-medium text-mist-lilac mb-2 block">
                                Quantity
                            </label>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="w-10 h-10 rounded border border-deep-purple/50 flex items-center justify-center text-mist-lilac hover:border-burnt-lilac/50 transition-colors"
                                >
                                    −
                                </button>
                                <span className="text-mist-lilac font-medium w-12 text-center">
                                    {quantity}
                                </span>
                                <button
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="w-10 h-10 rounded border border-deep-purple/50 flex items-center justify-center text-mist-lilac hover:border-burnt-lilac/50 transition-colors"
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="space-y-3 mt-auto">
                            <button
                                onClick={handleAddToCart}
                                disabled={loading || !product.availableForSale}
                                className="w-full btn-gothic py-4 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {!product.availableForSale ? 'Sold Out' : loading ? 'Adding...' : 'Add to Cart'}
                            </button>

                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    onClick={handleWishlist}
                                    className="btn-gothic-outline py-3 flex items-center justify-center gap-2"
                                >
                                    <svg className="w-5 h-5" fill={isInWishlist(product.id) ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                    </svg>
                                    Wishlist
                                </button>
                                <Link
                                    href={`/products/${product.handle}`}
                                    className="btn-gothic-outline py-3 flex items-center justify-center"
                                >
                                    Full Details
                                </Link>
                            </div>
                        </div>

                        {/* Trust Badges */}
                        <div className="mt-6 pt-6 border-t border-deep-purple/30 space-y-2">
                            <div className="flex items-center gap-2 text-sm text-mist-lilac/70">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                                </svg>
                                Free shipping on orders over $50
                            </div>
                            <div className="flex items-center gap-2 text-sm text-mist-lilac/70">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                30-day hassle-free returns
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
