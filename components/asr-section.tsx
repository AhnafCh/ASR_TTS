"use client"

import { Phone, FileText, Video, Search, Mic2, MessageSquare, PresentationIcon, Edit, BarChart3 } from "lucide-react"
import { ServiceCard } from "./service-card"

export function AsrSection() {
  const asrServices = [
    {
      title: "Call Transcription",
      description: "Automatically transcribe phone calls and voice conversations",
      icon: Phone,
      href: "/asr/call-transcription",
    },
    {
      title: "Meeting Minutes",
      description: "Generate accurate meeting transcripts and summaries",
      icon: FileText,
      href: "/asr/meeting-minutes",
    },
    {
      title: "Video & Podcast Subtitling",
      description: "Create accurate subtitles for video and podcast content",
      icon: Video,
      href: "/asr/video-podcast-subtitling",
    },
    {
      title: "Voice Search",
      description: "Enable voice-based search functionality in applications",
      icon: Search,
      href: "/asr/voice-search",
    },
    {
      title: "Interview Transcription",
      description: "Professional transcription for journalism and research",
      icon: Mic2,
      href: "/asr/interview-transcription",
    },
    {
      title: "Voice Commands",
      description: "Implement voice control for apps and devices",
      icon: MessageSquare,
      href: "/asr/voice-commands",
    },
    {
      title: "Lecture Transcription",
      description: "Convert educational lectures into searchable text",
      icon: PresentationIcon,
      href: "/asr/lecture-transcription",
    },
    {
      title: "Voice Data Entry",
      description: "Hands-free data input through voice commands",
      icon: Edit,
      href: "/asr/voice-data-entry",
    },
    {
      title: "Survey Voice Input",
      description: "Collect survey responses through voice input",
      icon: BarChart3,
      href: "/asr/survey-voice-input",
    },
  ]

  return (
    <section id="asr" className="py-12 px-4 border-t border-border scroll-mt-20 bg-muted">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">Automatic Speech Recognition</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
            Convert speech to text with industry-leading accuracy and speed
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {asrServices.map((service, index) => (
            <div key={index} className="animate-in fade-in" style={{ animationDelay: `${index * 50}ms` }}>
              <ServiceCard {...service} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
