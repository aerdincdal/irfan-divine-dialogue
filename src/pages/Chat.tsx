import { useState } from "react";
import { Header } from "@/components/Header";
import { ChatBubble } from "@/components/ChatBubble";
import { ChatInput } from "@/components/ChatInput";
import { WelcomePrompts } from "@/components/WelcomePrompts";
import { ChatHistory } from "@/components/ChatHistory";
import { Settings } from "@/components/Settings";
import { useToast } from "@/hooks/use-toast";
import { islamicApiService } from "@/services/islamicApi";

interface Message {
  id: string;
  text: string;
  type: 'user' | 'ai';
  timestamp: string;
}

type ChatView = 'chat' | 'history' | 'settings';

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentView, setCurrentView] = useState<ChatView>('chat');
  const { toast } = useToast();

  const generateResponse = async (userMessage: string): Promise<string> => {
    try {
      if (islamicApiService.isConfigured()) {
        const result = await islamicApiService.askQuestion({
          question: userMessage,
          language: 'tr'
        });
        
        if (result.success && result.data) {
          return result.data.answer;
        }
      }
      
      // Fallback to demo response
      const demoResponse = await islamicApiService.getDemoResponse(userMessage);
      return demoResponse.answer;
    } catch (error) {
      return 'Üzgünüm, şu anda bir teknik sorun yaşıyoruz. Lütfen daha sonra tekrar deneyin.';
    }
  };

  const handleSendMessage = async (text: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      type: 'user',
      timestamp: new Date().toLocaleTimeString('tr-TR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await generateResponse(text);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        type: 'ai',
        timestamp: new Date().toLocaleTimeString('tr-TR', { 
          hour: '2-digit', 
          minute: '2-digit' 
        })
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      toast({
        title: "Hata",
        description: "Mesaj gönderilemedi. Lütfen tekrar deneyin.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('irfan_user_authenticated');
    window.location.reload();
  };

  const saveCurrentChat = () => {
    if (messages.length > 0) {
      const chatSession = {
        id: Date.now().toString(),
        title: messages[0]?.text?.slice(0, 50) + '...' || 'Yeni Sohbet',
        preview: messages[0]?.text || '',
        timestamp: 'Şimdi',
        messageCount: messages.length,
        messages: messages
      };
      
      const existingHistory = JSON.parse(localStorage.getItem('irfan_chat_history') || '[]');
      const updatedHistory = [chatSession, ...existingHistory];
      localStorage.setItem('irfan_chat_history', JSON.stringify(updatedHistory));
    }
  };

  // Render different views
  if (currentView === 'history') {
    return (
      <ChatHistory 
        onBack={() => setCurrentView('chat')}
        onSelectChat={(chatId) => {
          // Load selected chat and return to chat view
          setCurrentView('chat');
        }}
      />
    );
  }

  if (currentView === 'settings') {
    return (
      <Settings 
        onBack={() => setCurrentView('chat')}
        onLogout={handleLogout}
      />
    );
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      <Header 
        onOpenHistory={() => {
          saveCurrentChat();
          setCurrentView('history');
        }}
        onOpenMenu={() => setCurrentView('settings')}
      />
      
      <div className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <WelcomePrompts onSelectPrompt={handleSendMessage} />
        ) : (
          <div className="p-4 space-y-4 pb-32">
            {messages.map((message) => (
              <ChatBubble
                key={message.id}
                message={message.text}
                type={message.type}
                timestamp={message.timestamp}
              />
            ))}
            {isLoading && (
              <div className="flex justify-start mb-4">
                <div className="glass-panel rounded-3xl rounded-bl-lg px-4 py-3 max-w-[85%]">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <ChatInput onSendMessage={handleSendMessage} disabled={isLoading} />
    </div>
  );
}