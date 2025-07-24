import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";
import irfanLogo from "@/assets/irfan-logo.png";

interface AuthScreenProps {
  onSuccess: () => void;
}

export const AuthScreen = ({ onSuccess }: AuthScreenProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const { signIn, signUp, loading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;

    try {
      const { error } = isSignUp 
        ? await signUp(email, password)
        : await signIn(email, password);
      
      if (!error) {
        onSuccess();
      }
    } catch (error) {
      // Error handling is done in the auth hook
    }
  };

  return (
    <div className="fixed inset-0 bg-background flex flex-col mobile-vh safe-top safe-bottom">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-radial from-primary/30 via-transparent to-transparent"></div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 z-10">
        <div className="w-full max-w-sm space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="mx-auto w-20 h-20 mb-6">
              <img 
                src={irfanLogo}
                alt="İrfan"
                className="w-full h-full rounded-2xl shadow-glow pulse-glow"
              />
            </div>
            
            <div>
              <h1 className="text-2xl font-bold font-arabic text-primary glow-text">
                بسم الله الرحمن الرحيم
              </h1>
              <h2 className="text-xl font-semibold text-foreground mt-2">
                İrfan'a Giriş
              </h2>
              <p className="text-muted-foreground mt-2">
                {isSignUp ? 'Yeni hesap oluşturun' : 'Hesabınıza giriş yapın'}
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="email" className="text-sm font-medium text-glass-foreground">
                  E-posta Adresi
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="ornek@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="glass-input mt-2 h-12"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="password" className="text-sm font-medium text-glass-foreground">
                  Şifre
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="glass-input mt-2 h-12"
                  required
                  minLength={6}
                />
                {isSignUp && (
                  <p className="text-xs text-muted-foreground mt-1">
                    En az 6 karakter olmalıdır
                  </p>
                )}
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading || !email.trim() || !password.trim()}
              className="glass-button w-full h-12"
            >
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {isSignUp ? 'Hesap Oluştur' : 'Giriş Yap'}
            </Button>
          </form>

          <div className="text-center">
            <Button
              variant="ghost"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-sm text-muted-foreground hover:text-primary"
            >
              {isSignUp 
                ? 'Zaten hesabınız var mı? Giriş yapın' 
                : 'Hesabınız yok mu? Kayıt olun'
              }
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};