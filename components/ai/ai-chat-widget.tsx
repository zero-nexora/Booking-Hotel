"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { X, Send, Bot, Loader2, Sparkles, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { AIChatMessage } from "./ai-chat-message";
import { motion, AnimatePresence, Variants } from "framer-motion";

type Message = {
  id: string;
  role: "user" | "model";
  content: string;
  streaming?: boolean;
};

const SUGGESTIONS = [
  "Chính sách huỷ phòng và hoàn tiền như thế nào?",
  "Tôi có thể huỷ booking khi nào?",
  "Thanh toán thất bại thì phải làm sao?",
  "Booking đang PENDING là gì?",
  "Bao lâu thì nhận được tiền hoàn lại?",
  "Làm sao để xem lại booking của tôi?",
  "Sau khi check-out thì có thể đánh giá không?",
];

const panelVariants: Variants = {
  hidden: { opacity: 0, scale: 0.92, y: 12, originX: 1, originY: 1 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.25, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    scale: 0.92,
    y: 12,
    transition: { duration: 0.18, ease: "easeIn" },
  },
};

const messageVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: "easeOut" },
  },
};

const suggestionContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.06, delayChildren: 0.1 },
  },
};

const suggestionItemVariants: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.2, ease: "easeOut" },
  },
};

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
            "Xin chào! Tôi là Staywise Assistant \nTôi có thể tư vấn khách sạn, du lịch và giải đáp thắc mắc đặt phòng.\n\nHello! I can help with hotels, travel tips, and booking questions.",
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
      <motion.button
        onClick={() => setOpen((v) => !v)}
        aria-label="AI Assistant"
        className={cn(
          "fixed bottom-6 right-6 z-50 rounded-full shadow-lg",
          "flex items-center justify-center",
          "bg-primary text-primary-foreground hover:bg-primary/90",
        )}
        style={{ width: 52, height: 52 }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        transition={{ duration: 0.18 }}
        animate={{ rotate: open ? 90 : 0 }}
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.span
              key="close"
              initial={{ opacity: 0, rotate: -45 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 45 }}
              transition={{ duration: 0.15 }}
            >
              <X className="w-5 h-5" />
            </motion.span>
          ) : (
            <motion.span
              key="open"
              initial={{ opacity: 0, rotate: 45 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: -45 }}
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
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
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
                  {messages.length > 1 && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.18, ease: "easeOut" }}
                    >
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground hover:text-foreground hover:bg-muted"
                        onClick={reset}
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
              <AnimatePresence initial={false}>
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    variants={messageVariants}
                    initial="hidden"
                    animate="visible"
                    layout
                  >
                    <AIChatMessage message={msg} />
                  </motion.div>
                ))}
              </AnimatePresence>

              <AnimatePresence>
                {messages.length <= 1 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="pt-1 space-y-1.5"
                  >
                    <p className="text-xs text-muted-foreground px-1">
                      Gợi ý / Suggestions
                    </p>
                    <motion.div
                      className="flex flex-wrap gap-1.5"
                      variants={suggestionContainerVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      {SUGGESTIONS.map((s) => (
                        <motion.button
                          key={s}
                          variants={suggestionItemVariants}
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => send(s)}
                          className="text-xs px-2.5 py-1.5 rounded-full border border-border bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground text-left"
                        >
                          {s}
                        </motion.button>
                      ))}
                    </motion.div>
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
                  disabled={loading}
                  className="resize-none text-sm rounded-xl border-border bg-muted/30 text-foreground placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-primary py-2.5 leading-relaxed"
                  style={{ minHeight: 40, maxHeight: 112 }}
                />
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                >
                  <Button
                    size="icon"
                    className="shrink-0 h-9 w-9 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90"
                    disabled={!input.trim() || loading}
                    onClick={() => send(input)}
                  >
                    <AnimatePresence mode="wait">
                      {loading ? (
                        <motion.span
                          key="loading"
                          initial={{ opacity: 0, scale: 0.6 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.6 }}
                          transition={{ duration: 0.15 }}
                        >
                          <Loader2 className="w-4 h-4 animate-spin" />
                        </motion.span>
                      ) : (
                        <motion.span
                          key="send"
                          initial={{ opacity: 0, scale: 0.6 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.6 }}
                          transition={{ duration: 0.15 }}
                        >
                          <Send className="w-4 h-4" />
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </Button>
                </motion.div>
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
