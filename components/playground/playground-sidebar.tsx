"use client"

import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { AudioWaveform, Mic2, Key, User, UserCircle, History } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface PlaygroundSidebarProps {
  activeTab: "text-to-audio" | "speech-to-text"
  setActiveTab: (tab: "text-to-audio" | "speech-to-text") => void
}

export function PlaygroundSidebar({ activeTab, setActiveTab }: PlaygroundSidebarProps) {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()

  return (
    <aside className="w-64 border-r border-border bg-muted dark:bg-background flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-border bg-white dark:bg-card">
        <Link href="/" className="flex items-center gap-2">
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
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        <button
          onClick={() => setActiveTab("text-to-audio")}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 font-medium ${
            activeTab === "text-to-audio"
              ? "bg-primary text-white"
              : "text-muted-foreground hover:bg-card hover:text-foreground"
          }`}
        >
          <AudioWaveform className="w-5 h-5" />
          <span>Text-to-Audio</span>
        </button>

        <button
          onClick={() => setActiveTab("speech-to-text")}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 font-medium ${
            activeTab === "speech-to-text"
              ? "bg-primary text-white"
              : "text-muted-foreground hover:bg-card hover:text-foreground"
          }`}
        >
          <Mic2 className="w-5 h-5" />
          <span>Speech-to-Text</span>
        </button>

        <button
          disabled
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 font-medium text-muted-foreground hover:bg-card/50 cursor-not-allowed relative"
        >
          <UserCircle className="w-5 h-5" /><span>
          <span>Voice Cloning</span>
          <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-600 dark:text-yellow-500 font-semibold border border-yellow-500/20">
            Soon
          </span></span>
        </button>

        <div className="pt-4 mt-4 border-t border-border">
          {isAuthenticated && (
            <Link href="/history">
              <Button 
                variant="outline" 
                className="w-full justify-start gap-3 border border-border hover:bg-card transition-colors duration-200 mb-3"
              >
                <History className="w-5 h-5" />
                History
              </Button>
            </Link>
          )}

          <Link href="/#contact">
            <Button variant="outline" className="w-full justify-start gap-3 border border-border hover:bg-card transition-colors duration-200">
              <Key className="w-5 h-5" />
              Get API
            </Button>
          </Link>
        </div>
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-border bg-white dark:bg-card space-y-2">
        {isAuthenticated && user ? (
          <>
            <button
              onClick={() => router.push("/profile")}
              className="w-full flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-muted/50 hover:shadow-sm transition-all duration-200 text-left group"
            >
              <Avatar className="h-8 w-8 ring-2 ring-transparent group-hover:ring-primary/20 transition-all duration-200">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="bg-primary text-white text-sm">
                  {user.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate group-hover:text-primary transition-colors duration-200">{user.name}</p>
                <p className="text-xs text-muted-foreground truncate">{user.email}</p>
              </div>
            </button>
          </>
        ) : (
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 hover:bg-muted transition-colors duration-200"
            onClick={() => router.push("/login")}
          >
            <User className="w-5 h-5" />
            Login
          </Button>
        )}
      </div>
    </aside>
  )
}
