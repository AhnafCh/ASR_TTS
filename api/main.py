"""
SenseVoice API - FastAPI Implementation

This API provides both text-to-speech (TTS) and speech-to-text (ASR) services
using OpenAI's advanced AI models with support for Bengali and English languages.

Services:
- TTS: Convert text to natural speech using OpenAI's TTS API
- ASR: Transcribe audio to text using OpenAI's Whisper API

Author: SenseVoice Team
Version: 1.0.0
Created: October 28, 2025
"""

from fastapi import FastAPI, HTTPException, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import os
import httpx
import base64
from datetime import datetime
from typing import Optional, Dict
import logging
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="SenseVoice API",
    description="Text-to-Speech and Speech-to-Text API with support for Bengali and English languages",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configure CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:8000"],  # Add your frontend URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============================================================================
# DATA MODELS
# ============================================================================

class TTSRequest(BaseModel):
    """
    Request model for TTS generation.
    
    Attributes:
        text: The input text to convert to speech (required)
        language: Target language for speech synthesis (default: "english")
        voice: Voice gender to use (default: "female")
    """
    text: str = Field(..., description="Text to convert to speech", min_length=1, max_length=5000)
    language: str = Field(
        default="english",
        description="Language for speech synthesis: 'bangla', 'english', or 'mix'"
    )
    voice: str = Field(
        default="female",
        description="Voice gender: 'female' or 'male'"
    )

    class Config:
        json_schema_extra = {
            "example": {
                "text": "Hello, this is a test message in English.",
                "language": "english",
                "voice": "female"
            }
        }


class TTSResponse(BaseModel):
    """
    Response model for successful TTS generation.
    
    Attributes:
        success: Whether the generation was successful
        audioUrl: Base64-encoded audio data URL
        metadata: Additional information about the generated audio
    """
    success: bool
    audioUrl: str
    metadata: Dict[str, str]


class ErrorResponse(BaseModel):
    """
    Response model for errors.
    
    Attributes:
        success: Always False for errors
        error: Error message describing what went wrong
    """
    success: bool = False
    error: str


class ASRResponse(BaseModel):
    """
    Response model for successful ASR (speech-to-text) transcription.
    
    Attributes:
        success: Whether the transcription was successful
        text: The transcribed text from the audio
        metadata: Additional information about the transcription
    """
    success: bool
    text: str
    metadata: Dict[str, str]


# ============================================================================
# VOICE CONFIGURATION
# ============================================================================

# Mapping of custom voice IDs to OpenAI voice names
# Simplified to two universal voices for all languages
VOICE_MAP = {
    "female": "nova",    # works for Bengali and English
    "male": "echo",      # works for Bengali and English
}

# Voice characteristics for instruction generation
VOICE_CHARACTERISTICS = {
    "nova": "warm, friendly, and conversational",
    "echo": "clear, articulate, and professional"
}


# ============================================================================
# HELPER FUNCTIONS
# ============================================================================

def get_openai_voice(voice_id: str) -> str:
    """
    Map custom voice ID to OpenAI voice name.
    
    Args:
        voice_id: Custom voice identifier (e.g., "bn-female-1")
        
    Returns:
        OpenAI voice name (e.g., "nova")
        Returns "alloy" as fallback if voice_id not found
    """
    return VOICE_MAP.get(voice_id, "alloy")


def generate_instructions(language: str, openai_voice: str) -> str:
    """
    Generate context-aware TTS instructions based on language and voice.
    
    This function creates detailed instructions for the OpenAI TTS model to
    ensure natural, culturally appropriate speech synthesis with proper
    pronunciation, intonation, and emotional inflection.
    
    Args:
        language: Target language ("bangla", "english", or "mix")
        openai_voice: OpenAI voice identifier (e.g., "nova", "onyx")
        
    Returns:
        Detailed instruction string for the TTS model
    """
    # Get voice characteristics or use default
    characteristic = VOICE_CHARACTERISTICS.get(openai_voice, "natural and clear")
    
    if language == "bangla":
        return (
            f"You are a professional Bengali voice narrator. "
            f"Speak in a {characteristic} tone with perfect Bengali pronunciation (বাংলা উচ্চারণ). "
            f"Maintain natural rhythm, proper stress on syllables, and use appropriate emotional inflection. "
            f"Handle Bengali numbers, dates, and cultural references authentically."
        )
    
    elif language == "english":
        return (
            f"You are a professional English voice narrator. "
            f"Speak in a {characteristic} tone with clear enunciation and natural pacing. "
            f"Use appropriate pauses for punctuation, vary your intonation to maintain listener engagement, "
            f"and emphasize key words naturally."
        )
    
    else:  # Mixed language
        return (
            f"You are a bilingual voice narrator fluent in both Bengali and English. "
            f"Speak in a {characteristic} tone, seamlessly switching between languages "
            f"while maintaining proper pronunciation for each. "
            f"Use natural code-switching patterns common in Bengali-English conversations."
        )


