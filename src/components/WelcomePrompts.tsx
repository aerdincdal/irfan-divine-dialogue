import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface WelcomePromptsProps {
  onSelectPrompt: (prompt: string) => void;
}

const prompts = [
  {
    title: "Fatiha Suresi",
    subtitle: "Tefsiri ve anlamını öğren",
    prompt: "Bana Fatiha Suresi'nin tefsirini ve derinliklerini anlatır mısın?"
  },
  {
    title: "Sabah Duaları",
    subtitle: "Güne başlamak için",
    prompt: "Sabah okunacak duaları ve faziletlerini öğrenmek istiyorum"
  },
  {
    title: "Hadis Bilgisi",
    subtitle: "Sahih hadisler hakkında",
    prompt: "Güzel ahlak ile ilgili sahih hadisler nelerdir?"
  },
  {
    title: "Namaz Rehberi",
    subtitle: "Doğru ibadet için",
    prompt: "Namazın rükünleri ve sünnetleri hakkında bilgi ver"
  }
];

export const WelcomePrompts = ({ onSelectPrompt }: WelcomePromptsProps) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold glow-text">
          İrfan'a Hoş Geldiniz
        </h1>
        <p className="text-muted-foreground text-lg max-w-md">
          İslami bilgiler için yapay zeka destekli rehberiniz
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
        {prompts.map((prompt, index) => (
          <Button
            key={index}
            variant="outline"
            className={cn(
              "glass-panel h-auto p-6 text-left justify-start group",
              "hover:scale-105 transition-all duration-300",
              "border-glass-border/30 hover:border-primary/50"
            )}
            onClick={() => onSelectPrompt(prompt.prompt)}
          >
            <div className="space-y-2">
              <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                {prompt.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {prompt.subtitle}
              </p>
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
};