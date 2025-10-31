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
  Loader2 
} from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"

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
  const audioRef = useRef<HTMLAudioElement>(null)

  // Autoplay the audio element when new audio is generated
  useEffect(() => {
    if (generatedAudio && audioRef.current) {
      audioRef.current.load() // Reload the audio source
      audioRef.current.play().catch(err => {
        console.error("Audio playback failed:", err)
      })
    }
  }, [generatedAudio])

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
    // Play sample audio
    const audio = new Audio(sampleUrl)
    audio.play().catch(err => console.log("Audio playback failed:", err))
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
        <h2 className="text-4xl font-bold text-foreground">Text-to-Audio</h2>
        <p className="text-muted-foreground text-base leading-relaxed">
          Create natural, emotional speech in seconds with AI-powered voices
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Input Mode Selection */}
          <div className="flex gap-3">
            <Button
              variant={inputMode === "text" ? "default" : "outline"}
              onClick={() => setInputMode("text")}
              className={inputMode === "text" ? "flex-1 bg-primary hover:bg-secondary text-white font-semibold rounded-lg transition-colors duration-200" : "flex-1 border border-border hover:bg-muted/50 rounded-lg transition-colors duration-200"}
            >
              <FileText className="w-4 h-4 mr-2" />
              Text
            </Button>
            <Button
              variant={inputMode === "file" ? "default" : "outline"}
              onClick={() => setInputMode("file")}
              className="flex-1 border border-border bg-muted/30 text-muted-foreground rounded-lg opacity-60 cursor-not-allowed"
              disabled
              title="Coming soon - File upload feature"
            >
              <Upload className="w-4 h-4 mr-2" />
              File
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
              Link
              <span className="ml-2 text-xs bg-muted px-2 py-0.5 rounded">Soon</span>
            </Button>
          </div>

          {/* Input Field */}
          <div className="space-y-2">
            <Label htmlFor="input-text" className="text-sm font-medium text-foreground">
              {inputMode === "text" && "Enter your text"}
              {inputMode === "file" && "Upload your file"}
              {inputMode === "link" && "Enter URL"}
            </Label>
            
            {inputMode === "text" && (
              <Textarea
                id="input-text"
                placeholder={language === "bangla" ? "আপনার টেক্সট এখানে লিখুন বা পেস্ট করুন..." : "Enter or paste your text here..."}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="min-h-[250px] resize-none bg-white dark:bg-background border border-border rounded-md focus-glow transition-all duration-200 leading-relaxed p-4"
                style={{ fontSize: '16px' }}
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
                  className="bg-primary hover:bg-secondary text-white font-semibold rounded-lg border-0 transition-colors duration-200"
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

          {/* Language and Settings */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="language" className="text-sm font-medium text-foreground">Language</Label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger 
                  id="language" 
                  className="bg-white dark:bg-background border border-border rounded-md focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
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
          </div>

          {/* Generate Button */}
          <Button
            onClick={handleGenerate}
            disabled={isGenerating || !inputText}
            className="w-full h-14 text-base font-semibold ai-gradient-button text-white rounded-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            size="lg"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Play className="w-5 h-5 mr-2" />
                Generate Audio
              </>
            )}
          </Button>

          {/* Output Section */}
          {generatedAudio && (
            <div className="card-gradient dark:bg-card border border-border rounded-lg p-6 space-y-4 animate-in fade-in duration-300 elevation-2">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg text-foreground flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary" />
                  Generated Audio
                </h3>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleDownloadAudio}
                  className="border border-border hover:bg-muted/50 rounded-lg transition-colors duration-200"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
              
              <audio ref={audioRef} controls className="w-full rounded-lg">
                <source src={generatedAudio} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
              
              <div className="text-sm text-muted-foreground flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  Format: MP3
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  Quality: High
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Voice Actor Selection */}
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold text-lg text-foreground mb-2">Voice Actors</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Choose the perfect voice for your content
            </p>
          </div>

          <div className="space-y-3">
            {voiceActors.map((actor) => (
              <div
                key={actor.id}
                className={`rounded-lg p-4 cursor-pointer transition-all duration-200 border ${
                  selectedVoice === actor.id
                    ? "border-primary bg-primary/5"
                    : "border-border bg-white dark:bg-card hover:border-primary/50"
                }`}
                onClick={() => setSelectedVoice(actor.id)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-base text-foreground">{actor.name}</p>
                    <p className="text-xs text-muted-foreground mt-1">{actor.language}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hover:bg-primary/10 transition-colors duration-200"
                    onClick={(e) => {
                      e.stopPropagation()
                      handlePlaySample(actor.sample)
                    }}
                  >
                    <Play className="w-4 h-4 text-primary" />
                  </Button>
                </div>
                {selectedVoice === actor.id && (
                  <div className="mt-3 pt-3 border-t border-primary/20">
                    <p className="text-xs text-primary font-medium">Selected</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Tips */}
          <div className="bg-muted/50 rounded-lg p-4 border border-border">
            <h4 className="font-semibold text-sm mb-3 text-foreground">Pro Tips</h4>
            <ul className="text-xs text-muted-foreground space-y-2 leading-relaxed">
              <li>Use punctuation for natural pauses</li>
              <li>Mix languages seamlessly</li>
              <li>Preview samples before generating</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
