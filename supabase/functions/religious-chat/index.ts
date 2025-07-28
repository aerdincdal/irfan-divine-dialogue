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

// Islamic content validator
function isReligiousContent(message: string): boolean {
  const religiousKeywords = [
    'allah', 'kuran', 'hadis', 'namaz', 'dua', 'islam', 'müslüman', 'peygamber',
    'ayet', 'sure', 'din', 'iman', 'ibadet', 'haram', 'helal', 'fıkıh',
    'tefsir', 'sünnet', 'sahabe', 'cami', 'mescit', 'ramazan', 'oruç',
    'zekat', 'hac', 'umre', 'kabe', 'medine', 'mekke', 'قرآن', 'الله'
  ];
  
  const lowerMessage = message.toLowerCase();
  return religiousKeywords.some(keyword => lowerMessage.includes(keyword));
}

// Prompt injection detector
function hasPromptInjection(message: string): boolean {
  const injectionPatterns = [
    /ignore\s+previous\s+instructions/i,
    /forget\s+what\s+i\s+told\s+you/i,
    /you\s+are\s+now/i,
    /system\s*:/i,
    /assistant\s*:/i,
    /new\s+role/i,
    /role\s*:\s*system/i,
    /pretend\s+to\s+be/i,
    /act\s+as\s+if/i,
    /override\s+your/i,
    /jailbreak/i,
    /\[SYSTEM\]/i,
    /\[ASSISTANT\]/i
  ];
  
  return injectionPatterns.some(pattern => pattern.test(message));
}

// Vector similarity search for RAG
async function findRelevantContext(query: string, limit: number = 3) {
  try {
    // First, generate embedding for the query using Groq
    const embeddingResponse = await fetch('https://api.groq.com/openai/v1/embeddings', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'nomic-embed-text-v1.5',
        input: query
      })
    });

    if (!embeddingResponse.ok) {
      console.error('Failed to generate embedding');
      return [];
    }

    const embeddingData = await embeddingResponse.json();
    const queryEmbedding = embeddingData.data[0].embedding;

    // Search for similar content in our database
    const { data: similarChunks, error } = await supabase.rpc('match_documents', {
      query_embedding: queryEmbedding,
      match_threshold: 0.7,
      match_count: limit
    });

    if (error) {
      console.error('Error searching for similar content:', error);
      return [];
    }

    return similarChunks || [];
  } catch (error) {
    console.error('Error in findRelevantContext:', error);
    return [];
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, userId, sessionId } = await req.json();

    if (!message || !userId) {
      return new Response(
        JSON.stringify({ error: 'Mesaj ve kullanıcı ID gerekli' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Log the content filter attempt
    const filterResult = {
      isReligious: isReligiousContent(message),
      hasInjection: hasPromptInjection(message),
      timestamp: new Date().toISOString()
    };

    await supabase.from('content_filters').insert({
      user_id: userId,
      message: message,
      filter_result: filterResult,
      blocked: !filterResult.isReligious || filterResult.hasInjection
    });

    // Block non-religious content
    if (!filterResult.isReligious) {
      return new Response(
        JSON.stringify({
          response: "Üzgünüm, sadece dini konularda yardımcı olabilirim. Lütfen İslam, Kuran, hadis veya diğer dini konular hakkında soru sorun.",
          blocked: true,
          reason: "non_religious_content"
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Block prompt injection attempts
    if (filterResult.hasInjection) {
      return new Response(
        JSON.stringify({
          response: "Lütfen sadece dini sorular sorun. Sistem komutları veya rol değiştirme girişimleri kabul edilmez.",
          blocked: true,
          reason: "prompt_injection"
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Find relevant context from our RAG database
    const relevantContext = await findRelevantContext(message);
    
    // Build context string from RAG results
    const contextString = relevantContext
      .map(chunk => `${chunk.document_name}: ${chunk.chunk_text}`)
      .join('\n\n');

    // Generate response using Groq
    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: `Sen İslami bir danışman asistanısın. Sadece İslam dini ile ilgili sorulara yanıt ver. Kaynaklarını Kuran ve sahih hadislerden al. 

Kullanılabilir kaynak bilgiler:
${contextString}

KURALLAR:
1. Sadece İslami konularda yanıt ver
2. Yanıtlarını Kuran ayetleri ve sahih hadislerle destekle
3. Kesin fetva verme, "Allah daha iyi bilir" de
4. Türkçe yanıt ver
5. Nazik ve saygılı ol
6. Eğer soruya yanıt veremiyorsan, alimlere danışmasını öner

Verilen kaynak bilgileri kullanarak doğru ve güvenilir yanıt ver.`
          },
          {
            role: 'user',
            content: message
          }
        ],
        temperature: 0.3,
        max_tokens: 1000,
        top_p: 0.9
      })
    });

    if (!groqResponse.ok) {
      const errorText = await groqResponse.text();
      console.error('Groq API error:', errorText);
      throw new Error('AI yanıt üretilemedi');
    }

    const groqData = await groqResponse.json();
    const response = groqData.choices[0]?.message?.content || 'Yanıt üretilemedi.';

    return new Response(
      JSON.stringify({
        response,
        blocked: false,
        sources: relevantContext.map(chunk => chunk.document_name)
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in religious-chat function:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Sistem hatası oluştu. Lütfen tekrar deneyin.',
        response: 'Üzgünüm, şu anda teknik bir sorun yaşıyoruz. Lütfen daha sonra tekrar deneyin.'
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});