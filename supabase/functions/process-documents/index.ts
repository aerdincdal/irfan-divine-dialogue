import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const groqApiKey = Deno.env.get('GROQ_API_KEY')!;

const supabase = createClient(supabaseUrl, supabaseKey);

// PDF text extraction (simplified - in production use proper PDF parser)
async function extractTextFromPDF(file: File): Promise<string> {
  // This is a placeholder - in production, you'd use a proper PDF parser
  // For now, we'll return empty string and expect manual text input
  return '';
}

// Text chunking for embeddings
function chunkText(text: string, chunkSize: number = 1000): string[] {
  const chunks: string[] = [];
  const sentences = text.split(/[.!?]+/);
  let currentChunk = '';
  
  for (const sentence of sentences) {
    if ((currentChunk + sentence).length > chunkSize && currentChunk) {
      chunks.push(currentChunk.trim());
      currentChunk = sentence;
    } else {
      currentChunk += (currentChunk ? ' ' : '') + sentence;
    }
  }
  
  if (currentChunk.trim()) {
    chunks.push(currentChunk.trim());
  }
  
  return chunks.filter(chunk => chunk.length > 50); // Filter out very short chunks
}

// Generate embeddings using Groq
async function generateEmbedding(text: string): Promise<number[]> {
  const response = await fetch('https://api.groq.com/openai/v1/embeddings', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${groqApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'text-embedding-ada-002',
      input: text
    })
  });

  if (!response.ok) {
    throw new Error('Failed to generate embedding');
  }

  const data = await response.json();
  return data.data[0].embedding;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { documentText, documentName, documentType = 'manual' } = await req.json();

    if (!documentText || !documentName) {
      return new Response(
        JSON.stringify({ error: 'Doküman metni ve adı gerekli' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Processing document: ${documentName}`);

    // Chunk the text
    const chunks = chunkText(documentText);
    console.log(`Created ${chunks.length} chunks`);

    // Process each chunk
    const processedChunks = [];
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      console.log(`Processing chunk ${i + 1}/${chunks.length}`);

      try {
        // Generate embedding for this chunk
        const embedding = await generateEmbedding(chunk);

        // Store in database
        const { data, error } = await supabase
          .from('document_embeddings')
          .insert({
            document_name: documentName,
            chunk_text: chunk,
            embedding: embedding,
            metadata: {
              chunk_index: i,
              total_chunks: chunks.length,
              document_type: documentType,
              processed_at: new Date().toISOString()
            }
          })
          .select()
          .single();

        if (error) {
          console.error('Error inserting chunk:', error);
          throw error;
        }

        processedChunks.push(data);
      } catch (chunkError) {
        console.error(`Error processing chunk ${i + 1}:`, chunkError);
        // Continue with other chunks
      }
    }

    console.log(`Successfully processed ${processedChunks.length}/${chunks.length} chunks`);

    return new Response(
      JSON.stringify({
        success: true,
        document_name: documentName,
        chunks_processed: processedChunks.length,
        total_chunks: chunks.length,
        message: `${documentName} başarıyla işlendi. ${processedChunks.length} parça veritabanına eklendi.`
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in process-documents function:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Doküman işleme hatası oluştu',
        details: error.message 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});