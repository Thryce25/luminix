# Gmail Setup for Magic Link Authentication

This guide shows you how to set up Gmail to send verification codes for passwordless authentication.

## Step 1: Enable 2-Step Verification

1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Click **2-Step Verification**
3. Follow the prompts to enable it (required for App Passwords)

## Step 2: Generate App Password

1. Go to [Google App Passwords](https://myaccount.google.com/apppasswords)
   - Or: Google Account → Security → 2-Step Verification → App passwords
2. In the "App name" field, type: **LUMINIX**
3. Click **Create**
4. Google will show you a 16-character password
5. **Copy this password** (you won't see it again!)

## Step 3: Add to Environment Variables

Add these two lines to your `.env.local` file:

```env
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-16-character-app-password
```

**Example:**
```env
GMAIL_USER=luminixclothing1@gmail.com
GMAIL_APP_PASSWORD=abcd efgh ijkl mnop
```

## Step 4: Restart Dev Server

```bash
npm run dev
```

## How It Works

### User Flow:
1. User enters email (+ optional name for new accounts)
2. Click "Send Code"
3. System generates 6-digit code
4. Email sent via your Gmail account
5. User enters code from email
6. Code verified → User signed in
7. Customer saved to Shopify admin

### Email Example:
```
Subject: Your LUMINIX Sign-In Code

Your verification code is: 123456

This code expires in 10 minutes.
```

## Testing

1. Go to `http://localhost:3000/account`
2. Click **"Continue with Email Code"**
3. Enter your email
4. Check your email for the 6-digit code
5. Enter the code
6. You should be signed in!
7. Check Shopify admin → Customers to see your account

## For Vercel Deployment

1. Go to Vercel project dashboard
2. **Settings** → **Environment Variables**
3. Add both variables:
   - `GMAIL_USER`
   - `GMAIL_APP_PASSWORD`
4. Select all environments (Production, Preview, Development)
5. Redeploy

## Security Notes

✅ **App Password** is safer than your real password  
✅ **Codes expire** in 10 minutes  
✅ **One-time use** - codes deleted after verification  
✅ **No password storage** - completely passwordless  
✅ **Shopify admin** has full customer records  

## Troubleshooting

**"Failed to send email"**
- Check GMAIL_USER and GMAIL_APP_PASSWORD in .env.local
- Make sure 2-Step Verification is enabled
- Verify App Password is correct (no spaces)
- Try generating a new App Password

**"Invalid or expired code"**
- Codes expire after 10 minutes
- Check email for most recent code
- Codes are case-sensitive

**Email not receiving**
- Check spam folder
- Verify email address is correct
- Try a different email provider

## Advantages of Magic Link

✅ **Faster sign-in** - No password to remember  
✅ **More secure** - No password to steal  
✅ **Better UX** - Quick and easy  
✅ **Same Shopify data** - All customers in admin  
✅ **Works with email/password** - Both methods available  

Users can choose:
- Magic link (quick, passwordless)
- Email/password (traditional)

Both save to Shopify admin!
