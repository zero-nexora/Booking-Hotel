"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { X, Send, Bot, Loader2, Sparkles, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { AIChatMessage } from "./ai-chat-message";

type Message = {
  id: string;
  role: "user" | "model";
  content: string;
  streaming?: boolean;
};

const SUGGESTIONS = [
  "Tư vấn khách sạn 5 sao Đà Nẵng",
  "Chính sách huỷ phòng như thế nào?",
  "Tips when checking in at a hotel",
  "Best time to visit Ha Long Bay?",
];

export const AIChatWidget = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([
        {
          id: "welcome",
          role: "model",
          content:
            "Xin chào! Tôi là Staywise Assistant 🏨\nTôi có thể tư vấn khách sạn, du lịch và giải đáp thắc mắc đặt phòng.\n\nHello! I can help with hotels, travel tips, and booking questions.",
        },
      ]);
    }
  }, [open]);

  const send = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || loading) return;

      const userMsg: Message = {
        id: `u-${Date.now()}`,
        role: "user",
        content: trimmed,
      };
      const aiMsgId = `a-${Date.now()}`;

      setMessages((prev) => [
        ...prev,
        userMsg,
        { id: aiMsgId, role: "model", content: "", streaming: true },
      ]);
      setInput("");
      setLoading(true);

      const payload = [...messages, userMsg].map((m) => ({
        role: m.role,
        content: m.content,
      }));

      abortRef.current = new AbortController();

      try {
        const res = await fetch("/api/ai/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: payload }),
          signal: abortRef.current.signal,
        });

        if (!res.ok || !res.body) throw new Error("Failed");

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let acc = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          acc += decoder.decode(value, { stream: true });
          const snap = acc;
          setMessages((prev) =>
            prev.map((m) => (m.id === aiMsgId ? { ...m, content: snap } : m)),
          );
        }

        setMessages((prev) =>
          prev.map((m) => (m.id === aiMsgId ? { ...m, streaming: false } : m)),
        );
      } catch (err: unknown) {
        if (err instanceof Error && err.name === "AbortError") return;
        setMessages((prev) =>
          prev.map((m) =>
            m.id === aiMsgId
              ? {
                  ...m,
                  content: "Đã có lỗi xảy ra. / Something went wrong.",
                  streaming: false,
                }
              : m,
          ),
        );
      } finally {
        setLoading(false);
      }
    },
    [messages, loading],
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send(input);
    }
  };

  const reset = () => {
    abortRef.current?.abort();
    setMessages([]);
    setLoading(false);
  };

  return (
    <>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="AI Assistant"
        className={cn(
          "fixed bottom-6 right-6 z-50 w-13 h-13 rounded-full shadow-lg",
          "flex items-center justify-center",
          "bg-primary text-primary-foreground hover:bg-primary/90",
          open && "rotate-90",
        )}
        style={{ width: 52, height: 52 }}
      >
        {open ? <X className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
      </button>

      <div
        className={cn(
          "fixed bottom-24 right-6 z-50 w-90 max-w-[calc(100vw-2rem)]",
          "rounded-2xl border border-border bg-background shadow-2xl",
          "flex flex-col origin-bottom-right",
          open
            ? "opacity-100 scale-100 pointer-events-auto"
            : "opacity-0 scale-95 pointer-events-none",
        )}
        style={{ height: 520 }}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-border shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
              <Bot className="w-3.5 h-3.5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold leading-none text-foreground">
                Staywise AI
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Travel assistant
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {messages.length > 1 && (
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-muted-foreground hover:text-foreground hover:bg-muted"
                onClick={reset}
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-muted-foreground hover:text-foreground hover:bg-muted"
              onClick={() => setOpen(false)}
            >
              <X className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3 min-h-0">
          {messages.map((msg) => (
            <AIChatMessage key={msg.id} message={msg} />
          ))}

          {messages.length <= 1 && (
            <div className="pt-1 space-y-1.5">
              <p className="text-xs text-muted-foreground px-1">
                Gợi ý / Suggestions
              </p>
              <div className="flex flex-wrap gap-1.5">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="text-xs px-2.5 py-1.5 rounded-full border border-border bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground text-left"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        <div className="px-3 py-3 border-t border-border shrink-0">
          <div className="flex items-end gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Hỏi bất cứ điều gì... / Ask anything..."
              rows={1}
              disabled={loading}
              className="resize-none text-sm rounded-xl border-border bg-muted/30 text-foreground placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-primary py-2.5 leading-relaxed"
              style={{ minHeight: 40, maxHeight: 112 }}
            />
            <Button
              size="icon"
              className="shrink-0 h-9 w-9 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90"
              disabled={!input.trim() || loading}
              onClick={() => send(input)}
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
          <p className="text-[10px] text-muted-foreground/50 text-center mt-1.5">
            Enter to send · Shift+Enter for new line
          </p>
        </div>
      </div>
    </>
  );
};
