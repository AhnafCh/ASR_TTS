"use client"

import Link from "next/link"
import Image from "next/image"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { AudioWaveform, Mic2, Key, User, UserCircle, History, ChevronLeft, ChevronRight } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useState, useEffect } from "react"

interface PlaygroundSidebarProps {
  activeTab: "text-to-audio" | "speech-to-text"
  setActiveTab: (tab: "text-to-audio" | "speech-to-text") => void
}

export function PlaygroundSidebar({ activeTab, setActiveTab }: PlaygroundSidebarProps) {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  console.log('PlaygroundSidebar - isLoading:', isLoading, 'isAuthenticated:', isAuthenticated, 'user:', user?.email)

  // Auto-collapse on mobile and track mobile state
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      if (mobile) {
        setIsCollapsed(true)
      }
    }
    
    // Check on mount
    handleResize()
    
    // Add event listener
    window.addEventListener('resize', handleResize)
    
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <>
      {/* Overlay backdrop for mobile when expanded */}
      {isMobile && !isCollapsed && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsCollapsed(true)}
        />
      )}

      <aside className={`
        ${isCollapsed ? 'w-20' : 'w-64'} 
        ${isMobile && !isCollapsed ? 'fixed left-0 top-0 bottom-0 z-50 shadow-2xl' : 'relative'}
        border-r border-border bg-muted dark:bg-background flex flex-col transition-all duration-300
      `}>
      {/* Collapse Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className={`${isMobile ? 'flex' : 'hidden md:flex'} absolute -right-3 top-20 z-10 w-6 h-6 rounded-full ai-gradient-button text-white shadow-lg items-center justify-center hover:scale-110 transition-transform duration-200`}
        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {isCollapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
      </button>

      {/* Logo */}
      <div className={`p-6 border-b border-border bg-white dark:bg-card ${isCollapsed ? 'flex justify-center' : ''}`}>
        <Link href="/" className="flex items-center gap-2">
          {isCollapsed ? (
            <>
              <Image
                src="/logo/sv-icon-light-48.svg"
                alt="SenseVoice Logo"
                width={32}
                height={32}
                className="h-8 w-8 dark:hidden"
              />
              <Image
                src="/logo/sv-icon-dark-48.svg"
                alt="SenseVoice Logo"
                width={32}
                height={32}
                className="h-8 w-8 hidden dark:block"
              />
            </>
          ) : (
            <>
              <Image
                src="/logo/sv-light-48.svg"
                alt="SenseVoice Logo"
                width={110}
                height={32}
                className="h-8 w-auto dark:hidden"
              />
              <Image
                src="/logo/sv-dark-48.svg"
                alt="SenseVoice Logo"
                width={110}
                height={32}
                className="h-8 w-auto hidden dark:block"
              />
            </>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        <button
          onClick={() => {
            if (pathname === "/history") {
              router.push("/playground")
              setTimeout(() => setActiveTab("text-to-audio"), 100)
            } else {
              setActiveTab("text-to-audio")
            }
          }}
          className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} px-4 py-3 rounded-lg transition-colors duration-200 font-medium ${
            activeTab === "text-to-audio" && pathname !== "/history"
              ? "bg-primary text-white"
              : "text-muted-foreground hover:bg-card hover:text-foreground"
          }`}
          title={isCollapsed ? "Text-to-Speech" : undefined}
        >
          <AudioWaveform className="w-5 h-5" />
          {!isCollapsed && <span>Text-to-Speech</span>}
        </button>

        <button
          onClick={() => {
            if (pathname === "/history") {
              router.push("/playground")
              setTimeout(() => setActiveTab("speech-to-text"), 100)
            } else {
              setActiveTab("speech-to-text")
            }
          }}
          className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} px-4 py-3 rounded-lg transition-colors duration-200 font-medium ${
            activeTab === "speech-to-text" && pathname !== "/history"
              ? "bg-primary text-white"
              : "text-muted-foreground hover:bg-card hover:text-foreground"
          }`}
          title={isCollapsed ? "Speech-to-Text" : undefined}
        >
          <Mic2 className="w-5 h-5" />
          {!isCollapsed && <span>Speech-to-Text</span>}
        </button>

        <button
          disabled
          className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} px-4 py-3 rounded-lg transition-colors duration-200 font-medium text-muted-foreground hover:bg-card/50 cursor-not-allowed relative`}
          title={isCollapsed ? "Cloning (Coming Soon)" : undefined}
        >
          <UserCircle className="w-5 h-5" />
          {!isCollapsed && (
            <>
              <span>Cloning</span>
              <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-600 dark:text-yellow-500 font-semibold border border-yellow-500/20">
                Soon
              </span>
            </>
          )}
          {isCollapsed && (
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-yellow-500"></span>
          )}
        </button>

        <div className="pt-4 mt-4 border-t border-border">
          {isAuthenticated && (
            <Link href="/history">
              <Button 
                variant={pathname === "/history" ? "default" : "outline"}
                className={`w-full ${isCollapsed ? 'justify-center px-0' : 'justify-start gap-3'} transition-colors duration-200 mb-3 ${
                  pathname === "/history" 
                    ? "" 
                    : "border border-border hover:bg-card"
                }`}
                title={isCollapsed ? "History" : undefined}
              >
                <History className="w-5 h-5" />
                {!isCollapsed && "History"}
              </Button>
            </Link>
          )}

          <Link href="/#contact">
            <Button 
              variant="outline" 
              className={`w-full ${isCollapsed ? 'justify-center px-0' : 'justify-start gap-3'} border border-border hover:bg-card transition-colors duration-200`}
              title={isCollapsed ? "Get API" : undefined}
            >
              <Key className="w-5 h-5" />
              {!isCollapsed && "Get API"}
            </Button>
          </Link>
        </div>
      </nav>

      {/* User Section */}
      <div className={`p-4 border-t border-border bg-white dark:bg-card space-y-2 ${isCollapsed ? 'flex justify-center' : ''}`}>
        {isAuthenticated && user ? (
          <button
            onClick={() => router.push("/profile")}
            className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'gap-3 px-4'} py-2 rounded-lg hover:bg-muted/50 hover:shadow-sm transition-all duration-200 text-left group`}
            title={isCollapsed ? user.name : undefined}
          >
            <Avatar className="h-8 w-8 ring-2 ring-transparent group-hover:ring-primary/20 transition-all duration-200">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="bg-primary text-white text-sm">
                {user.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate group-hover:text-primary transition-colors duration-200">{user.name}</p>
                <p className="text-xs text-muted-foreground truncate">{user.email}</p>
              </div>
            )}
          </button>
        ) : isLoading ? (
          <div className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'gap-3 px-4'} py-2 rounded-lg`}>
            <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
            {!isCollapsed && (
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-muted rounded animate-pulse" />
                <div className="h-2 bg-muted rounded animate-pulse w-3/4" />
              </div>
            )}
          </div>
        ) : (
          <Button
            variant="ghost"
            className={`w-full ${isCollapsed ? 'justify-center px-0' : 'justify-start gap-3'} hover:bg-muted transition-colors duration-200`}
            onClick={() => router.push("/login")}
            title={isCollapsed ? "Login" : undefined}
          >
            <User className="w-5 h-5" />
            {!isCollapsed && "Login"}
          </Button>
        )}
      </div>
    </aside>
    </>
  )
}
