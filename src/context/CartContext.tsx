'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  ShopifyCart,
  createCart,
  getCart,
  addToCart,
  updateCartLine,
  removeFromCart,
} from '@/lib/shopify';
import { createClient } from '@/lib/supabase/client';

interface CartContextType {
  cart: ShopifyCart | null;
  loading: boolean;
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  addItem: (variantId: string, quantity: number) => Promise<void>;
  updateItem: (lineId: string, quantity: number) => Promise<void>;
  removeItem: (lineId: string) => Promise<void>;
  getCheckoutUrl: () => string | null;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_ID_KEY = 'shopify_cart_id';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<ShopifyCart | null>(null);
  const [loading, setLoading] = useState(true);
  const [cartOpen, setCartOpen] = useState(false);
  const supabase = createClient();

  // Initialize cart
  useEffect(() => {
    const initCart = async () => {
      const cartId = localStorage.getItem(CART_ID_KEY);

      if (cartId) {
        try {
          const existingCart = await getCart(cartId);
          if (existingCart) {
            setCart(existingCart);
            setLoading(false);
            return;
          }
        } catch (error) {
          console.error('Error fetching cart:', error);
        }
      }

      // Create new cart if none exists
      try {
        const newCart = await createCart();
        localStorage.setItem(CART_ID_KEY, newCart.id);
        setCart(newCart);
      } catch (error) {
        console.error('Error creating cart:', error);
      }

      setLoading(false);
    };

    initCart();
  }, []);

  const addItem = useCallback(
    async (variantId: string, quantity: number) => {
      if (!cart) return;

      setLoading(true);
      try {
        const updatedCart = await addToCart(cart.id, [{ merchandiseId: variantId, quantity }]);
        setCart(updatedCart);
        setCartOpen(true);
      } catch (error) {
        console.error('Error adding to cart:', error);
      }
      setLoading(false);
    },
    [cart]
  );

  const updateItem = useCallback(
    async (lineId: string, quantity: number) => {
      if (!cart) return;

      setLoading(true);
      try {
        const updatedCart = await updateCartLine(cart.id, lineId, quantity);
        setCart(updatedCart);
      } catch (error) {
        console.error('Error updating cart:', error);
      }
      setLoading(false);
    },
    [cart]
  );

  const removeItem = useCallback(
    async (lineId: string) => {
      if (!cart) return;

      setLoading(true);
      try {
        const updatedCart = await removeFromCart(cart.id, [lineId]);
        setCart(updatedCart);
      } catch (error) {
        console.error('Error removing from cart:', error);
      }
      setLoading(false);
    },
    [cart]
  );

  const getCheckoutUrl = useCallback(() => {
    if (!cart || !cart.checkoutUrl) return null;
    // Ensure checkout URL is valid
    try {
      new URL(cart.checkoutUrl);
      return cart.checkoutUrl;
    } catch {
      console.error('Invalid checkout URL:', cart.checkoutUrl);
      return null;
    }
  }, [cart]);

  // Sync cart to Supabase when cart changes and user is logged in
  useEffect(() => {
    const syncCartToSupabase = async () => {
      if (!cart) return;

      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const cartItems = cart.lines?.edges?.map((edge: any) => ({
          id: edge.node.id,
          variantId: edge.node.merchandise.id,
          title: edge.node.merchandise.product.title,
          variantTitle: edge.node.merchandise.title,
          quantity: edge.node.quantity,
          price: edge.node.merchandise.price.amount,
          image: edge.node.merchandise.image?.url || edge.node.merchandise.product.featuredImage?.url,
        })) || [];

        const totalQuantity = cart.totalQuantity || 0;

        // Upsert cart data
        const { error } = await supabase
          .from('carts')
          .upsert({
            user_id: user.id,
            shopify_cart_id: cart.id,
            items: cartItems,
            total_quantity: totalQuantity,
          }, {
            onConflict: 'user_id'
          });

        if (error) {
          console.error('Error syncing cart to Supabase:', error);
        }
      } catch (error) {
        console.error('Error syncing cart:', error);
      }
    };

    syncCartToSupabase();
  }, [cart, supabase]);

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        cartOpen,
        setCartOpen,
        addItem,
        updateItem,
        removeItem,
        getCheckoutUrl,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
