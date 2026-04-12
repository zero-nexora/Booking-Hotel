"use client";

import { useEffect, useState } from "react";
import { Bot, User } from "lucide-react";
import { cn } from "@/lib/utils";

type ChatMessage = {
  id: string;
  role: "user" | "model";
  content: string;
  streaming?: boolean;
};

interface AIChatMessageProps {
  message: ChatMessage;
}

const renderMarkdown = (text: string): string =>
  text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(
      /`(.*?)`/g,
      '<code class="bg-background px-1 py-0.5 rounded text-[11px] font-mono border border-border">$1</code>',
    )
    .replace(/^- (.+)$/gm, '<li class="ml-3 list-disc">$1</li>')
    .replace(/(<li.*<\/li>)/g, '<ul class="space-y-0.5 my-1">$1</ul>')
    .replace(/\n\n/g, '<div class="h-2"></div>')
    .replace(/\n/g, "<br />");

const StreamingText = ({
  content,
  streaming,
}: {
  content: string;
  streaming?: boolean;
}) => {
  const [committed, setCommitted] = useState("");
  const [prevLength, setPrevLength] = useState(0);

  const newChunk = content.slice(prevLength);

  useEffect(() => {
    setCommitted(content);
    setPrevLength(content.length);
  }, [content]);

  return (
    <div>
      <span dangerouslySetInnerHTML={{ __html: renderMarkdown(committed) }} />
      {newChunk && (
        <span
          key={prevLength}
          className="animate-token-in"
          dangerouslySetInnerHTML={{ __html: renderMarkdown(newChunk) }}
        />
      )}
      {streaming &&
        (content.length === 0 ? (
          <span className="inline-flex gap-0.5 ml-0.5 align-middle">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="w-1 h-1 rounded-full bg-current opacity-60 animate-bounce"
                style={{ animationDelay: `${i * 150}ms` }}
              />
            ))}
          </span>
        ) : (
          <span className="inline-block w-0.5 h-3.25 bg-current align-middle ml-px animate-caret" />
        ))}
    </div>
  );
};

export const AIChatMessage = ({ message }: AIChatMessageProps) => {
  const isUser = message.role === "user";

  return (
    <div className={cn("flex gap-2 items-start", isUser && "flex-row-reverse")}>
      <div
        className={cn(
          "w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5",
          isUser ? "bg-primary/10" : "bg-muted border border-border",
        )}
      >
        {isUser ? (
          <User className="w-3 h-3 text-primary" />
        ) : (
          <Bot className="w-3 h-3 text-muted-foreground" />
        )}
      </div>

      <div
        className={cn(
          "max-w-[80%] rounded-2xl px-3 py-2 text-xs leading-relaxed",
          isUser
            ? "bg-primary text-primary-foreground rounded-tr-sm"
            : "bg-muted text-foreground rounded-tl-sm",
        )}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap">{message.content}</p>
        ) : (
          <StreamingText
            content={message.content}
            streaming={message.streaming}
          />
        )}
      </div>
    </div>
  );
};
