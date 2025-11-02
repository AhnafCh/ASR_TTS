# Sneha Custom Voice Implementation

## Overview
Successfully added "Sneha" as a custom cloned voice to the TTS playground. When users select this voice, it automatically uses the voice cloning endpoint with a pre-configured reference audio file.

## Changes Made

### 1. Frontend Updates (`components/playground/text-to-audio-panel.tsx`)

#### Added TypeScript Interface
```typescript
interface VoiceActor {
  id: string
  name: string
  language: string
  sample: string
  type: "standard" | "custom"
  referenceFile?: string  // Only for custom voices
}
```

#### Voice Actor Configuration
- **Standard Voices**: Female Voice, Male Voice (use `/api/tts/generate`)
- **Custom Voices**: Sneha (uses `/api/tts/clone` with reference audio)

```typescript
const customVoices: VoiceActor[] = [
  { 
    id: "sneha", 
    name: "Sneha", 
    language: "Bengali", 
    sample: "/samples/Female_voiceover2.wav", 
    type: "custom", 
    referenceFile: "/samples/Female_voiceover2.wav" 
  },
]
```

#### Enhanced `handleGenerate` Function
- Detects voice type (standard vs custom)
- For **custom voices**: 
  - Fetches reference audio file from public directory
  - Creates FormData with text, language, and reference audio
  - Calls `/api/tts/clone` endpoint
  - Uses `sample_rate: 24000` for high quality
  - Applies `make_clean: true` for audio enhancement

#### Visual Separation in Dropdown
- Standard voices listed first
- Visual separator with "Custom Voices" header
- Custom voices display with "Premium" badge
- Clear distinction between voice types

### 2. Backend API (`api/main.py`)

The backend already has a fully implemented `/api/tts/clone` endpoint that:
- Accepts multipart form data (text, language, reference audio file)
- Validates language codes (en/bn)
- Supports multiple audio formats (mp3, wav, m4a, flac, ogg)
- Forwards request to external TTS API
- Returns base64-encoded audio with metadata

**Endpoint**: `POST /api/tts/clone`

**Parameters**:
- `text`: Text to synthesize (required)
- `language`: 'en' or 'bn' (required)
- `reference`: Audio file for voice cloning (required)
- `make_clean`: Apply audio enhancement (default: true)
- `sample_rate`: Output sample rate in Hz (default: 16000)

## File Structure

```
public/
  samples/
    Female_voiceover2.wav  ✓ (Reference audio for Sneha voice)
    female.mp3             ✓ (Sample for Female Voice)
    male.mp3               ✓ (Sample for Male Voice)

components/
  playground/
    text-to-audio-panel.tsx  ✓ (Updated with Sneha voice)

api/
  main.py                    ✓ (Clone endpoint already implemented)
```

## How It Works

### User Flow
1. User opens TTS playground
2. Selects "Sneha" from Voice Actor dropdown (shown under "Custom Voices")
3. Enters text in Bengali or English
4. Clicks "Generate Audio"

### Technical Flow
1. Frontend detects Sneha is a custom voice (type === "custom")
2. Fetches reference audio from `/samples/Female_voiceover2.wav`
3. Creates FormData with:
   - text: User's input text
   - language: 'bn' (for Bangla) or 'en' (for English)
   - reference: Female_voiceover2.wav blob
   - make_clean: true
   - sample_rate: 24000
4. Sends POST request to `/api/tts/clone`
5. Backend forwards to external TTS API at `{TTS_API_BASE_URL}/tts/clone`
6. Returns cloned audio as base64-encoded data URL
7. User can play and download the generated audio

## API Endpoints Used

### Standard Voices (Female/Male)
```
POST /api/tts/generate
Content-Type: application/json

{
  "text": "User's text",
  "language": "bangla",
  "voice": "female"
}
```

### Custom Voice (Sneha)
```
POST /api/tts/clone
Content-Type: multipart/form-data

- text: "User's text"
- language: "bn"
- reference: Female_voiceover2.wav (auto-fetched)
- make_clean: "true"
- sample_rate: "24000"
```

## Adding More Custom Voices

To add additional custom voices in the future:

1. Add reference audio file to `public/samples/`
2. Update `customVoices` array in `text-to-audio-panel.tsx`:

```typescript
const customVoices: VoiceActor[] = [
  { 
    id: "sneha", 
    name: "Sneha", 
    language: "Bengali", 
    sample: "/samples/Female_voiceover2.wav", 
    type: "custom", 
    referenceFile: "/samples/Female_voiceover2.wav" 
  },
  // Add new custom voice
  { 
    id: "aryan", 
    name: "Aryan", 
    language: "Bengali", 
    sample: "/samples/Male_voiceover1.wav", 
    type: "custom", 
    referenceFile: "/samples/Male_voiceover1.wav" 
  },
]
```

3. The system automatically handles routing to clone endpoint for all custom voices!

## Benefits

✅ **Seamless Integration**: No user intervention needed for voice cloning
✅ **High Quality**: Uses 24kHz sample rate with audio cleaning
✅ **Scalable**: Easy to add more custom voices
✅ **Visual Clarity**: Clear separation between standard and premium custom voices
✅ **Performance**: Reference files cached by browser
✅ **Type Safe**: Full TypeScript support with interfaces

## Testing

To test the Sneha voice:

1. Start the backend: `cd api && uvicorn main:app --reload`
2. Start the frontend: `npm run dev`
3. Navigate to playground
4. Select "Sneha" from Voice Actor dropdown
5. Enter Bengali text (e.g., "শুধু বাণী চিরন্তণী বা উক্তি পড়লেই যে সাফল্য পাওয়া যাবে")
6. Click "Generate Audio"
7. Play the generated audio with Sneha's cloned voice

## Notes

- Reference audio file (`Female_voiceover2.wav`) must be high-quality for best results
- Voice cloning typically takes longer than standard TTS (15-20 seconds)
- Custom voices work with both Bengali and English text
- The "Premium" badge distinguishes custom voices in the UI
