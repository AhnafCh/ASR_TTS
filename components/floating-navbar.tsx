"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ChevronUp } from "lucide-react"
import Link from "next/link"

export function FloatingNavbar() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 300)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  if (!isVisible) return null

  return (
    <div className="fixed bottom-8 right-8 z-40 flex flex-col gap-3">
      <Button
        size="sm"
        className="ai-gradient-button text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
        onClick={() => scrollToSection("contact")}
      >
        Contact Us
      </Button>
      <Link href="/playground">
        <Button
          size="sm"
          variant="outline"
          className="border-border text-foreground hover:bg-muted rounded-lg bg-white dark:bg-card shadow-lg hover:shadow-xl transition-all duration-200 w-full"
        >
          Playground
        </Button>
      </Link>
      <Button
        size="icon"
        className="ai-gradient-button text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
        onClick={scrollToTop}
      >
        <ChevronUp className="w-4 h-4" />
      </Button>
    </div>
  )
}
