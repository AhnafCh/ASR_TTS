"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Sparkles, Mic, Volume2, Zap } from "lucide-react"

export function Hero() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <section className="relative flex items-center justify-center px-4 py-10 overflow-hidden pt-20 pb-20">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-primary/20 to-blue-50 dark:from-background dark:via-primary/25 dark:to-background animate-gradient-shift" 
           style={{
             backgroundSize: '200% 200%',
             animation: 'gradient-shift 15s ease infinite'
           }}
      />
      
      {/* Grainy Texture Overlay */}
      <div className="absolute inset-0 opacity-[0.085] dark:opacity-[0.035]"
           style={{
             backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
             backgroundRepeat: 'repeat',
             backgroundSize: '200px 200px'
           }}
      />

      {/* Subtle Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
        <div className="absolute top-20 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Text and Buttons */}
          <div className="space-y-8 text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 border border-primary/20">
              <Zap className="w-4 h-4 text-primary" />
              <span className="text-primary text-sm font-semibold">AI-Powered Voice Technology</span>
            </div>

            <div className="space-y-6">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] text-foreground">
                <span className="block">
                  বাংলা এআই
                </span>
                <span className="block text-primary">
                  ভয়েস প্রযুক্তি
                </span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-xl leading-relaxed">
                Transform your content with cutting-edge <span className="text-primary font-semibold">AI voice services</span>. 
                Text-to-Speech and Speech Recognition in Bengali.
              </p>
            </div>

            {/* Features Grid */}
            {/* <div className="grid grid-cols-2 gap-4 py-4">
              <div className="bg-white border border-border p-4 text-center hover:border-primary transition-all duration-200 cursor-pointer rounded-lg">
                <Volume2 className="w-6 h-6 mx-auto mb-2 text-primary" />
                <p className="text-sm font-medium text-foreground">TTS</p>
              </div>
              <div className="bg-white border border-border p-4 text-center hover:border-primary transition-all duration-200 cursor-pointer rounded-lg">
                <Mic className="w-6 h-6 mx-auto mb-2 text-primary" />
                <p className="text-sm font-medium text-foreground">ASR</p>
              </div>
            </div> */}

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Button 
                size="lg" 
                className="ai-gradient-button text-white font-semibold rounded-lg px-8 shadow-lg"
              >
                Get API Access
              </Button>
              <Link href="/playground">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-border text-foreground hover:bg-muted rounded-lg px-8 transition-colors duration-200 font-semibold elevation-1 hover:elevation-2"
                >
                  <span className="mr-2">Try Playground</span>
                  <Zap className="w-4 h-4" />
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="border border-border text-foreground hover:bg-muted rounded-lg px-8 transition-colors duration-200 font-semibold"
                onClick={() => scrollToSection("contact")}
              >
                Contact Us
              </Button>
            </div>

            {/* Stats */}
            <div className="flex gap-8 pt-4 text-sm">
              <div>
                <p className="text-2xl font-bold text-primary">99.9%</p>
                <p className="text-muted-foreground">Accuracy</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">&lt;100ms</p>
                <p className="text-muted-foreground">Latency</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">24/7</p>
                <p className="text-muted-foreground">Available</p>
              </div>
            </div>
          </div>

          {/* Right side - YouTube Video */}
          <div className="relative">
            <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-border bg-muted">
              <iframe
                className="absolute inset-0 w-full h-full"
                src="https://www.youtube-nocookie.com/embed/Jw_gLj0_87Y"
                title="SenseVoice Demo"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              ></iframe>
            </div>

            {/* Badge */}
            <div className="absolute -bottom-4 -right-4 bg-white dark:bg-card border border-border p-4 rounded-lg shadow-lg">
              <p className="text-xs text-muted-foreground mb-1">Watch Demo</p>
              <p className="text-lg font-bold text-primary flex items-center gap-1">
                <Play className="w-4 h-4" />
                1:10
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Play(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M8 5v14l11-7z" />
    </svg>
  )
}
