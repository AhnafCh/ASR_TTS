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
  Square,
  Copy, 
  Search,
  AudioWaveform,
  Mic2,
  Clock,
  FileText,
  Loader2
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { SimpleAudioPlayer } from "@/components/playground/simple-audio-player"

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
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null)
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

  // Helper to sanitize and format filename
  const getDownloadFilename = (item: HistoryItem) => {
    // Get first 6 words from name or textContent
    let baseText = item.name || item.textContent || "voiceai"
    // Remove non-alphanumeric, split to words, take first 6
    const words = baseText.replace(/[^a-zA-Z0-9 ]/g, " ").split(/\s+/).filter(Boolean).slice(0, 6)
    const prefix = item.type === "text-to-speech" ? "tts" : "asr"
    // Format date and time from createdAt
    const dateObj = new Date(item.createdAt)
    const yyyy = dateObj.getFullYear()
    const mm = String(dateObj.getMonth() + 1).padStart(2, '0')
    const dd = String(dateObj.getDate()).padStart(2, '0')
    const hh = String(dateObj.getHours()).padStart(2, '0')
    const min = String(dateObj.getMinutes()).padStart(2, '0')
    const ss = String(dateObj.getSeconds()).padStart(2, '0')
    const dateStr = `${yyyy}${mm}${dd}`
    const timeStr = `${hh}${min}${ss}`
    const ext = item.type === "text-to-speech" ? "mp3" : "txt"
    return `${prefix}-${words.join('_')}-${dateStr}-${timeStr}.${ext}`.toLowerCase()
  }

  const handleDownload = (item: HistoryItem) => {
    const filename = getDownloadFilename(item)
    if (item.type === "text-to-speech" && item.audioUrl) {
      // TTS: Download generated audio as .mp3 file (WAV data, but .mp3 for user)
      const a = document.createElement("a")
      a.href = item.audioUrl
      a.download = filename
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    } else if (item.type === "speech-to-text") {
      // STT: Download transcribed text as .txt file
      const blob = new Blob([item.textContent], { type: "text/plain" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }
  }

  const handleToggleAudio = (itemId: string) => {
    if (playingAudioId === itemId) {
      setPlayingAudioId(null)
    } else {
      setPlayingAudioId(itemId)
    }
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
        <div className="border-b border-border bg-white dark:bg-background px-4 sm:px-6 md:px-8 py-4 sm:py-5 md:py-6 shrink-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">History</h1>
              <p className="text-muted-foreground mt-1 text-sm sm:text-base">View and manage your voice projects</p>
            </div>
            <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
              <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>{filteredHistory.length} projects</span>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 bg-background">
          <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
        {/* Filters */}
        <div className="flex flex-col gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 text-muted-foreground" />
            <Input
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 sm:pl-10 h-9 sm:h-10 text-sm sm:text-base"
            />
          </div>
          <div className="flex flex-row gap-2 sm:gap-3">
            <Select value={filterType} onValueChange={(value: any) => setFilterType(value)}>
              <SelectTrigger className="w-full md:w-[180px] h-9 sm:h-10 text-xs sm:text-sm" suppressHydrationWarning>
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="text-to-speech">Text-to-Speech</SelectItem>
                <SelectItem value="speech-to-text">Speech-to-Text</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
              <SelectTrigger className="w-full md:w-[180px] h-9 sm:h-10 text-xs sm:text-sm" suppressHydrationWarning>
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
        </div>

        {/* History List */}
        <div className="space-y-2 sm:space-y-3">
          {isLoading ? (
            <Card>
              <CardContent className="py-8 sm:py-12 text-center">
                <Loader2 className="w-10 h-10 sm:w-12 sm:h-12 text-muted-foreground mx-auto mb-3 sm:mb-4 animate-spin" />
                <h3 className="text-base sm:text-lg font-semibold mb-1 sm:mb-2">Loading history...</h3>
                <p className="text-muted-foreground text-sm sm:text-base">
                  Please wait while we fetch your projects
                </p>
              </CardContent>
            </Card>
          ) : filteredHistory.length === 0 ? (
            <Card>
              <CardContent className="py-8 sm:py-12 text-center">
                <FileText className="w-10 h-10 sm:w-12 sm:h-12 text-muted-foreground mx-auto mb-3 sm:mb-4" />
                <h3 className="text-base sm:text-lg font-semibold mb-1 sm:mb-2">No projects found</h3>
                <p className="text-muted-foreground text-sm sm:text-base px-4">
                  {searchQuery || filterType !== "all"
                    ? "Try adjusting your filters or search query"
                    : "Start creating voice projects in the playground"}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredHistory.map((item) => (
              <Card key={item.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-3 sm:p-4">
                  <div className="flex flex-col gap-3">
                    <div className="flex items-start sm:items-center gap-3 sm:gap-4">
                    {/* Icon */}
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center shrink-0 ${
                      item.type === "text-to-speech" 
                        ? "bg-primary/10 text-primary" 
                        : "bg-blue-500/10 text-blue-600"
                    }`}>
                      {item.type === "text-to-speech" ? (
                        <AudioWaveform className="w-5 h-5 sm:w-6 sm:h-6" />
                      ) : (
                        <Mic2 className="w-5 h-5 sm:w-6 sm:h-6" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground truncate mb-1 text-sm sm:text-base">
                          {item.name}
                        </h3>
                        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-muted-foreground">
                          <span className={`inline-flex items-center gap-1 px-1.5 sm:px-2 py-0.5 rounded-md text-xs ${
                            item.type === "text-to-speech"
                              ? "bg-primary/10 text-primary"
                              : "bg-blue-500/10 text-blue-600"
                          }`}>
                            {item.type === "text-to-speech" ? "TTS" : "STT"}
                          </span>
                          <span className="flex items-center gap-1">
                            <FileText className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                            {item.wordCount} words
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                            {item.duration}
                          </span>
                          <span className="hidden xs:inline">{formatDate(item.createdAt)}</span>
                        </div>
                        <div className="xs:hidden text-xs text-muted-foreground mt-1">
                          {formatDate(item.createdAt)}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
                        {item.type === "text-to-speech" && item.audioUrl ? (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleToggleAudio(item.id)}
                            className="gap-1 sm:gap-2 flex-1 sm:flex-initial text-xs sm:text-sm h-8 sm:h-9"
                          >
                            {playingAudioId === item.id ? (
                              <>
                                <Square className="w-3 h-3 sm:w-4 sm:h-4" />
                                <span className="hidden xs:inline">Stop</span>
                              </>
                            ) : (
                              <>
                                <Play className="w-3 h-3 sm:w-4 sm:h-4" />
                                <span className="hidden xs:inline">Play</span>
                              </>
                            )}
                          </Button>
                        ) : item.type === "speech-to-text" ? (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleCopyText(item.textContent)}
                            className="gap-1 sm:gap-2 flex-1 sm:flex-initial text-xs sm:text-sm h-8 sm:h-9"
                          >
                            <Copy className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span className="hidden xs:inline">Copy</span>
                          </Button>
                        ) : null}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDownload(item)}
                          className="gap-1 sm:gap-2 flex-1 sm:flex-initial text-xs sm:text-sm h-8 sm:h-9"
                        >
                          <Download className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span className="hidden sm:inline">Download</span>
                          <span className="sm:hidden">{item.type === "text-to-speech" ? ".mp3" : ".txt"}</span>
                        </Button>
                      </div>
                    </div>
                    </div>
                    
                    {/* Audio Player */}
                    {playingAudioId === item.id && item.audioUrl && (
                      <div className="pt-2">
                        <SimpleAudioPlayer 
                          audioUrl={item.audioUrl}
                          autoPlay={true}
                          onEnded={() => setPlayingAudioId(null)}
                        />
                      </div>
                    )}
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