def validate_api_key() -> str:
    """
    Validate and retrieve OpenAI API key from environment.
    
    Returns:
        Valid OpenAI API key
        
    Raises:
        HTTPException: If API key is not configured or invalid
    """
    api_key = os.getenv("OPENAI_API_KEY")
    
    if not api_key:
        logger.error("OPENAI_API_KEY not found in environment variables")
        raise HTTPException(
            status_code=500,
            detail="OPENAI_API_KEY is not configured. Please add your API key to .env file"
        )
    
    if api_key == "your_openai_api_key_here":
        logger.error("OPENAI_API_KEY is set to placeholder value")
        raise HTTPException(
            status_code=500,
            detail="Please replace the placeholder API key with your actual OpenAI API key"
        )
    
    return api_key


# ============================================================================
# API ENDPOINTS
# ============================================================================

@app.get("/", tags=["Health"])
async def root():
    """
    Root endpoint - API health check.
    
    Returns:
        Basic API information and status
    """
    return {
        "message": "SenseVoice TTS API",
        "status": "running",
        "version": "1.0.0",
        "docs": "/docs"
    }


@app.get("/health", tags=["Health"])
async def health_check():
    """
    Detailed health check endpoint.
    
    Returns:
        API health status and configuration info
    """
    api_key_configured = bool(os.getenv("OPENAI_API_KEY"))
    
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "api_key_configured": api_key_configured,
        "supported_languages": ["bangla", "english", "mix"],
        "available_voices": list(VOICE_MAP.keys())
    }


