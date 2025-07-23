import { useState } from "react";
import { Header } from "@/components/Header";
import { ChatBubble } from "@/components/ChatBubble";
import { ChatInput } from "@/components/ChatInput";
import { WelcomePrompts } from "@/components/WelcomePrompts";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  text: string;
  type: 'user' | 'ai';
  timestamp: string;
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const generateResponse = async (userMessage: string): Promise<string> => {
    // AI entegrasyonu için yer tutucu
    // Gerçek uygulamada burada Supabase Edge Function çağrılacak
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return `Bu bir demo yanıttır. "${userMessage}" sorunuz için İslami kaynaklardan detaylı bilgi vereceğim. Supabase bağlantısı kurulduktan sonra gerçek AI yanıtları gelecek.`;
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

  return (
    <div className="flex flex-col h-screen bg-background">
      <Header />
      
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