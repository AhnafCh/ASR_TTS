"use client"

import { Button } from "@/components/ui/button"

export function Hero() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 py-20 overflow-hidden pt-32">
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-accent/10 via-transparent to-transparent pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8 fade-in">
        <div className="space-y-4">
          <p className="text-accent text-sm font-semibold tracking-widest uppercase">SenseVoice Platform</p>
          <h1 className="text-5xl md:text-7xl font-bold leading-tight text-balance font-sans">
            <span className="gradient-text">বাংলা এআই ভয়েস</span>
            <br />
            <span className="text-foreground">প্রযুক্তি</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
            Transform your content with cutting-edge AI voice services. Text-to-Speech, Speech Recognition, and Voice
            Cloning in Bengali.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
          <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-8">
            Get API
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-muted-foreground text-foreground hover:bg-secondary rounded-full px-8 bg-transparent cursor-pointer"
            onClick={() => scrollToSection("playground")}
          >
            Playground
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-muted-foreground text-foreground hover:bg-secondary rounded-full px-8 bg-transparent cursor-pointer"
            onClick={() => scrollToSection("contact")}
          >
            Contact Us
          </Button>
        </div>
      </div>
    </section>
  )
}
