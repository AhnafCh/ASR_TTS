import { ServiceCard } from "./service-card"

export function VoiceCloningSection() {
  const cloningServices = [
    {
      title: "Personalized Voice Assistants",
      description: "Create branded voice assistants with unique personalities",
      icon: "🤖",
      href: "/voice-cloning/personalized-assistants",
    },
    {
      title: "Multilingual Content",
      description: "Maintain original speaker voice across multiple languages",
      icon: "🌍",
      href: "/voice-cloning/multilingual-content",
    },
    {
      title: "Video Series Narration",
      description: "Consistent narrator voice throughout video series",
      icon: "🎬",
      href: "/voice-cloning/video-series-narration",
    },
    {
      title: "Film & Series Dubbing",
      description: "Professional voice dubbing for films and television",
      icon: "🎭",
      href: "/voice-cloning/film-dubbing",
    },
    {
      title: "Game Character Voices",
      description: "Unique character voices for games and animation",
      icon: "🎮",
      href: "/voice-cloning/game-character-voices",
    },
    {
      title: "Radio Jockey Voice",
      description: "Replicate professional radio announcer voices",
      icon: "📻",
      href: "/voice-cloning/radio-jockey",
    },
    {
      title: "News Anchor Generation",
      description: "Automated news anchor voice generation",
      icon: "📡",
      href: "/voice-cloning/news-anchor",
    },
  ]

  return (
    <section id="cloning" className="py-20 px-4 border-t border-border scroll-mt-20">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold">Voice Cloning</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Clone and replicate voices with remarkable accuracy and naturalness
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cloningServices.map((service, index) => (
            <div key={index} className="animate-in fade-in" style={{ animationDelay: `${index * 50}ms` }}>
              <ServiceCard {...service} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
