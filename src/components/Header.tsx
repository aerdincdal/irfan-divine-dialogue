import { Button } from "@/components/ui/button";
import { Menu, History } from "lucide-react";
import irfanLogo from "@/assets/irfan-logo.png";

interface HeaderProps {
  onOpenMenu?: () => void;
  onOpenHistory?: () => void;
}

export const Header = ({ onOpenMenu, onOpenHistory }: HeaderProps) => {
  return (
    <div className="sticky top-0 left-0 right-0 z-50 glass-panel border-b border-glass-border/50 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img 
            src={irfanLogo} 
            alt="İrfan" 
            className="w-8 h-8 rounded-lg shadow-glow"
          />
          <h1 className="text-xl font-bold glow-text">İrfan</h1>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onOpenHistory}
            className="text-foreground hover:text-primary hover:bg-glass-border/20 rounded-xl"
          >
            <History className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onOpenMenu}
            className="text-foreground hover:text-primary hover:bg-glass-border/20 rounded-xl"
          >
            <Menu className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};