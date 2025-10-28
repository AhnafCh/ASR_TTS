import { GoogleGenerativeAI } from "@google/generative-ai"

// Initialize Gemini AI
export const initGemini = () => {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY
  
  if (!apiKey) {
    throw new Error("NEXT_PUBLIC_GEMINI_API_KEY is not set in environment variables")
  }
  
  return new GoogleGenerativeAI(apiKey)
}

// Text preprocessing for TTS
export const preprocessTextForTTS = async (
  text: string,
  language: string,
  options?: {
    voice?: string
    commercialUse?: boolean
  }
) => {
  const genAI = initGemini()
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" })

  const prompt = `You are a text processing assistant for a ${language} TTS system.
  
Process this text for natural speech synthesis:
${text}

Tasks:
1. Fix grammatical errors
2. Add proper punctuation for natural pauses
3. Expand abbreviations
4. Convert numbers to words
5. Maintain the original language and meaning

Return ONLY the processed text, no explanations.`

  const result = await model.generateContent(prompt)
  return result.response.text()
}

// Transcription enhancement for ASR
export const enhanceTranscription = async (
  rawTranscription: string,
  language: string
) => {
  const genAI = initGemini()
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" })

  const prompt = `You are a transcription enhancement assistant for ${language} speech-to-text.

Raw transcription:
${rawTranscription}

Tasks:
1. Correct obvious errors
2. Add proper punctuation
3. Format naturally
4. Preserve original meaning
5. Maintain proper script (Bengali/English)

Return ONLY the corrected transcription, no explanations.`

  const result = await model.generateContent(prompt)
  return result.response.text()
}

// Generate content summary
export const generateSummary = async (text: string, language: string) => {
  const genAI = initGemini()
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" })

  const prompt = `Summarize the following ${language} text in 2-3 sentences:

${text}

Provide a concise summary in the same language.`

  const result = await model.generateContent(prompt)
  return result.response.text()
}

// Detect language
export const detectLanguage = async (text: string) => {
  const genAI = initGemini()
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" })

  const prompt = `Detect the primary language of this text. Respond with just the language name (e.g., "Bengali", "English", "Hindi"):

${text}`

  const result = await model.generateContent(prompt)
  return result.response.text().trim()
}
