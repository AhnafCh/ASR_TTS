# 🚀 Quick Setup Guide - Password Reset Email

## ✅ What I've Done

### 1. Created Enhanced Custom Email Templates
- **HTML Template**: `email-templates/password-reset.html` - Beautiful, professionally branded
- **Plain Text**: `email-templates/password-reset.txt` - Enhanced fallback
- **Documentation**: `email-templates/README.md` - Complete setup guide
- **Preview**: `email-templates/PREVIEW.md` - Visual design documentation

### ✨ New Features:
- ✅ **Your actual SenseVoice logo** (from `/public/logo/sv-light-256.svg`)
- ✅ **Grid pattern overlay** on header for depth
- ✅ **Enhanced gradients** with smooth transitions
- ✅ **Professional typography** hierarchy
- ✅ **Bengali text** in footer (বাংলা এআই ভয়েস প্রযুক্তি)
- ✅ **Better security notes** with icons
- ✅ **Improved mobile responsiveness**
- ✅ **Multi-layer shadows** for depth

### 2. Fixed Auth Flow
Updated these files to ensure proper redirect:
- ✅ `/app/auth/callback/route.ts` - Now handles password recovery redirects
- ✅ `/app/api/auth/forgot-password/route.ts` - Routes through callback with proper parameters
- ✅ `/app/api/auth/reset-password/route.ts` - Already created
- ✅ `/app/reset-password/page.tsx` - Already updated

## 🎯 Next Steps (YOU NEED TO DO THIS)

### Step 1: Configure Supabase Email Template

1. **Open Supabase Dashboard**
   - Go to: https://app.supabase.com/
   - Select your project

2. **Navigate to Email Templates**
   - Click: **Authentication** (left sidebar)
   - Click: **Email Templates** tab
   - Find: **"Reset Password"** or **"Confirm signup"** template

3. **Paste Custom Template**
   - Click on **"Reset Password"** template
   - Clear existing content
   - Copy ALL content from: `email-templates/password-reset.html`
   - Paste into the template editor
   - Click **Save**

### Step 2: Configure Redirect URLs

1. **In Supabase Dashboard**
   - Go to: **Authentication** → **URL Configuration**

2. **Add These URLs to "Redirect URLs":**
   ```
   http://localhost:3000/reset-password
   https://yourdomain.com/reset-password
   http://localhost:3000/auth/callback*
   https://yourdomain.com/auth/callback*
   ```
   *(Replace `yourdomain.com` with your actual domain)*

3. **Set Site URL:**
   - For development: `http://localhost:3000`
   - For production: `https://yourdomain.com`

### Step 3: Test the Flow

1. Start your development server
2. Go to: `http://localhost:3000/forgot-password`
3. Enter your email
4. Check your inbox
5. Click "Reset Password" button in email
6. Should redirect to: `/reset-password` page
7. Enter new password
8. Should redirect to: `/login` page

## 🎨 Email Template Features

✨ **Professional Design**
- Branded header with logo
- SenseVoice color scheme (#6cc6ee, #2fa5da)
- Gradient button
- Responsive layout

⚡ **User Experience**
- Clear call-to-action button
- Expiration warning (1 hour)
- Fallback link if button doesn't work
- Mobile-friendly design

🔒 **Security**
- Links expire after 1 hour
- One-time use tokens
- Secure redirect flow
- No email enumeration

## 🔍 Troubleshooting

**If email doesn't send:**
```
Check Supabase Dashboard → Authentication → Email Templates
Make sure Email provider is enabled
Check your email logs in Supabase
```

**If redirect doesn't work:**
```
Verify redirect URLs in Supabase
Check that NEXT_PUBLIC_SITE_URL is set
Make sure /auth/callback/route.ts exists
```

**If you see 404 errors:**
```
Restart your development server
Clear browser cache
Check browser console for errors
```

## 📋 Environment Variables Checklist

Make sure these are set in `.env.local`:

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000  # Change for production
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## 🎯 The Flow

```
User enters email on /forgot-password
           ↓
API calls Supabase resetPasswordForEmail()
           ↓
Supabase sends email with custom template
           ↓
User clicks "Reset Password" button
           ↓
Redirects directly to /reset-password (with token in URL hash)
           ↓
Page validates session from URL hash
           ↓
User enters new password
           ↓
API updates password in Supabase
           ↓
Redirects to /login
```

## ✅ Verification Checklist

- [ ] Custom email template uploaded to Supabase
- [ ] Redirect URLs configured in Supabase
- [ ] Site URL set correctly
- [ ] Environment variables set
- [ ] Tested forgot password flow
- [ ] Tested reset password flow
- [ ] Verified email arrives
- [ ] Confirmed redirect works

---

**Need Help?** Check the detailed guide in `email-templates/README.md`
