"use client"

import { Button } from "@/components/ui/button"
import { Pause, Play, AudioWaveform } from "lucide-react"
import { useState, useRef } from "react"

interface AudioPlayerProps {
  audioSrc: string
  buttonText?: string
}

export default function AudioPlayer({ audioSrc, buttonText = "এআই দিয়ে শুনুন" }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [showPlayer, setShowPlayer] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const audioRef = useRef<HTMLAudioElement>(null)

  const handleLetAIRead = () => {
    setShowPlayer(true)
    setIsLoading(true)
    
    if (audioRef.current) {
      // Reset audio to beginning and load it
      audioRef.current.load()
      audioRef.current.currentTime = 0
      
      // Show loading animation for 3 seconds
      setTimeout(() => {
        setIsLoading(false)
        if (audioRef.current) {
          audioRef.current.play().catch(error => {
            console.error("Audio playback error:", error)
            alert("Unable to play audio.")
            setShowPlayer(false)
          })
          setIsPlaying(true)
        }
      }, 3000)
    }
  }

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime)
    }
  }

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration)
    }
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value)
    if (audioRef.current) {
      audioRef.current.currentTime = time
      setCurrentTime(time)
    }
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  return (
    <>
      {/* Audio Element */}
      <audio
        ref={audioRef}
        src={audioSrc}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
        onError={(e) => {
          console.error("Audio element error:", e)
          alert(`Failed to load audio file: ${audioSrc}`)
        }}
        preload="metadata"
      />

      {/* Floating Button/Player */}
      {!showPlayer ? (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="relative p-0.5 rounded-full bg-linear-to-r from-primary via-secondary to-primary">
            <Button
              onClick={handleLetAIRead}
              size="lg"
              className="h-14 px-12 text-base font-semibold bg-background dark:bg-card text-foreground rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 flex items-center gap-3 min-w-[400px]"
            >
              <AudioWaveform className="w-7 h-7 text-primary animate-pulse" />
              {buttonText}
            </Button>
          </div>
        </div>
      ) : (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="bg-white dark:bg-card border-2 border-primary rounded-full shadow-2xl px-6 py-4 backdrop-blur-lg">
            {/* Single Row Player */}
            <div className="flex items-center gap-4 min-w-[500px]">
              {/* Play/Pause Button or Loading Spinner */}
              {isLoading ? (
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                  <div className="w-6 h-6 border-3 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : (
                <Button
                  onClick={handlePlayPause}
                  size="lg"
                  className="w-12 h-12 rounded-full bg-primary hover:bg-primary/90 text-white shadow-lg hover:shadow-xl transition-all duration-200 shrink-0"
                >
                  {isPlaying ? (
                    <Pause className="w-5 h-5" />
                  ) : (
                    <Play className="w-5 h-5 ml-0.5" />
                  )}
                </Button>
              )}

              {/* Progress Bar and Time */}
              <div className="flex-1 space-y-1">
                {isLoading ? (
                  <div className="space-y-2">
                    <div className="h-1.5 bg-muted rounded-lg overflow-hidden">
                      <div className="h-full bg-primary/50 animate-pulse"></div>
                    </div>
                    <div className="flex justify-center text-xs text-muted-foreground">
                      <span className="animate-pulse">Generating Speech...</span>
                    </div>
                  </div>
                ) : (
                  <>
                    <input
                      type="range"
                      min="0"
                      max={duration || 0}
                      value={currentTime}
                      onChange={handleSeek}
                      className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{formatTime(currentTime)}</span>
                      <span>{formatTime(duration)}</span>
                    </div>
                  </>
                )}
              </div>

              {/* Close Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowPlayer(false)
                  setIsPlaying(false)
                  setIsLoading(false)
                  if (audioRef.current) {
                    audioRef.current.pause()
                    audioRef.current.currentTime = 0
                  }
                }}
                className="text-muted-foreground hover:text-foreground shrink-0 w-8 h-8 p-0"
              >
                ✕
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
