"use client"

import { useState, useEffect } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { PlaygroundSidebar } from "@/components/playground/playground-sidebar"
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
  Loader2
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface HistoryItem {
  id: string
  name: string
  type: "text-to-speech" | "speech-to-text"
  wordCount: number
  duration: string | null
  createdAt: string
  audioUrl: string | null
  textContent: string
}

function HistoryPageContent() {
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState<"all" | "text-to-speech" | "speech-to-text">("all")
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "longest" | "shortest">("newest")
  const supabase = createClient()

  useEffect(() => {
    fetchHistory()
  }, [])

  const fetchHistory = async () => {
    try {
      setIsLoading(true)
      const { data, error } = await supabase
        .from('history')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      const formattedHistory: HistoryItem[] = (data || []).map(item => ({
        id: item.id,
        name: item.name,
        type: item.type as "text-to-speech" | "speech-to-text",
        wordCount: item.word_count,
        duration: item.duration || "00:00",
        createdAt: item.created_at,
        audioUrl: item.audio_url,
        textContent: item.text_content
      }))

      setHistory(formattedHistory)
    } catch (error) {
      console.error('Error fetching history:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      alert("Text copied to clipboard!")
    }).catch(err => {
      console.error("Failed to copy text:", err)
    })
  }

  const handleDownload = (item: HistoryItem) => {
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
    } else if (item.audioUrl) {
      // Download as .mp3 file
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
  let filteredHistory = history.filter((item: HistoryItem) => {
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
    <div className="flex h-screen bg-muted">
      {/* Sidebar */}
      <PlaygroundSidebar activeTab="text-to-audio" setActiveTab={() => {}} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="border-b border-border bg-white dark:bg-background px-8 py-6 shrink-0">
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

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-8 bg-background">
          <div className="max-w-7xl mx-auto space-y-6">
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
          {isLoading ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Loader2 className="w-12 h-12 text-muted-foreground mx-auto mb-4 animate-spin" />
                <h3 className="text-lg font-semibold mb-2">Loading history...</h3>
                <p className="text-muted-foreground">
                  Please wait while we fetch your projects
                </p>
              </CardContent>
            </Card>
          ) : filteredHistory.length === 0 ? (
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
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 ${
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
                      <div className="flex items-center gap-2 shrink-0">
                        {item.type === "speech-to-text" && item.audioUrl ? (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handlePlayAudio(item.audioUrl!)}
                            className="gap-2"
                          >
                            <Play className="w-4 h-4" />
                            Play
                          </Button>
                        ) : item.type === "text-to-speech" ? (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleCopyText(item.textContent)}
                            className="gap-2"
                          >
                            <Copy className="w-4 h-4" />
                            Copy
                          </Button>
                        ) : null}
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
        </main>
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
