"use client";

import { useEffect, useRef, useState } from "react";
import { X, Send, Bot, Loader2, Sparkles, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { AIChatMessage } from "./ai-chat-message";
import { useAIChat } from "@/hooks/use-ai-chat";
import { AnimatePresence, motion } from "framer-motion";

const SUGGESTIONS = [
  "Chính sách huỷ phòng và hoàn tiền như thế nào?",
  "Tôi có thể huỷ booking khi nào?",
  "Thanh toán thất bại thì phải làm sao?",
  "Booking đang PENDING là gì?",
  "Bao lâu thì nhận được tiền hoàn lại?",
  "Làm sao để xem lại booking của tôi?",
  "Sau khi check-out thì có thể đánh giá không?",
];

const WELCOME: import("@/hooks/use-ai-chat").ChatMessage = {
  id: "welcome",
  role: "model",
  content:
    "Xin chào! Tôi là Staywise Assistant\nTôi có thể tư vấn khách sạn, du lịch và giải đáp thắc mắc đặt phòng.\n\nHello! I can help with hotels, travel tips, and booking questions.",
};

export const AIChatWidget = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const { messages, isStreaming, sendMessage, clear } = useAIChat();
  const bottomRef = useRef<HTMLDivElement>(null);

  const allMessages = messages.length === 0 ? [WELCOME] : messages;
  const showSuggestions = messages.length === 0;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim() || isStreaming) return;
    sendMessage(input);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSuggestion = (s: string) => {
    sendMessage(s);
  };

  return (
    <>
      <motion.button
        onClick={() => setOpen((v) => !v)}
        aria-label="AI Assistant"
        className={cn(
          "fixed bottom-6 right-6 z-50 rounded-full shadow-lg",
          "flex items-center justify-center",
          "bg-primary text-primary-foreground hover:bg-primary/90",
        )}
        style={{ width: 52, height: 52 }}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.span
              key="close"
              initial={{ opacity: 0, rotate: -45, scale: 0.7 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: 45, scale: 0.7 }}
              transition={{ duration: 0.15 }}
            >
              <X className="w-5 h-5" />
            </motion.span>
          ) : (
            <motion.span
              key="open"
              initial={{ opacity: 0, rotate: 45, scale: 0.7 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: -45, scale: 0.7 }}
              transition={{ duration: 0.15 }}
            >
              <Sparkles className="w-5 h-5" />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={cn(
              "fixed bottom-24 right-6 z-50 w-90 max-w-[calc(100vw-2rem)]",
              "rounded-2xl border border-border bg-background shadow-2xl",
              "flex flex-col origin-bottom-right",
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
                <AnimatePresence>
                  {messages.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.15 }}
                    >
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground hover:text-foreground hover:bg-muted"
                        onClick={clear}
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
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
              {allMessages.map((msg, i) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: i === 0 ? 0 : 0 }}
                >
                  <AIChatMessage message={msg} />
                </motion.div>
              ))}

              <AnimatePresence>
                {showSuggestions && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2, delay: 0.1 }}
                    className="pt-1 space-y-1.5"
                  >
                    <p className="text-xs text-muted-foreground px-1">
                      Gợi ý / Suggestions
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {SUGGESTIONS.map((s, i) => (
                        <motion.button
                          key={s}
                          initial={{ opacity: 0, scale: 0.92 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{
                            duration: 0.18,
                            delay: 0.12 + i * 0.05,
                          }}
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => handleSuggestion(s)}
                          className="text-xs px-2.5 py-1.5 rounded-full border border-border bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground text-left"
                        >
                          {s}
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

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
                  disabled={isStreaming}
                  className="resize-none text-sm rounded-xl border-border bg-muted/30 text-foreground placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-primary py-2.5 leading-relaxed"
                  style={{ minHeight: 40, maxHeight: 112 }}
                />
                <Button
                  size="icon"
                  className="shrink-0 h-9 w-9 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90"
                  disabled={!input.trim() || isStreaming}
                  onClick={handleSend}
                >
                  <AnimatePresence mode="wait">
                    {isStreaming ? (
                      <motion.span
                        key="loading"
                        initial={{ opacity: 0, scale: 0.6 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.6 }}
                        transition={{ duration: 0.12 }}
                      >
                        <Loader2 className="w-4 h-4 animate-spin" />
                      </motion.span>
                    ) : (
                      <motion.span
                        key="send"
                        initial={{ opacity: 0, scale: 0.6 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.6 }}
                        transition={{ duration: 0.12 }}
                      >
                        <Send className="w-4 h-4" />
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Button>
              </div>
              <p className="text-[10px] text-muted-foreground/50 text-center mt-1.5">
                Enter to send · Shift+Enter for new line
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
