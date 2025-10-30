"""
SenseVoice API - FastAPI Implementation

This API provides both text-to-speech (TTS) and speech-to-text (ASR) services
using custom AI APIs with support for Bengali and English languages.

Services:
- TTS: Convert text to natural speech using SenseTTS API
- ASR: Transcribe audio to text using custom ASR API

Author: SenseVoice Team
Version: 2.0.0
Created: October 30, 2025
"""

from fastapi import FastAPI, HTTPException, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import httpx
import base64
from datetime import datetime
from typing import Optional, Dict
import logging
import os
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
    version="2.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configure CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:8000",
        "http://192.168.0.44:3000",
        "http://192.168.0.203:3000",
        "http://192.168.0.203:9605",
        "http://127.0.0.1:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load API URLs from environment variables
TTS_API_BASE_URL = os.getenv("TTS_API_BASE_URL")
ASR_API_BASE_URL = os.getenv("ASR_API_BASE_URL")

# Validate required environment variables
if not TTS_API_BASE_URL:
    raise ValueError("TTS_API_BASE_URL environment variable is required in .env file")
if not ASR_API_BASE_URL:
    raise ValueError("ASR_API_BASE_URL environment variable is required in .env file")

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
        description="Language for speech synthesis: 'bangla' or 'english'"
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


class TTSCloneResponse(BaseModel):
    """
    Response model for successful TTS voice cloning.
    
    Attributes:
        success: Whether the generation was successful
        audioUrl: Base64-encoded audio data URL
        metadata: Additional information about the cloned audio
    """
    success: bool
    audioUrl: str
    metadata: Dict[str, str]


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
# HELPER FUNCTIONS
# ============================================================================

