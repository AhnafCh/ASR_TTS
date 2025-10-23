export function Clients() {
  const clients = [
    { name: "TechCorp", logo: "🏢" },
    { name: "MediaHub", logo: "📺" },
    { name: "EduLearn", logo: "📚" },
    { name: "VoiceAI", logo: "🎙️" },
    { name: "StreamPro", logo: "🎬" },
  ]

  return (
    <section className="py-20 px-4 border-t border-border">
      <div className="max-w-6xl mx-auto">
        <p className="text-center text-muted-foreground text-sm uppercase tracking-widest mb-12">
          Trusted by leading companies
        </p>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 items-center justify-items-center">
          {clients.map((client) => (
            <div
              key={client.name}
              className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-secondary/50 transition-colors duration-300"
            >
              <span className="text-4xl">{client.logo}</span>
              <span className="text-sm text-muted-foreground">{client.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
