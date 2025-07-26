import { supabase } from '@/integrations/supabase/client';

interface ReligiousChatResponse {
  response: string;
  blocked: boolean;
  reason?: string;
  sources?: string[];
}

interface ProcessDocumentResponse {
  success: boolean;
  document_name: string;
  chunks_processed: number;
  total_chunks: number;
  message: string;
}

export const ragService = {
  async askReligiousQuestion(message: string, userId: string, sessionId?: string): Promise<ReligiousChatResponse> {
    try {
      const { data, error } = await supabase.functions.invoke('religious-chat', {
        body: {
          message,
          userId,
          sessionId
        }
      });

      if (error) {
        console.error('RAG service error:', error);
        return {
          response: 'Üzgünüm, şu anda bir teknik sorun yaşıyoruz. Lütfen daha sonra tekrar deneyin.',
          blocked: false
        };
      }

      return data;
    } catch (error) {
      console.error('RAG service error:', error);
      return {
        response: 'Üzgünüm, şu anda bir teknik sorun yaşıyoruz. Lütfen daha sonra tekrar deneyin.',
        blocked: false
      };
    }
  },

  async processDocument(documentText: string, documentName: string, documentType: string = 'manual'): Promise<ProcessDocumentResponse> {
    try {
      const { data, error } = await supabase.functions.invoke('process-documents', {
        body: {
          documentText,
          documentName,
          documentType
        }
      });

      if (error) {
        console.error('Document processing error:', error);
        throw new Error('Doküman işlenemedi');
      }

      return data;
    } catch (error) {
      console.error('Document processing error:', error);
      throw error;
    }
  },

  // Helper function to check if content is religious
  isReligiousContent(message: string): boolean {
    const religiousKeywords = [
      'allah', 'kuran', 'hadis', 'namaz', 'dua', 'islam', 'müslüman', 'peygamber',
      'ayet', 'sure', 'din', 'iman', 'ibadet', 'haram', 'helal', 'fıkıh',
      'tefsir', 'sünnet', 'sahabe', 'cami', 'mescit', 'ramazan', 'oruç',
      'zekat', 'hac', 'umre', 'kabe', 'medine', 'mekke', 'قرآن', 'الله'
    ];
    
    const lowerMessage = message.toLowerCase();
    return religiousKeywords.some(keyword => lowerMessage.includes(keyword));
  }
};