"use client"

import { useState } from "react"
import { PlaygroundSidebar } from "@/components/playground/playground-sidebar"
import { PlaygroundHeader } from "@/components/playground/playground-header"
import { TextToAudioPanel } from "@/components/playground/text-to-audio-panel"
import { SpeechToTextPanel } from "@/components/playground/speech-to-text-panel"

export default function PlaygroundPage() {
  const [activeTab, setActiveTab] = useState<"text-to-audio" | "speech-to-text">("text-to-audio")

  return (
    <div className="flex h-screen bg-muted">
      {/* Sidebar */}
      <PlaygroundSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <PlaygroundHeader />
        
        <main className="flex-1 overflow-y-auto p-8 bg-background">
          <div className="max-w-7xl mx-auto">
            {activeTab === "text-to-audio" && <TextToAudioPanel />}
            {activeTab === "speech-to-text" && <SpeechToTextPanel />}
          </div>
        </main>
      </div>
    </div>
  )
}
