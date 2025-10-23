"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ChevronUp } from "lucide-react"

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
        className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full shadow-lg hover:shadow-xl transition-all"
        onClick={() => scrollToSection("contact")}
      >
        Contact Us
      </Button>
      <Button
        size="sm"
        variant="outline"
        className="border-muted-foreground text-foreground hover:bg-secondary rounded-full bg-background shadow-lg hover:shadow-xl transition-all"
        onClick={() => scrollToSection("playground")}
      >
        Playground
      </Button>
      <Button
        size="icon"
        className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full shadow-lg hover:shadow-xl transition-all"
        onClick={scrollToTop}
      >
        <ChevronUp className="w-4 h-4" />
      </Button>
    </div>
  )
}
