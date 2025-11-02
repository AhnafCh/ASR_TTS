import { createServerSupabaseClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') ?? '/playground'
  const origin = requestUrl.origin

  if (code) {
    const supabase = await createServerSupabaseClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      // Check if this is a password reset flow
      const { data: { user } } = await supabase.auth.getUser()
      
      // If user exists and they're in a password recovery flow, redirect to reset-password
      if (user) {
        // Check URL for type parameter (Supabase sets this for password recovery)
        const type = requestUrl.searchParams.get('type')
        if (type === 'recovery') {
          return NextResponse.redirect(`${origin}/reset-password`)
        }
      }
      
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(`${origin}/playground`)
}
