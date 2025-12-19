'use client';

import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/shopify';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect } from 'react';

export default function CartDrawer() {
  const { cart, loading, cartOpen, setCartOpen, updateItem, removeItem } = useCart();

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
    </>
  );
}
