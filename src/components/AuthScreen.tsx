import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import irfanLogo from "@/assets/irfan-logo.png";

interface AuthScreenProps {
  onSuccess: () => void;
}

export const AuthScreen = ({ onSuccess }: AuthScreenProps) => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [otp, setOtp] = useState("");
  const { toast } = useToast();

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    
    // Simulate email verification
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast({
      title: "Doğrulama Kodu Gönderildi",
      description: `${email} adresine 6 haneli kod gönderildi.`
    });
    
    setIsLoading(false);
    setStep('otp');
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) return;

    setIsLoading(true);
    
    // Simulate OTP verification
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (otp === "123456") {
      toast({
        title: "Giriş Başarılı",
        description: "İrfan'a hoş geldiniz!"
      });
      onSuccess();
    } else {
      toast({
        title: "Hatalı Kod",
        description: "Doğrulama kodu yanlış. Tekrar deneyin.",
        variant: "destructive"
      });
    }
    
    setIsLoading(false);
  };

  const handleGoogleAuth = async () => {
    setIsLoading(true);
    
    // Simulate Google auth
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast({
      title: "Google ile Giriş",
      description: "Başarıyla giriş yapıldı!"
    });
    
    onSuccess();
  };

  return (
    <div className="fixed inset-0 bg-background flex flex-col">
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
                بسم الله
              </h1>
              <h2 className="text-xl font-semibold text-foreground mt-2">
                İrfan'a Giriş
              </h2>
              <p className="text-muted-foreground mt-2">
                {step === 'email' 
                  ? 'E-posta adresinizi girin' 
                  : 'Doğrulama kodunu girin'
                }
              </p>
            </div>
          </div>

          {/* Form */}
          {step === 'email' ? (
            <form onSubmit={handleEmailSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="E-posta adresiniz"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="glass-input pl-10 h-12"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={!email || isLoading}
                className="glass-button w-full h-12"
              >
                {isLoading ? 'Gönderiliyor...' : 'Kod Gönder'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-glass-border/30" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">veya</span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={handleGoogleAuth}
                disabled={isLoading}
                className="w-full h-12 glass-panel border-glass-border/30"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google ile Giriş
              </Button>
            </form>
          ) : (
            <form onSubmit={handleOtpSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-4">
                    <strong>{email}</strong> adresine gönderilen 6 haneli kodu girin
                  </p>
                </div>
                
                <Input
                  type="text"
                  placeholder="000000"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="glass-input h-12 text-center text-xl tracking-widest"
                  maxLength={6}
                />
                
                <p className="text-xs text-muted-foreground text-center">
                  Demo için: <span className="text-primary font-mono">123456</span>
                </p>
              </div>

              <div className="space-y-3">
                <Button
                  type="submit"
                  disabled={otp.length !== 6 || isLoading}
                  className="glass-button w-full h-12"
                >
                  {isLoading ? 'Doğrulanıyor...' : 'Giriş Yap'}
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setStep('email');
                    setOtp('');
                  }}
                  className="w-full"
                >
                  E-posta değiştir
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};