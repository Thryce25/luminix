'use client';

import { useState, useEffect } from 'react';
import { useWishlist } from '@/context/WishlistContext';
import Link from 'next/link';
import Image from 'next/image';
import { formatPrice } from '@/lib/shopify';
import { useCart } from '@/context/CartContext';
import FloatingBackground from '@/components/common/FloatingBackground';

export default function WishlistView() {
    const { items, removeItem, clearWishlist } = useWishlist();
    const { addItem } = useCart();
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        setIsLoaded(true);
    }, []);

    const handleMoveToCart = async (item: any) => {
        removeItem(item.id);
    };

    return (
        <div className="min-h-screen bg-black overflow-hidden">
            {/* Jaw-dropping Animated Background */}
            <FloatingBackground />

            {/* Hero Section */}
            <section className="relative pt-24 pb-12 sm:pt-32 sm:pb-16 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    {/* Floating Shapes */}
                    <div className="absolute top-20 left-[10%] w-20 h-20 border border-pink-500/20 rounded-full animate-float" />
                    <div className="absolute top-40 right-[15%] w-32 h-32 border border-mist-lilac/10 rounded-full animate-float" style={{ animationDelay: '1s' }} />
                    <div className="absolute bottom-20 left-[20%] w-16 h-16 bg-pink-500/5 rounded-lg rotate-45 animate-float" style={{ animationDelay: '2s' }} />
                    <div className="absolute top-32 left-[40%] w-8 h-8 bg-mist-lilac/10 rounded-full animate-pulse" />
                    <div className="absolute bottom-32 right-[30%] w-24 h-24 border border-pink-500/10 rotate-12 animate-float" style={{ animationDelay: '1.5s' }} />
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        {/* Breadcrumb */}
                        <nav 
                            className={`flex items-center justify-center gap-2 text-sm text-mist-lilac/60 mb-8 transition-all duration-700 ${
                                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                            }`}
                        >
                            <Link href="/" className="hover:text-burnt-lilac transition-colors">Home</Link>
                            <span>/</span>
                            <span className="text-mist-lilac">Wishlist</span>
                        </nav>

                        {/* Animated Heart Icon */}
                        <div 
                            className={`relative mx-auto w-24 h-24 mb-8 transition-all duration-700 delay-100 ${
                                isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
                            }`}
                        >
                            <div className="absolute inset-0 bg-linear-to-br from-pink-500/30 to-burnt-lilac/20 rounded-2xl rotate-6 animate-pulse" />
                            <div className="absolute inset-0 bg-linear-to-br from-deep-purple/80 to-pink-900/50 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/10">
                                <svg className="w-12 h-12 text-pink-400" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                            </div>
                            {/* Item count badge */}
                            {items.length > 0 && (
                                <div className="absolute -top-2 -right-2 w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-pink-500/50 animate-bounce">
                                    {items.length}
                                </div>
                            )}
                        </div>

                        <h1 
                            className={`text-4xl sm:text-5xl md:text-6xl font-serif mb-4 transition-all duration-700 delay-200 ${
                                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                            }`}
                        >
                            <span className="bg-linear-to-r from-white via-pink-200 to-burnt-lilac bg-clip-text text-transparent">
                                My Wishlist
                            </span>
                        </h1>
                        <p 
                            className={`text-mist-lilac/70 max-w-2xl mx-auto text-base sm:text-lg transition-all duration-700 delay-300 ${
                                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                            }`}
                        >
                            {items.length} {items.length === 1 ? 'item' : 'items'} saved for later
                        </p>

                        {/* Clear All Button */}
                        {items.length > 0 && (
                            <button
                                onClick={clearWishlist}
                                className={`mt-6 px-6 py-2 bg-white/5 backdrop-blur-sm rounded-full text-mist-lilac/70 text-sm border border-white/10 hover:bg-white/10 hover:text-pink-400 hover:border-pink-400/30 transition-all duration-300 ${
                                    isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                                }`}
                            >
                                Clear All
                            </button>
                        )}

                        {/* Decorative Line */}
                        <div 
                            className={`mt-8 flex items-center justify-center gap-4 transition-all duration-700 delay-400 ${
                                isLoaded ? 'opacity-100' : 'opacity-0'
                            }`}
                        >
                            <div className="h-px w-16 bg-linear-to-r from-transparent to-pink-500/50" />
                            <div className="w-2 h-2 rounded-full bg-pink-500 animate-pulse" />
                            <div className="h-px w-16 bg-linear-to-l from-transparent to-pink-500/50" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Wishlist Content */}
            <section className="relative z-10 py-8 sm:py-12 pb-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {items.length > 0 ? (
                        <div 
                            className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6 transition-all duration-700 delay-500 ${
                                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                            }`}
                        >
                            {items.map((item, index) => (
                                <div 
                                    key={item.id} 
                                    className="group"
                                    style={{
                                        animation: 'fadeInUp 0.6s ease-out forwards',
                                        animationDelay: `${index * 100}ms`,
                                        opacity: 0,
                                    }}
                                >
                                    <Link href={`/products/${item.handle}`} className="block">
                                        <div className="relative bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden hover:border-pink-400/30 hover:shadow-lg hover:shadow-pink-500/10 transition-all duration-300 group-hover:scale-[1.02]">
                                            {/* Image */}
                                            <div className="relative aspect-4/5 overflow-hidden bg-deep-purple/10">
                                                <Image
                                                    src={item.image}
                                                    alt={item.title}
                                                    fill
                                                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                                                />

                                                {/* Gradient Overlay */}
                                                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                                {/* Remove Button */}
                                                <button
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        removeItem(item.id);
                                                    }}
                                                    className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/70 backdrop-blur-sm flex items-center justify-center text-mist-lilac hover:text-pink-400 hover:bg-black transition-all opacity-0 group-hover:opacity-100"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </button>

                                                {/* Heart Badge */}
                                                <div className="absolute top-2 left-2 w-8 h-8 rounded-full bg-pink-500/80 backdrop-blur-sm flex items-center justify-center text-white">
                                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                                    </svg>
                                                </div>
                                            </div>

                                            {/* Info */}
                                            <div className="p-3 sm:p-4">
                                                <h3 className="text-sm text-mist-lilac group-hover:text-pink-300 transition-colors line-clamp-2 mb-2">
                                                    {item.title}
                                                </h3>
                                                <p className="text-base font-semibold bg-linear-to-r from-pink-400 to-burnt-lilac bg-clip-text text-transparent">
                                                    {formatPrice(item.price)}
                                                </p>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div 
                            className={`text-center py-20 transition-all duration-700 delay-500 ${
                                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                            }`}
                        >
                            {/* Empty State with Glassmorphism */}
                            <div className="max-w-md mx-auto p-8 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
                                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-linear-to-br from-pink-500/20 to-burnt-lilac/20 flex items-center justify-center">
                                    <svg className="w-12 h-12 text-mist-lilac/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                    </svg>
                                </div>
                                <h2 className="text-2xl font-serif text-mist-lilac mb-4">
                                    Your Wishlist is Empty
                                </h2>
                                <p className="text-mist-lilac/70 mb-8">
                                    Start adding items you love to your wishlist. They'll be saved here for easy access.
                                </p>
                                <Link 
                                    href="/products" 
                                    className="inline-flex items-center gap-2 px-8 py-3 bg-linear-to-r from-pink-500 to-burnt-lilac rounded-xl text-white font-medium hover:shadow-lg hover:shadow-pink-500/30 hover:scale-105 transition-all duration-300"
                                >
                                    Explore Products
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* Decorative bottom fade */}
            <div className="fixed bottom-0 left-0 right-0 h-32 bg-linear-to-t from-black to-transparent pointer-events-none z-0" />
        </div>
    );
}
