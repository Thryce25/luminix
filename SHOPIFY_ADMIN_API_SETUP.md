# Shopify Admin API Setup for OAuth Customer Sync

This guide explains how to get a Shopify Admin API access token to enable Google OAuth users to appear in your Shopify admin customers list.

## Why Admin API?

The Shopify **Storefront API** requires a password for customer creation. Since Google OAuth users don't have passwords, we use the **Admin API** which allows creating customers without passwords.

## Steps to Get Admin API Access Token

### 1. Create a Custom App in Shopify Admin

1. Log in to your Shopify admin: `https://luminixclothing.myshopify.com/admin`
2. Go to **Settings** (bottom left) → **Apps and sales channels**
3. Click **Develop apps** (top right)
4. If prompted, click **Allow custom app development**
5. Click **Create an app**
6. Enter app name: `OAuth Customer Sync`
7. Click **Create app**

### 2. Configure Admin API Access Scopes

1. Click **Configure Admin API scopes**
2. Scroll down and check these permissions:
   - ✅ `write_customers` - Create and update customers
   - ✅ `read_customers` - Read customer data
3. Click **Save**

### 3. Install the App and Get Access Token

1. Click **API credentials** tab
2. Click **Install app** button
3. Click **Install** to confirm
4. You'll see **Admin API access token** section
5. Click **Reveal token once** button
6. **IMPORTANT**: Copy the token immediately - it's only shown once!
   - The token will look like: `shpat_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

### 4. Add to Environment Variables

Add this to your `.env.local` file:

```env
SHOPIFY_ADMIN_ACCESS_TOKEN=your_admin_token_here
```

Replace with your actual token.

### 5. Restart Development Server

```bash
npm run dev
```

## For Vercel Deployment

1. Go to Vercel project dashboard
2. **Settings** → **Environment Variables**
3. Add:
   - **Key**: `SHOPIFY_ADMIN_ACCESS_TOKEN`
   - **Value**: Your Admin API token
   - **Environments**: Check all (Production, Preview, Development)
4. Click **Save**
5. Redeploy your app

## How It Works

When a user signs in with Google OAuth:

1. NextAuth creates a session in your Next.js app
2. App calls `/api/sync-oauth-customer` (server-side)
3. API checks if customer exists in Shopify
4. If not, creates customer using Admin API (no password)
5. Customer appears in Shopify admin with tags: `oauth`, `google-auth`

## Security

- ✅ Admin API token is server-side only (never exposed to browser)
- ✅ Token stored in environment variables (not in code)
- ✅ API route runs on server, not in browser
- ✅ OAuth customers tagged for easy filtering

## Testing

1. Clear browser cache or use incognito mode
2. Sign in with "Continue with Google"
3. Go to Shopify admin → Customers
4. You should see the OAuth user with tags `oauth` and `google-auth`

## Troubleshooting

**Error: "SHOPIFY_ADMIN_ACCESS_TOKEN not configured"**
- Add the token to `.env.local`
- Restart dev server

**Error: "Access denied"**
- Verify `write_customers` and `read_customers` scopes enabled
- Reinstall the custom app

**Customer not appearing**
- Check browser console for errors
- Verify API route is being called
- Check token hasn't been revoked in Shopify admin
