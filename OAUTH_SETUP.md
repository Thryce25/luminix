# OAuth Setup Guide - Google & GitHub Authentication

This guide shows how to configure Google and GitHub OAuth providers in Supabase.

## Configure in Supabase Dashboard

### 1. Enable OAuth Providers

Go to: `Authentication` → `Providers` in your Supabase dashboard
https://supabase.com/dashboard/project/rldqgrbsammpzgygtasa/auth/providers

---

## Google OAuth Setup

### Step 1: Create Google OAuth Client

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Navigate to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth 2.0 Client ID**
5. Configure OAuth consent screen if prompted:
   - User Type: **External**
   - App name: `Luminix`
   - User support email: Your email
   - Developer contact: Your email
6. Choose **Web application** as application type
7. Add authorized redirect URIs:
   ```
   https://rldqgrbsammpzgygtasa.supabase.co/auth/v1/callback
   ```
8. Copy the **Client ID** and **Client Secret**

### Step 2: Configure in Supabase

1. In Supabase dashboard, go to **Authentication** → **Providers**
2. Find **Google** and click to expand
3. Enable Google provider
4. Paste your **Client ID**
5. Paste your **Client Secret**
6. Click **Save**

---

## GitHub OAuth Setup

### Step 1: Create GitHub OAuth App

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click **New OAuth App**
3. Fill in the details:
   - Application name: `Luminix`
   - Homepage URL: `https://www.luminixclothing.com`
   - Authorization callback URL:
     ```
     https://rldqgrbsammpzgygtasa.supabase.co/auth/v1/callback
     ```
4. Click **Register application**
5. Copy the **Client ID**
6. Click **Generate a new client secret** and copy it

### Step 2: Configure in Supabase

1. In Supabase dashboard, go to **Authentication** → **Providers**
2. Find **GitHub** and click to expand
3. Enable GitHub provider
4. Paste your **Client ID**
5. Paste your **Client Secret**
6. Click **Save**

---

## Site URL Configuration

Make sure your **Site URL** is configured in Supabase:

1. Go to **Authentication** → **URL Configuration**
2. Set **Site URL** to:
   - Development: `http://localhost:3000`
   - Production: `https://www.luminixclothing.com`
3. Add **Redirect URLs**:
   ```
   http://localhost:3000/account
   https://www.luminixclothing.com/account
   ```

---

## Testing

### Development (localhost:3000)
1. Go to http://localhost:3000/account
2. Click "Continue with Google" or "Continue with GitHub"
3. Authorize the app
4. You should be redirected back to /account page

### Production
Update the redirect URLs in both Google Cloud Console and GitHub OAuth App settings to use your production domain.

---

## Troubleshooting

### Error: "redirect_uri_mismatch"
- Make sure the callback URL in Google/GitHub matches exactly:
  `https://rldqgrbsammpzgygtasa.supabase.co/auth/v1/callback`

### Error: "invalid_client"
- Double-check Client ID and Client Secret are correct
- Make sure there are no extra spaces when copying

### Users not appearing in database
- The `profiles` table is automatically populated after first OAuth login
- Check the `auth.users` table in Supabase to verify user exists

---

## User Flow

1. User clicks "Continue with Google/GitHub"
2. Redirected to OAuth provider
3. User authorizes app
4. Redirected back to Supabase callback URL
5. Supabase creates user in `auth.users`
6. User is redirected to `/account`
7. Profile is created in `profiles` table automatically

---

## Environment Variables

No additional environment variables needed! OAuth is handled entirely by Supabase.
