# Google OAuth Setup Instructions

## 1. Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **Google+ API**
4. Go to **APIs & Services > Credentials**
5. Click **Create Credentials > OAuth 2.0 Client ID**
6. Configure the OAuth consent screen if prompted
7. Select **Web application** as the application type
8. Add authorized redirect URIs (add ALL of these):
   - For local development: `http://localhost:3000/api/auth/callback/google`
   - For production: `https://luminixclothing.com/api/auth/callback/google`
   - For production with www: `https://www.luminixclothing.com/api/auth/callback/google`
9. Copy the **Client ID** and **Client Secret**

**Important**: Add both the www and non-www production URLs to handle all user access patterns.

### Troubleshooting: Error 400 redirect_uri_mismatch

If you encounter "Error 400: redirect_uri_mismatch":

1. **Check which URL is being used in the callback**. The error URL shows the actual callback URL (e.g., `https://www.luminixclothing.com` vs `https://luminixclothing.com`)
2. Verify **ALL redirect URIs** are added in **Google Cloud Console > Credentials > OAuth 2.0 Client ID**:
   - Production (no www): `https://luminixclothing.com/api/auth/callback/google`
   - Production (with www): `https://www.luminixclothing.com/api/auth/callback/google`
   - Local: `http://localhost:3000/api/auth/callback/google`
3. Ensure no trailing slashes and correct protocol (http vs https)
4. Verify your `NEXTAUTH_URL` environment variable matches your primary domain
5. Click **Save** in Google Console and wait 5-10 minutes for changes to propagate
6. Clear your browser cache or test in incognito mode

**Common Issue**: If your site redirects from `luminixclothing.com` to `www.luminixclothing.com`, you MUST add both URLs to Google Console.

## 2. Update Environment Variables

Add these to your `.env.local` file:

```env
NEXTAUTH_URL=https://luminixclothing.com
NEXTAUTH_SECRET=generate-a-random-secret-key
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### Generate NEXTAUTH_SECRET

Run this command to generate a secure secret:
```bash
openssl rand -base64 32
```

## 3. Add to Vercel Environment Variables

In your Vercel dashboard:
1. Go to **Settings > Environment Variables**
2. Add all four variables above
3. Redeploy the site

## How It Works

- Users can sign in with Google OAuth or traditional email/password
- OAuth users are automatically linked to their email
- Both OAuth and Shopify authentication work seamlessly together
- OAuth users get the same dashboard and wishlist features
