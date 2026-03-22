import { useState, useRef, useEffect } from "react";
import { useChatStore } from "@/lib/store";
import { askLLMStream, type Message } from "@/lib/openai";

export function useChat() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    activeConversationId,
    getActiveConversation,
    addMessage,
    updateLastMessage,
    updateConversationTitle,
  } = useChatStore();

  const activeConversation = getActiveConversation();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeConversation?.messages]);

  const generateResponse = async (
    convId: string,
    history: Message[],
    userMsg: Message,
  ) => {
    try {
      // ======================
      // SYSTEM MESSAGE
      // ======================
      const systemMessage: Message = {
        role: "system",
        content: "You are a helpful HR assistant.",
      };

      // ======================
      // MESSAGE HISTORY
      // ======================
      const allMessages: Message[] = [systemMessage, ...history, userMsg];

      // ======================
      // PLACEHOLDER MESSAGE
      // ======================
      const assistantMessage: Message = {
        role: "assistant",
        content: "",
      };

      addMessage(convId, assistantMessage);

      // ======================
      // TOKEN BYPASS FOR TESTING
      // ======================
      const token = "mock-token";

      // ======================
      // STREAM RESPONSE
      // ======================
      let streamedText = "";

      await askLLMStream(
        allMessages,
        (text) => {
          streamedText = text;
          updateLastMessage(convId, streamedText);
        },
        (sources) => {
          updateLastMessage(convId, { sources });
        },
        token,
      );
    } catch (err) {
      console.error("Chat error:", err);
      setError(err instanceof Error ? err.message : "Failed to send message");
      updateLastMessage(convId, "Failed to generate response.");
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async (content: string) => {
    if (!content.trim() || !activeConversationId || isLoading) return;

    setError(null);
    setIsLoading(true);

    const trimmed = content.trim();

    const userMessage: Message = {
      role: "user",
      content: trimmed,
    };

    addMessage(activeConversationId, userMessage);

    // Set conversation title on first message
    if (activeConversation?.messages.length === 0) {
      const title = trimmed.slice(0, 50) + (trimmed.length > 50 ? "..." : "");
      updateConversationTitle(activeConversationId, title);
    }

    await generateResponse(
      activeConversationId,
      activeConversation?.messages || [],
      userMessage,
    );
  };

  const editAndRegenerate = async (index: number, content: string) => {
    if (!content.trim() || !activeConversationId || isLoading) return;

    setError(null);
    setIsLoading(true);

    const { editMessage } = useChatStore.getState();
    editMessage(activeConversationId, index, content.trim());

    const updatedConv = useChatStore.getState().getActiveConversation();
    if (!updatedConv) return;

    const history = updatedConv.messages.slice(0, index);
    const userMsg = updatedConv.messages[index];

    await generateResponse(activeConversationId, history, userMsg);
  };

  return {
    messages: activeConversation?.messages || [],
    isLoading,
    error,
    sendMessage,
    editAndRegenerate,
    messagesEndRef,
  };
}
