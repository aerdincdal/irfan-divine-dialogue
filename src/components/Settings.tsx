import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  User, 
  Shield, 
  FileText, 
  LogOut, 
  ExternalLink,
  Trash2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import irfanLogo from "@/assets/irfan-logo.png";

interface SettingsProps {
  onBack: () => void;
  onLogout?: () => void;
  userProfile?: {
    email: string;
    display_name: string;
  };
}

export const Settings = ({ onBack, onLogout, userProfile }: SettingsProps) => {
  const [feedback, setFeedback] = useState('');
  const { toast } = useToast();


  const clearAllData = () => {
    localStorage.clear();
    toast({
      title: "Veriler Temizlendi",
      description: "Tüm uygulama verileri silindi."
    });
  };

  const submitFeedback = () => {
    if (!feedback.trim()) return;
    
    // Here you would normally send to your backend
    toast({
      title: "Geri Bildirim Gönderildi",
      description: "Değerli geri bildiriminiz için teşekkürler!"
    });
    setFeedback('');
  };

  const handleLogout = () => {
    onLogout?.();
  };

  return (
    <div className="fixed inset-0 bg-background flex flex-col">
      {/* Header */}
      <div className="glass-panel border-b border-glass-border/50 p-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="text-foreground hover:text-primary rounded-xl"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-3">
            <img 
              src={irfanLogo} 
              alt="İrfan" 
              className="w-8 h-8 rounded-lg shadow-glow"
            />
            <h1 className="text-xl font-semibold">Ayarlar</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          
          {/* Profile Section */}
          <div className="glass-panel p-6 space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <User className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold">Profil Bilgileri</h2>
            </div>
            
            <div className="space-y-3">
              <div>
                <Label htmlFor="email" className="text-sm font-medium text-muted-foreground">
                  E-posta Adresi
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={userProfile?.email || ''}
                  disabled
                  className="mt-1 bg-muted/20"
                />
              </div>
              <div>
                <Label htmlFor="display_name" className="text-sm font-medium text-muted-foreground">
                  Görünen Ad
                </Label>
                <Input
                  id="display_name"
                  type="text"
                  value={userProfile?.display_name || ''}
                  disabled
                  className="mt-1 bg-muted/20"
                />
              </div>
            </div>
          </div>


          {/* Feedback Section */}
          <div className="glass-panel p-6 space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold">Geri Bildirim</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="feedback" className="text-sm font-medium text-muted-foreground">
                  Görüş ve Önerileriniz
                </Label>
                <Textarea
                  id="feedback"
                  placeholder="İrfan hakkındaki görüşlerinizi bizimle paylaşın..."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  className="mt-1 min-h-[100px]"
                />
              </div>
              <Button
                onClick={submitFeedback}
                disabled={!feedback.trim()}
                className="glass-button w-full"
              >
                Geri Bildirim Gönder
              </Button>
            </div>
          </div>

          {/* Legal Links */}
          <div className="glass-panel p-6 space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold">Hukuki</h2>
            </div>
            
            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-between glass-panel border-glass-border/30"
                onClick={() => window.open('/privacy-policy', '_blank')}
              >
                Gizlilik Politikası
                <ExternalLink className="w-4 h-4" />
              </Button>
              
              <Button
                variant="outline"
                className="w-full justify-between glass-panel border-glass-border/30"
                onClick={() => window.open('/terms-of-service', '_blank')}
              >
                Kullanım Şartları
                <ExternalLink className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* App Info */}
          <div className="glass-panel p-6 space-y-4">
            <h2 className="text-lg font-semibold">Uygulama Bilgileri</h2>
            
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex justify-between">
                <span>Versiyon</span>
                <span>1.0.0</span>
              </div>
              <div className="flex justify-between">
                <span>Yapı</span>
                <span>2024.1</span>
              </div>
              <div className="flex justify-between">
                <span>Son Güncelleme</span>
                <span>23 Ocak 2025</span>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="glass-panel p-6 space-y-4 border-destructive/20">
            <h2 className="text-lg font-semibold text-destructive">Tehlikeli Bölge</h2>
            
            <div className="space-y-3">
              <Button
                variant="outline"
                onClick={clearAllData}
                className="w-full border-destructive/50 text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Tüm Verileri Sil
              </Button>
              
              <Separator className="bg-glass-border/30" />
              
              <Button
                variant="outline"
                onClick={handleLogout}
                className="w-full border-destructive/50 text-destructive hover:bg-destructive/10"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Çıkış Yap
              </Button>
            </div>
          </div>

          {/* Bottom Spacing */}
          <div className="h-8"></div>
        </div>
      </ScrollArea>
    </div>
  );
};