import { jwtVerify, createRemoteJWKSet } from 'jose'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!

export interface JWTPayload {
  sub: string // user id
  email?: string
  role?: string
  aud?: string
  exp?: number
  iat?: number
  [key: string]: any
}

/**
 * Verify Supabase JWT using the public key from JWKS endpoint
 * This uses asymmetric verification (RS256) - no secret needed!
 * @param token - The JWT token to verify
 * @returns The decoded payload if valid
 * @throws Error if token is invalid
 */
export async function verifySupabaseJWT(token: string): Promise<JWTPayload> {
  try {
    // Supabase provides a JWKS endpoint with the public key
    const JWKS = createRemoteJWKSet(
      new URL(`${SUPABASE_URL}/auth/v1/jwks`)
    )
    
    const { payload } = await jwtVerify(token, JWKS, {
      issuer: `${SUPABASE_URL}/auth/v1`, // Verify the issuer
      audience: 'authenticated', // Verify the audience
    })
    
    return payload as JWTPayload
  } catch (error) {
    throw new Error('Invalid or expired token')
  }
}

/**
 * Extract JWT token from Authorization header
 * @param authHeader - Authorization header value
 * @returns The JWT token or null
 */
export function extractBearerToken(authHeader: string | null): string | null {
  if (!authHeader) return null
  
  const parts = authHeader.split(' ')
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return null
  }
  
  return parts[1]
}
