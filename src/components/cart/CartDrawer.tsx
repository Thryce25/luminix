'use client';

import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { formatPrice } from '@/lib/shopify';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function CartDrawer() {
  const { cart, loading, cartOpen, setCartOpen, updateItem, removeItem } = useCart();
  const { user } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Prevent body scroll when cart is open
  useEffect(() => {
    if (cartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [cartOpen]);

  if (!cartOpen) return null;

  const lines = cart?.lines.edges || [];
  const itemCount = lines.reduce((acc, { node }) => acc + node.quantity, 0);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 transition-opacity duration-300"
        onClick={() => setCartOpen(false)}
      />

      {/* Drawer - Full width on mobile, max-width on larger screens */}
      <div className="fixed right-0 top-0 h-full w-full sm:max-w-md bg-black border-l border-mist-lilac/10 z-50 flex flex-col shadow-2xl transform transition-transform duration-300 safe-area-inset">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-mist-lilac/10 bg-deep-purple/10">
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-burnt-lilac" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <div>
              <h2 className="text-lg sm:text-xl font-serif text-mist-lilac">Shopping Bag</h2>
              <p className="text-mist-lilac/50 text-xs sm:text-sm">{itemCount} {itemCount === 1 ? 'item' : 'items'}</p>
            </div>
          </div>
          <button
            onClick={() => setCartOpen(false)}
            className="p-2.5 sm:p-2 text-mist-lilac/70 hover:text-mist-lilac hover:bg-mist-lilac/10 rounded-full transition-colors touch-manipulation"
            aria-label="Close cart"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto overscroll-contain">
          {loading && lines.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="w-10 h-10 border-2 border-burnt-lilac border-t-transparent rounded-full animate-spin" />
            </div>
          ) : lines.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-6 sm:px-8">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-deep-purple/20 flex items-center justify-center mb-6">
                <svg className="w-10 h-10 sm:w-12 sm:h-12 text-mist-lilac/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-serif text-mist-lilac mb-2">Your bag is empty</h3>
              <p className="text-mist-lilac/50 text-xs sm:text-sm mb-8">
                Looks like you haven't added anything yet. Explore our collections to find something you'll love.
              </p>
              <button
                onClick={() => setCartOpen(false)}
                className="btn-gothic px-8 touch-manipulation"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <ul className="divide-y divide-mist-lilac/10">
              {lines.map(({ node: line }) => (
                <li key={line.id} className="p-4 hover:bg-deep-purple/5 transition-colors">
                  <div className="flex gap-3 sm:gap-4">
                    {/* Product Image */}
                    <Link 
                      href={`/products/${line.merchandise.product.handle}`}
                      onClick={() => setCartOpen(false)}
                      className="relative w-20 h-24 sm:w-24 sm:h-28 shrink-0 rounded-lg overflow-hidden bg-deep-purple/20 group touch-manipulation"
                    >
                      {line.merchandise.product.featuredImage ? (
                        <Image
                          src={line.merchandise.product.featuredImage.url}
                          alt={line.merchandise.product.featuredImage.altText || line.merchandise.product.title}
                          fill
                          sizes="96px"
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-mist-lilac/30">
                          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                    </Link>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <Link 
                        href={`/products/${line.merchandise.product.handle}`}
                        onClick={() => setCartOpen(false)}
                        className="text-mist-lilac font-medium text-sm sm:text-base hover:text-burnt-lilac transition-colors line-clamp-2 touch-manipulation"
                      >
                        {line.merchandise.product.title}
                      </Link>
                      
                      {line.merchandise.title !== 'Default Title' && (
                        <p className="text-mist-lilac/50 text-xs sm:text-sm mt-0.5 sm:mt-1">
                          {line.merchandise.selectedOptions.map(opt => opt.value).join(' / ')}
                        </p>
                      )}

                      {/* Price */}
                      <div className="mt-1 sm:mt-2 flex items-center gap-2">
                        <span className="text-burnt-lilac font-semibold text-sm sm:text-base">
                          {formatPrice(line.merchandise.price)}
                        </span>
                        {line.quantity > 1 && (
                          <span className="text-mist-lilac/40 text-xs sm:text-sm">
                            x {line.quantity}
                          </span>
                        )}
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between mt-2 sm:mt-3">
                        <div className="flex items-center border border-mist-lilac/20 rounded-lg overflow-hidden">
                          <button
                            onClick={() => {
                              if (line.quantity === 1) {
                                removeItem(line.id);
                              } else {
                                updateItem(line.id, line.quantity - 1);
                              }
                            }}
                            disabled={loading}
                            className="w-8 h-8 sm:w-8 sm:h-8 flex items-center justify-center text-mist-lilac/70 hover:text-mist-lilac hover:bg-mist-lilac/10 transition-colors disabled:opacity-50 touch-manipulation"
                            aria-label="Decrease quantity"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                            </svg>
                          </button>
                          <span className="w-8 sm:w-10 text-center text-mist-lilac text-sm font-medium">
                            {line.quantity}
                          </span>
                          <button
                            onClick={() => updateItem(line.id, line.quantity + 1)}
                            disabled={loading}
                            className="w-8 h-8 sm:w-8 sm:h-8 flex items-center justify-center text-mist-lilac/70 hover:text-mist-lilac hover:bg-mist-lilac/10 transition-colors disabled:opacity-50 touch-manipulation"
                            aria-label="Increase quantity"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                          </button>
                        </div>

                        <button
                          onClick={() => removeItem(line.id)}
                          disabled={loading}
                          className="text-mist-lilac/40 hover:text-red-400 transition-colors disabled:opacity-50 text-xs sm:text-sm flex items-center gap-1 touch-manipulation p-2 -mr-2"
                          aria-label="Remove item"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          <span className="hidden sm:inline">Remove</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {lines.length > 0 && cart && (
          <div className="border-t border-mist-lilac/10 bg-deep-purple/5 safe-area-bottom">
            {/* Order Summary */}
            <div className="p-4 space-y-2 sm:space-y-3">
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <span className="text-mist-lilac/60">Subtotal</span>
                <span className="text-mist-lilac">
                  {formatPrice(cart.cost.subtotalAmount)}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <span className="text-mist-lilac/60">Shipping</span>
                <span className="text-mist-lilac/60">Calculated at checkout</span>
              </div>
              <div className="flex items-center justify-between pt-2 sm:pt-3 border-t border-mist-lilac/10">
                <span className="text-mist-lilac font-medium text-sm sm:text-base">Estimated Total</span>
                <span className="text-mist-lilac font-semibold text-base sm:text-lg">
                  {formatPrice(cart.cost.subtotalAmount)}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="p-4 pt-0 space-y-2 sm:space-y-3">
              {cart.checkoutUrl ? (
                <>
                  {user ? (
                    <a
                      href={cart.checkoutUrl}
                      target="_self"
                      rel="noopener"
                      onClick={() => {
                        // Close the cart drawer when navigating to checkout
                        setCartOpen(false);
                      }}
                      className="btn-gothic w-full text-center block py-3 sm:py-3 touch-manipulation text-sm sm:text-base"
                    >
                      Checkout
                    </a>
                  ) : (
                    <button
                      onClick={() => {
                        setCartOpen(false);
                        setShowAuthModal(true);
                      }}
                      className="btn-gothic w-full text-center block py-3 sm:py-3 touch-manipulation text-sm sm:text-base"
                    >
                      Sign In to Checkout
                    </button>
                  )}
                </>
              ) : (
                <button
                  disabled
                  className="btn-gothic w-full text-center block py-3 sm:py-3 touch-manipulation text-sm sm:text-base opacity-50 cursor-not-allowed"
                >
                  Checkout Unavailable
                </button>
              )}
              <Link
                href="/cart"
                onClick={() => setCartOpen(false)}
                className="btn-gothic-outline w-full text-center block py-3 text-xs sm:text-sm touch-manipulation"
              >
                View Full Bag
              </Link>
            </div>

            {/* Payment Methods */}
            <div className="px-4 pb-4">
              <p className="text-mist-lilac/30 text-[10px] sm:text-xs text-center mt-2">
                Secure checkout powered by Shopify
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Authentication Modal - Dark Theme */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-lg z-60 flex items-center justify-center p-4 animate-fadeIn">
          {/* Subtle Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-burnt-lilac/5 rounded-full blur-3xl animate-float" />
            <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-600/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
          </div>

          <div className="relative bg-black/98 backdrop-blur-xl rounded-3xl border border-white/10 max-w-md w-full p-8 sm:p-10 shadow-2xl shadow-black/50 animate-scaleIn overflow-hidden">
            {/* Very Subtle Border Glow */}
            <div className="absolute inset-0 rounded-3xl bg-linear-to-r from-burnt-lilac/10 via-transparent to-burnt-lilac/10 animate-pulse opacity-30" />
            
            {/* Close Button */}
            <button
              onClick={() => setShowAuthModal(false)}
              className="absolute top-6 right-6 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white/5 backdrop-blur-sm text-white/40 hover:text-white hover:bg-white/10 hover:rotate-90 transition-all duration-300 group"
              aria-label="Close"
            >
              <svg className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Minimal Decorative Elements */}
            <div className="absolute top-10 left-10 w-20 h-20 border border-white/5 rounded-full animate-float" />
            <div className="absolute bottom-10 right-10 w-16 h-16 border border-white/5 rounded-lg rotate-45 animate-float" style={{ animationDelay: '1.5s' }} />

            <div className="relative z-10 text-center mb-8">
              {/* Icon Container */}
              <div className="relative mx-auto w-24 h-24 mb-6">
                {/* Subtle Rings */}
                <div className="absolute inset-2 bg-white/5 rounded-full animate-pulse" />
                
                {/* Main Icon Circle */}
                <div className="absolute inset-0 bg-linear-to-br from-white/10 to-white/5 rounded-full flex items-center justify-center shadow-lg shadow-black/50 animate-scaleIn border border-white/10">
                  <svg className="w-12 h-12 text-white relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>

              <h2 className="text-3xl sm:text-4xl font-serif mb-3 text-white animate-slideUp">
                Sign In Required
              </h2>
              <div className="flex items-center justify-center gap-3 mb-3">
                <div className="h-px w-12 bg-linear-to-r from-transparent via-white/20 to-white/40" />
                <div className="w-1.5 h-1.5 rounded-full bg-white/30 animate-pulse" />
                <div className="h-px w-12 bg-linear-to-l from-transparent via-white/20 to-white/40" />
              </div>
              <p className="text-white/60 text-base leading-relaxed max-w-xs mx-auto">
                Please sign in or create an account to proceed with your secure checkout
              </p>
            </div>

            <div className="relative z-10 space-y-4">
              <Link
                href="/account?action=signin"
                className="group relative block w-full py-4 rounded-xl overflow-hidden transition-all duration-500 hover:scale-105 hover:shadow-xl hover:shadow-purple-600/30 touch-manipulation"
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    localStorage.setItem('redirectAfterAuth', '/cart');
                  }
                  setShowAuthModal(false);
                }}
              >
                <div className="absolute inset-0 bg-linear-to-r from-purple-600 via-burnt-lilac to-purple-600" />
                <div className="absolute inset-0 bg-linear-to-r from-burnt-lilac via-purple-600 to-burnt-lilac opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative z-10 flex items-center justify-center gap-2 text-white font-semibold text-lg">
                  <svg className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  Sign In
                </span>
              </Link>

              <Link
                href="/account?action=signup"
                className="group relative block w-full py-4 rounded-xl overflow-hidden bg-black backdrop-blur-sm border border-purple-600/40 hover:border-purple-600/80 hover:bg-purple-600/10 transition-all duration-500 hover:scale-105 hover:shadow-xl hover:shadow-purple-600/20 touch-manipulation"
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    localStorage.setItem('redirectAfterAuth', '/cart');
                  }
                  setShowAuthModal(false);
                }}
              >
                <span className="relative z-10 flex items-center justify-center gap-2 text-purple-300 font-semibold text-lg group-hover:text-white transition-colors duration-300">
                  <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                  Create Account
                </span>
              </Link>
            </div>

            <div className="relative z-10 mt-6 pt-6 border-t border-white/10">
              <div className="flex items-center justify-center gap-2 text-white/40">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                <p className="text-xs">
                  Secure checkout with account verification
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
