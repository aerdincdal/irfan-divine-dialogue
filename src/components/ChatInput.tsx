import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

export const ChatInput = ({ onSendMessage, disabled }: ChatInputProps) => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage("");
    }
  };

  return (
    <div className="sticky bottom-0 left-0 right-0 p-4 glass-panel border-t border-glass-border/50 safe-bottom flex-shrink-0">
      <form onSubmit={handleSubmit} className="flex gap-3 items-end">
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="İslami bir konu hakkında soru sorun..."
          className={cn(
            "glass-input resize-none min-h-[52px] max-h-32 text-foreground placeholder:text-muted-foreground border-glass-border/30 touch-manipulation",
            "focus:border-primary/50 focus:ring-primary/30"
          )}
          disabled={disabled}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
        />
        <Button
          type="submit"
          disabled={!message.trim() || disabled}
          className={cn(
            "glass-button px-4 py-3 h-[52px] shrink-0 touch-manipulation",
            "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          )}
        >
          <Send className="w-5 h-5" />
        </Button>
      </form>
    </div>
  );
};