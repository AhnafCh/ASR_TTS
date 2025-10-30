"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { 
  Mic, 
  Upload, 
  Link as LinkIcon, 
  Download, 
  Share2,
  Loader2,
  StopCircle,
  X,
  Play
} from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

export function SpeechToTextPanel() {
  const router = useRouter()
  const { isAuthenticated } = useAuth()
  const [inputMode, setInputMode] = useState<"record" | "file" | "link">("file")
  const [isRecording, setIsRecording] = useState(false)
  const [isTranscribing, setIsTranscribing] = useState(false)
  const [transcription, setTranscription] = useState("")
  const [language, setLanguage] = useState("auto")
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    validateAndSetFile(file)
  }

  const validateAndSetFile = (file: File) => {
    // Validate file type
    const allowedExtensions = ['flac', 'mp3', 'mp4', 'mpeg', 'mpga', 'm4a', 'ogg', 'wav', 'webm']
    const fileExtension = file.name.split('.').pop()?.toLowerCase()
    
    if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
      alert(`Unsupported file type. Supported formats: ${allowedExtensions.join(', ')}`)
      return
    }

    // Check file size (max 25 MB)
    const maxSize = 25 * 1024 * 1024 // 25 MB in bytes
    if (file.size > maxSize) {
      alert(`File size (${(file.size / (1024 * 1024)).toFixed(2)} MB) exceeds maximum limit of 25 MB`)
      return
    }

    // Clear previous audio URL if exists
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl)
    }

    // Create object URL for audio playback
    const url = URL.createObjectURL(file)
    setAudioUrl(url)
    setUploadedFile(file)
  }

  const handleRemoveFile = () => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl)
    }
    setAudioUrl(null)
    setUploadedFile(null)
    setTranscription("")
  }

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragging(false)

    const file = event.dataTransfer.files?.[0]
    if (file) {
      validateAndSetFile(file)
    }
  }

  const handleTranscribe = async () => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      router.push("/signup")
      return
    }

    // Validate input
    if (!uploadedFile) {
      alert("Please upload an audio file")
      return
    }

    setIsTranscribing(true)
    
    try {
      // Prepare form data
      const formData = new FormData()
      formData.append('file', uploadedFile)
      
      // Add language parameter if not auto-detect
      if (language && language !== 'auto') {
        formData.append('language', language)
      }

      // Connect to FastAPI backend - use relative path or network IP
      const apiUrl = typeof window !== 'undefined' 
        ? `${window.location.protocol}//${window.location.hostname}:8000/api/asr/transcribe`
        : "http://localhost:8000/api/asr/transcribe"

      // Call FastAPI backend
      const response = await fetch(apiUrl, {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error("API Error Response:", errorData)
        // FastAPI returns errors in 'detail' field
        throw new Error(errorData.detail || errorData.error || `HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()

      if (data.success) {
        setTranscription(data.text)
        console.log("Transcription successful!")
        console.log("Metadata:", data.metadata)
      } else {
        console.error("Transcription failed:", data.error)
        throw new Error(data.error || "Unknown error occurred")
      }
    } catch (error: any) {
      console.error("Error transcribing audio:", error)
      alert("Failed to transcribe audio: " + (error.message || error))
    } finally {
      setIsTranscribing(false)
    }
  }

  const handleCopyToClipboard = () => {
    if (!transcription) return
    
    navigator.clipboard.writeText(transcription).then(() => {
      alert("Transcription copied to clipboard!")
    }).catch(err => {
      console.error("Failed to copy:", err)
      alert("Failed to copy to clipboard")
    })
  }

  const handleDownloadTranscription = () => {
    if (!transcription) return
    
    // Create a download link
    const blob = new Blob([transcription], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `transcription-${Date.now()}.txt`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="space-y-3">
        <h2 className="text-4xl font-bold text-foreground">Speech-to-Text</h2>
        <p className="text-muted-foreground text-base leading-relaxed">
          Convert audio to accurate text transcriptions with AI precision
        </p>
      </div>

      {/* Input Mode Selection */}
      <div className="flex gap-3">
        <Button
          variant={inputMode === "file" ? "default" : "outline"}
          onClick={() => setInputMode("file")}
          className={inputMode === "file" ? "flex-1 bg-primary hover:bg-secondary text-white font-semibold rounded-lg transition-colors duration-200" : "flex-1 border border-border hover:bg-muted/50 rounded-lg transition-colors duration-200"}
        >
          <Upload className="w-4 h-4 mr-2" />
          Upload File
        </Button>
        <Button
          variant={inputMode === "record" ? "default" : "outline"}
          onClick={() => setInputMode("record")}
          className="flex-1 border border-border bg-muted/30 text-muted-foreground rounded-lg opacity-60 cursor-not-allowed"
          disabled
          title="Coming soon - Voice recording feature"
        >
          <Mic className="w-4 h-4 mr-2" />
          Record
          <span className="ml-2 text-xs bg-muted px-2 py-0.5 rounded">Soon</span>
        </Button>
        <Button
          variant={inputMode === "link" ? "default" : "outline"}
          onClick={() => setInputMode("link")}
          className="flex-1 border border-border bg-muted/30 text-muted-foreground rounded-lg opacity-60 cursor-not-allowed"
          disabled
          title="Coming soon - URL import feature"
        >
          <LinkIcon className="w-4 h-4 mr-2" />
          Audio Link
          <span className="ml-2 text-xs bg-muted px-2 py-0.5 rounded">Soon</span>
        </Button>
      </div>

      {/* Input Section */}
      <div className="space-y-4">
        {inputMode === "file" && (
          <div 
            className={`border-2 border-dashed rounded-lg p-10 text-center transition-all duration-200 ${
              isDragging 
                ? 'border-primary bg-primary/5' 
                : 'border-border bg-muted/30 hover:border-primary/50'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <Upload className={`w-16 h-16 mx-auto mb-4 text-primary ${isDragging ? 'scale-110' : ''} transition-transform duration-200`} />
            <p className="text-sm text-foreground mb-2 font-medium">
              {uploadedFile ? uploadedFile.name : "Drag and drop your audio file here, or click to browse"}
            </p>
            <p className="text-xs text-muted-foreground mb-4">
              Supported formats: FLAC, MP3, MP4, MPEG, MPGA, M4A, OGG, WAV, WEBM (Max 25 MB)
            </p>
            <input
              type="file"
              id="audio-upload"
              className="hidden"
              accept=".flac,.mp3,.mp4,.mpeg,.mpga,.m4a,.ogg,.wav,.webm"
              onChange={handleFileUpload}
            />
            <Button 
              variant="outline" 
              size="sm"
              className="bg-primary hover:bg-secondary text-white font-semibold rounded-lg border-0 transition-colors duration-200"
              onClick={() => document.getElementById('audio-upload')?.click()}
            >
              Choose Audio File
            </Button>
          </div>
        )}

        {/* Uploaded File Preview */}
        {uploadedFile && audioUrl && (
          <div className="bg-white dark:bg-card border border-border rounded-lg p-5 space-y-3 animate-in fade-in duration-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Play className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{uploadedFile.name}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    {(uploadedFile.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleRemoveFile}
                title="Remove file"
                className="hover:bg-destructive/10 hover:text-destructive transition-colors duration-200"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            
            {/* Audio Player */}
            <audio controls className="w-full rounded-lg" src={audioUrl}>
              Your browser does not support the audio element.
            </audio>
          </div>
        )}

        {inputMode === "link" && (
          <div className="space-y-2">
            <Label htmlFor="audio-link" className="text-sm font-medium text-foreground">Audio URL</Label>
            <input
              id="audio-link"
              type="url"
              placeholder="https://example.com/audio.mp3"
              className="w-full px-4 py-3 border border-border rounded-md bg-white dark:bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
            />
            <Button onClick={handleTranscribe} className="w-full mt-4 bg-primary hover:bg-secondary text-white font-semibold rounded-lg transition-colors duration-200">
              Transcribe from Link
            </Button>
          </div>
        )}

        {/* Language Selection */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="transcribe-language" className="text-sm font-medium text-foreground">Audio Language</Label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger 
                id="transcribe-language" 
                className="bg-white dark:bg-background border border-border rounded-md focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                suppressHydrationWarning
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-card border border-border rounded-md">
                <SelectItem value="auto">Auto-detect</SelectItem>
                <SelectItem value="bn">বাংলা (Bengali)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Transcribe Button */}
      <Button
        onClick={handleTranscribe}
        disabled={isTranscribing || !uploadedFile}
        className="w-full h-14 text-base font-semibold ai-gradient-button text-white rounded-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        size="lg"
      >
        {isTranscribing ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Transcribing...
          </>
        ) : (
          <>
            <Mic className="w-5 h-5 mr-2" />
            Transcribe Audio
          </>
        )}
      </Button>

      {/* Output Section */}
      {transcription && (
        <div className="card-gradient dark:bg-card border border-border rounded-lg p-6 space-y-4 animate-in fade-in duration-300 elevation-2">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg text-foreground flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary" />
              Transcription
            </h3>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleDownloadTranscription}
                className="border border-border hover:bg-muted/50 rounded-lg transition-colors duration-200"
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleCopyToClipboard}
                className="border border-border hover:bg-muted/50 rounded-lg transition-colors duration-200"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Copy
              </Button>
            </div>
          </div>
          
          <Textarea
            value={transcription}
            onChange={(e) => setTranscription(e.target.value)}
            className="min-h-[250px] resize-none bg-white dark:bg-background border border-border rounded-md focus-glow transition-all duration-200 text-base leading-relaxed p-4"
            placeholder="Transcription will appear here..."
          />
          
          <div className="text-sm text-muted-foreground flex items-center gap-4">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              Words: {transcription.split(" ").filter(Boolean).length}
            </span>
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              Characters: {transcription.length}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
