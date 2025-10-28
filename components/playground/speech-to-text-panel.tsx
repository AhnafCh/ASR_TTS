"use client"

import { useState } from "react"
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

      // Call FastAPI backend
      const response = await fetch("http://localhost:8000/api/asr/transcribe", {
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
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold">Speech-to-Text</h2>
        <p className="text-muted-foreground mt-2">
          Convert audio to accurate text transcriptions in Bengali
        </p>
      </div>

      {/* Input Mode Selection */}
      <div className="flex gap-2">
        <Button
          variant={inputMode === "record" ? "default" : "outline"}
          onClick={() => setInputMode("record")}
          className="flex-1"
          disabled
          title="Coming soon - Voice recording feature"
        >
          <Mic className="w-4 h-4 mr-2" />
          Record
        </Button>
        <Button
          variant={inputMode === "file" ? "default" : "outline"}
          onClick={() => setInputMode("file")}
          className="flex-1"
        >
          <Upload className="w-4 h-4 mr-2" />
          Upload File
        </Button>
        <Button
          variant={inputMode === "link" ? "default" : "outline"}
          onClick={() => setInputMode("link")}
          className="flex-1"
          disabled
          title="Coming soon - URL import feature"
        >
          <LinkIcon className="w-4 h-4 mr-2" />
          Audio Link
        </Button>
      </div>

      {/* Input Section */}
      <div className="space-y-4">
        {inputMode === "file" && (
          <div 
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragging 
                ? 'border-accent bg-accent/10' 
                : 'border-border'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-sm text-muted-foreground mb-2">
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
              onClick={() => document.getElementById('audio-upload')?.click()}
            >
              Choose Audio File
            </Button>
          </div>
        )}

        {/* Uploaded File Preview */}
        {uploadedFile && audioUrl && (
          <div className="border border-border rounded-lg p-4 space-y-3 bg-card">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Play className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">{uploadedFile.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(uploadedFile.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleRemoveFile}
                title="Remove file"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            {/* Audio Player */}
            <audio controls className="w-full" src={audioUrl}>
              Your browser does not support the audio element.
            </audio>
          </div>
        )}

        {inputMode === "link" && (
          <div className="space-y-2">
            <Label htmlFor="audio-link">Audio URL</Label>
            <input
              id="audio-link"
              type="url"
              placeholder="https://example.com/audio.mp3"
              className="w-full px-4 py-2 border border-border rounded-lg bg-background"
            />
            <Button onClick={handleTranscribe} className="w-full mt-4">
              Transcribe from Link
            </Button>
          </div>
        )}

        {/* Language Selection */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="transcribe-language">Audio Language</Label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger id="transcribe-language">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="auto">Auto-detect</SelectItem>
                <SelectItem value="bn">বাংলা (Bengali)</SelectItem>
                <SelectItem value="en">English</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Transcribe Button */}
      <Button
        onClick={handleTranscribe}
        disabled={isTranscribing || !uploadedFile}
        className="w-full h-12 text-lg"
        size="lg"
      >
        {isTranscribing ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Transcribing...
          </>
        ) : (
          "Transcribe Audio"
        )}
      </Button>

      {/* Output Section */}
      {transcription && (
        <div className="border border-border rounded-lg p-6 space-y-4 bg-card">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Transcription</h3>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleDownloadTranscription}>
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
              <Button variant="outline" size="sm" onClick={handleCopyToClipboard}>
                <Share2 className="w-4 h-4 mr-2" />
                Copy
              </Button>
            </div>
          </div>
          
          <Textarea
            value={transcription}
            onChange={(e) => setTranscription(e.target.value)}
            className="min-h-[200px] resize-none"
            placeholder="Transcription will appear here..."
          />
          
          <div className="text-sm text-muted-foreground">
            <p>Words: {transcription.split(" ").length} • Characters: {transcription.length}</p>
          </div>
        </div>
      )}
    </div>
  )
}
