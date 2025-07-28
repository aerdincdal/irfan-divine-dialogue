import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowLeft, MessageSquare, Trash2, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ChatSession {
  id: string;
  title: string;
  preview: string;
  timestamp: string;
  messageCount: number;
}

interface ChatHistoryProps {
  onBack: () => void;
  onSelectChat?: (chatId: string) => void;
}

export const ChatHistory = ({ onBack, onSelectChat }: ChatHistoryProps) => {
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Load chat history from localStorage
    loadChatHistory();
  }, []);

  const loadChatHistory = () => {
    setIsLoading(true);
    
    // Simulate loading
    setTimeout(() => {
      const savedHistory = localStorage.getItem('irfan_chat_history');
      if (savedHistory) {
        setChatSessions(JSON.parse(savedHistory));
      } else {
        // Demo data
        setChatSessions([
          {
            id: '1',
            title: 'Fatiha Suresi Tefsiri',
            preview: 'Bana Fatiha Suresi\'nin tefsirini anlatır mısın?',
            timestamp: '2 saat önce',
            messageCount: 8
          },
          {
            id: '2',
            title: 'Sabah Duaları',
            preview: 'Sabah okunacak duaları öğrenmek istiyorum',
            timestamp: '1 gün önce',
            messageCount: 5
          },
          {
            id: '3',
            title: 'Namaz Rehberi',
            preview: 'Namazın rükünleri hakkında bilgi ver',
            timestamp: '3 gün önce',
            messageCount: 12
          }
        ]);
      }
      setIsLoading(false);
    }, 500);
  };

  const deleteChatSession = (chatId: string) => {
    setChatSessions(prev => {
      const updated = prev.filter(chat => chat.id !== chatId);
      localStorage.setItem('irfan_chat_history', JSON.stringify(updated));
      return updated;
    });
    
    toast({
      title: "Sohbet Silindi",
      description: "Sohbet geçmişi başarıyla silindi."
    });
  };

  const clearAllHistory = () => {
    setChatSessions([]);
    localStorage.removeItem('irfan_chat_history');
    
    toast({
      title: "Tüm Geçmiş Silindi",
      description: "Tüm sohbet geçmişi temizlendi."
    });
  };

  return (
    <div className="flex flex-col h-screen bg-background mobile-vh safe-top safe-bottom">
      {/* Header */}
      <div className="glass-panel border-b border-glass-border/50 p-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="text-foreground hover:text-primary rounded-xl"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-primary" />
              <h1 className="text-xl font-semibold">Sohbet Geçmişi</h1>
            </div>
          </div>
          
          {chatSessions.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllHistory}
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Tümünü Sil
            </Button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="space-y-4 text-center">
              <div className="flex justify-center">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
              <p className="text-muted-foreground">Sohbet geçmişi yükleniyor...</p>
            </div>
          </div>
        ) : chatSessions.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center space-y-4 px-6">
              <div className="w-20 h-20 mx-auto rounded-full glass-panel flex items-center justify-center">
                <MessageSquare className="w-10 h-10 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Henüz Sohbet Yok</h3>
                <p className="text-muted-foreground">
                  İlk sorunuzu sorarak sohbete başlayın
                </p>
              </div>
            </div>
          </div>
        ) : (
          <ScrollArea className="h-full">
            <div className="p-4 space-y-3">
              {chatSessions.map((session) => (
                <div
                  key={session.id}
                  className="glass-panel p-4 cursor-pointer hover:scale-[1.02] transition-all duration-300 group"
                  onClick={() => onSelectChat?.(session.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                        {session.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {session.preview}
                      </p>
                      <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {session.timestamp}
                        </div>
                        <span>{session.messageCount} mesaj</span>
                      </div>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteChatSession(session.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </div>
    </div>
  );
};