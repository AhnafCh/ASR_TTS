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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        isScrolled ? "bg-white/95 dark:bg-background/95 backdrop-blur-sm border-b border-border" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="font-bold text-xl text-primary">SenseVoice</div>

        <div className="hidden md:flex items-center gap-8">
          <button
            onClick={() => scrollToSection("tts")}
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200"
          >
            TTS
          </button>
          <button
            onClick={() => scrollToSection("asr")}
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200"
          >
            ASR
          </button>
          <button
            onClick={() => scrollToSection("pricing")}
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200"
          >
            Pricing
          </button>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Button
            size="sm"
            variant="outline"
            className="border border-border text-foreground hover:bg-muted rounded-lg hidden sm:inline-flex transition-colors duration-200"
            onClick={() => scrollToSection("contact")}
          >
            Contact
          </Button>
          <Button size="sm" className="bg-primary hover:bg-secondary text-white rounded-lg font-semibold transition-colors duration-200">
            Get API
          </Button>
        </div>
      </div>
    </nav>
  )
}
