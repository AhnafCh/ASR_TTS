"use client"

import { ThemeToggle } from "@/components/theme-toggle"

export function PlaygroundHeader() {
  return (
    <header className="border-b border-border bg-white dark:bg-background px-8 py-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Playground</h1>
        </div>
        <ThemeToggle />
      </div>
    </header>
  )
}
