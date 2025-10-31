import { createClient } from '@/lib/supabase/client'

/**
 * Make an authenticated API call to your backend
 * Automatically includes the Supabase session token
 */
export async function authenticatedFetch(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const supabase = createClient()
  
  // Get the current session
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session) {
    throw new Error('No active session')
  }

  // Add Authorization header with the access token
  const headers = new Headers(options.headers)
  headers.set('Authorization', `Bearer ${session.access_token}`)

  return fetch(url, {
    ...options,
    headers,
  })
}

/**
 * Helper to make authenticated JSON API calls
 */
export async function authenticatedFetchJson<T = any>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const headers = new Headers(options.headers)
  headers.set('Content-Type', 'application/json')

  const response = await authenticatedFetch(url, {
    ...options,
    headers,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }))
    throw new Error(error.message || `HTTP ${response.status}`)
  }

  return response.json()
}

/**
 * Get the current user's JWT token
 */
export async function getUserToken(): Promise<string | null> {
  const supabase = createClient()
  const { data: { session } } = await supabase.auth.getSession()
  return session?.access_token || null
}
