import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface Message {
  role: "user" | "assistant";
  content: string;
}

export function useAIChat(type: "general" | "inventory" | "sales" | "forecast" = "general") {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(
    async (userMessage: string) => {
      if (!userMessage.trim()) return;

      const newUserMessage: Message = { role: "user", content: userMessage };
      setMessages((prev) => [...prev, newUserMessage]);
      setIsLoading(true);
      setError(null);

      try {
        const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-chat`;
        
        const response = await fetch(CHAT_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            messages: [...messages, newUserMessage],
            type,
          }),
        });

        if (!response.ok) {
          if (response.status === 429) {
            throw new Error("Rate limit exceeded. Please wait a moment and try again.");
          }
          if (response.status === 402) {
            throw new Error("AI credits exhausted. Please add credits to continue.");
          }
          throw new Error("Failed to get AI response");
        }

        if (!response.body) {
          throw new Error("No response body");
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let assistantMessage = "";
        let buffer = "";

        setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          
          let newlineIndex: number;
          while ((newlineIndex = buffer.indexOf("\n")) !== -1) {
            let line = buffer.slice(0, newlineIndex);
            buffer = buffer.slice(newlineIndex + 1);

            if (line.endsWith("\r")) line = line.slice(0, -1);
            if (line.startsWith(":") || line.trim() === "") continue;
            if (!line.startsWith("data: ")) continue;

            const jsonStr = line.slice(6).trim();
            if (jsonStr === "[DONE]") break;

            try {
              const parsed = JSON.parse(jsonStr);
              const content = parsed.choices?.[0]?.delta?.content;
              if (content) {
                assistantMessage += content;
                setMessages((prev) => {
                  const updated = [...prev];
                  updated[updated.length - 1] = { role: "assistant", content: assistantMessage };
                  return updated;
                });
              }
            } catch (e) {
              console.warn("Failed to parse SSE chunk:", e);
            }
          }
        }
      } catch (err) {
        console.error("AI chat error:", err);
        const errorMessage = err instanceof Error ? err.message : "Failed to send message";
        setError(errorMessage);
        setMessages((prev) => prev.slice(0, -1)); // Remove loading message
      } finally {
        setIsLoading(false);
      }
    },
    [messages, type]
  );

  const clearChat = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return { messages, isLoading, error, sendMessage, clearChat };
}
