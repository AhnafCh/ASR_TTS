import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'

/**
 * POST /api/auth/forgot-password
 * Send password reset email to user
 */
export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    // Validate email
    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    const supabase = await createServerSupabaseClient()

    // Get the site URL for the redirect
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

    // Send password reset email
    // Supabase will send the user directly to the reset-password page
    // with the token in the URL hash
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${siteUrl}/reset-password`,
    })

    if (error) {
      console.error('Password reset error:', error)
      // Don't reveal if the email exists or not for security reasons
      // Just return success to prevent email enumeration
      return NextResponse.json({
        success: true,
        message: 'If an account exists with that email, we have sent password reset instructions.',
      })
    }

    return NextResponse.json({
      success: true,
      message: 'If an account exists with that email, we have sent password reset instructions.',
    })
  } catch (error) {
    console.error('Forgot password error:', error)
    return NextResponse.json(
      { error: 'An error occurred while processing your request' },
      { status: 500 }
    )
  }
}
