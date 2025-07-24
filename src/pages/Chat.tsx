import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { ChatBubble } from "@/components/ChatBubble";
import { ChatInput } from "@/components/ChatInput";
import { WelcomePrompts } from "@/components/WelcomePrompts";
import { ChatHistory } from "@/components/ChatHistory";
import { Settings } from "@/components/Settings";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useDatabase } from "@/hooks/useDatabase";
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
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  
  const { toast } = useToast();
  const { user, signOut } = useAuth();
  const database = useDatabase(user?.id);

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

  useEffect(() => {
    if (user) {
      loadUserProfile();
    }
  }, [user]);

  const loadUserProfile = async () => {
    if (!user) return;
    const profile = await database.getUserProfile();
    setUserProfile(profile);
  };

  const createNewSession = async (firstMessage: string): Promise<string | null> => {
    if (!user) return null;
    
    const title = firstMessage.slice(0, 50) + (firstMessage.length > 50 ? '...' : '');
    const preview = firstMessage.slice(0, 100);
    
    return await database.createChatSession(title, preview);
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
      // Create new session if this is the first message
      let sessionId = currentSessionId;
      if (!sessionId && user) {
        sessionId = await createNewSession(text);
        setCurrentSessionId(sessionId);
      }

      // Save user message to database
      if (sessionId && user) {
        await database.saveMessage(sessionId, text, 'user');
      }

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

      // Save AI message to database
      if (sessionId && user) {
        await database.saveMessage(sessionId, response, 'ai');
      }
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

  const handleLogout = async () => {
    await signOut();
  };

  const loadChatSession = async (sessionId: string) => {
    if (!user) return;
    
    const sessionMessages = await database.getChatMessages(sessionId);
    const convertedMessages: Message[] = sessionMessages.map(msg => ({
      id: msg.id,
      text: msg.content,
      type: msg.message_type,
      timestamp: new Date(msg.created_at).toLocaleTimeString('tr-TR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    }));
    
    setMessages(convertedMessages);
    setCurrentSessionId(sessionId);
    setCurrentView('chat');
  };

  // Render different views
  if (currentView === 'history') {
    return (
      <ChatHistory 
        onBack={() => setCurrentView('chat')}
        onSelectChat={loadChatSession}
      />
    );
  }

  if (currentView === 'settings') {
    return (
      <Settings 
        onBack={() => setCurrentView('chat')}
        onLogout={handleLogout}
        userProfile={userProfile}
      />
    );
  }

  return (
    <div className="flex flex-col h-screen bg-background mobile-vh safe-top safe-bottom">
      <Header 
        onOpenHistory={() => setCurrentView('history')}
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