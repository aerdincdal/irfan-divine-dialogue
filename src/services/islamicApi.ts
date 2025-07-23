// API Service for İrfan Islamic Knowledge Assistant
// Swagger Endpoint Integration

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

interface IslamicQuery {
  question: string;
  context?: string;
  language?: 'tr' | 'ar' | 'en';
}

interface IslamicResponse {
  answer: string;
  sources: string[];
  confidence: number;
  category: 'quran' | 'hadith' | 'fiqh' | 'dua' | 'general';
}

class IslamicApiService {
  private baseUrl: string;
  private apiKey?: string;

  constructor() {
    this.baseUrl = localStorage.getItem('irfan_swagger_endpoint') || '';
    this.apiKey = localStorage.getItem('irfan_api_key') || undefined;
  }

  private async makeRequest<T>(
    endpoint: string, 
    method: 'GET' | 'POST' = 'POST', 
    data?: any
  ): Promise<ApiResponse<T>> {
    try {
      if (!this.baseUrl) {
        throw new Error('Swagger endpoint not configured');
      }

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (this.apiKey) {
        headers['Authorization'] = `Bearer ${this.apiKey}`;
      }

      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method,
        headers,
        body: data ? JSON.stringify(data) : undefined,
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      return { success: true, data: result };
    } catch (error) {
      console.error('API Request failed:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  async askQuestion(query: IslamicQuery): Promise<ApiResponse<IslamicResponse>> {
    return this.makeRequest<IslamicResponse>('/api/v1/ask', 'POST', query);
  }

  async searchQuran(query: string): Promise<ApiResponse<any>> {
    return this.makeRequest('/api/v1/quran/search', 'POST', { query });
  }

  async searchHadith(query: string): Promise<ApiResponse<any>> {
    return this.makeRequest('/api/v1/hadith/search', 'POST', { query });
  }

  async getDailyDua(): Promise<ApiResponse<any>> {
    return this.makeRequest('/api/v1/dua/daily', 'GET');
  }

  async getSpecialDua(occasion: string): Promise<ApiResponse<any>> {
    return this.makeRequest('/api/v1/dua/special', 'POST', { occasion });
  }

  // Demo fallback method for when no API is configured
  async getDemoResponse(question: string): Promise<IslamicResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    return {
      answer: `Bu bir demo yanıttır. "${question}" sorunuz için İslami kaynaklardan detaylı bilgi vereceğim. Gerçek API bağlantısı kurulduktan sonra otantik İslami bilgiler sağlanacaktır.`,
      sources: ['Demo Kaynak 1', 'Demo Kaynak 2'],
      confidence: 0.8,
      category: 'general'
    };
  }

  updateEndpoint(newEndpoint: string) {
    this.baseUrl = newEndpoint;
    localStorage.setItem('irfan_swagger_endpoint', newEndpoint);
  }

  updateApiKey(newApiKey: string) {
    this.apiKey = newApiKey;
    localStorage.setItem('irfan_api_key', newApiKey);
  }

  getEndpoint(): string {
    return this.baseUrl;
  }

  isConfigured(): boolean {
    return !!this.baseUrl;
  }
}

export const islamicApiService = new IslamicApiService();
export type { IslamicQuery, IslamicResponse, ApiResponse };