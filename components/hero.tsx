"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"

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
      <div className="absolute inset-0 bg-linear-to-b from-accent/10 via-transparent to-transparent pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center fade-in">
          {/* Left side - Text and Buttons */}
          <div className="space-y-8 text-left">
            <div className="space-y-4">
              <p className="text-accent text-sm font-semibold tracking-widest uppercase">SenseVoice Platform</p>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight font-sans">
                <span className="gradient-text">বাংলা এআই ভয়েস প্রযুক্তি</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-xl">
                Transform your content with cutting-edge AI voice services. Text-to-Speech, Speech Recognition, and Voice
                Cloning in Bengali.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-8">
                Get API
              </Button>
              <Link href="/playground">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-muted-foreground text-foreground hover:bg-secondary rounded-full px-8 bg-transparent cursor-pointer"
                >
                  Playground
                </Button>
              </Link>
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

          {/* Right side - YouTube Video */}
          <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-2xl border border-border/50 bg-secondary/20 backdrop-blur-sm">
            <iframe
              className="absolute inset-0 w-full h-full"
              src="https://www.youtube-nocookie.com/embed/Jw_gLj0_87Y"
              title="SenseVoice Demo"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  )
}
