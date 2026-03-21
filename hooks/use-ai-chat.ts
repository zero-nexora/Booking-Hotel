"use client";

import { useState, useCallback, useRef } from "react";

export type ChatMessage = {
  id: string;
  role: "user" | "model";
  content: string;
  streaming?: boolean;
};

export function useAIChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isStreaming) return;

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: content.trim(),
    };
    const modelMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: "model",
      content: "",
      streaming: true,
    };

    setMessages((prev) => [...prev, userMsg, modelMsg]);
    setIsStreaming(true);

    const history = [...messages, userMsg].map((m) => ({
      role: m.role,
      content: m.content,
    }));

    abortRef.current = new AbortController();

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
        signal: abortRef.current.signal,
      });

      if (!res.ok || !res.body) {
        const errText = await res.text();
        setMessages((prev) =>
          prev.map((m) =>
            m.id === modelMsg.id
              ? { ...m, content: errText || "Đã xảy ra lỗi.", streaming: false }
              : m,
          ),
        );
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        setMessages((prev) =>
          prev.map((m) =>
            m.id === modelMsg.id ? { ...m, content: m.content + chunk } : m,
          ),
        );
      }

      setMessages((prev) =>
        prev.map((m) =>
          m.id === modelMsg.id ? { ...m, streaming: false } : m,
        ),
      );
    } catch (err: any) {
      if (err?.name === "AbortError") return;
      setMessages((prev) =>
        prev.map((m) =>
          m.id === modelMsg.id
            ? { ...m, content: "Kết nối bị gián đoạn.", streaming: false }
            : m,
        ),
      );
    } finally {
      setIsStreaming(false);
      abortRef.current = null;
    }
  }, [messages, isStreaming]);

  const stop = useCallback(() => {
    abortRef.current?.abort();
    setIsStreaming(false);
    setMessages((prev) =>
      prev.map((m) => (m.streaming ? { ...m, streaming: false } : m)),
    );
  }, []);

  const clear = useCallback(() => {
    abortRef.current?.abort();
    setMessages([]);
    setIsStreaming(false);
  }, []);

  return { messages, isStreaming, sendMessage, stop, clear };
}