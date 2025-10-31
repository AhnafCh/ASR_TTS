# Vercel Deployment Guide for SenseVoice

This guide will help you deploy your Next.js application to Vercel.

## Prerequisites

1. A Vercel account (sign up at https://vercel.com)
2. Your project pushed to a Git repository (GitHub, GitLab, or Bitbucket)
3. Supabase project set up with your database and authentication

## Step 1: Prepare Your Project

✅ **Already Done:**
- `vercel.json` configuration created
- `next.config.mjs` optimized for production
- `.gitignore` properly configured
- Environment variables template (`.env.example`) ready

## Step 2: Push to Git Repository

```bash
# Initialize git if not already done
git init

# Add all files
git add .

# Commit changes
git commit -m "Prepare for Vercel deployment"

# Add your remote repository
git remote add origin YOUR_REPOSITORY_URL

# Push to main branch
git push -u origin main
```

## Step 3: Deploy to Vercel

### Option A: Using Vercel Dashboard (Recommended)

1. Go to https://vercel.com/dashboard
2. Click **"Add New..."** → **"Project"**
3. Import your Git repository
4. Configure your project:
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `./` (leave as default)
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `.next` (auto-detected)

### Option B: Using Vercel CLI

```bash
# Install Vercel CLI globally
npm i -g vercel

# Login to Vercel
vercel login

# Deploy (from project root)
vercel

# Deploy to production
vercel --prod
```

## Step 4: Configure Environment Variables

In your Vercel project settings, add these environment variables:

### Required Variables:

1. **NEXT_PUBLIC_SUPABASE_URL**
   - Value: Your Supabase project URL
   - Example: `https://xyzcompany.supabase.co`

2. **NEXT_PUBLIC_SUPABASE_ANON_KEY**
   - Value: Your Supabase anonymous key
   - Found in: Supabase Dashboard → Settings → API

3. **NEXT_PUBLIC_API_URL** (if using external API)
   - Value: Your backend API URL
   - Example: `https://asrtts-production.up.railway.app`

### How to Add Environment Variables in Vercel:

1. Go to your project in Vercel Dashboard
2. Click **"Settings"** → **"Environment Variables"**
3. Add each variable:
   - Key: Variable name (e.g., `NEXT_PUBLIC_SUPABASE_URL`)
   - Value: Your actual value
   - Environment: Select **Production**, **Preview**, and **Development**
4. Click **"Save"**

## Step 5: Redeploy

After adding environment variables:
1. Go to **"Deployments"** tab
2. Click the **three dots** (⋯) on the latest deployment
3. Click **"Redeploy"**
4. Check **"Use existing Build Cache"** if you only changed env vars
5. Click **"Redeploy"**

## Step 6: Configure Custom Domain (Optional)

1. Go to **"Settings"** → **"Domains"**
2. Add your custom domain
3. Follow DNS configuration instructions
4. Wait for DNS propagation (can take up to 48 hours)

## Step 7: Update Supabase URL Configuration

After deployment, update your Supabase project:

1. Go to Supabase Dashboard → **Authentication** → **URL Configuration**
2. Add your Vercel URLs to **Redirect URLs**:
   ```
   https://your-project.vercel.app/**
   https://your-custom-domain.com/**
   ```

## Important Notes

### Image Optimization
- Vercel automatically optimizes images using Next.js Image Optimization
- No additional configuration needed

### Automatic Deployments
- Every push to your main branch triggers a production deployment
- Pull requests create preview deployments automatically

### Build Settings
If you need to change build settings:
1. Go to **"Settings"** → **"General"**
2. Modify:
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

### Troubleshooting Build Errors

**TypeScript Errors:**
If build fails due to TypeScript errors, temporarily set in `next.config.mjs`:
```javascript
typescript: {
  ignoreBuildErrors: true,
}
```

**Environment Variables Not Working:**
- Ensure variables start with `NEXT_PUBLIC_` for client-side access
- Redeploy after adding environment variables
- Check variable names for typos

**Build Timeout:**
- Upgrade to Vercel Pro for longer build times
- Optimize your build by reducing dependencies

## Post-Deployment Checklist

- [ ] Test all pages and routes
- [ ] Verify authentication works
- [ ] Check API connections
- [ ] Test image loading
- [ ] Verify dark mode toggle
- [ ] Test responsive design on mobile
- [ ] Check all links in footer (Privacy Policy, Terms & Conditions)
- [ ] Test contact forms and email links
- [ ] Verify social media links
- [ ] Monitor performance in Vercel Analytics

## Performance Optimization

Vercel automatically provides:
- ✅ Global CDN
- ✅ Edge caching
- ✅ Automatic HTTPS
- ✅ DDoS protection
- ✅ Web Analytics (if enabled)

## Monitoring

1. **Analytics**: Go to **"Analytics"** tab to view:
   - Page views
   - Top pages
   - User demographics
   
2. **Logs**: Go to **"Deployments"** → Click deployment → **"Function Logs"**

## Rollback

If something goes wrong:
1. Go to **"Deployments"**
2. Find a previous working deployment
3. Click **"..."** → **"Promote to Production"**

## Support Resources

- Vercel Documentation: https://vercel.com/docs
- Next.js Documentation: https://nextjs.org/docs
- Vercel Community: https://github.com/vercel/vercel/discussions

## Quick Commands Reference

```bash
# Deploy to preview
vercel

# Deploy to production
vercel --prod

# Check deployment status
vercel ls

# View logs
vercel logs [deployment-url]

# Remove deployment
vercel rm [deployment-name]
```

---

## Your Project URLs After Deployment

- **Production**: `https://your-project.vercel.app`
- **Preview Deployments**: `https://your-project-git-branch.vercel.app`
- **Custom Domain**: Configure in Settings → Domains

---

**Need Help?** Contact Vercel Support or check the documentation at https://vercel.com/docs
