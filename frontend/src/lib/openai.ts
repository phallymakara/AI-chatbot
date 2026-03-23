/**
 * Represents a document source used as context for the AI response.
 */
export interface Source {
  title: string;
  link: string;
  snippet: string;
  source?: string;
  favicon?: string;
}

/**
 * Structure of a single message in a chat conversation.
 */
export interface Message {
  role: "system" | "user" | "assistant";
  content: string;
  sources?: Source[];
}

/**
 * Metadata structure returned at the end of an LLM stream.
 */
interface StreamMeta {
  sources?: Array<{
    document: string;
    page: number;
  }>;
  documents_used?: number;
}

const API_URL = import.meta.env.VITE_LLM_API_URL;

/**
 * Sends a chat message to the LLM API and handles the streaming response.
 *
 * @param messages - The history of messages in the conversation.
 * @param onToken - Callback function triggered for each new text chunk received.
 * @param onSources - Callback function triggered when document sources are identified.
 * @param accessToken - Optional authentication token for the API.
 * @returns A promise that resolves when the stream is fully consumed.
 */
export async function askLLMStream(
  messages: Message[],
  onToken: (text: string) => void,
  onSources?: (sources: Source[]) => void,
  accessToken?: string,
): Promise<void> {
  const lastUserMessage = messages[messages.length - 1]?.content;

  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
    },
    body: JSON.stringify({
      question: lastUserMessage,
    }),
  });

  if (!res.ok) {
    throw new Error("LLM API request failed");
  }

  if (!res.body) {
    throw new Error("Response body is empty");
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();

  let accumulatedText = "";
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();

    if (done) break;

    const chunk = decoder.decode(value, { stream: true });

    buffer += chunk;

    /**
     * Detect metadata marker from backend
     */
    if (buffer.includes("__META__")) {
      const [textPart, metaPart] = buffer.split("__META__");

      // textPart now contains the COMPLETE text before the marker.
      // We set accumulatedText to it directly instead of appending.
      accumulatedText = textPart;

      onToken(accumulatedText);

      try {
        const meta: StreamMeta = JSON.parse(metaPart);

        if (onSources && meta.sources) {
          const sources: Source[] = meta.sources.map((s) => ({
            title: `Page ${s.page}`,
            link: s.document,
            snippet: `Source document page ${s.page}`,
            source: s.document.split("/").pop() || "Document",
          }));

          onSources(sources);
        }
      } catch (err) {
        console.error("Failed to parse metadata:", err);
      }

      break;
    }

    accumulatedText += chunk;

    onToken(accumulatedText);
  }
}
