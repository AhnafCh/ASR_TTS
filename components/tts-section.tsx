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
      title: "Audio Ads & Commercials",
      description: "Engaging voice content for marketing and advertising campaigns",
      icon: Megaphone,
      href: "/tts/audio-ads-commercials",
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
    {
      title: "Audiobook Production",
      description: "Complete audiobook creation with professional narration",
      icon: Headphones,
      href: "/tts/audiobook-production",
    },
  ]

  return (
    <section id="tts" className="py-12 px-4 border-t border-border scroll-mt-20 bg-white dark:bg-background">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">Text-to-Speech</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
            Convert written content into natural, engaging audio with our advanced TTS technology
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