def map_language_to_api(language: str) -> str:
    """
    Map frontend language names to SenseTTS API language codes.
    
    Args:
        language: Frontend language name ("bangla" or "english")
        
    Returns:
        API language code ("bn" or "en")
    """
    language_map = {
        "bangla": "bn",
        "english": "en"
    }
    return language_map.get(language.lower(), "en")


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
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "tts_api_url": TTS_API_BASE_URL,
        "asr_api_url": ASR_API_BASE_URL,
        "supported_languages": ["bangla", "english"],
        "available_voices": ["female", "male"]
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
    Generate speech audio from text using SenseTTS API.
    
    This endpoint accepts text input along with language and voice preferences,
    then generates high-quality speech audio using the SenseTTS API.
    The audio is returned as a base64-encoded data URL for immediate playback.
    
    **Supported Languages:**
    - `bangla`: Bengali language with proper pronunciation
    - `english`: English language with natural intonation
    
    **Available Voices:**
    - `female`: Warm, friendly female voice (works for all languages)
    - `male`: Deep, authoritative male voice (works for all languages)
    
    Args:
        request: TTSRequest object containing text, language, and voice
        
    Returns:
        TTSResponse with success status, audio data URL, and metadata
        
    Raises:
        HTTPException: If text is empty or SenseTTS API fails
    """
    logger.info(f"TTS generation requested: language={request.language}, voice={request.voice}, text_length={len(request.text)}")
    
    # Validate input text
    if not request.text or not request.text.strip():
        logger.warning("Empty text received")
        raise HTTPException(status_code=400, detail="Text is required and cannot be empty")
    
    try:
        # Map language from frontend format to API format
        api_language = map_language_to_api(request.language)
        logger.info(f"Mapped language '{request.language}' to API code '{api_language}'")
        
        # Prepare SenseTTS API request payload
        payload = {
            "text": request.text,
            "voice": request.voice,
            "language": api_language,
            "make_clean": True
        }
        
        logger.info(f"Calling SenseTTS API at {TTS_API_BASE_URL}/tts...")
        
        # Call SenseTTS API with timeout
        async with httpx.AsyncClient(timeout=120.0) as client:
            response = await client.post(
                f"{TTS_API_BASE_URL}/tts",
                json=payload
            )
            
            # Handle API errors
            if response.status_code != 200:
                error_text = response.text
                logger.error(f"SenseTTS API error {response.status_code}: {error_text}")
                raise HTTPException(
                    status_code=response.status_code,
                    detail=f"SenseTTS API error: {error_text}"
                )
            
            # Get audio bytes from response (direct audio/wav return)
            audio_bytes = response.content
            
            if not audio_bytes:
                logger.error("Empty audio response from SenseTTS API")
                raise HTTPException(
                    status_code=500,
                    detail="Received empty audio from SenseTTS API"
                )
            
            audio_size_kb = len(audio_bytes) / 1024
            
            # Extract metadata from response headers
            processing_time = response.headers.get("x-processing-time", "0")
            text_length = response.headers.get("x-text-length", "0")
            
            logger.info(f"Audio generated successfully: {audio_size_kb:.2f} KB, processing time: {processing_time}s")
            
            # Convert audio to base64 data URL for browser playback
            base64_audio = base64.b64encode(audio_bytes).decode('utf-8')
            audio_data_url = f"data:audio/wav;base64,{base64_audio}"
            
            # Prepare response with metadata
            response_data = {
                "success": True,
                "audioUrl": audio_data_url,
                "metadata": {
                    "language": request.language,
                    "voice": request.voice,
                    "provider": "SenseTTS",
                    "processingTime": f"{processing_time}s",
                    "textLength": text_length,
                    "audioSize": f"{audio_size_kb:.2f} KB",
                    "timestamp": datetime.utcnow().isoformat()
                }
            }
            
            logger.info("TTS generation completed successfully")
            return response_data
            
    except httpx.TimeoutException as e:
        logger.error(f"Request timeout: {str(e)}")
        raise HTTPException(
            status_code=504,
            detail="Request to SenseTTS API timed out. Please try again."
        )
    
    except httpx.ConnectError as e:
        logger.error(f"Connection failed: {str(e)}")
        raise HTTPException(
            status_code=503,
            detail="Could not connect to SenseTTS API. Please check if the service is running."
        )
    
    except httpx.HTTPError as e:
        logger.error(f"HTTP request failed: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Request to SenseTTS API failed: {str(e)}"
        )
    
    except Exception as e:
        logger.error(f"Unexpected error during TTS generation: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate audio: {str(e)}"
        )


@app.post(
    "/api/tts/clone",
    response_model=TTSCloneResponse,
    responses={
        200: {"description": "Voice cloned and audio generated successfully"},
        400: {"model": ErrorResponse, "description": "Invalid request"},
        500: {"model": ErrorResponse, "description": "Server error"}
    },
    tags=["TTS"]
)
async def clone_voice(
    text: str = Form(..., description="Text to convert to speech with cloned voice"),
    language: str = Form(..., description="Language code: 'en' or 'bn'"),
    reference: UploadFile = File(..., description="Reference audio file for voice cloning"),
    make_clean: bool = Form(default=True, description="Apply audio cleaning/enhancement"),
    sample_rate: int = Form(default=16000, description="Output audio sample rate in Hz")
):
    """
    Generate speech audio with voice cloning using a reference audio sample.
    
    This endpoint accepts text input, language preference, and a reference audio file
    to clone the voice characteristics from the reference and apply them to the generated speech.
    
    **Supported Languages:**
    - `en`: English language
    - `bn`: Bengali language
    
    **Reference Audio Requirements:**
    - Clear audio with the target voice speaking
    - Minimal background noise
    - Duration: 5-30 seconds recommended
    - Supported formats: mp3, wav, m4a, flac, ogg
    
    **Audio Processing Options:**
    - `make_clean`: Apply audio enhancement (default: true)
    - `sample_rate`: Output sample rate - 16000, 22050, 24000, or 48000 Hz (default: 16000)
    
    Args:
        text: Text to synthesize with the cloned voice (required)
        language: Language code - 'en' or 'bn' (required)
        reference: Audio file containing the voice to clone (required)
        make_clean: Apply audio cleaning/enhancement (optional, default: true)
        sample_rate: Output audio sample rate in Hz (optional, default: 16000)
        
    Returns:
        TTSCloneResponse with success status, audio data URL, and metadata
        
    Raises:
        HTTPException: If text is empty, reference file is invalid, or TTS API fails
    """
    logger.info(f"TTS voice cloning requested: language={language}, text_length={len(text)}, reference_file={reference.filename}, make_clean={make_clean}, sample_rate={sample_rate}")
    
    # Validate input text
    if not text or not text.strip():
        logger.warning("Empty text received")
        raise HTTPException(status_code=400, detail="Text is required and cannot be empty")
    
    # Validate language
    if language not in ['en', 'bn']:
        logger.warning(f"Invalid language code: {language}")
        raise HTTPException(
            status_code=400,
            detail="Language must be 'en' (English) or 'bn' (Bengali)"
        )
    
    # Validate reference file type
    allowed_extensions = ['mp3', 'wav', 'm4a', 'flac', 'ogg']
    file_extension = reference.filename.split('.')[-1].lower() if reference.filename else ''
    
    if file_extension not in allowed_extensions:
        logger.warning(f"Unsupported reference file type: {file_extension}")
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported audio format. Supported formats: {', '.join(allowed_extensions)}"
        )
    
    try:
        # Read reference audio file
        reference_content = await reference.read()
        reference_size_mb = len(reference_content) / (1024 * 1024)
        
        if reference_size_mb > 10:
            logger.warning(f"Reference file too large: {reference_size_mb:.2f} MB")
            raise HTTPException(
                status_code=400,
                detail=f"Reference file size ({reference_size_mb:.2f} MB) exceeds maximum limit of 10 MB"
            )
        
        logger.info(f"Processing voice cloning: reference audio size={reference_size_mb:.2f} MB")
        
        # Prepare multipart form data for TTS API
        files = {
            'reference': (reference.filename, reference_content, reference.content_type or f'audio/{file_extension}')
        }
        
        data = {
            'text': text,
            'language': language,
            'make_clean': str(make_clean).lower(),
            'sample_rate': str(sample_rate)
        }
        
        logger.info(f"Calling TTS API at {TTS_API_BASE_URL}/tts/clone...")
        
        # Call TTS voice cloning API with timeout
        async with httpx.AsyncClient(timeout=180.0) as client:
            response = await client.post(
                f"{TTS_API_BASE_URL}/tts/clone",
                files=files,
                data=data
            )
            
            # Handle API errors
            if response.status_code != 200:
                error_text = response.text
                logger.error(f"TTS Clone API error {response.status_code}: {error_text}")
                raise HTTPException(
                    status_code=response.status_code,
                    detail=f"TTS Clone API error: {error_text}"
                )
            
            # Get audio bytes from response
            audio_bytes = response.content
            
            if not audio_bytes:
                logger.error("Empty audio response from TTS Clone API")
                raise HTTPException(
                    status_code=500,
                    detail="Received empty audio from TTS Clone API"
                )
            
            audio_size_kb = len(audio_bytes) / 1024
            
            # Extract metadata from response headers
            processing_time = response.headers.get("x-processing-time", "0")
            text_length = response.headers.get("x-text-length", "0")
            
            logger.info(f"Voice cloned audio generated successfully: {audio_size_kb:.2f} KB, processing time: {processing_time}s")
            
            # Convert audio to base64 data URL for browser playback
            base64_audio = base64.b64encode(audio_bytes).decode('utf-8')
            audio_data_url = f"data:audio/wav;base64,{base64_audio}"
            
            # Prepare response with metadata
            response_data = {
                "success": True,
                "audioUrl": audio_data_url,
                "metadata": {
                    "language": language,
                    "provider": "SenseTTS Voice Clone",
                    "processingTime": f"{processing_time}s",
                    "textLength": text_length,
                    "audioSize": f"{audio_size_kb:.2f} KB",
                    "referenceFile": reference.filename,
                    "referenceSize": f"{reference_size_mb:.2f} MB",
                    "makeClean": str(make_clean),
                    "sampleRate": f"{sample_rate} Hz",
                    "timestamp": datetime.utcnow().isoformat()
                }
            }
            
            logger.info("TTS voice cloning completed successfully")
            return response_data
            
    except httpx.TimeoutException as e:
        logger.error(f"Request timeout: {str(e)}")
        raise HTTPException(
            status_code=504,
            detail="Request to TTS Clone API timed out. Please try again."
        )
    
    except httpx.ConnectError as e:
        logger.error(f"Connection failed: {str(e)}")
        raise HTTPException(
            status_code=503,
            detail="Could not connect to TTS Clone API. Please check if the service is running."
        )
    
    except httpx.HTTPError as e:
        logger.error(f"HTTP request failed: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Request to TTS Clone API failed: {str(e)}"
        )
    
    except Exception as e:
        logger.error(f"Unexpected error during voice cloning: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to clone voice and generate audio: {str(e)}"
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
    file: UploadFile = File(..., description="Audio file to transcribe")
):
    """
    Transcribe speech audio to Bengali text using custom ASR API.
    
    This endpoint accepts audio files and transcribes them to Bengali text
    using a custom speech recognition API. Punctuation is automatically added
    to improve readability.
    
    **Supported Audio Formats:**
    - mp3, wav, m4a, flac, aac, wma, aiff
    
    **Language Support:**
    - Bengali (Bangla) only
    
    **Best Practices:**
    - Use clear audio with minimal background noise
    - Recommended: 16kHz or higher sample rate
    - Maximum file size: 25 MB
    
    Args:
        file: Audio file to transcribe (required)
        
    Returns:
        ASRResponse with success status, transcribed text, and metadata
        
    Raises:
        HTTPException: If file is invalid or ASR API fails
    """
    logger.info(f"ASR transcription requested: filename={file.filename}, content_type={file.content_type}")
    
    # Validate file type
    allowed_extensions = ['mp3', 'wav', 'm4a', 'flac', 'aac', 'wma', 'aiff']
    file_extension = file.filename.split('.')[-1].lower() if file.filename else ''
    
    if file_extension not in allowed_extensions:
        logger.warning(f"Unsupported file type: {file_extension}")
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file format. Supported formats: {', '.join(allowed_extensions)}"
        )
    
    try:
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
        
        # Prepare multipart form data for custom ASR API
        files = {
            'file': (file.filename, audio_content, file.content_type or f'audio/{file_extension}')
        }
        
        # Always add punctuation for better readability
        data = {
            'add_punctuation': 'true'
        }
        
        logger.info(f"Calling Custom ASR API at {ASR_API_BASE_URL}/transcribe...")
        
        # Call custom ASR API with timeout
        async with httpx.AsyncClient(timeout=120.0) as client:
            response = await client.post(
                f"{ASR_API_BASE_URL}/transcribe",
                files=files,
                data=data
            )
            
            # Handle API errors
            if response.status_code != 200:
                error_text = response.text
                logger.error(f"ASR API error {response.status_code}: {error_text}")
                raise HTTPException(
                    status_code=response.status_code,
                    detail=f"ASR API error: {error_text}"
                )
            
            # Parse response
            asr_result = response.json()
            
            if not asr_result.get('success'):
                logger.warning("ASR API returned success=false")
                raise HTTPException(
                    status_code=400,
                    detail="Transcription failed"
                )
            
            transcribed_text = asr_result.get('transcription', '')
            
            if not transcribed_text:
                logger.warning("No text transcribed from audio")
                raise HTTPException(
                    status_code=400,
                    detail="No speech detected in the audio file"
                )
            
            logger.info(f"Transcription successful: {len(transcribed_text)} characters, duration: {asr_result.get('duration_seconds', 0)}s")
            
            # Prepare response with metadata
            response_data = {
                "success": True,
                "text": transcribed_text,
                "metadata": {
                    "filename": asr_result.get('filename', file.filename),
                    "fileSize": f"{audio_size_mb:.2f} MB",
                    "format": file_extension,
                    "language": "bangla",
                    "provider": "Custom ASR",
                    "durationSeconds": str(asr_result.get('duration_seconds', 0)),
                    "wordCount": str(asr_result.get('word_count', 0)),
                    "punctuationAdded": str(asr_result.get('punctuation_added', True)),
                    "characterCount": str(len(transcribed_text)),
                    "timestamp": datetime.utcnow().isoformat()
                }
            }
            
            logger.info("ASR transcription completed successfully")
            return response_data
            
    except httpx.TimeoutException as e:
        logger.error(f"Request timeout: {str(e)}")
        raise HTTPException(
            status_code=504,
            detail="Request to ASR API timed out. Please try again."
        )
    
    except httpx.ConnectError as e:
        logger.error(f"Connection failed: {str(e)}")
        raise HTTPException(
            status_code=503,
            detail="Could not connect to ASR API. Please check if the service is running."
        )
    
    except httpx.HTTPError as e:
        logger.error(f"HTTP request failed: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Request to ASR API failed: {str(e)}"
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
    logger.info(f"TTS API: {TTS_API_BASE_URL}")
    logger.info(f"TTS - Supported Languages: bangla, english")
    logger.info(f"TTS - Available Voices: female, male")
    logger.info(f"ASR API: {ASR_API_BASE_URL}")
    logger.info(f"ASR - Supported Languages: bangla")
    logger.info(f"ASR - Supported Formats: mp3, wav, m4a, flac, aac, wma, aiff")
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
