"use client"

export function PlaygroundHeader() {
  return (
    <header className="border-b border-border bg-background px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Playground</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Test our AI voice services in real-time
          </p>
        </div>
      </div>
    </header>
  )
}
