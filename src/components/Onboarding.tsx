import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft } from "lucide-react";
import irfanLogo from "@/assets/irfan-logo.png";
import islamicPattern from "@/assets/islamic-pattern.png";
import mosqueSilhouette from "@/assets/mosque-silhouette.png";

interface OnboardingProps {
  onComplete: () => void;
}

const slides = [
  {
    id: 1,
    title: "İrfan'a Hoş Geldiniz",
    titleArabic: "أهلاً وسهلاً بكم في إرفان",
    subtitle: "Maneviyat yolculuğunuzda size özel bir rehber",
    description: "İslami bilgilere modern ve akıcı bir şekilde ulaşın",
    image: irfanLogo,
    bgClass: "bg-gradient-radial from-primary/20 via-transparent to-transparent"
  },
  {
    id: 2,
    title: "Keşfet ve Öğren",
    titleArabic: "اكتشف وتعلم",
    subtitle: "Ayetleri sorgulayın, hadisleri öğrenin",
    description: "Tefsirlerin derinliklerine inin ve İslami ilimleri keşfedin",
    image: islamicPattern,
    bgClass: "bg-gradient-to-br from-accent/10 via-transparent to-primary/10"
  },
  {
    id: 3,
    title: "Gizli İlimler Hazinesi",
    titleArabic: "كنز العلوم الخفية",
    subtitle: "Hayatınızdaki anlara özel dualar",
    description: "Manevi rehberlik ve özel durumlar için dua hazinesi",
    image: mosqueSilhouette,
    bgClass: "bg-gradient-to-tr from-primary/15 via-accent/5 to-transparent"
  },
  {
    id: 4,
    title: "Hemen Başlayın",
    titleArabic: "ابدأ الآن",
    subtitle: "İslami bilgiler için sorularınızı sorun",
    description: "Yapay zeka destekli rehberinizle sohbete başlayın",
    image: irfanLogo,
    bgClass: "bg-gradient-radial from-primary/25 via-accent/10 to-transparent"
  }
];

export const Onboarding = ({ onComplete }: OnboardingProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      onComplete();
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const slide = slides[currentSlide];

  return (
    <div className="fixed inset-0 bg-background flex flex-col overflow-hidden">
      {/* Background Pattern */}
      <div className={`absolute inset-0 ${slide.bgClass} transition-all duration-700`}>
        <div className="absolute inset-0 opacity-5">
          <div className="w-full h-full bg-repeat" 
               style={{backgroundImage: `url(${islamicPattern})`}}></div>
        </div>
      </div>

      {/* Skip Button */}
      <div className="absolute top-8 right-6 z-10">
        <Button 
          variant="ghost" 
          onClick={onComplete}
          className="text-muted-foreground hover:text-foreground"
        >
          Geç
        </Button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 z-10">
        <div className="w-full max-w-sm text-center space-y-8">
          {/* Image */}
          <div className="relative mx-auto mb-8">
            <div className="w-32 h-32 mx-auto animate-fade-in">
              <img 
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-contain pulse-glow"
              />
            </div>
          </div>

          {/* Arabic Title */}
          <div className="animate-fade-in" style={{animationDelay: '0.3s'}}>
            <h1 className="text-2xl font-bold font-arabic text-primary glow-text mb-2">
              {slide.titleArabic}
            </h1>
            <h2 className="text-xl font-semibold text-foreground">
              {slide.title}
            </h2>
          </div>

          {/* Content */}
          <div className="space-y-4 animate-fade-in" style={{animationDelay: '0.6s'}}>
            <p className="text-lg font-medium text-primary">
              {slide.subtitle}
            </p>
            <p className="text-muted-foreground leading-relaxed">
              {slide.description}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="p-6 z-10">
        {/* Progress Indicators */}
        <div className="flex justify-center mb-6 space-x-2">
          {slides.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentSlide 
                  ? 'w-8 bg-primary shadow-glow' 
                  : 'bg-muted-foreground/30'
              }`}
            />
          ))}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center">
          <Button
            variant="ghost"
            onClick={prevSlide}
            disabled={currentSlide === 0}
            className="opacity-0 pointer-events-none data-[visible=true]:opacity-100 data-[visible=true]:pointer-events-auto transition-opacity"
            data-visible={currentSlide > 0}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Geri
          </Button>

          <Button
            onClick={nextSlide}
            className="glass-button px-8"
          >
            {currentSlide === slides.length - 1 ? 'Başla' : 'İleri'}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};