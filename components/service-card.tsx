"use client"

interface ServiceCardProps {
  title: string
  description: string
  icon: string
}

export function ServiceCard({ title, description, icon }: ServiceCardProps) {
  return (
    <div className="group relative p-6 rounded-lg bg-card border border-border hover:border-accent/50 card-hover cursor-pointer overflow-hidden">
      {/* Hover glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent/0 via-transparent to-accent/0 group-hover:from-accent/10 group-hover:to-accent/5 transition-all duration-300" />

      <div className="relative z-10 space-y-3">
        <div className="text-3xl">{icon}</div>
        <h3 className="text-lg font-semibold text-foreground group-hover:text-accent transition-colors duration-300">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
      </div>
    </div>
  )
}
