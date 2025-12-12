# Wishlist Metafield Setup Guide

This guide explains how to enable wishlist syncing with Shopify customer metafields.

## What Changed

Your wishlist now automatically syncs to Shopify when users are logged in:
- **Guest users**: Wishlist saved in browser only (localStorage)
- **Logged-in users**: Wishlist saved to Shopify customer metafields + syncs across all devices

## Setup Steps

### 1. Enable Customer Metafield Scopes

You need to add metafield permissions to your Shopify Admin API app.

1. Go to: `https://admin.shopify.com/store/luminix-8609/settings/apps/development`
2. Click on **OAuth Customer Sync** (or your Admin API app)
3. Click **Configuration** tab
4. Under **Admin API access scopes**, find and enable:
   - ✅ `write_customer_metafields` - Write customer metafields
   - ✅ `read_customer_metafields` - Read customer metafields
5. Click **Save**
6. You may need to **reinstall the app** for changes to take effect

### 2. Test the Implementation

1. **Create an account** or **login** on your site
2. **Add products to wishlist** (click the heart icon)
3. **Check browser console** - should see no errors
4. **Logout and login again** - wishlist should persist
5. **Try on different device** - login with same account, wishlist should be there

### 3. Verify in Shopify Admin

1. Go to: `https://admin.shopify.com/store/luminix-8609/customers`
2. Find the customer who added wishlist items
3. Click on the customer
4. Scroll down to **Metafields** section
5. You should see:
   - **Namespace**: `custom`
   - **Key**: `wishlist`
   - **Value**: JSON array of product IDs like `["gid://shopify/Product/123", "gid://shopify/Product/456"]`

## How It Works

### Adding to Wishlist
```
User clicks heart icon
  ↓
Added to localStorage (instant UI update)
  ↓
If logged in:
  └→ API call to /api/wishlist/add
      ↓
    Shopify Admin API updates customer metafield
```

### Syncing on Login
```
User logs in
  ↓
WishlistContext checks customer.id
  ↓
API call to /api/wishlist/sync
  ↓
Fetch wishlist from Shopify metafield
  ↓
Merge with localStorage wishlist
  ↓
Display synced wishlist
```

### Removing from Wishlist
```
User clicks remove icon
  ↓
Removed from localStorage (instant UI update)
  ↓
If logged in:
  └→ API call to /api/wishlist/remove
      ↓
    Shopify Admin API updates customer metafield
```

## API Endpoints Created

- **POST /api/wishlist/sync**: Fetch wishlist from Shopify for a customer
- **POST /api/wishlist/add**: Add product to customer's Shopify wishlist
- **POST /api/wishlist/remove**: Remove product from customer's Shopify wishlist

## Benefits

✅ **Cross-device sync** - Same wishlist on phone, laptop, tablet
✅ **Persistent** - Survives browser cache clears
✅ **Admin visibility** - You can see customer wishlists in Shopify admin
✅ **No monthly cost** - Uses Shopify's built-in metafield storage
✅ **Works offline** - Falls back to localStorage for guests

## Troubleshooting

**Error: "Server configuration error"**
- Make sure `SHOPIFY_ADMIN_ACCESS_TOKEN` is in your `.env.local`
- Verify the token is correct and hasn't been revoked

**Wishlist not syncing**
- Check browser console for API errors
- Verify customer metafield scopes are enabled in Shopify admin
- Make sure you're logged in (check customer.id exists)

**"Failed to fetch wishlist" error**
- Check that the Admin API access token has correct permissions
- Verify the app is installed in Shopify admin

## Next Steps

1. Enable the metafield scopes as described above
2. Test on localhost
3. Deploy to Vercel (environment variables already configured)
4. Test in production

The wishlist will now automatically sync for all logged-in users!
