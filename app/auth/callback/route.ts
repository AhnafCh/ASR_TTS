import { createServerSupabaseClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const error_code = requestUrl.searchParams.get('error_code')
  const error_description = requestUrl.searchParams.get('error_description')
  const origin = requestUrl.origin

  // Handle errors
  if (error_code) {
    console.error('Auth callback error:', error_code, error_description)
    return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(error_description || 'Authentication failed')}`)
  }

  if (code) {
    const supabase = await createServerSupabaseClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error && data.session) {
      // Get the user and check the session metadata
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        // Check if this is a password recovery session
        // Supabase marks recovery sessions differently
        const amr = data.session.user.app_metadata?.provider
        
        // For password recovery, check the next parameter or default to reset-password
        const next = requestUrl.searchParams.get('next')
        if (next === '/reset-password' || requestUrl.searchParams.get('type') === 'recovery') {
          return NextResponse.redirect(`${origin}/reset-password`)
        }
        
        // Default redirect for normal auth
        return NextResponse.redirect(`${origin}${next || '/playground'}`)
      }
    }
    
    if (error) {
      console.error('Session exchange error:', error)
      return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(error.message)}`)
    }
  }

  // Fallback redirect
  return NextResponse.redirect(`${origin}/login`)
}
