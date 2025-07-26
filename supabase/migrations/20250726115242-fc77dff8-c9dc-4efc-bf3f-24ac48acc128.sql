-- Enable vector extension for embeddings
CREATE EXTENSION IF NOT EXISTS vector;

-- Add Google OAuth provider support to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS avatar_url TEXT,
ADD COLUMN IF NOT EXISTS provider TEXT DEFAULT 'email',
ADD COLUMN IF NOT EXISTS provider_id TEXT;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_profiles_provider_id ON public.profiles(provider, provider_id);

-- Update the handle_new_user function to support Google OAuth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER 
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, display_name, avatar_url, provider, provider_id)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(
      NEW.raw_user_meta_data->>'full_name',
      NEW.raw_user_meta_data->>'display_name', 
      NEW.email
    ),
    NEW.raw_user_meta_data->>'avatar_url',
    COALESCE(NEW.app_metadata->>'provider', 'email'),
    NEW.raw_user_meta_data->>'provider_id'
  );
  RETURN NEW;
END;
$$;

-- Create trigger for new users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create storage bucket for RAG documents
INSERT INTO storage.buckets (id, name, public) 
VALUES ('ayetsel-docs', 'ayetsel-docs', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for admin document uploads
CREATE POLICY "Admin can upload documents" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'ayetsel-docs' AND
  auth.jwt() ->> 'role' = 'admin'
);

CREATE POLICY "System can read documents" ON storage.objects
FOR SELECT USING (bucket_id = 'ayetsel-docs');

-- Create RAG embeddings table with vector support
CREATE TABLE IF NOT EXISTS public.document_embeddings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  document_name TEXT NOT NULL,
  chunk_text TEXT NOT NULL,
  embedding vector(1536),
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.document_embeddings ENABLE ROW LEVEL SECURITY;

-- Policy for embeddings (system access only)
CREATE POLICY "System can manage embeddings" ON public.document_embeddings
FOR ALL USING (true);

-- Create index for vector similarity search
CREATE INDEX IF NOT EXISTS idx_document_embeddings_vector 
ON public.document_embeddings USING ivfflat (embedding vector_cosine_ops);

-- Update chat_sessions to track conversation context
ALTER TABLE public.chat_sessions 
ADD COLUMN IF NOT EXISTS conversation_type TEXT DEFAULT 'religious',
ADD COLUMN IF NOT EXISTS security_level TEXT DEFAULT 'standard';

-- Add content filtering log table
CREATE TABLE IF NOT EXISTS public.content_filters (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  message TEXT NOT NULL,
  filter_result JSONB NOT NULL,
  blocked BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.content_filters ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own filter logs" ON public.content_filters
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can insert filter logs" ON public.content_filters
FOR INSERT WITH CHECK (true);