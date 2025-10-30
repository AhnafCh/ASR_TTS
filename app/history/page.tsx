"use client"

import { useState } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  Download, 
  Play, 
  Copy, 
  Search,
  AudioWaveform,
  Mic2,
  Clock,
  FileText,
  ArrowLeft
} from "lucide-react"
import Link from "next/link"

// Dummy data
const dummyHistory = [
  {
    id: "1",
    name: "Welcome to our new voice synthesis platform...",
    type: "text-to-speech" as const,
    wordCount: 150,
    duration: "00:45",
    createdAt: "2024-10-30T14:30:00",
    audioUrl: "/samples/female.mp3",
    textContent: "Welcome to our new voice synthesis platform. This technology allows you to convert text into natural-sounding speech with various voice options and languages."
  },
  {
    id: "2",
    name: "The quick brown fox jumps over...",
    type: "speech-to-text" as const,
    wordCount: 89,
    duration: "00:32",
    createdAt: "2024-10-30T13:15:00",
    audioUrl: "/samples/male.mp3",
    textContent: "The quick brown fox jumps over the lazy dog. This is a sample transcription of an audio file that was processed through our speech-to-text engine."
  },
  {
    id: "3",
    name: "In today's digital age, artificial intelligence...",
    type: "text-to-speech" as const,
    wordCount: 234,
    duration: "01:20",
    createdAt: "2024-10-30T11:45:00",
    audioUrl: "/samples/female.mp3",
    textContent: "In today's digital age, artificial intelligence is transforming how we interact with technology. Voice synthesis is just one example of how AI can enhance user experiences."
  },
  {
    id: "4",
    name: "Good morning everyone, today we will discuss...",
    type: "speech-to-text" as const,
    wordCount: 445,
    duration: "02:15",
    createdAt: "2024-10-29T16:20:00",
    audioUrl: "/samples/male.mp3",
    textContent: "Good morning everyone, today we will discuss the importance of voice technology in modern applications and how it can improve accessibility for users worldwide."
  },
  {
    id: "5",
    name: "Machine learning models have evolved significantly...",
    type: "text-to-speech" as const,
    wordCount: 312,
    duration: "01:45",
    createdAt: "2024-10-29T10:10:00",
    audioUrl: "/samples/female.mp3",
    textContent: "Machine learning models have evolved significantly over the past decade, enabling more natural and human-like voice synthesis capabilities."
  },
  {
    id: "6",
    name: "Thank you for joining our webinar...",
    type: "speech-to-text" as const,
    wordCount: 678,
    duration: "03:30",
    createdAt: "2024-10-28T15:00:00",
    audioUrl: "/samples/male.mp3",
    textContent: "Thank you for joining our webinar on voice technology. We appreciate your time and hope you found the session informative and engaging."
  },
]

function HistoryPageContent() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState<"all" | "text-to-speech" | "speech-to-text">("all")
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "longest" | "shortest">("newest")

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      alert("Text copied to clipboard!")
    }).catch(err => {
      console.error("Failed to copy text:", err)
    })
  }

  const handleDownload = (item: typeof dummyHistory[0]) => {
    if (item.type === "text-to-speech") {
      // Download as .txt file
      const blob = new Blob([item.textContent], { type: "text/plain" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${item.name.slice(0, 30).replace(/[^a-z0-9]/gi, "_")}.txt`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } else {
      // Download as .mp3 file (simulate)
      const a = document.createElement("a")
      a.href = item.audioUrl
      a.download = `${item.name.slice(0, 30).replace(/[^a-z0-9]/gi, "_")}.mp3`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    }
  }

  const handlePlayAudio = (audioUrl: string) => {
    const audio = new Audio(audioUrl)
    audio.play().catch(err => {
      console.error("Failed to play audio:", err)
    })
  }

  // Filter and sort history
  let filteredHistory = dummyHistory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.textContent.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = filterType === "all" || item.type === filterType
    return matchesSearch && matchesType
  })

  // Sort history
  filteredHistory = [...filteredHistory].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      case "oldest":
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      case "longest":
        return b.wordCount - a.wordCount
      case "shortest":
        return a.wordCount - b.wordCount
      default:
        return 0
    }
  })

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 24) {
      return `${diffInHours} hours ago`
    } else if (diffInHours < 48) {
      return "Yesterday"
    } else {
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    }
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <div className="border-b border-border bg-white dark:bg-background">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <Link href="/playground" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Playground
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">History</h1>
              <p className="text-muted-foreground mt-1">View and manage your voice projects</p>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <FileText className="w-4 h-4" />
              <span>{filteredHistory.length} projects</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterType} onValueChange={(value: any) => setFilterType(value)}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="text-to-speech">Text-to-Speech</SelectItem>
              <SelectItem value="speech-to-text">Speech-to-Text</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="longest">Longest First</SelectItem>
              <SelectItem value="shortest">Shortest First</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* History List */}
        <div className="space-y-3">
          {filteredHistory.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No projects found</h3>
                <p className="text-muted-foreground">
                  {searchQuery || filterType !== "all"
                    ? "Try adjusting your filters or search query"
                    : "Start creating voice projects in the playground"}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredHistory.map((item) => (
              <Card key={item.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-1">
                  <div className="flex items-center gap-4 px-4">
                    {/* Icon */}
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      item.type === "text-to-speech" 
                        ? "bg-primary/10 text-primary" 
                        : "bg-blue-500/10 text-blue-600"
                    }`}>
                      {item.type === "text-to-speech" ? (
                        <AudioWaveform className="w-6 h-6" />
                      ) : (
                        <Mic2 className="w-6 h-6" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 flex items-center justify-between gap-4">
                      <div className="flex-1 min-w-0 items-center">
                        <h3 className="font-semibold text-foreground truncate mb-1">
                          {item.name}
                        </h3>
                        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md ${
                            item.type === "text-to-speech"
                              ? "bg-primary/10 text-primary"
                              : "bg-blue-500/10 text-blue-600"
                          }`}>
                            {item.type === "text-to-speech" ? "Text-to-Speech" : "Speech-to-Text"}
                          </span>
                          <span className="flex items-center gap-1">
                            <FileText className="w-3.5 h-3.5" />
                            {item.wordCount} words
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {item.duration}
                          </span>
                          <span>{formatDate(item.createdAt)}</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {item.type === "speech-to-text" ? (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handlePlayAudio(item.audioUrl)}
                            className="gap-2"
                          >
                            <Play className="w-4 h-4" />
                            Play
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleCopyText(item.textContent)}
                            className="gap-2"
                          >
                            <Copy className="w-4 h-4" />
                            Copy
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDownload(item)}
                          className="gap-2"
                        >
                          <Download className="w-4 h-4" />
                          Download {item.type === "text-to-speech" ? ".txt" : ".mp3"}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default function HistoryPage() {
  return (
    <ProtectedRoute>
      <HistoryPageContent />
    </ProtectedRoute>
  )
}
