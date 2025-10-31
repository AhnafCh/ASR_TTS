"use client"

import Link from "next/link"
import { LucideIcon } from "lucide-react"

interface ServiceCardProps {
  title: string
  description: string
  icon: LucideIcon
  href?: string
}

export function ServiceCard({ title, description, icon: Icon, href }: ServiceCardProps) {
  const content = (
    <div className="group relative p-5 sm:p-6 rounded-lg card-gradient dark:bg-card border border-border hover:border-primary transition-all duration-200 cursor-pointer h-full card-hover-lift elevation-1 min-h-11">
      <div className="space-y-3">
        <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-200">
          <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
        <h3 className="text-base sm:text-lg font-semibold text-foreground group-hover:text-primary transition-colors duration-200">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
      </div>
    </div>
  )

  if (href) {
    return (
      <Link href={href} className="block">
        {content}
      </Link>
    )
  }

  return content
}
