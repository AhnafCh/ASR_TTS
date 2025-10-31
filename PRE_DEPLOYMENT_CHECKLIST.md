# Pre-Deployment Checklist

Use this checklist before deploying to Vercel to ensure everything is ready.

## ✅ Code Quality

- [ ] All TypeScript errors fixed (run `npm run lint`)
- [ ] No console.log statements in production code
- [ ] All commented-out code removed
- [ ] No hardcoded API keys or secrets in code
- [ ] Error boundaries implemented for critical components

## ✅ Environment Variables

- [ ] `.env.example` file updated with all required variables
- [ ] Actual `.env` file added to `.gitignore`
- [ ] All environment variables start with `NEXT_PUBLIC_` for client access
- [ ] Supabase URL and keys ready
- [ ] API URLs configured correctly

## ✅ Performance

- [ ] Images optimized and using Next.js Image component
- [ ] Lazy loading implemented where appropriate
- [ ] No unnecessary re-renders in components
- [ ] Bundle size is reasonable

## ✅ SEO & Meta Tags

- [ ] Page titles set for all routes
- [ ] Meta descriptions added
- [ ] Open Graph tags configured
- [ ] Favicon present in `/public`

## ✅ Functionality Testing

- [ ] All pages load correctly
- [ ] Authentication flow works (login, signup, logout)
- [ ] Protected routes redirect correctly
- [ ] API calls succeed
- [ ] Forms submit successfully
- [ ] Error handling works properly

## ✅ UI/UX

- [ ] Responsive design works on mobile, tablet, desktop
- [ ] Dark mode toggle functions correctly
- [ ] All buttons and links work
- [ ] Loading states implemented
- [ ] Error messages are user-friendly

## ✅ Content

- [ ] All placeholder text replaced with actual content
- [ ] Privacy Policy page complete
- [ ] Terms & Conditions page complete
- [ ] Contact information accurate
- [ ] Social media links point to correct URLs

## ✅ Security

- [ ] Authentication properly implemented
- [ ] API routes protected
- [ ] CORS configured correctly
- [ ] SQL injection prevention in place
- [ ] XSS protection implemented

## ✅ Git Repository

- [ ] All changes committed
- [ ] Meaningful commit messages
- [ ] `.gitignore` properly configured
- [ ] No sensitive files in repository
- [ ] README.md updated

## ✅ Build Test

Run locally before deploying:

```bash
# Install dependencies
npm install

# Run linter
npm run lint

# Build the project
npm run build

# Test the production build
npm start
```

- [ ] `npm run build` succeeds without errors
- [ ] Production build runs correctly (`npm start`)
- [ ] All pages accessible in production mode
- [ ] No console errors in production build

## ✅ Third-Party Services

- [ ] Supabase project created and configured
- [ ] Database tables created
- [ ] Row Level Security (RLS) policies set up
- [ ] Authentication providers enabled
- [ ] Email templates configured
- [ ] Supabase URL whitelist updated for Vercel domains

## ✅ Vercel Configuration

- [ ] `vercel.json` created and configured
- [ ] `next.config.mjs` optimized for production
- [ ] Region selected (e.g., sin1 for Singapore)
- [ ] Framework preset set to Next.js

## ✅ Post-Deployment Testing Plan

After deployment, test:
- [ ] Homepage loads
- [ ] Login/Signup works
- [ ] User dashboard accessible
- [ ] API connections functioning
- [ ] Forms submitting correctly
- [ ] Images loading properly
- [ ] Dark mode working
- [ ] Mobile responsiveness
- [ ] Footer links working
- [ ] Privacy Policy accessible
- [ ] Terms & Conditions accessible

## ✅ Monitoring Setup

- [ ] Vercel Analytics enabled
- [ ] Error tracking configured (Sentry, LogRocket, etc.)
- [ ] Performance monitoring set up
- [ ] Uptime monitoring configured

## ✅ Documentation

- [ ] VERCEL_DEPLOYMENT_GUIDE.md reviewed
- [ ] README.md includes deployment instructions
- [ ] Environment variables documented
- [ ] API documentation updated

---

## Quick Command to Run All Checks

```bash
# Clean install
rm -rf node_modules package-lock.json
npm install

# Lint
npm run lint

# Build
npm run build

# If all pass, you're ready to deploy!
```

---

## Deployment Steps

Once all items are checked:

1. **Commit and Push**
   ```bash
   git add .
   git commit -m "Ready for Vercel deployment"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Option A: Connect repository in Vercel Dashboard
   - Option B: Run `vercel --prod` in terminal

3. **Configure Environment Variables** in Vercel Dashboard

4. **Test Production Deployment**

5. **Monitor for 24 hours** after deployment

---

**Ready to Deploy?** Follow the [VERCEL_DEPLOYMENT_GUIDE.md](./VERCEL_DEPLOYMENT_GUIDE.md)
