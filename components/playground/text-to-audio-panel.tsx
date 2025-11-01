"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { 
  FileText, 
  Upload, 
  Link as LinkIcon, 
  Play, 
  Download, 
  Loader2,
  Square,
  MoreHorizontal
} from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { CustomAudioPlayer } from "./custom-audio-player"

const voiceActors = [
  { id: "female", name: "Female Voice", language: "Universal", sample: "/samples/female.mp3" },
  { id: "male", name: "Male Voice", language: "Universal", sample: "/samples/male.mp3" },
]

export function TextToAudioPanel() {
  const router = useRouter()
  const { isAuthenticated } = useAuth()
  const [inputMode, setInputMode] = useState<"text" | "file" | "link">("text")
  const [inputText, setInputText] = useState("")
  const [fileUrl, setFileUrl] = useState("")
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [language, setLanguage] = useState("bangla")
  const [selectedVoice, setSelectedVoice] = useState(voiceActors[0].id)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedAudio, setGeneratedAudio] = useState<string | null>(null)
  const [isPlayingSample, setIsPlayingSample] = useState(false)
  const sampleAudioRef = useRef<HTMLAudioElement | null>(null)

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    const supportedExtensions = ['pdf', 'doc', 'docx', 'png', 'jpg', 'jpeg', 'bmp', 'tiff', 'xlsx', 'pptx', 'html', 'xml']
    const fileExtension = file.name.split('.').pop()?.toLowerCase()
    
    if (!fileExtension || !supportedExtensions.includes(fileExtension)) {
      alert(`Unsupported file type. Supported formats: ${supportedExtensions.join(', ')}`)
      return
    }

    setUploadedFile(file)
  }

  const handleGenerate = async () => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      router.push("/signup")
      return
    }

    // Validate input based on mode
    if (inputMode === "text" && !inputText) {
      alert("Please enter text")
      return
    }

    setIsGenerating(true)
    
    try {
      // Connect to FastAPI backend - use environment variable or fallback to localhost
      const apiUrl = process.env.NEXT_PUBLIC_API_URL 
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/tts/generate`
        : "http://localhost:8000/api/tts/generate"
      
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: inputText,
          language,
          voice: selectedVoice,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error("API Error Response:", errorData)
        // FastAPI returns errors in 'detail' field
        throw new Error(errorData.detail || errorData.error || `HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()

      if (data.success) {
        setGeneratedAudio(data.audioUrl)
        console.log("Audio generated successfully!")
        console.log("Metadata:", data.metadata)
        
        // Save to history in Supabase
        try {
          const supabase = createClient()
          const { data: { user } } = await supabase.auth.getUser()
          
          if (user) {
            // Count words in the text
            const wordCount = inputText.trim().split(/\s+/).length
            
            // Extract first few words for the name
            const name = inputText.trim().slice(0, 50) + (inputText.length > 50 ? '...' : '')
            
            await supabase.from('history').insert({
              user_id: user.id,
              name: name,
              type: 'text-to-speech',
              text_content: inputText,
              audio_url: data.audioUrl,
              word_count: wordCount,
              duration: data.metadata?.duration || null,
              language: language,
              voice: selectedVoice
            })
          }
        } catch (historyError) {
          console.error("Failed to save to history:", historyError)
          // Don't fail the whole operation if history save fails
        }
      } else {
        console.error("Generation failed:", data.error)
        throw new Error(data.error || "Unknown error occurred")
      }
    } catch (error: any) {
      console.error("Error generating audio:", error)
      alert("Failed to generate audio: " + (error.message || error))
    } finally {
      setIsGenerating(false)
    }
  }

  const handlePlaySample = (sampleUrl: string) => {
    // If already playing, stop it
    if (isPlayingSample && sampleAudioRef.current) {
      sampleAudioRef.current.pause()
      sampleAudioRef.current = null
      setIsPlayingSample(false)
      return
    }

    // Stop any currently playing sample
    if (sampleAudioRef.current) {
      sampleAudioRef.current.pause()
      sampleAudioRef.current = null
    }

    // Play sample audio
    const audio = new Audio(sampleUrl)
    sampleAudioRef.current = audio
    
    setIsPlayingSample(true)
    
    audio.play().catch(err => {
      console.log("Audio playback failed:", err)
      setIsPlayingSample(false)
    })

    // Reset state when audio ends or errors
    audio.onended = () => {
      setIsPlayingSample(false)
      sampleAudioRef.current = null
    }
    audio.onerror = () => {
      setIsPlayingSample(false)
      sampleAudioRef.current = null
    }
  }

  const handleDownloadAudio = () => {
    if (!generatedAudio) return
    
    // Create a download link
    const link = document.createElement('a')
    link.href = generatedAudio
    link.download = `tts-audio-${Date.now()}.mp3`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="space-y-3">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">Text-to-Speech</h2>
        <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
          Create natural, emotional speech in seconds with AI-powered voices
        </p>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Input Mode Selection */}
        <div className="flex gap-2 sm:gap-3">
          <Button
            variant={inputMode === "text" ? "default" : "outline"}
            onClick={() => setInputMode("text")}
            className={inputMode === "text" ? "flex-1 ai-gradient-button text-white font-semibold rounded-lg transition-colors duration-200 text-sm sm:text-base" : "flex-1 border border-border hover:bg-muted/50 rounded-lg transition-colors duration-200 text-sm sm:text-base"}
          >
            <FileText className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            Text
          </Button>
          
          {/* Desktop: Show separate File and Link buttons */}
          <Button
            variant={inputMode === "file" ? "default" : "outline"}
            onClick={() => setInputMode("file")}
            className="hidden min-[650px]:flex flex-1 border border-border bg-muted/30 text-muted-foreground rounded-lg opacity-60 cursor-not-allowed text-sm sm:text-base"
            disabled
            title="Coming soon - File upload feature"
          >
            <Upload className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            File
            <span className="ml-1 sm:ml-2 text-xs bg-muted px-1.5 sm:px-2 py-0.5 rounded">Soon</span>
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

          {/* Mobile: Show dropdown for File/Link */}
          <div className="min-[650px]:hidden">
            <Select value="more" onValueChange={(value) => {
              if (value === "file") setInputMode("file")
              if (value === "link") setInputMode("link")
            }}>
              <SelectTrigger 
                className="h-10 w-10 border border-border bg-muted/30 text-muted-foreground rounded-lg opacity-60 p-0 flex items-center justify-center hover:opacity-80 transition-opacity"
                suppressHydrationWarning
              >
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-card border border-border rounded-md">
                <SelectItem value="file" disabled>
                  <div className="flex items-center">
                    <Upload className="w-3 h-3 mr-2" />
                    File
                    <span className="ml-2 text-xs bg-muted px-1.5 py-0.5 rounded">Soon</span>
                  </div>
                </SelectItem>
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

        {/* Input Field */}
        <div className="space-y-2">
          {inputMode === "text" && (
            <Textarea
              id="input-text"
              placeholder={language === "bangla" ? "আপনার টেক্সট এখানে লিখুন বা পেস্ট করুন..." : "Enter or paste your text here..."}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="min-h-[200px] sm:min-h-[250px] resize-none bg-white dark:bg-background border border-border rounded-md focus-glow transition-all duration-200 leading-relaxed p-3 sm:p-4 text-sm sm:text-base"
            />
          )}
          
          {inputMode === "file" && (
            <div className="border-2 border-dashed border-border rounded-lg p-10 text-center bg-muted/30 hover:border-primary/50 transition-colors duration-200">
              <Upload className="w-16 h-16 mx-auto mb-4 text-primary" />
              <p className="text-sm text-foreground mb-2 font-medium">
                {uploadedFile ? uploadedFile.name : "Drag and drop your file here, or click to browse"}
              </p>
              <p className="text-xs text-muted-foreground mb-4">
                Supported: PDF, DOC, DOCX, PNG, JPG, JPEG, BMP, TIFF, XLSX, PPTX, HTML, XML
              </p>
              <input
                type="file"
                id="file-upload"
                className="hidden"
                accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.bmp,.tiff,.xlsx,.pptx,.html,.xml"
                onChange={handleFileUpload}
              />
              <Button 
                variant="outline" 
                size="sm"
                className="ai-gradient-button text-white font-semibold rounded-lg border-0 transition-colors duration-200"
                onClick={() => document.getElementById('file-upload')?.click()}
              >
                Choose File
              </Button>
            </div>
          )}
          
          {inputMode === "link" && (
            <div className="space-y-2">
              <input
                type="url"
                placeholder="https://example.com/document.pdf"
                value={fileUrl}
                onChange={(e) => setFileUrl(e.target.value)}
                className="w-full px-4 py-3 border border-border rounded-md bg-white dark:bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
              />
              <p className="text-xs text-muted-foreground">
                Supported URLs: PDF, DOC, DOCX, PNG, JPG, JPEG, BMP, TIFF, XLSX, PPTX, HTML, XML
              </p>
            </div>
          )}
        </div>

        {/* Language and Voice Settings */}
        <div className="flex flex-col sm:flex-row gap-4 w-full">
          <div className="space-y-2 w-full sm:w-[30%]">
            <Label htmlFor="language" className="text-sm font-medium text-foreground">Language</Label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger 
                id="language" 
                className="bg-white dark:bg-background border border-border rounded-md focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 w-full"
                suppressHydrationWarning
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-card border border-border rounded-md">
                <SelectItem value="bangla">বাংলা (Bangla)</SelectItem>
                <SelectItem value="english">English</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 w-full sm:w-[70%]">
            <Label htmlFor="voice" className="text-sm font-medium text-foreground">Voice Actor</Label>
            <div className="flex flex-col sm:flex-row gap-2">
              <Select value={selectedVoice} onValueChange={setSelectedVoice}>
                <SelectTrigger 
                  id="voice" 
                  className="bg-white dark:bg-background border border-border rounded-md focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 w-full sm:flex-1"
                  suppressHydrationWarning
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-card border border-border rounded-md">
                  {voiceActors.map((actor) => (
                    <SelectItem key={actor.id} value={actor.id}>
                      {actor.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="default"
                className="px-3 sm:px-4 border border-border hover:bg-primary/10 transition-colors duration-200 whitespace-nowrap w-full sm:w-auto"
                onClick={() => {
                  const currentVoice = voiceActors.find(actor => actor.id === selectedVoice)
                  if (currentVoice) {
                    handlePlaySample(currentVoice.sample)
                  }
                }}
                title={isPlayingSample ? "Stop sample" : "Preview selected voice"}
              >
                {isPlayingSample ? (
                  <>
                    <Square className="w-3 h-3 sm:w-4 sm:h-4 text-primary mr-1.5 sm:mr-2 fill-current" />
                    <span className="text-xs sm:text-sm text-foreground">Stop</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3 h-3 sm:w-4 sm:h-4 text-primary mr-1.5 sm:mr-2" />
                    <span className="text-xs sm:text-sm text-foreground">Voice Sample</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Generate Button */}
        <Button
          onClick={handleGenerate}
          disabled={isGenerating || !inputText}
          className="w-full h-12 sm:h-14 text-sm sm:text-base font-semibold ai-gradient-button text-white rounded-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          size="lg"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Play className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Generate Audio
            </>
          )}
        </Button>

        {/* Output Section */}
        {generatedAudio && (
          <div className="card-gradient dark:bg-card border border-border rounded-lg p-3 sm:p-4 md:p-6 space-y-3 sm:space-y-4 animate-in fade-in duration-300 elevation-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary" />
              <h3 className="font-semibold text-sm sm:text-base md:text-lg text-foreground">
                Generated Audio
              </h3>
            </div>
            
            <CustomAudioPlayer audioUrl={generatedAudio} onDownload={handleDownloadAudio} />
            
            <div className="text-xs sm:text-sm text-muted-foreground flex flex-wrap items-center gap-3 sm:gap-4 pt-2 border-t border-border/50">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                Format: MP3
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                Quality: High
              </span>
            </div>
          </div>
        )}

        {/* Pro Tips */}
        <div className="bg-muted/50 rounded-lg p-3 sm:p-4 border border-border">
          <h4 className="font-semibold text-xs sm:text-sm mb-2 sm:mb-3 text-foreground">Pro Tips</h4>
          <ul className="text-xs text-muted-foreground space-y-1.5 sm:space-y-2 leading-relaxed">
            <li>• Use punctuation for natural pauses</li>
            <li>• Mix languages seamlessly</li>
            <li>• Preview voice samples before generating</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
