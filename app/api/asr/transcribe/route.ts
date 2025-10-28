import { NextRequest, NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

export async function POST(req: NextRequest) {
  try {
    const { audioUrl, audioText, language, mode } = await req.json()

    if (!audioUrl && !audioText) {
      return NextResponse.json(
        { error: "Audio URL or text is required" },
        { status: 400 }
      )
    }

    // Check if API key is configured
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY
    if (!apiKey || apiKey === "your_gemini_api_key_here") {
      return NextResponse.json(
        { error: "Gemini API key is not configured. Please add your API key to .env.local" },
        { status: 500 }
      )
    }

    // In a real implementation, you would:
    // 1. Download/process the audio from audioUrl
    // 2. Send it to a STT engine (Google Speech-to-Text, Whisper, etc.)
    // 3. Get the raw transcription back
    
    // For now, use audioText as raw transcription (simulated)
    let rawTranscription = audioText || "This is a simulated transcription from your audio."

    // Initialize Gemini AI for enhancement
    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" })

    // Create prompt for transcription enhancement
    const prompt = `You are a transcription enhancement assistant for ${language} speech-to-text.

Raw transcription:
${rawTranscription}

Tasks:
1. Correct obvious speech recognition errors
2. Add proper punctuation and capitalization
3. Format naturally for readability
4. Preserve the original meaning and words
5. Maintain proper script (Bengali/English as appropriate)

Return ONLY the corrected transcription, no explanations or additional commentary.`

    // Generate enhanced transcription
    const result = await model.generateContent(prompt)
    const response = result.response
    const enhancedTranscription = response.text()

    // Calculate metadata
    const wordCount = enhancedTranscription.split(/\s+/).length
    const charCount = enhancedTranscription.length
    const sentenceCount = enhancedTranscription.split(/[.!?]+/).filter(s => s.trim()).length

    return NextResponse.json({
      success: true,
      transcription: enhancedTranscription,
      rawTranscription,
      metadata: {
        words: wordCount,
        characters: charCount,
        sentences: sentenceCount,
        language,
        mode,
        confidence: 0.95, // Simulated confidence score
        timestamp: new Date().toISOString(),
      },
    })
  } catch (error: any) {
    console.error("ASR Transcription Error:", error)
    return NextResponse.json(
      { error: error.message || "Failed to transcribe audio" },
      { status: 500 }
    )
  }
}
