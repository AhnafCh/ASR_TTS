"use client"

import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import type { User as SupabaseUser } from "@supabase/supabase-js"

interface User {
  id: string
  email: string
  name: string
  avatar?: string
}

interface AuthContextType {
  user: User | null
  supabaseUser: SupabaseUser | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (name: string, email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  updateUser: (user: Partial<User>) => void
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// In-memory cache for user profile (non-sensitive data only)
// Session tokens are handled securely by Supabase via HttpOnly cookies
let profileCache: {
  data: User | null
  timestamp: number
  userId: string | null
} = {
  data: null,
  timestamp: 0,
  userId: null
}

const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

const isCacheValid = (userId: string): boolean => {
  return (
    profileCache.userId === userId &&
    profileCache.data !== null &&
    Date.now() - profileCache.timestamp < CACHE_DURATION
  )
}

const setProfileCache = (user: User) => {
  profileCache = {
    data: user,
    timestamp: Date.now(),
    userId: user.id
  }
}

const clearProfileCache = () => {
  profileCache = {
    data: null,
    timestamp: 0,
    userId: null
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()
  
  // Refs to prevent duplicate fetches
  const isFetchingProfile = useRef(false)
  const hasInitialized = useRef(false)

  // Check for existing session on mount and listen for auth changes
  useEffect(() => {
    // Prevent duplicate initialization
    if (hasInitialized.current) return
    hasInitialized.current = true

    checkAuth()

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, 'Session:', session ? 'exists' : 'null')
        console.log('User email:', session?.user?.email)
        
        if (session?.user) {
          setSupabaseUser(session.user)
          await fetchUserProfile(session.user.id)
        } else {
          setSupabaseUser(null)
          setUser(null)
          clearProfileCache()
        }
        setIsLoading(false)
      }
    )

    return () => {
      subscription.unsubscribe()
      hasInitialized.current = false
    }
  }, [])

  const checkAuth = async () => {
    try {
      // Supabase handles session caching securely via cookies
      // We don't need to cache the session ourselves
      const { data: { session } } = await supabase.auth.getSession()
      
      console.log('checkAuth - session:', session ? 'exists' : 'null')
      console.log('checkAuth - user:', session?.user?.email)
      
      if (session?.user) {
        setSupabaseUser(session.user)
        
        // Check if we have a valid cached profile for this user
        if (isCacheValid(session.user.id)) {
          setUser(profileCache.data)
          setIsLoading(false)
          // Refresh in background without blocking
          fetchUserProfile(session.user.id, true)
          return
        }
        
        // No valid cache, fetch fresh profile
        await fetchUserProfile(session.user.id)
      }
    } catch (error) {
      console.error("Auth check failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchUserProfile = useCallback(async (userId: string, isBackgroundRefresh = false) => {
    // Prevent concurrent fetches
    if (isFetchingProfile.current) return
    isFetchingProfile.current = true

    try {
      console.log('Fetching profile for user:', userId)
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        console.error("Error fetching profile:", error)
        // If profile doesn't exist, get user from session
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user) {
          const fallbackUser: User = {
            id: session.user.id,
            email: session.user.email || '',
            name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User',
            avatar: session.user.user_metadata?.avatar_url
          }
          console.log('Using fallback user:', fallbackUser.email)
          setUser(fallbackUser)
          setProfileCache(fallbackUser)
        }
      } else if (data) {
        const userProfile: User = {
          id: data.id,
          email: data.email,
          name: data.name || data.email?.split('@')[0] || 'User',
          avatar: data.avatar_url
        }
        console.log('Profile loaded successfully:', userProfile.email)
        setUser(userProfile)
        setProfileCache(userProfile)
      }
    } catch (error) {
      console.error("Error fetching user profile:", error)
    } finally {
      isFetchingProfile.current = false
    }
  }, [])

  // Manual refresh function for when user updates their profile
  const refreshUser = useCallback(async () => {
    if (supabaseUser) {
      clearProfileCache()
      await fetchUserProfile(supabaseUser.id)
    }
  }, [supabaseUser, fetchUserProfile])

  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        throw new Error(error.message || "Login failed")
      }

      if (data.session) {
        console.log('Login successful, session exists')
        // Wait a tiny bit for onAuthStateChange to fire
        await new Promise(resolve => setTimeout(resolve, 100))
        router.push("/playground")
      } else {
        throw new Error("No session returned from login")
      }
    } catch (error) {
      console.error("Login error:", error)
      throw error
    }
  }

  const signup = async (name: string, email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name,
          },
        },
      })

      if (error) {
        throw new Error(error.message || "Signup failed")
      }

      // Don't manually set state here - let onAuthStateChange handle it
      // This prevents race conditions and ensures consistent auth state
      if (data.session) {
        console.log('Signup successful, redirecting to playground')
        router.push("/playground")
      }
    } catch (error) {
      console.error("Signup error:", error)
      throw error
    }
  }

  const logout = async () => {
    try {
      // Clear state immediately for instant UI feedback
      setUser(null)
      setSupabaseUser(null)
      clearProfileCache()
      
      // Then sign out from Supabase
      await supabase.auth.signOut()
      
      // Wait a tiny bit to ensure state updates are rendered
      await new Promise(resolve => setTimeout(resolve, 50))
      
      router.push("/")
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  const updateUser = (updatedData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updatedData }
      setUser(updatedUser)
      setProfileCache(updatedUser)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        supabaseUser,
        isLoading,
        isAuthenticated: !!user && !!supabaseUser,
        login,
        signup,
        logout,
        updateUser,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
