"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-background/95 backdrop-blur-md border-b border-border shadow-lg" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="font-bold text-xl text-accent">SenseVoice</div>

        <div className="hidden md:flex items-center gap-8">
          <button
            onClick={() => scrollToSection("tts")}
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            TTS
          </button>
          <button
            onClick={() => scrollToSection("asr")}
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            ASR
          </button>
          <button
            onClick={() => scrollToSection("cloning")}
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Voice Cloning
          </button>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Button
            size="sm"
            variant="outline"
            className="border-muted-foreground text-foreground hover:bg-secondary rounded-full bg-transparent hidden sm:inline-flex"
            onClick={() => scrollToSection("contact")}
          >
            Contact
          </Button>
          <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full">
            Get API
          </Button>
        </div>
      </div>
    </nav>
  )
}
