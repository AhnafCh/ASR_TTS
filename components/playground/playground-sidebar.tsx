"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AudioWaveform, Mic2, Key, User } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

interface PlaygroundSidebarProps {
  activeTab: "text-to-audio" | "speech-to-text"
  setActiveTab: (tab: "text-to-audio" | "speech-to-text") => void
}

export function PlaygroundSidebar({ activeTab, setActiveTab }: PlaygroundSidebarProps) {
  return (
    <aside className="w-64 border-r border-border bg-muted dark:bg-background flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-border bg-white dark:bg-card">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <AudioWaveform className="w-5 h-5 text-white" />
          </div>
          <span className="font-semibold text-xl text-foreground">SenseVoice</span>
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

        <div className="pt-4 mt-4 border-t border-border space-y-2">
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
        <Button variant="ghost" className="w-full justify-start gap-3 hover:bg-muted transition-colors duration-200">
          <User className="w-5 h-5" />
          Login
        </Button>
        <div className="flex items-center justify-between px-4">
          <span className="text-sm text-muted-foreground font-medium">Theme</span>
          <ThemeToggle />
        </div>
      </div>
    </aside>
  )
}
