import { useEffect, useState } from "react";
import irfanLogo from "@/assets/irfan-logo.png";
import bismillahCalligraphy from "@/assets/bismillah-calligraphy.png";

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  const [showBismillah, setShowBismillah] = useState(false);
  const [showLogo, setShowLogo] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => setShowBismillah(true), 500);
    const timer2 = setTimeout(() => setShowLogo(true), 1500);
    const timer3 = setTimeout(() => onComplete(), 3500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-background flex flex-col items-center justify-center overflow-hidden">
      {/* Subtle geometric background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-radial from-primary/20 via-transparent to-transparent"></div>
      </div>

      <div className="flex flex-col items-center space-y-8 z-10">
        {/* Bismillah Calligraphy */}
        <div className={`transition-all duration-1000 transform ${
          showBismillah 
            ? 'opacity-100 translate-y-0 scale-100' 
            : 'opacity-0 translate-y-10 scale-95'
        }`}>
          <img 
            src={bismillahCalligraphy}
            alt="Bismillah"
            className="w-64 h-32 object-contain pulse-glow"
          />
        </div>

        {/* App Logo and Name */}
        <div className={`transition-all duration-1000 delay-500 transform ${
          showLogo 
            ? 'opacity-100 translate-y-0 scale-100' 
            : 'opacity-0 translate-y-10 scale-95'
        }`}>
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <img 
                src={irfanLogo}
                alt="İrfan"
                className="w-16 h-16 rounded-2xl shadow-glow"
              />
              <div className="absolute inset-0 rounded-2xl animate-glow-pulse"></div>
            </div>
            <div className="text-center">
              <h1 className="text-2xl font-bold glow-text font-arabic">إرفان</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Yapay Zeka İslami Rehberiniz
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Loading indicator */}
      <div className="absolute bottom-20 flex items-center space-x-2">
        <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
      </div>
    </div>
  );
};