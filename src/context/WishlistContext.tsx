'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { createClient } from '@/lib/supabase/client';

interface WishlistItem {
  id: string;
  productId: string;
  productHandle: string;
  productTitle?: string;
  productImage?: string;
  productPrice?: string;
}

interface WishlistContextType {
  items: WishlistItem[];
  loading: boolean;
  addItem: (product: any) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
  refreshWishlist: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const fetchWishlist = async () => {
    if (!user) {
      setItems([]);
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('wishlists')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setItems(
        data?.map((item) => ({
          id: item.id,
          productId: item.product_id,
          productHandle: item.product_handle,
          productTitle: item.product_title,
          productImage: item.product_image,
          productPrice: item.product_price,
        })) || []
      );
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, [user]);

  const addItem = async (product: any) => {
    if (!user) {
      alert('Please sign in to add items to your wishlist');
      return;
    }

    try {
      const { error } = await supabase.from('wishlists').insert({
        user_id: user.id,
        product_id: product.id,
        product_handle: product.handle,
        product_title: product.title,
        product_image: product.images?.[0]?.url || product.featuredImage?.url,
        product_price: product.priceRange?.minVariantPrice?.amount || product.variants?.edges?.[0]?.node?.price?.amount,
      });

      if (error) throw error;

      await fetchWishlist();
    } catch (error: any) {
      console.error('Error adding to wishlist:', error);
      if (error.code === '23505') {
        alert('This item is already in your wishlist');
      } else {
        alert('Failed to add to wishlist');
      }
    }
  };

  const removeItem = async (productId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('wishlists')
        .delete()
        .eq('user_id', user.id)
        .eq('product_id', productId);

      if (error) throw error;

      await fetchWishlist();
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      alert('Failed to remove from wishlist');
    }
  };

  const isInWishlist = (productId: string) => {
    return items.some((item) => item.productId === productId);
  };

  const refreshWishlist = async () => {
    await fetchWishlist();
  };

  return (
    <WishlistContext.Provider
      value={{
        items,
        loading,
        addItem,
        removeItem,
        isInWishlist,
        refreshWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