@app.post(
    "/api/tts/generate",
    response_model=TTSResponse,
    responses={
        200: {"description": "Audio generated successfully"},
        400: {"model": ErrorResponse, "description": "Invalid request"},
        500: {"model": ErrorResponse, "description": "Server error"}
    },
    tags=["TTS"]
)
async def generate_tts(request: TTSRequest):
    """
    Generate speech audio from text using OpenAI TTS API.
    
    This endpoint accepts text input along with language and voice preferences,
    then generates high-quality speech audio using OpenAI's text-to-speech model.
    The audio is returned as a base64-encoded data URL for immediate playback.
    
    **Supported Languages:**
    - `bangla`: Bengali language with proper pronunciation
    - `english`: English language with natural intonation
    - `mix`: Mixed Bengali-English with code-switching
    
    **Available Voices:**
    - `female`: Warm, friendly female voice (works for all languages)
    - `male`: Deep, authoritative male voice (works for all languages)
    
    Args:
        request: TTSRequest object containing text, language, and voice
        
    Returns:
        TTSResponse with success status, audio data URL, and metadata
        
    Raises:
        HTTPException: If text is empty, API key is invalid, or OpenAI API fails
    """
    logger.info(f"TTS generation requested: language={request.language}, voice={request.voice}, text_length={len(request.text)}")
    
    # Validate input text
    if not request.text or not request.text.strip():
        logger.warning("Empty text received")
        raise HTTPException(status_code=400, detail="Text is required and cannot be empty")
    
    try:
        # Validate API key
        api_key = validate_api_key()
        
        # Map voice to OpenAI voice
        openai_voice = get_openai_voice(request.voice)
        logger.info(f"Mapped voice '{request.voice}' to OpenAI voice '{openai_voice}'")
        
        # Generate context-aware instructions
        instructions = generate_instructions(request.language, openai_voice)
        
        # Prepare OpenAI TTS API request payload
        payload = {
            "model": "gpt-4o-mini-tts",
            "input": request.text,
            "voice": openai_voice,
            "instructions": instructions,
            "response_format": "mp3",
            "speed": 1.0,
            "stream_format": "audio"
        }
        
        logger.info("Calling OpenAI TTS API...")
        
        # Call OpenAI TTS API with timeout
        async with httpx.AsyncClient(timeout=120.0) as client:
            response = await client.post(
                "https://api.openai.com/v1/audio/speech",
                headers={
                    "Authorization": f"Bearer {api_key}",
                    "Content-Type": "application/json"
                },
                json=payload
            )
            
            # Handle API errors
            if response.status_code != 200:
                error_text = response.text
                logger.error(f"OpenAI API error {response.status_code}: {error_text}")
                raise HTTPException(
                    status_code=response.status_code,
                    detail=f"OpenAI API error: {error_text}"
                )
            
            # Get audio bytes from response
            audio_bytes = response.content
            audio_size_kb = len(audio_bytes) / 1024
            logger.info(f"Audio generated successfully: {audio_size_kb:.2f} KB")
            
            # Convert audio to base64 data URL for browser playback
            base64_audio = base64.b64encode(audio_bytes).decode('utf-8')
            audio_data_url = f"data:audio/mpeg;base64,{base64_audio}"
            
            # Prepare response with metadata
            response_data = {
                "success": True,
                "audioUrl": audio_data_url,
                "metadata": {
                    "language": request.language,
                    "voice": request.voice,
                    "openAIVoice": openai_voice,
                    "provider": "OpenAI TTS",
                    "model": "gpt-4o-mini-tts",
                    "audioSize": f"{audio_size_kb:.2f} KB",
                    "timestamp": datetime.utcnow().isoformat()
                }
            }
            
            logger.info("TTS generation completed successfully")
            return response_data
            
    except httpx.HTTPError as e:
        logger.error(f"HTTP request failed: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Request to OpenAI API failed: {str(e)}"
        )
    
    except Exception as e:
        logger.error(f"Unexpected error during TTS generation: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate audio: {str(e)}"
        )


