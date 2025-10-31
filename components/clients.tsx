"use client"

import { useEffect, useState } from "react"
import { Building2, Tv, BookOpen, Mic, Clapperboard } from "lucide-react"

export function Clients() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const testimonials = [
    {
      name: "TechCorp",
      icon: Building2,
      role: "CTO",
      company: "TechCorp Solutions",
      testimonial: "SenseVoice transformed our customer service with accurate Bengali voice recognition. The API integration was seamless.",
    },
    {
      name: "MediaHub",
      icon: Tv,
      role: "Content Director",
      company: "MediaHub Productions",
      testimonial: "The text-to-speech quality is exceptional. Our Bengali content reaches a wider audience with natural-sounding voiceovers.",
    },
    {
      name: "EduLearn",
      icon: BookOpen,
      role: "Head of Product",
      company: "EduLearn Platform",
      testimonial: "Students love the audio narration feature. SenseVoice made our educational content accessible to everyone.",
    },
    {
      name: "VoiceAI",
      icon: Mic,
      role: "Lead Engineer",
      company: "VoiceAI Labs",
      testimonial: "Best-in-class latency and accuracy. The API documentation is clear and the support team is responsive.",
    },
    {
      name: "StreamPro",
      icon: Clapperboard,
      role: "Founder & CEO",
      company: "StreamPro Media",
      testimonial: "Real-time transcription for our live streams works flawlessly. This technology is a game-changer for Bengali content creators.",
    },
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    }, 5000) // Change every 5 seconds

    return () => clearInterval(timer)
  }, [testimonials.length])

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  return (
    <section className="py-10 sm:py-12 md:py-16 px-4 sm:px-6 md:px-8 bg-linear-to-br from-white via-primary/5 to-white dark:from-background dark:via-primary/5 dark:to-background relative overflow-hidden">
      {/* Background decoration - hidden on mobile */}
      <div className="hidden sm:block absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl opacity-50" />
      <div className="hidden sm:block absolute bottom-0 left-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl opacity-50" />
      
      <div className="max-w-[1200px] mx-auto relative z-10">
        <div className="text-center mb-8 sm:mb-10 md:mb-12 space-y-2 sm:space-y-3">
          <p className="text-primary text-xs sm:text-sm font-semibold uppercase tracking-wide">
            Client Success Stories
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">
            Trusted by Industry Leaders
          </h2>
        </div>

        {/* Carousel */}
        <div className="relative">
          <div className="overflow-hidden rounded-2xl">
            <div
              className="flex transition-transform duration-700 ease-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {testimonials.map((item, index) => {
                const Icon = item.icon
                return (
                  <div key={index} className="w-full shrink-0 px-2 sm:px-3">
                    <div className="relative card-gradient dark:bg-card border-2 border-border rounded-2xl p-5 sm:p-6 shadow-lg card-hover-lift h-full hover:border-primary transition-all duration-200 elevation-2">
                      {/* Company Icon at top */}
                      <div className="flex justify-center mb-4 sm:mb-6">
                        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-linear-to-br from-primary to-secondary flex items-center justify-center shadow-md">
                          <Icon className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                        </div>
                      </div>

                      {/* Quote mark decoration */}
                      <div className="text-primary/10 dark:text-primary/20 text-4xl sm:text-5xl font-serif leading-none mb-3 sm:mb-4 text-center">"</div>
                      
                      <div className="space-y-4 sm:space-y-6">
                        {/* Testimonial text */}
                        <blockquote className="text-foreground text-sm sm:text-base leading-relaxed text-center min-h-[100px] sm:min-h-[120px]">
                          {item.testimonial}
                        </blockquote>

                        {/* Rating stars */}
                        <div className="flex gap-1 justify-center">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className="w-4 h-4 text-primary fill-current"
                              viewBox="0 0 20 20"
                            >
                              <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                            </svg>
                          ))}
                        </div>

                        {/* Author section */}
                        <div className="text-center pt-3 sm:pt-4 border-t border-border space-y-1">
                          <p className="text-foreground font-bold text-sm sm:text-base">{item.name}</p>
                          <p className="text-muted-foreground text-xs sm:text-sm">
                            {item.role}
                          </p>
                          <p className="text-primary text-xs sm:text-sm font-semibold">
                            {item.company}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Navigation arrows - hidden on mobile */}
          <button
            onClick={() => goToSlide((currentIndex - 1 + testimonials.length) % testimonials.length)}
            className="hidden sm:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-11 h-11 md:w-12 md:h-12 bg-white dark:bg-card border-2 border-border rounded-full items-center justify-center shadow-lg hover:bg-primary hover:border-primary hover:text-white transition-all duration-200 group z-10 min-h-11 min-w-11"
            aria-label="Previous testimonial"
          >
            <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => goToSlide((currentIndex + 1) % testimonials.length)}
            className="hidden sm:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-11 h-11 md:w-12 md:h-12 bg-white dark:bg-card border-2 border-border rounded-full items-center justify-center shadow-lg hover:bg-primary hover:border-primary hover:text-white transition-all duration-200 group z-10 min-h-11 min-w-11"
            aria-label="Next testimonial"
          >
            <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Enhanced Dots Navigation */}
        <div className="flex justify-center items-center gap-2 sm:gap-3 mt-6 sm:mt-8 md:mt-10">
          {testimonials.map((item, index) => {
            const Icon = item.icon
            return (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`group relative transition-all duration-200 min-h-11 min-w-11 ${
                  index === currentIndex ? "scale-110" : "hover:scale-105"
                }`}
                aria-label={`Go to ${item.company} testimonial`}
              >
                <div
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center transition-all duration-200 ${
                    index === currentIndex
                      ? "bg-primary text-white shadow-lg"
                      : "bg-white dark:bg-card border border-border text-muted-foreground hover:border-primary hover:text-primary"
                  }`}
                >
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}
