'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/shopify';

export default function CartPageContent() {
  const { cart, loading, updateItem, removeItem } = useCart();

  const lines = cart?.lines.edges || [];

  if (loading && lines.length === 0) {
    return (
      <div className="flex items-center justify-center py-16 sm:py-20">
        <div className="w-8 h-8 sm:w-10 sm:h-10 border-2 border-burnt-lilac border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <div className="text-center py-12 sm:py-20 px-4">
        <svg
          className="w-16 h-16 sm:w-20 sm:h-20 text-deep-purple mx-auto mb-4 sm:mb-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
          />
        </svg>
        <h2 className="text-xl sm:text-2xl font-serif text-mist-lilac mb-3 sm:mb-4">Your Cart is Empty</h2>
        <p className="text-mist-lilac/70 mb-6 sm:mb-8 max-w-md mx-auto text-sm sm:text-base">
          Looks like you haven&apos;t added anything to your cart yet. 
          Explore our collection and find something you love.
        </p>
        <Link href="/products" className="btn-gothic text-sm sm:text-base touch-manipulation">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-12">
      {/* Cart Items */}
      <div className="lg:col-span-2">
        <div className="space-y-4 sm:space-y-6">
          {lines.map(({ node: line }) => (
            <div
              key={line.id}
              className="flex gap-3 sm:gap-6 p-3 sm:p-6 bg-linear-to-r from-deep-purple/10 to-transparent rounded-lg border border-deep-purple/20"
            >
              {/* Product Image */}
              <Link
                href={`/products/${line.merchandise.product.handle}`}
                className="relative w-20 h-20 sm:w-28 sm:h-28 shrink-0 rounded-md overflow-hidden bg-deep-purple/20 touch-manipulation"
              >
                {line.merchandise.product.featuredImage ? (
                  <Image
                    src={line.merchandise.product.featuredImage.url}
                    alt={
                      line.merchandise.product.featuredImage.altText ||
                      line.merchandise.product.title
                    }
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-deep-purple">
                    <svg className="w-8 h-8 sm:w-10 sm:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                )}
              </Link>

              {/* Product Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 sm:gap-4">
                  <div className="min-w-0">
                    <Link
                      href={`/products/${line.merchandise.product.handle}`}
                      className="text-sm sm:text-lg font-medium text-mist-lilac hover:text-burnt-lilac transition-colors line-clamp-2 touch-manipulation"
                    >
                      {line.merchandise.product.title}
                    </Link>
                    {line.merchandise.title !== 'Default Title' && (
                      <p className="text-mist-lilac/60 text-xs sm:text-sm mt-0.5 sm:mt-1 truncate">
                        {line.merchandise.selectedOptions.map((opt) => opt.value).join(' / ')}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => removeItem(line.id)}
                    disabled={loading}
                    className="p-1.5 sm:p-2 text-mist-lilac/50 hover:text-red-400 active:text-red-500 transition-colors disabled:opacity-50 touch-manipulation shrink-0"
                    aria-label="Remove item"
                  >
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>

                <div className="flex items-end justify-between mt-3 sm:mt-4">
                  {/* Quantity Controls */}
                  <div className="flex items-center gap-2 sm:gap-3">
                    <button
                      onClick={() => {
                        if (line.quantity === 1) {
                          removeItem(line.id);
                        } else {
                          updateItem(line.id, line.quantity - 1);
                        }
                      }}
                      disabled={loading}
                      className="w-7 h-7 sm:w-8 sm:h-8 rounded border border-deep-purple/50 flex items-center justify-center text-mist-lilac hover:border-burnt-lilac hover:text-burnt-lilac active:bg-burnt-lilac/10 transition-colors disabled:opacity-50 touch-manipulation"
                      aria-label="Decrease quantity"
                    >
                      <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                      </svg>
                    </button>
                    <span className="text-mist-lilac w-6 sm:w-8 text-center text-sm sm:text-base">{line.quantity}</span>
                    <button
                      onClick={() => updateItem(line.id, line.quantity + 1)}
                      disabled={loading}
                      className="w-7 h-7 sm:w-8 sm:h-8 rounded border border-deep-purple/50 flex items-center justify-center text-mist-lilac hover:border-burnt-lilac hover:text-burnt-lilac active:bg-burnt-lilac/10 transition-colors disabled:opacity-50 touch-manipulation"
                      aria-label="Increase quantity"
                    >
                      <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  </div>

                  {/* Price */}
                  <div className="text-right">
                    <p className="text-burnt-lilac font-medium text-sm sm:text-base">
                      {formatPrice(line.cost.totalAmount)}
                    </p>
                    {line.quantity > 1 && (
                      <p className="text-mist-lilac/50 text-[10px] sm:text-sm">
                        {formatPrice(line.merchandise.price)} each
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Order Summary */}
      <div className="lg:col-span-1">
        <div className="sticky top-24 sm:top-28 p-4 sm:p-6 bg-linear-to-b from-deep-purple/10 to-transparent rounded-lg border border-deep-purple/30">
          <h2 className="text-lg sm:text-xl font-serif text-mist-lilac mb-4 sm:mb-6">Order Summary</h2>

          <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
            <div className="flex justify-between text-mist-lilac/70 text-sm sm:text-base">
              <span>Subtotal</span>
              <span>{cart ? formatPrice(cart.cost.subtotalAmount) : '-'}</span>
            </div>
            <div className="flex justify-between text-mist-lilac/70 text-sm sm:text-base">
              <span>Shipping</span>
              <span className="text-xs sm:text-sm">Calculated at checkout</span>
            </div>
            {cart?.cost.totalTaxAmount && (
              <div className="flex justify-between text-mist-lilac/70 text-sm sm:text-base">
                <span>Tax</span>
                <span>{formatPrice(cart.cost.totalTaxAmount)}</span>
              </div>
            )}
          </div>

          <div className="border-t border-deep-purple/30 pt-3 sm:pt-4 mb-4 sm:mb-6">
            <div className="flex justify-between text-base sm:text-lg font-medium text-mist-lilac">
              <span>Total</span>
              <span>{cart ? formatPrice(cart.cost.totalAmount) : '-'}</span>
            </div>
          </div>

          <a
            href={cart?.checkoutUrl || '#'}
            className="block w-full btn-gothic text-center py-3 sm:py-4 text-sm sm:text-base touch-manipulation"
          >
            Proceed to Checkout
          </a>

          <Link
            href="/products"
            className="block w-full text-center mt-3 sm:mt-4 text-mist-lilac/70 hover:text-mist-lilac active:text-burnt-lilac transition-colors text-xs sm:text-sm touch-manipulation"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
