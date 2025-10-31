"use client"

import { FileText, BookOpen, GraduationCap, Megaphone, Mic, ShoppingCart, Building, Headphones } from "lucide-react"
import { ServiceCard } from "./service-card"

export function TtsSection() {
  const ttsServices = [
    {
      title: "Article & Blog Readout",
      description: "Convert written content into natural-sounding audio for accessibility and engagement",
      icon: FileText,
      href: "/tts/article-blog-readout",
    },
    {
      title: "E-book Narration",
      description: "Professional voice narration for digital books and publications",
      icon: BookOpen,
      href: "/tts/ebook-narration",
    },
    {
      title: "Educational Voiceovers",
      description: "High-quality audio for online courses and educational materials",
      icon: GraduationCap,
      href: "/tts/educational-voiceovers",
    },
   
    {
      title: "Podcast Script Conversion",
      description: "Transform scripts into polished podcast audio content",
      icon: Mic,
      href: "/tts/podcast-conversion",
    },
    {
      title: "E-commerce Product Audio",
      description: "Product descriptions and details in engaging audio format",
      icon: ShoppingCart,
      href: "/tts/ecommerce-audio",
    },
    {
      title: "Museum Audio Guides",
      description: "Immersive audio experiences for exhibitions and museums",
      icon: Building,
      href: "/tts/museum-audio-guides",
    },
    
  ]

  return (
    <section id="tts" className="py-10 sm:py-12 md:py-16 lg:py-20 px-4 sm:px-6 md:px-8 border-t border-border scroll-mt-20 bg-white dark:bg-background">
      <div className="max-w-[1200px] mx-auto space-y-8 sm:space-y-10 md:space-y-12">
        <div className="text-center space-y-3 sm:space-y-4">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground">Text-to-Speech</h2>
          <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto leading-relaxed px-4">
            Convert written content into natural, engaging audio with our advanced TTS technology
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
          {ttsServices.map((service, index) => (
            <div key={index} className="animate-in fade-in" style={{ animationDelay: `${index * 50}ms` }}>
              <ServiceCard {...service} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
