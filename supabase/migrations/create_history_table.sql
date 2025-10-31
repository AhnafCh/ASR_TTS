-- Create history table for storing user's TTS and ASR generations
CREATE TABLE IF NOT EXISTS public.history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Basic info
  name TEXT NOT NULL, -- First few words of the text/transcription
  type TEXT NOT NULL CHECK (type IN ('text-to-speech', 'speech-to-text')),
  
  -- Content
  text_content TEXT NOT NULL, -- The actual text (input for TTS, output for ASR)
  audio_url TEXT, -- URL to the audio file (output for TTS, input for ASR)
  
  -- Metadata
  word_count INTEGER NOT NULL DEFAULT 0,
  duration TEXT, -- Duration in format "MM:SS" like "01:45"
  
  -- TTS-specific fields (nullable for ASR)
  language TEXT, -- 'bangla' or 'english'
  voice TEXT, -- 'male' or 'female'
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index on user_id for faster queries
CREATE INDEX IF NOT EXISTS idx_history_user_id ON public.history(user_id);

-- Create index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_history_created_at ON public.history(created_at DESC);

-- Create index on type for filtering
CREATE INDEX IF NOT EXISTS idx_history_type ON public.history(type);

-- Enable Row Level Security
ALTER TABLE public.history ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Allow users to view their own history
CREATE POLICY "Users can view own history"
ON public.history FOR SELECT
USING (auth.uid() = user_id);

-- Allow users to insert their own history
CREATE POLICY "Users can insert own history"
ON public.history FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own history
CREATE POLICY "Users can update own history"
ON public.history FOR UPDATE
USING (auth.uid() = user_id);

-- Allow users to delete their own history
CREATE POLICY "Users can delete own history"
ON public.history FOR DELETE
USING (auth.uid() = user_id);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER set_updated_at
BEFORE UPDATE ON public.history
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();
