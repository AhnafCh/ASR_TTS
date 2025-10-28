"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { 
  FileText, 
  Upload, 
  Link as LinkIcon, 
  Play, 
  Download, 
  Share2,
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
  const [inputMode, setInputMode] = useState<"text" | "file" | "link">("text")
  const [inputText, setInputText] = useState("")
  const [fileUrl, setFileUrl] = useState("")
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [language, setLanguage] = useState("bangla")
  const [selectedVoice, setSelectedVoice] = useState(voiceActors[0].id)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedAudio, setGeneratedAudio] = useState<string | null>(null)

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
    // Validate input based on mode
    if (inputMode === "text" && !inputText) {
      alert("Please enter text")
      return
    }

    setIsGenerating(true)
    
    try {
      // Connect to FastAPI backend
      const response = await fetch("http://localhost:8000/api/tts/generate", {
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
        
        // Play the audio automatically if available
        if (data.audioUrl) {
          const audio = new Audio(data.audioUrl)
          audio.play().catch(err => {
            console.error("Audio playback failed:", err)
            alert("Audio generated successfully but playback failed. Please download to listen.")
          })
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
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold">Text-to-Audio</h2>
        <p className="text-muted-foreground mt-2">
          Create natural, emotional speech in seconds to help you earn
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Input Mode Selection */}
          <div className="flex gap-2">
            <Button
              variant={inputMode === "text" ? "default" : "outline"}
              onClick={() => setInputMode("text")}
              className="flex-1"
            >
              <FileText className="w-4 h-4 mr-2" />
              Text
            </Button>
            <Button
              variant={inputMode === "file" ? "default" : "outline"}
              onClick={() => setInputMode("file")}
              className="flex-1"
              disabled
              title="Coming soon - File upload feature"
            >
              <Upload className="w-4 h-4 mr-2" />
              File
            </Button>
            <Button
              variant={inputMode === "link" ? "default" : "outline"}
              onClick={() => setInputMode("link")}
              className="flex-1"
              disabled
              title="Coming soon - URL import feature"
            >
              <LinkIcon className="w-4 h-4 mr-2" />
              Link
            </Button>
          </div>

          {/* Input Field */}
          <div className="space-y-2">
            <Label htmlFor="input-text">
              {inputMode === "text" && "Enter your text"}
              {inputMode === "file" && "Upload your file"}
              {inputMode === "link" && "Enter URL"}
            </Label>
            
            {inputMode === "text" && (
              <Textarea
                id="input-text"
                placeholder="আপনার টেক্সট এখানে লিখুন বা পেস্ট করুন..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="min-h-[200px] resize-none"
              />
            )}
            
            {inputMode === "file" && (
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-sm text-muted-foreground mb-2">
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
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background"
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
              <Label htmlFor="language">Language</Label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger id="language">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bangla">বাংলা (Bangla)</SelectItem>
                  <SelectItem value="english">English</SelectItem>
                  <SelectItem value="mix">Mixed (Bangla + English)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Generate Button */}
          <Button
            onClick={handleGenerate}
            disabled={isGenerating || !inputText}
            className="w-full h-12 text-lg"
            size="lg"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              "Generate Audio"
            )}
          </Button>

          {/* Output Section */}
          {generatedAudio && (
            <div className="border border-border rounded-lg p-6 space-y-4 bg-card">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Generated Audio</h3>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleDownloadAudio}>
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                  <Button variant="outline" size="sm">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                </div>
              </div>
              
              <audio controls className="w-full">
                <source src={generatedAudio} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
              
              <div className="text-sm text-muted-foreground">
                <p>Duration: 0:45 • Size: 1.2 MB • Format: MP3</p>
              </div>
            </div>
          )}
        </div>

        {/* Voice Actor Selection */}
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold mb-4">Voice Actors</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Select a voice actor for your audio
            </p>
          </div>

          <div className="space-y-3">
            {voiceActors.map((actor) => (
              <div
                key={actor.id}
                className={`border rounded-lg p-4 cursor-pointer transition-all ${
                  selectedVoice === actor.id
                    ? "border-accent bg-accent/10"
                    : "border-border hover:border-accent/50 hover:bg-secondary/50"
                }`}
                onClick={() => setSelectedVoice(actor.id)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{actor.name}</p>
                    <p className="text-xs text-muted-foreground">{actor.language}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      handlePlaySample(actor.sample)
                    }}
                  >
                    <Play className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