@app.post(
    "/api/asr/transcribe",
    response_model=ASRResponse,
    responses={
        200: {"description": "Audio transcribed successfully"},
        400: {"model": ErrorResponse, "description": "Invalid request"},
        500: {"model": ErrorResponse, "description": "Server error"}
    },
    tags=["ASR"]
)
async def transcribe_audio(
    file: UploadFile = File(..., description="Audio file to transcribe"),
    language: Optional[str] = Form(None, description="Language hint: 'bn' for Bengali, 'en' for English, or None for auto-detect")
):
    """
    Transcribe speech audio to text using OpenAI Whisper API.
    
    This endpoint accepts audio files and transcribes them to text using OpenAI's
    state-of-the-art speech recognition model (gpt-4o-transcribe). It supports
    multiple audio formats and can handle both Bengali and English languages.
    
    **Supported Audio Formats:**
    - flac, mp3, mp4, mpeg, mpga, m4a, ogg, wav, webm
    
    **Language Support:**
    - Automatic language detection (default)
    - Bengali (bn) - when specified
    - English (en) - when specified
    - Code-switching between Bengali and English
    
    **Best Practices:**
    - Use clear audio with minimal background noise
    - Recommended: 16kHz or higher sample rate
    - Maximum file size: 25 MB
    
    Args:
        file: Audio file to transcribe (required)
        language: Optional language hint (None for auto-detect, 'bn' for Bengali, 'en' for English)
        
    Returns:
        ASRResponse with success status, transcribed text, and metadata
        
    Raises:
        HTTPException: If file is invalid, API key is missing, or OpenAI API fails
    """
    logger.info(f"ASR transcription requested: filename={file.filename}, content_type={file.content_type}")
    
    # Validate file type
    allowed_extensions = ['flac', 'mp3', 'mp4', 'mpeg', 'mpga', 'm4a', 'ogg', 'wav', 'webm']
    file_extension = file.filename.split('.')[-1].lower() if file.filename else ''
    
    if file_extension not in allowed_extensions:
        logger.warning(f"Unsupported file type: {file_extension}")
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file format. Supported formats: {', '.join(allowed_extensions)}"
        )
    
    try:
        # Validate API key
        api_key = validate_api_key()
        
        # Read audio file content
        audio_content = await file.read()
        audio_size_mb = len(audio_content) / (1024 * 1024)
        
        if audio_size_mb > 25:
            logger.warning(f"File too large: {audio_size_mb:.2f} MB")
            raise HTTPException(
                status_code=400,
                detail=f"File size ({audio_size_mb:.2f} MB) exceeds maximum limit of 25 MB"
            )
        
        logger.info(f"Processing audio file: {audio_size_mb:.2f} MB")
        
        # Prepare multipart form data for OpenAI Whisper API
        files = {
            'file': (file.filename, audio_content, file.content_type or 'audio/mpeg')
        }
        
        data = {
            'model': 'gpt-4o-transcribe'
        }
        
        # Add language parameter if specified
        if language:
            data['language'] = language
            logger.info(f"Language hint provided: {language}")
        
        logger.info("Calling OpenAI Whisper API...")
        
        # Call OpenAI Whisper API with timeout
        async with httpx.AsyncClient(timeout=120.0) as client:
            response = await client.post(
                "https://api.openai.com/v1/audio/transcriptions",
                headers={
                    "Authorization": f"Bearer {api_key}"
                },
                files=files,
                data=data
            )
            
            # Handle API errors
            if response.status_code != 200:
                error_text = response.text
                logger.error(f"OpenAI API error {response.status_code}: {error_text}")
                raise HTTPException(
                    status_code=response.status_code,
                    detail=f"OpenAI API error: {error_text}"
                )
            
            # Parse response
            transcription_result = response.json()
            transcribed_text = transcription_result.get('text', '')
            
            if not transcribed_text:
                logger.warning("No text transcribed from audio")
                raise HTTPException(
                    status_code=400,
                    detail="No speech detected in the audio file"
                )
            
            logger.info(f"Transcription successful: {len(transcribed_text)} characters")
            
            # Prepare response with metadata
            response_data = {
                "success": True,
                "text": transcribed_text,
                "metadata": {
                    "filename": file.filename,
                    "fileSize": f"{audio_size_mb:.2f} MB",
                    "format": file_extension,
                    "language": language or "auto-detect",
                    "provider": "OpenAI Whisper",
                    "model": "gpt-4o-transcribe",
                    "characterCount": str(len(transcribed_text)),
                    "timestamp": datetime.utcnow().isoformat()
                }
            }
            
            logger.info("ASR transcription completed successfully")
            return response_data
            
    except httpx.HTTPError as e:
        logger.error(f"HTTP request failed: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Request to OpenAI API failed: {str(e)}"
        )
    
    except Exception as e:
        logger.error(f"Unexpected error during ASR transcription: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to transcribe audio: {str(e)}"
        )


# ============================================================================
# APPLICATION STARTUP
# ============================================================================

@app.on_event("startup")
async def startup_event():
    """
    Application startup event handler.
    Logs startup information and checks configuration.
    """
    logger.info("=" * 60)
    logger.info("SenseVoice API Starting...")
    logger.info("=" * 60)
    logger.info(f"API Version: 1.0.0")
    logger.info(f"Services: TTS (Text-to-Speech) & ASR (Speech-to-Text)")
    logger.info(f"TTS - Supported Languages: {', '.join(['bangla', 'english', 'mix'])}")
    logger.info(f"TTS - Available Voices: {', '.join(VOICE_MAP.keys())}")
    logger.info(f"ASR - Supported Formats: flac, mp3, mp4, mpeg, mpga, m4a, ogg, wav, webm")
    
    # Check API key configuration
    api_key_configured = bool(os.getenv("OPENAI_API_KEY"))
    if api_key_configured:
        logger.info("✓ OpenAI API Key: Configured")
    else:
        logger.warning("⚠ OpenAI API Key: NOT CONFIGURED - Please set OPENAI_API_KEY in .env")
    
    logger.info("=" * 60)


@app.on_event("shutdown")
async def shutdown_event():
    """
    Application shutdown event handler.
    """
    logger.info("SenseVoice API shutting down...")


# ============================================================================
# MAIN ENTRY POINT
# ============================================================================

if __name__ == "__main__":
    import uvicorn
    
    # Run the FastAPI application
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,  # Enable auto-reload during development
        log_level="info"
    )
