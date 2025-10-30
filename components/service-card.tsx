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
    <div className="group relative p-6 rounded-lg bg-white dark:bg-card border border-border hover:border-primary transition-colors duration-200 cursor-pointer h-full">
      <div className="space-y-3">
        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
          <Icon className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors duration-200">
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
