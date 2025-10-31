import { User as SupabaseUser } from '@supabase/supabase-js'

// Database Types
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string | null
          name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email?: string | null
          name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string | null
          name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}

// Application User Type
export interface AppUser {
  id: string
  email: string
  name: string
  avatar?: string
}

// Profile Type
export type Profile = Database['public']['Tables']['profiles']['Row']
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert']
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update']

// JWT Payload Type
export interface JWTPayload {
  sub: string // user id
  email?: string
  role?: string
  aud?: string
  exp?: number
  iat?: number
  user_metadata?: Record<string, any>
  [key: string]: any
}

// Auth Context Types
export interface AuthContextType {
  user: AppUser | null
  supabaseUser: SupabaseUser | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (name: string, email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  updateUser: (user: Partial<AppUser>) => void
}
