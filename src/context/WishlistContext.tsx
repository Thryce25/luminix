'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useCustomer } from './CustomerContext';

interface WishlistItem {
  id: string;
  handle: string;
  title: string;
  price: {
    amount: string;
    currencyCode: string;
  };
  image: string;
  addedAt: number;
}

interface WishlistContextType {
  items: WishlistItem[];
  addItem: (item: WishlistItem) => void;
  removeItem: (id: string) => void;
  isInWishlist: (id: string) => boolean;
  clearWishlist: () => void;
  syncInProgress: boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

const WISHLIST_STORAGE_KEY = 'luminix_wishlist';

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [syncInProgress, setSyncInProgress] = useState(false);
  const { customer, isAuthenticated } = useCustomer();

  // Load wishlist on mount and sync with Shopify if authenticated
  useEffect(() => {
    const loadWishlist = async () => {
      try {
        // Always load from localStorage first for immediate UI
        const stored = localStorage.getItem(WISHLIST_STORAGE_KEY);
        const localItems = stored ? JSON.parse(stored) : [];
        
        // If authenticated, sync with Shopify metafield
        if (isAuthenticated && customer?.id) {
          setSyncInProgress(true);
          try {
            const response = await fetch('/api/wishlist/sync', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ customerId: customer.id }),
            });

            if (response.ok) {
              const { productIds } = await response.json();
              
              // Merge Shopify wishlist with local wishlist
              const mergedItems = [...localItems];
              for (const productId of productIds) {
                if (!mergedItems.some((item: WishlistItem) => item.id === productId)) {
                  // Product in Shopify but not in local - fetch product details
                  // For now, just add the ID (product details will be fetched when viewing wishlist)
                  const existingItem = localItems.find((item: WishlistItem) => item.id === productId);
                  if (existingItem) {
                    mergedItems.push(existingItem);
                  }
                }
              }
              
              // Remove items that are in local but not in Shopify
              const syncedItems = mergedItems.filter((item: WishlistItem) => productIds.includes(item.id));
              setItems(syncedItems);
              localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(syncedItems));
            } else {
              // Fallback to local if sync fails
              setItems(localItems);
            }
          } catch (error) {
            console.error('Failed to sync wishlist from Shopify:', error);
            setItems(localItems);
          } finally {
            setSyncInProgress(false);
          }
        } else {
          // Not authenticated, use localStorage only
          setItems(localItems);
        }
      } catch (error) {
        console.error('Failed to load wishlist:', error);
      } finally {
        setIsLoaded(true);
      }
    };

    loadWishlist();
  }, [customer?.id, isAuthenticated]);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(items));
      } catch (error) {
        console.error('Failed to save wishlist:', error);
      }
    }
  }, [items, isLoaded]);

  const addItem = async (item: WishlistItem) => {
    // Add to local state immediately
    setItems((prev) => {
      if (prev.some((i) => i.id === item.id)) {
        return prev;
      }
      return [...prev, { ...item, addedAt: Date.now() }];
    });

    // Sync to Shopify if authenticated
    if (isAuthenticated && customer?.id) {
      try {
        await fetch('/api/wishlist/add', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            customerId: customer.id, 
            productId: item.id 
          }),
        });
      } catch (error) {
        console.error('Failed to sync add to Shopify:', error);
      }
    }
  };

  const removeItem = async (id: string) => {
    // Remove from local state immediately
    setItems((prev) => prev.filter((item) => item.id !== id));

    // Sync to Shopify if authenticated
    if (isAuthenticated && customer?.id) {
      try {
        await fetch('/api/wishlist/remove', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            customerId: customer.id, 
            productId: id 
          }),
        });
      } catch (error) {
        console.error('Failed to sync remove to Shopify:', error);
      }
    }
  };

  const isInWishlist = (id: string) => {
    return items.some((item) => item.id === id);
  };

  const clearWishlist = async () => {
    setItems([]);
    
    // If authenticated, clear from Shopify too
    if (isAuthenticated && customer?.id) {
      try {
        // Remove all items one by one
        for (const item of items) {
          await fetch('/api/wishlist/remove', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              customerId: customer.id, 
              productId: item.id 
            }),
          });
        }
      } catch (error) {
        console.error('Failed to clear wishlist from Shopify:', error);
      }
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        isInWishlist,
        clearWishlist,
        syncInProgress,
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
