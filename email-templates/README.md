# Email Template Setup for SenseVoice

This guide explains how to configure custom email templates in Supabase for password reset functionality.

## 📧 Custom Email Template

The custom password reset email template is located at:
```
email-templates/password-reset.html
```

## 🔧 Supabase Configuration

### Step 1: Access Supabase Dashboard

1. Go to your [Supabase Dashboard](https://app.supabase.com/)
2. Select your project
3. Navigate to **Authentication** → **Email Templates**

### Step 2: Configure Password Reset Email

1. Find **"Reset Password"** template in the list
2. Click on it to edit
3. Copy the content from `email-templates/password-reset.html`
4. Paste it into the **HTML Template** section

### Step 3: Configure Email Settings

Make sure the following settings are configured:

#### Site URL Configuration
Go to **Authentication** → **URL Configuration** and set:
- **Site URL**: Your production URL (e.g., `https://yourdomain.com`)
- **Redirect URLs**: Add the following to the allowed list:
  - `http://localhost:3000/auth/callback*`
  - `https://yourdomain.com/auth/callback*`
  - `http://localhost:3000/reset-password`
  - `https://yourdomain.com/reset-password`

#### Email Auth Settings
Go to **Authentication** → **Providers** → **Email**:
- ✅ Enable **Email provider**
- ✅ Enable **Confirm email**
- Set **Email link expiration**: `3600` seconds (1 hour)

### Step 4: Template Variables

The email template uses these Supabase variables:
- `{{ .ConfirmationURL }}` - The password reset link
- `{{ .SiteURL }}` - Your site URL
- `{{ .Email }}` - User's email address (optional)
- `{{ .Token }}` - Reset token (optional)

### Step 5: Test the Flow

1. Go to `/forgot-password` page
2. Enter your email address
3. Check your email inbox
4. Click the "Reset Password" button
5. You should be redirected to `/reset-password` page
6. Enter your new password
7. You'll be redirected to `/login` after success

## 🎨 Customizing the Email Template

You can customize the email template by editing `email-templates/password-reset.html`:

### Colors
- **Primary**: `#6cc6ee` (Light blue)
- **Secondary**: `#2fa5da` (Dark blue)
- **Background**: `#f9fafb` (Light gray)
- **Text**: `#1a1a1a` (Dark gray)

### Sections
1. **Header**: Logo and branding
2. **Content**: Main message and reset button
3. **Info Box**: Expiration notice
4. **Footer**: Company info and links

## 🔐 Security Notes

- Password reset links expire after 1 hour
- Links can only be used once
- Email addresses are not revealed if they don't exist in the system
- All redirects go through `/auth/callback` for security validation

## 🚀 Environment Variables

Make sure these are set in your `.env.local` or production environment:

```env
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## 📱 Email Preview

The email template is fully responsive and looks great on:
- ✅ Desktop email clients
- ✅ Mobile devices
- ✅ Webmail (Gmail, Outlook, etc.)
- ✅ Dark mode

## 🐛 Troubleshooting

### Email not received
- Check spam/junk folder
- Verify email is enabled in Supabase Auth settings
- Check Supabase logs for email sending errors

### Reset link doesn't work
- Verify redirect URLs are configured in Supabase
- Check that `/auth/callback` route exists
- Ensure `NEXT_PUBLIC_SITE_URL` is set correctly

### 404 Error on callback
- Make sure `/app/auth/callback/route.ts` exists
- Verify the route is properly deployed

## 📞 Support

For issues or questions:
- Check [Supabase Documentation](https://supabase.com/docs/guides/auth/passwords)
- Review the password reset flow in the code
- Check browser console and network tab for errors
