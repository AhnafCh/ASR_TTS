"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { createClient } from "@/lib/supabase/client"
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
  Play,
  Pause
} from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { CustomAudioPlayer } from "./custom-audio-player"

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
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null)
  const [audioChunks, setAudioChunks] = useState<Blob[]>([])
  const [recordingTime, setRecordingTime] = useState(0)
  const [recordingInterval, setRecordingInterval] = useState<NodeJS.Timeout | null>(null)
  const [isPaused, setIsPaused] = useState(false)

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

  const formatRecordingTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  }

  const convertToWav = async (webmBlob: Blob): Promise<Blob> => {
    // Create an audio context
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    
    // Decode the audio data
    const arrayBuffer = await webmBlob.arrayBuffer()
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer)
    
    // Convert to WAV
    const wavBuffer = audioBufferToWav(audioBuffer)
    return new Blob([wavBuffer], { type: 'audio/wav' })
  }

  const audioBufferToWav = (buffer: AudioBuffer): ArrayBuffer => {
    const length = buffer.length * buffer.numberOfChannels * 2 + 44
    const arrayBuffer = new ArrayBuffer(length)
    const view = new DataView(arrayBuffer)
    const channels: Float32Array[] = []
    let offset = 0
    let pos = 0

    // Write WAV header
    const setUint16 = (data: number) => {
      view.setUint16(pos, data, true)
      pos += 2
    }
    const setUint32 = (data: number) => {
      view.setUint32(pos, data, true)
      pos += 4
    }

    // "RIFF" chunk descriptor
    setUint32(0x46464952) // "RIFF"
    setUint32(length - 8) // file length - 8
    setUint32(0x45564157) // "WAVE"

    // "fmt " sub-chunk
    setUint32(0x20746d66) // "fmt "
    setUint32(16) // subchunk1size
    setUint16(1) // audio format (1 = PCM)
    setUint16(buffer.numberOfChannels)
    setUint32(buffer.sampleRate)
    setUint32(buffer.sampleRate * 2 * buffer.numberOfChannels) // byte rate
    setUint16(buffer.numberOfChannels * 2) // block align
    setUint16(16) // bits per sample

    // "data" sub-chunk
    setUint32(0x61746164) // "data"
    setUint32(length - pos - 4) // subchunk2size

    // Write interleaved data
    for (let i = 0; i < buffer.numberOfChannels; i++) {
      channels.push(buffer.getChannelData(i))
    }

    while (pos < length) {
      for (let i = 0; i < buffer.numberOfChannels; i++) {
        let sample = Math.max(-1, Math.min(1, channels[i][offset]))
        sample = sample < 0 ? sample * 0x8000 : sample * 0x7FFF
        view.setInt16(pos, sample, true)
        pos += 2
      }
      offset++
    }

    return arrayBuffer
  }

  const startRecording = async () => {
    try {
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      
      // Create MediaRecorder instance with specific options for better compatibility
      let options = { mimeType: 'audio/webm' }
      if (!MediaRecorder.isTypeSupported('audio/webm')) {
        options = { mimeType: 'audio/mp4' }
      }
      
      const recorder = new MediaRecorder(stream, options)
      const chunks: Blob[] = []

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data)
        }
      }

      recorder.onstop = async () => {
        try {
          // Create a blob from the recorded chunks
          const recordedBlob = new Blob(chunks, { type: recorder.mimeType })
          
          console.log("Recording stopped. Original blob size:", (recordedBlob.size / (1024 * 1024)).toFixed(2), "MB")
          
          // Convert to WAV format (supported by backend)
          console.log("Converting to WAV format...")
          const wavBlob = await convertToWav(recordedBlob)
          
          console.log("Conversion complete. WAV size:", (wavBlob.size / (1024 * 1024)).toFixed(2), "MB")
          
          // Create a file from the WAV blob
          const audioFile = new File([wavBlob], `recording-${Date.now()}.wav`, { type: 'audio/wav' })
          
          console.log("=== RECORD MODE FILE CREATION ===")
          console.log("Created File object:", audioFile)
          console.log("File name:", audioFile.name)
          console.log("File type:", audioFile.type)
          console.log("File size:", audioFile.size, "bytes")
          console.log("Is File instance?", audioFile instanceof File)
          console.log("Is Blob instance?", audioFile instanceof Blob)
          
          // Clear previous audio URL if exists
          if (audioUrl) {
            URL.revokeObjectURL(audioUrl)
          }

          // Create object URL for audio playback
          const url = URL.createObjectURL(wavBlob)
          setAudioUrl(url)
          setUploadedFile(audioFile)
          
          console.log("Audio file ready:", audioFile.name, audioFile.type, (audioFile.size / (1024 * 1024)).toFixed(2), "MB")
          
          // Stop all tracks to release microphone
          stream.getTracks().forEach(track => track.stop())
        } catch (error) {
          console.error("Error processing recording:", error)
          alert("Failed to process recording. Please try again.")
          stream.getTracks().forEach(track => track.stop())
        }
      }

      // Start recording
      recorder.start()
      setMediaRecorder(recorder)
      setAudioChunks(chunks)
      setIsRecording(true)
      setRecordingTime(0)

      // Start timer
      const interval = setInterval(() => {
        setRecordingTime(prev => prev + 1)
      }, 1000)
      setRecordingInterval(interval)

    } catch (error) {
      console.error("Error accessing microphone:", error)
      alert("Failed to access microphone. Please ensure you have granted microphone permissions.")
    }
  }

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop()
      setIsRecording(false)
      setIsPaused(false)
      
      // Clear timer
      if (recordingInterval) {
        clearInterval(recordingInterval)
        setRecordingInterval(null)
      }
    }
  }

  const pauseRecording = () => {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.pause()
      setIsPaused(true)
      
      // Pause timer
      if (recordingInterval) {
        clearInterval(recordingInterval)
        setRecordingInterval(null)
      }
    }
  }

  const resumeRecording = () => {
    if (mediaRecorder && mediaRecorder.state === 'paused') {
      mediaRecorder.resume()
      setIsPaused(false)
      
      // Resume timer
      const interval = setInterval(() => {
        setRecordingTime(prev => prev + 1)
      }, 1000)
      setRecordingInterval(interval)
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

    console.log("=== TRANSCRIBE DEBUG ===")
    console.log("uploadedFile:", uploadedFile)
    console.log("File name:", uploadedFile.name)
    console.log("File type:", uploadedFile.type)
    console.log("File size:", uploadedFile.size, "bytes =", (uploadedFile.size / (1024 * 1024)).toFixed(2), "MB")
    console.log("Is File instance?", uploadedFile instanceof File)
    console.log("Is Blob instance?", uploadedFile instanceof Blob)

    setIsTranscribing(true)
    
    try {
      // Prepare form data
      const formData = new FormData()
      formData.append('file', uploadedFile)
      
      // Note: Language parameter removed - backend ASR only supports Bengali
      // Backend always adds punctuation automatically

      // Connect to FastAPI backend - use environment variable or fallback to localhost
      const apiUrl = process.env.NEXT_PUBLIC_API_URL 
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/asr/transcribe`
        : "http://localhost:8000/api/asr/transcribe"

      console.log("Sending transcription request to:", apiUrl)
      console.log("File:", uploadedFile.name, "Size:", (uploadedFile.size / (1024 * 1024)).toFixed(2), "MB")

      // Call FastAPI backend
      const response = await fetch(apiUrl, {
        method: "POST",
        body: formData,
      })

      console.log("Response status:", response.status, response.statusText)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: response.statusText }))
        console.error("API Error Response:", errorData)
        // FastAPI returns errors in 'detail' field
        throw new Error(errorData.detail || errorData.error || `HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      console.log("API Response data:", data)

      if (data.success) {
        setTranscription(data.text)
        console.log("Transcription successful!")
        console.log("Metadata:", data.metadata)
        
        // Save to history in Supabase
        try {
          const supabase = createClient()
          const { data: { user } } = await supabase.auth.getUser()
          
          if (user) {
            // Count words in the transcription
            const wordCount = data.text.trim().split(/\s+/).length
            
            // Extract first few words for the name
            const name = data.text.trim().slice(0, 50) + (data.text.length > 50 ? '...' : '')
            
            // Format duration from seconds to MM:SS
            let formattedDuration = null
            if (data.metadata?.durationSeconds) {
              const totalSeconds = parseInt(data.metadata.durationSeconds)
              const minutes = Math.floor(totalSeconds / 60)
              const seconds = totalSeconds % 60
              formattedDuration = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
            }
            
            await supabase.from('history').insert({
              user_id: user.id,
              name: name,
              type: 'speech-to-text',
              text_content: data.text,
              audio_url: null, // Don't store audio URL for ASR (blob URL won't persist)
              word_count: wordCount,
              duration: formattedDuration,
              language: data.metadata?.language || language,
              voice: null // No voice for ASR
            })
          }
        } catch (historyError) {
          console.error("Failed to save to history:", historyError)
          // Don't fail the whole operation if history save fails
        }
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

  const handleDownloadAudio = () => {
    if (!audioUrl || !uploadedFile) return
    
    // Create a download link
    const link = document.createElement('a')
    link.href = audioUrl
    link.download = uploadedFile.name
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="space-y-3">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">Speech-to-Text</h2>
        <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
          Convert audio to accurate text transcriptions with AI precision
        </p>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Input Mode Selection */}
        <div className="flex gap-2 sm:gap-3">
          {/* Mobile: Show active mode button */}
          <Button
            variant="default"
            onClick={() => setInputMode(inputMode)}
            className="flex-1 min-[650px]:hidden ai-gradient-button text-white font-semibold rounded-lg transition-colors duration-200 text-sm sm:text-base"
          >
            {inputMode === "file" ? (
              <>
                <Upload className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                Upload File
              </>
            ) : (
              <>
                <Mic className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                Record
              </>
            )}
          </Button>

          {/* Desktop: Show all buttons */}
          <Button
            variant={inputMode === "file" ? "default" : "outline"}
            onClick={() => setInputMode("file")}
            className={`hidden min-[650px]:flex flex-1 ${inputMode === "file" ? "ai-gradient-button text-white" : "border border-border hover:bg-muted/50"} font-semibold rounded-lg transition-colors duration-200 text-sm sm:text-base`}
          >
            <Upload className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            Upload File
          </Button>
          
          <Button
            variant={inputMode === "record" ? "default" : "outline"}
            onClick={() => setInputMode("record")}
            className={`hidden min-[650px]:flex flex-1 ${inputMode === "record" ? "ai-gradient-button text-white" : "border border-border hover:bg-muted/50"} font-semibold rounded-lg transition-colors duration-200 text-sm sm:text-base`}
          >
            <Mic className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            Record
          </Button>
          <Button
            variant={inputMode === "link" ? "default" : "outline"}
            onClick={() => setInputMode("link")}
            className="hidden min-[650px]:flex flex-1 border border-border bg-muted/30 text-muted-foreground rounded-lg opacity-60 cursor-not-allowed text-sm sm:text-base"
            disabled
            title="Coming soon - URL import feature"
          >
            <LinkIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            Link
            <span className="ml-1 sm:ml-2 text-xs bg-muted px-1.5 sm:px-2 py-0.5 rounded">Soon</span>
          </Button>

          {/* Mobile: Show dropdown for other options */}
          <div className="min-[650px]:hidden">
            <Select value={inputMode} onValueChange={(value) => {
              if (value === "record" || value === "file" || value === "link") {
                setInputMode(value as "record" | "file" | "link")
              }
            }}>
              <SelectTrigger 
                className="h-10 w-10 border border-border bg-muted/30 text-muted-foreground rounded-lg opacity-60 p-0 flex items-center justify-center hover:opacity-80 transition-opacity"
                suppressHydrationWarning
              >
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-card border border-border rounded-md">
                {inputMode !== "file" && (
                  <SelectItem value="file">
                    <div className="flex items-center">
                      <Upload className="w-3 h-3 mr-2" />
                      Upload File
                    </div>
                  </SelectItem>
                )}
                {inputMode !== "record" && (
                  <SelectItem value="record">
                    <div className="flex items-center">
                      <Mic className="w-3 h-3 mr-2" />
                      Record
                    </div>
                  </SelectItem>
                )}
                <SelectItem value="link" disabled>
                  <div className="flex items-center">
                    <LinkIcon className="w-3 h-3 mr-2" />
                    Link
                    <span className="ml-2 text-xs bg-muted px-1.5 py-0.5 rounded">Soon</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Input Section */}
        <div className="space-y-4">
          {inputMode === "record" && !uploadedFile && (
            <div className="border-2 border-dashed rounded-lg p-6 sm:p-10 text-center bg-muted/30 border-border">
              {!isRecording && (
                <>
                  <Mic className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-primary" />
                  <p className="text-xs sm:text-sm text-foreground mb-2 font-medium px-2">
                    Click the button below to start recording
                  </p>
                  <p className="text-xs text-muted-foreground mb-3 sm:mb-4 px-2">
                    Make sure your microphone is connected and permissions are granted
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="ai-gradient-button text-white font-semibold rounded-lg border-0 transition-colors duration-200 text-xs sm:text-sm"
                    onClick={startRecording}
                  >
                    <Mic className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                    Start Recording
                  </Button>
                </>
              )}
              
              {isRecording && (
                <div className="space-y-4">
                  <div className="relative">
                    <div className={`w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-full ${isPaused ? 'bg-yellow-500/10' : 'bg-red-500/10'} flex items-center justify-center ${isPaused ? '' : 'animate-pulse'}`}>
                      <Mic className={`w-8 h-8 sm:w-10 sm:h-10 ${isPaused ? 'text-yellow-500' : 'text-red-500'}`} />
                    </div>
                    {!isPaused && <div className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full animate-pulse" />}
                  </div>
                  <div>
                    <p className="text-lg sm:text-xl font-bold text-foreground mb-1">
                      {isPaused ? 'Recording Paused' : 'Recording...'}
                    </p>
                    <p className="text-2xl sm:text-3xl font-mono text-primary">{formatRecordingTime(recordingTime)}</p>
                  </div>
                  <div className="flex gap-2 justify-center">
                    {!isPaused ? (
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-lg border-0 transition-colors duration-200 text-xs sm:text-sm"
                        onClick={pauseRecording}
                      >
                        <Pause className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                        Pause
                      </Button>
                    ) : (
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg border-0 transition-colors duration-200 text-xs sm:text-sm"
                        onClick={resumeRecording}
                      >
                        <Play className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                        Resume
                      </Button>
                    )}
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg border-0 transition-colors duration-200 text-xs sm:text-sm"
                      onClick={stopRecording}
                    >
                      <StopCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                      Stop
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

          {inputMode === "file" && !uploadedFile && (
            <div 
              className={`border-2 border-dashed rounded-lg p-6 sm:p-10 text-center transition-all duration-200 ${
                isDragging 
                  ? 'border-primary bg-primary/5' 
                  : 'border-border bg-muted/30 hover:border-primary/50'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <Upload className={`w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-primary ${isDragging ? 'scale-110' : ''} transition-transform duration-200`} />
              <p className="text-xs sm:text-sm text-foreground mb-2 font-medium px-2">
                Drag and drop your audio file here, or click to browse
              </p>
              <p className="text-xs text-muted-foreground mb-3 sm:mb-4 px-2">
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
                className="ai-gradient-button text-white font-semibold rounded-lg border-0 transition-colors duration-200 text-xs sm:text-sm"
                onClick={() => document.getElementById('audio-upload')?.click()}
              >
                Choose Audio File
              </Button>
            </div>
          )}

          {/* Uploaded File Preview */}
          {uploadedFile && audioUrl && (
            <div className="bg-white dark:bg-card border border-border rounded-lg p-4 sm:p-5 space-y-3 animate-in fade-in duration-300">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                  <div className="p-1.5 sm:p-2 rounded-lg bg-primary/10 shrink-0">
                    <Play className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-semibold text-foreground truncate">{uploadedFile.name}</p>
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
                  className="hover:bg-destructive/10 hover:text-destructive transition-colors duration-200 shrink-0 h-8 w-8 sm:h-9 sm:w-9 p-0"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5" />
                </Button>
              </div>
              
              {/* Custom Audio Player */}
              <CustomAudioPlayer audioUrl={audioUrl} onDownload={handleDownloadAudio} />
            </div>
          )}

          {inputMode === "link" && (
            <div className="space-y-2">
              <Label htmlFor="audio-link" className="text-sm font-medium text-foreground">Audio URL</Label>
              <input
                id="audio-link"
                type="url"
                placeholder="https://example.com/audio.mp3"
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-border rounded-md bg-white dark:bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 text-sm sm:text-base"
              />
              <Button onClick={handleTranscribe} className="w-full mt-3 sm:mt-4 h-12 sm:h-14 ai-gradient-button text-white font-semibold rounded-lg transition-colors duration-200 text-sm sm:text-base">
                Transcribe from Link
              </Button>
            </div>
          )}

          {/* Language Selection */}
          <div className="space-y-2">
            <Label htmlFor="transcribe-language" className="text-sm font-medium text-foreground">Audio Language</Label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger 
                id="transcribe-language" 
                className="bg-white dark:bg-background border border-border rounded-md focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 w-full"
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

        {/* Transcribe Button */}
        <Button
          onClick={handleTranscribe}
          disabled={isTranscribing || !uploadedFile || isRecording}
          className="w-full h-12 sm:h-14 text-sm sm:text-base font-semibold ai-gradient-button text-white rounded-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          size="lg"
        >
          {isTranscribing ? (
            <>
              <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 mr-2 animate-spin" />
              Transcribing...
            </>
          ) : (
            <>
              <Mic className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              {isRecording ? 'Stop Recording First' : 'Transcribe Audio'}
            </>
          )}
        </Button>

        {/* Output Section */}
        {transcription && (
          <div className="card-gradient dark:bg-card border border-border rounded-lg p-3 sm:p-4 md:p-6 space-y-3 sm:space-y-4 animate-in fade-in duration-300 elevation-2">
            <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-3 xs:gap-2">
              <h3 className="font-semibold text-sm sm:text-base md:text-lg text-foreground flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary" />
                Transcription
              </h3>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleDownloadTranscription}
                  className="border border-border hover:bg-muted/50 rounded-lg transition-colors duration-200 text-xs sm:text-sm flex-1 xs:flex-initial"
                >
                  <Download className="w-3 h-3 sm:w-4 sm:h-4 xs:mr-2" />
                  <span className="hidden xs:inline">Download</span>
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleCopyToClipboard}
                  className="border border-border hover:bg-muted/50 rounded-lg transition-colors duration-200 text-xs sm:text-sm flex-1 xs:flex-initial"
                >
                  <Share2 className="w-3 h-3 sm:w-4 sm:h-4 xs:mr-2" />
                  <span className="hidden xs:inline">Copy</span>
                </Button>
              </div>
            </div>
            
            <Textarea
              value={transcription}
              onChange={(e) => setTranscription(e.target.value)}
              className="min-h-[200px] sm:min-h-[250px] resize-none bg-white dark:bg-background border border-border rounded-md focus-glow transition-all duration-200 text-sm sm:text-base leading-relaxed p-3 sm:p-4"
              placeholder="Transcription will appear here..."
            />
            
            <div className="text-xs sm:text-sm text-muted-foreground flex flex-wrap items-center gap-3 sm:gap-4 pt-2 border-t border-border/50">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                Words: {transcription.split(" ").filter(Boolean).length}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                Characters: {transcription.length}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
