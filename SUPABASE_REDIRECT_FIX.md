# Fix Supabase Password Reset Redirect

## Issue
Password reset emails are redirecting to `http://localhost:3000/reset-password` instead of `https://sensevoice.vercel.app/reset-password`.

## Solutions Applied

### 1. ✅ Local Environment Variable Added
Added `NEXT_PUBLIC_SITE_URL=https://sensevoice.vercel.app` to `.env.local`

### 2. 🔧 Vercel Environment Variables (ACTION REQUIRED)
You need to add this environment variable in your Vercel dashboard:

1. Go to: https://vercel.com/dashboard
2. Select your `sensevoice` project
3. Go to **Settings** → **Environment Variables**
4. Add a new variable:
   - **Name**: `NEXT_PUBLIC_SITE_URL`
   - **Value**: `https://sensevoice.vercel.app`
   - **Environment**: Select all (Production, Preview, Development)
5. Click **Save**
6. **Redeploy** your application for changes to take effect

### 3. 🔧 Supabase Dashboard Configuration (ACTION REQUIRED)
You need to update the redirect URLs in your Supabase dashboard:

1. Go to: https://supabase.com/dashboard/project/eijcnqmuwhpkvnhgrrbr
2. Navigate to **Authentication** → **URL Configuration**
3. Update the following fields:

   **Site URL**:
   ```
   https://sensevoice.vercel.app
   ```

   **Redirect URLs** (add both):
   ```
   https://sensevoice.vercel.app/reset-password
   https://sensevoice.vercel.app/auth/callback
   http://localhost:3000/reset-password
   http://localhost:3000/auth/callback
   ```

4. Click **Save**

## Testing

### After completing all steps:

1. **Restart your local dev server**:
   ```bash
   npm run dev
   ```

2. **Test password reset flow**:
   - Go to: https://sensevoice.vercel.app/forgot-password
   - Enter your email
   - Check email for reset link
   - Verify the link redirects to: `https://sensevoice.vercel.app/reset-password`

3. **Test locally** (for development):
   - Temporarily change `.env.local` to use localhost:
     ```
     NEXT_PUBLIC_SITE_URL=http://localhost:3000
     ```
   - Restart dev server
   - Test forgot password flow
   - Should redirect to localhost

## Why This Happened

The code in `/app/api/auth/forgot-password/route.ts` uses:
```typescript
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
```

Without the environment variable set, it defaults to localhost. Now that we've set it to your production URL, all password reset emails will redirect to the correct domain.

## Important Notes

- **NEXT_PUBLIC_** prefix means the variable is exposed to the browser
- Vercel requires a redeploy after adding environment variables
- Supabase validates redirect URLs against the whitelist you configure
- Always keep both localhost and production URLs in Supabase for development and production testing

## Verification Checklist

- [ ] Added `NEXT_PUBLIC_SITE_URL` to `.env.local`
- [ ] Added `NEXT_PUBLIC_SITE_URL` to Vercel environment variables
- [ ] Updated Supabase Site URL to production domain
- [ ] Added both production and localhost redirect URLs to Supabase
- [ ] Redeployed Vercel application
- [ ] Restarted local dev server
- [ ] Tested password reset flow in production
- [ ] Tested password reset flow locally

---

**Current Status**: Local environment updated ✅  
**Next Steps**: Update Vercel and Supabase dashboard settings
