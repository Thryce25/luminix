'use client';

import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/shopify';
import Image from 'next/image';
import Link from 'next/link';

export default function CartDrawer() {
  const { cart, loading, cartOpen, setCartOpen, updateItem, removeItem } = useCart();

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

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-black border-l border-mist-lilac/10 z-50 flex flex-col shadow-2xl transform transition-transform duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-4 lg:p-6 border-b border-mist-lilac/10 bg-deep-purple/10">
          <div className="flex items-center gap-3">
            <svg className="w-6 h-6 text-burnt-lilac" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <div>
              <h2 className="text-xl font-serif text-mist-lilac">Shopping Bag</h2>
              <p className="text-mist-lilac/50 text-sm">{itemCount} {itemCount === 1 ? 'item' : 'items'}</p>
            </div>
          </div>
          <button
            onClick={() => setCartOpen(false)}
            className="p-2 text-mist-lilac/70 hover:text-mist-lilac hover:bg-mist-lilac/10 rounded-full transition-colors"
            aria-label="Close cart"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Free Shipping Banner */}
        {lines.length > 0 && cart && (
          <div className="px-4 py-3 bg-deep-purple/20 border-b border-mist-lilac/10">
            {parseFloat(cart.cost.subtotalAmount.amount) >= 100 ? (
              <p className="text-green-400 text-sm text-center flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                You've unlocked free shipping!
              </p>
            ) : (
              <div className="text-center">
                <p className="text-mist-lilac/70 text-sm mb-2">
                  Add ${(100 - parseFloat(cart.cost.subtotalAmount.amount)).toFixed(2)} more for free shipping
                </p>
                <div className="w-full h-1.5 bg-mist-lilac/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-linear-to-r from-burnt-lilac to-mist-lilac rounded-full transition-all duration-500"
                    style={{ width: `${Math.min((parseFloat(cart.cost.subtotalAmount.amount) / 100) * 100, 100)}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto">
          {loading && lines.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="w-10 h-10 border-2 border-burnt-lilac border-t-transparent rounded-full animate-spin" />
            </div>
          ) : lines.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-8">
              <div className="w-24 h-24 rounded-full bg-deep-purple/20 flex items-center justify-center mb-6">
                <svg className="w-12 h-12 text-mist-lilac/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <h3 className="text-xl font-serif text-mist-lilac mb-2">Your bag is empty</h3>
              <p className="text-mist-lilac/50 text-sm mb-8">
                Looks like you haven't added anything yet. Explore our collections to find something you'll love.
              </p>
              <button
                onClick={() => setCartOpen(false)}
                className="btn-gothic px-8"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <ul className="divide-y divide-mist-lilac/10">
              {lines.map(({ node: line }) => (
                <li key={line.id} className="p-4 hover:bg-deep-purple/5 transition-colors">
                  <div className="flex gap-4">
                    {/* Product Image */}
                    <Link 
                      href={`/products/${line.merchandise.product.handle}`}
                      onClick={() => setCartOpen(false)}
                      className="relative w-24 h-28 shrink-0 rounded-lg overflow-hidden bg-deep-purple/20 group"
                    >
                      {line.merchandise.product.featuredImage ? (
                        <Image
                          src={line.merchandise.product.featuredImage.url}
                          alt={line.merchandise.product.featuredImage.altText || line.merchandise.product.title}
                          fill
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
                        className="text-mist-lilac font-medium hover:text-burnt-lilac transition-colors line-clamp-2"
                      >
                        {line.merchandise.product.title}
                      </Link>
                      
                      {line.merchandise.title !== 'Default Title' && (
                        <p className="text-mist-lilac/50 text-sm mt-1">
                          {line.merchandise.selectedOptions.map(opt => opt.value).join(' / ')}
                        </p>
                      )}

                      {/* Price */}
                      <div className="mt-2 flex items-center gap-2">
                        <span className="text-burnt-lilac font-semibold">
                          {formatPrice(line.merchandise.price)}
                        </span>
                        {line.quantity > 1 && (
                          <span className="text-mist-lilac/40 text-sm">
                            × {line.quantity}
                          </span>
                        )}
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between mt-3">
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
                            className="w-8 h-8 flex items-center justify-center text-mist-lilac/70 hover:text-mist-lilac hover:bg-mist-lilac/10 transition-colors disabled:opacity-50"
                            aria-label="Decrease quantity"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                            </svg>
                          </button>
                          <span className="w-10 text-center text-mist-lilac text-sm font-medium">
                            {line.quantity}
                          </span>
                          <button
                            onClick={() => updateItem(line.id, line.quantity + 1)}
                            disabled={loading}
                            className="w-8 h-8 flex items-center justify-center text-mist-lilac/70 hover:text-mist-lilac hover:bg-mist-lilac/10 transition-colors disabled:opacity-50"
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
                          className="text-mist-lilac/40 hover:text-red-400 transition-colors disabled:opacity-50 text-sm flex items-center gap-1"
                          aria-label="Remove item"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Remove
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
          <div className="border-t border-mist-lilac/10 bg-deep-purple/5">
            {/* Order Summary */}
            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-mist-lilac/60">Subtotal</span>
                <span className="text-mist-lilac">
                  {formatPrice(cart.cost.subtotalAmount)}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-mist-lilac/60">Shipping</span>
                <span className="text-mist-lilac/60">Calculated at checkout</span>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-mist-lilac/10">
                <span className="text-mist-lilac font-medium">Estimated Total</span>
                <span className="text-mist-lilac font-semibold text-lg">
                  {formatPrice(cart.cost.subtotalAmount)}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="p-4 pt-0 space-y-3">
              <a
                href={cart.checkoutUrl}
                className="btn-gothic w-full text-center block py-3"
              >
                Checkout
              </a>
              <Link
                href="/cart"
                onClick={() => setCartOpen(false)}
                className="btn-gothic-outline w-full text-center block py-3 text-sm"
              >
                View Full Bag
              </Link>
            </div>

            {/* Payment Methods */}
            <div className="px-4 pb-4">
              <div className="flex items-center justify-center gap-2 text-mist-lilac/40">
                <svg className="w-8 h-5" viewBox="0 0 38 24" fill="currentColor">
                  <path d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3z"/>
                </svg>
                <svg className="w-8 h-5" viewBox="0 0 38 24" fill="currentColor">
                  <path d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3z"/>
                </svg>
                <svg className="w-8 h-5" viewBox="0 0 38 24" fill="currentColor">
                  <path d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3z"/>
                </svg>
                <svg className="w-8 h-5" viewBox="0 0 38 24" fill="currentColor">
                  <path d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3z"/>
                </svg>
              </div>
              <p className="text-mist-lilac/30 text-xs text-center mt-2">
                Secure checkout powered by Shopify
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
