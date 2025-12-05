'use client';

import { useWishlist } from '@/context/WishlistContext';
import Link from 'next/link';
import Image from 'next/image';
import { formatPrice } from '@/lib/shopify';
import { useCart } from '@/context/CartContext';

export default function WishlistView() {
    const { items, removeItem, clearWishlist } = useWishlist();
    const { addItem } = useCart();

    const handleMoveToCart = async (item: any) => {
        // This is simplified - in production, we'd need to fetch the variant ID
        // For now, we'll just remove from wishlist
        removeItem(item.id);
    };

    return (
        <div className="min-h-screen bg-black gothic-texture">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-serif text-mist-lilac mb-2">
                            My Wishlist
                        </h1>
                        <p className="text-mist-lilac/70">
                            {items.length} {items.length === 1 ? 'item' : 'items'} saved
                        </p>
                    </div>
                    {items.length > 0 && (
                        <button
                            onClick={clearWishlist}
                            className="text-sm text-mist-lilac/70 hover:text-burnt-lilac transition-colors"
                        >
                            Clear All
                        </button>
                    )}
                </div>

                {items.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {items.map((item) => (
                            <div key={item.id} className="group">
                                <Link href={`/products/${item.handle}`} className="block">
                                    <div className="card-gothic">
                                        {/* Image */}
                                        <div className="relative aspect-4/5 overflow-hidden bg-deep-purple/10">
                                            <Image
                                                src={item.image}
                                                alt={item.title}
                                                fill
                                                className="object-cover group-hover:scale-110 transition-transform duration-500"
                                            />

                                            {/* Remove Button */}
                                            <button
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    removeItem(item.id);
                                                }}
                                                className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/70 backdrop-blur-sm flex items-center justify-center text-mist-lilac hover:text-burnt-lilac hover:bg-black transition-all opacity-0 group-hover:opacity-100"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>

                                        {/* Info */}
                                        <div className="p-3">
                                            <h3 className="text-sm text-mist-lilac group-hover:text-burnt-lilac transition-colors line-clamp-2 mb-2">
                                                {item.title}
                                            </h3>
                                            <p className="text-base font-semibold text-burnt-lilac">
                                                {formatPrice(item.price)}
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-deep-purple/20 flex items-center justify-center">
                            <svg className="w-10 h-10 text-mist-lilac/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-serif text-mist-lilac mb-4">
                            Your Wishlist is Empty
                        </h2>
                        <p className="text-mist-lilac/70 mb-8 max-w-md mx-auto">
                            Start adding items you love to your wishlist. They'll be saved here for easy access.
                        </p>
                        <Link href="/products" className="btn-gothic">
                            Explore Products
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
