"use client"

import { useEffect, useState } from "react"
import Image from "next/image"

export function Clients() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  const testimonials = [
    {
      name: "Fatima Tuz Zahara",
      logo: "/clients/IntelsenseAIlogo.svg",
      role: "Peer and Communication Executive",
      company: "IntelSense AI Ltd.",
      testimonial: "The AI-powered capabilities of SenseVoice are essential in our communication strategies. The integrated machine learning ensures that our performance is continuously improving, without any degradation, adapting dynamically to our needs.",
    },
    {
      name: "Riyazul Alam Rabbi",
      logo: "/clients/channel-24.svg",
      role: "Manager, Digital Department",
      company: "Channel 24",
      testimonial: "In my role at Channel 24, the digital department greatly benefits from SenseVoice, which streamlines content creation and management, significantly speeding up our digital workflows and increasing efficiency.",
    },
    {
      name: "Asadul Islam",
      logo: "/clients/uni-rajshahi.svg",
      role: "Student",
      company: "University of Rajshahi",
      testimonial: "Studying Materials Science and Engineering at University of Rajshahi, I appreciate the technical complexities and the need for precise data analysis. SenseVoice's AI tools support these requirements proficiently, enhancing our academic research capabilities.",
    },
    {
      name: "Salman Rahman",
      logo: "/clients/inspira.png",
      role: "Advisor, Consulting Partner and Director",
      company: "Inspira",
      testimonial: "Overseeing private sector engagement at Inspira, I recognize the importance of innovative solutions like SenseVoice. Its AI capabilities enhance our interactions and efficiency in managing projects and client relations.",
    },
    {
      name: "Erfanul Haque",
      logo: "/clients/Onethread.svg",
      role: "Co-Founder and CEO",
      company: "OneThread",
      testimonial: "OneThread is designed as a simpler, more affordable project management solution. SenseVoice's AI integration significantly simplifies project tracking and management, giving us a competitive edge over traditional methods.",
    },
    // {
    //   name: "Aminul Ihsan Zami",
    //   logo: "/clients/insight-labs.png",
    //   role: "Former CEO, Educator",
    //   company: "Insight Labs Ltd.",
    //   testimonial: "Having transitioned from IoT to education, I leverage SenseVoice to provide practical courses in MATLAB and Python. The AI's role in educational tools enhances both learning and teaching experiences through interactive and adaptive content.",
    // },
    {
      name: "Shah MD Reza Khan",
      logo: "/clients/legum.png",
      role: "Lawyer, Senior Consultant",
      company: "Legum Consultants Limited",
      testimonial: "As a legal professional, the real-time content creation facilitated by SenseVoice's AI and NLP technologies is revolutionary. It speeds up documentation and significantly reduces the workload on our legal teams, allowing for more focused legal analysis.",
    },
  ]

  useEffect(() => {
    if (isPaused) return

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    }, 5500) // Change every 5.5 seconds for smoother experience

    return () => clearInterval(timer)
  }, [testimonials.length, isPaused])

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  return (
    <section className="py-10 sm:py-12 md:py-16 px-4 sm:px-6 md:px-8 bg-linear-to-br from-white via-primary/5 to-white dark:from-background dark:via-primary/5 dark:to-background relative overflow-hidden">
      {/* Background decoration - hidden on mobile */}
      <div className="hidden sm:block absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl opacity-90" />
      <div className="hidden sm:block absolute bottom-0 left-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl opacity-90" />
      
      <div className="max-w-[1200px] mx-auto relative z-10">
        <div className="text-center mb-8 sm:mb-10 md:mb-12 space-y-2 sm:space-y-3">
          <p className="text-primary text-xs sm:text-sm font-semibold uppercase tracking-wide">
            Client Success Stories
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">
            Trusted by Industry Leaders
          </h2>
        </div>

        {/* Carousel - Center card has full opacity, side cards are blurred */}
        <div className="relative px-4 sm:px-8 md:px-12">
          <div 
            className="relative min-h-[400px]"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {testimonials.map((item, index) => {
              // Calculate position relative to current index
              let position = index - currentIndex
              
              // Handle wrapping for infinite carousel effect
              if (position < -1) position += testimonials.length
              if (position > testimonials.length - 2) position -= testimonials.length
              
              // Determine if card is visible (-1 = left, 0 = center, 1 = right)
              const isCenter = position === 0
              const isLeft = position === -1
              const isRight = position === 1
              const isVisible = isLeft || isCenter || isRight
              
              return (
                <div
                  key={index}
                  className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                    isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
                  }`}
                  style={{
                    transform: `translateX(${position * 35}%) scale(${isCenter ? 1 : 0.65})`,
                    zIndex: isCenter ? 40 : 10,
                  }}
                >
                  <div className={`mx-auto max-w-2xl transition-all duration-1000 ${
                    !isCenter ? 'blur-[4px]' : 'blur-0'
                  }`}>
                    <div className="relative card-gradient dark:bg-card border-2 border-border rounded-2xl p-6 sm:p-8 shadow-lg hover:border-primary transition-all duration-200 elevation-2 flex flex-col">
                      {/* Row 1: Testimonial */}
                      <div className="mb-6">
                        <blockquote className="text-foreground text-base sm:text-lg leading-relaxed">
                          {item.testimonial}
                        </blockquote>
                      </div>

                      {/* Row 2: Author Info and Logo */}
                      <div className="flex items-center justify-between gap-4 pt-4 border-t border-border">
                        {/* Col 1: Name and Company */}
                        <div className="flex-1 min-w-0">
                          {/* Row 2.1: Name */}
                          <p className="text-foreground font-bold text-base sm:text-lg mb-1 truncate">
                            {item.name}
                          </p>
                          {/* Row 2.2: Company and Role */}
                          <p className="text-muted-foreground text-sm sm:text-base truncate">
                            {item.role}
                          </p>
                          <p className="text-primary text-sm sm:text-base font-semibold mt-1 truncate">
                            {item.company}
                          </p>
                        </div>

                        {/* Col 2: Logo */}
                        <div className="shrink-0">
                          <div className={`${
                            item.company === "IntelSense AI Ltd." || item.company === "OneThread" || item.company === "Inspira"
                              ? "w-28 h-16 sm:w-40 sm:h-20" 
                              : "w-16 h-16 sm:w-20 sm:h-20"
                          } rounded-xl bg-white border border-border/50 flex items-center justify-center shadow-md p-3 sm:p-4`}>
                            <Image
                              src={item.logo}
                              alt={`Logo of ${item.company}`}
                              width={128}
                              height={80}
                              className="w-full h-full object-contain"
                              onError={(e) => {
                                const target = e.currentTarget as HTMLImageElement
                                target.style.display = 'none'
                                const parent = target.parentElement
                                if (parent && !parent.querySelector('.logo-fallback')) {
                                  const fallback = document.createElement('div')
                                  fallback.className = 'logo-fallback text-[10px] text-center text-muted-foreground font-medium px-1 leading-tight'
                                  fallback.textContent = `Logo of ${item.company}`
                                  parent.appendChild(fallback)
                                }
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
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
        <div className="flex justify-center items-center gap-2 sm:gap-3 mt-4 sm:mt-6 md:mt-8">
          {testimonials.map((item, index) => {
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
                  className={`${
                    item.company === "IntelSense AI Ltd." || item.company === "OneThread" || item.company === "Inspira"
                      ? "w-16 h-12 sm:w-20 sm:h-14"
                      : "w-12 h-12 sm:w-14 sm:h-14"
                  } rounded-lg flex items-center justify-center p-2 transition-all duration-200 relative ${
                    index === currentIndex
                      ? "bg-white border-2 border-primary shadow-lg"
                      : "bg-white border border-border hover:border-primary"
                  }`}
                >
                  <Image
                    src={item.logo}
                    alt={`Logo of ${item.company}`}
                    width={56}
                    height={56}
                    className="w-full h-full object-contain opacity-90 group-hover:opacity-100 transition-opacity"
                    onError={(e) => {
                      const target = e.currentTarget as HTMLImageElement
                      target.style.display = 'none'
                      const parent = target.parentElement
                      if (parent && !parent.querySelector('.logo-fallback')) {
                        const fallback = document.createElement('div')
                        fallback.className = 'logo-fallback text-[8px] text-center text-muted-foreground font-medium leading-tight'
                        fallback.textContent = `Logo of ${item.company}`
                        parent.appendChild(fallback)
                      }
                    }}
                  />
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}
