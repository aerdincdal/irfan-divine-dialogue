import { cn } from "@/lib/utils";

interface ChatBubbleProps {
  message: string;
  type: 'user' | 'ai';
  timestamp?: string;
}

export const ChatBubble = ({ message, type, timestamp }: ChatBubbleProps) => {
  return (
    <div className={cn(
      "flex w-full mb-4",
      type === 'user' ? "justify-end" : "justify-start"
    )}>
      <div className="flex flex-col gap-1">
        <div className={cn(
          "animate-fade-in",
          type === 'user' ? "chat-bubble-user" : "chat-bubble-ai"
        )}>
          <p className="text-sm leading-relaxed whitespace-pre-wrap">
            {message}
          </p>
        </div>
        {timestamp && (
          <span className="text-xs text-muted-foreground px-2">
            {timestamp}
          </span>
        )}
      </div>
    </div>
  );
};