import { useState } from "react";
import type { Message } from "@/lib/openai";
import ReactMarkdown from "react-markdown";
import type { ComponentPropsWithoutRef } from "react";
import { SourceCarousel } from "./SourceCarousel";
import { ThinkingIndicator } from "./ThinkingIndicator";
import { FiCopy, FiShare2, FiCheck, FiEdit3, FiX } from "react-icons/fi";
import { ProsethLogo } from "./ProsethLogo";
import { Textarea } from "./ui/textarea";
import { CodeBlock } from "./CodeBlock";

interface ChatMessageProps {
  message: Message;
  index: number;
  isFirst?: boolean;
  onRelatedSelect?: (question: string) => void;
  onEdit?: (index: number, newContent: string) => void;
}

export function ChatMessage({
  message,
  index,
  onEdit,
}: ChatMessageProps) {
  const isUser = message.role === "user";
  const isSystem = message.role === "system";
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(message.content || "");

  if (isSystem) return null;

  const handleCopy = async () => {
    if (message.content) {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShare = async () => {
    if (navigator.share && message.content) {
      try {
        await navigator.share({
          title: "Proseth Answer",
          text: message.content,
        });
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      handleCopy();
    }
  };

  const handleSaveEdit = () => {
    if (editContent.trim() && editContent !== message.content && onEdit) {
      onEdit(index, editContent);
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditContent(message.content || "");
    setIsEditing(false);
  };

  // User message: Display as right-aligned bubble
  if (isUser) {
    return (
      <div className="w-full pt-6 pb-2 px-4 md:px-0 group">
        <div className="max-w-3xl mx-auto flex flex-col items-end gap-2">
          {isEditing ?
            <div className="w-full max-w-[80%] flex flex-col gap-2">
              <Textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full bg-card border-border/50 rounded-xl p-3 text-sm focus-visible:ring-primary/30"
                rows={3}
                autoFocus
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={handleCancelEdit}
                  className="px-3 py-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
                  <FiX className="w-3 h-3" />
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="px-4 py-1 text-xs font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                  Save & Regenerate
                </button>
              </div>
            </div>
          : <>
              <div className="flex items-center gap-2 max-w-full">
                <button
                  onClick={() => setIsEditing(true)}
                  className="opacity-0 group-hover:opacity-100 p-1.5 text-muted-foreground hover:text-foreground bg-muted/30 hover:bg-muted rounded-md transition-all duration-200 shrink-0"
                  title="Edit message">
                  <FiEdit3 className="w-3.5 h-3.5" />
                </button>
                <div className="bg-primary text-primary-foreground px-4 py-3 rounded-2xl rounded-br-md shadow-sm overflow-hidden break-words">
                  <p className="text-sm md:text-base leading-relaxed">
                    {message.content}
                  </p>
                </div>
              </div>
            </>}
        </div>
      </div>
    );
  }

  // Assistant message: Structured answer with sources
  const formattedContent = (message.content || "").replace(
    /\[(\d+)\]/g,
    "[$1](#source-$1)",
  );

  return (
    <div className="w-full px-4 md:px-0 pb-8 overflow-hidden">
      <div className="max-w-3xl mx-auto">
        {/* Answer Section - Clean, flat, no bubbles */}
        <div className="mt-6">
          <div className="flex items-center gap-2 mb-4">
            <ProsethLogo size="sm" />
            <span className="text-sm font-medium text-muted-foreground">
              Answer
            </span>
          </div>

          {message.content ?
            <>
              <div className="prose prose-neutral dark:prose-invert max-w-none text-foreground leading-relaxed text-base">
                <ReactMarkdown
                  components={{
                    a: ({ children, href }) => {
                      const isCitation = href?.startsWith("#source-");
                      if (isCitation) {
                        return (
                          <sup className="mx-0.5 select-none">
                            <a
                              href={href}
                              className="inline-flex items-center justify-center w-3.5 h-3.5 text-[9px] font-bold text-primary bg-primary/10 rounded-full hover:bg-primary/20 transition-colors no-underline border border-primary/20"
                              onClick={(e) => {
                                e.preventDefault();
                                if (!href) return;
                                const sourceIdx =
                                  parseInt(href.split("-")[1]) || 0;
                                const sourceElements =
                                  document.querySelectorAll(
                                    "[data-source-index]",
                                  );
                                if (sourceElements[sourceIdx - 1]) {
                                  sourceElements[sourceIdx - 1].scrollIntoView({
                                    behavior: "smooth",
                                    block: "center",
                                  });
                                }
                              }}>
                              {children}
                            </a>
                          </sup>
                        );
                      }
                      return (
                        <a
                          href={href || "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline font-medium">
                          {children}
                        </a>
                      );
                    },
                    p: ({ children }) => (
                      <p className="mb-4 last:mb-0 break-words">{children}</p>
                    ),
                    ul: ({ children }) => (
                      <ul className="list-disc pl-5 mb-4 space-y-1">
                        {children}
                      </ul>
                    ),
                    ol: ({ children }) => (
                      <ol className="list-decimal pl-5 mb-4 space-y-1">
                        {children}
                      </ol>
                    ),
                    strong: ({ children }) => (
                      <strong className="font-semibold text-foreground">
                        {children}
                      </strong>
                    ),
                    code: ({
                      className,
                      children,
                      ...props
                    }: ComponentPropsWithoutRef<"code">) => {
                      const codeString = String(children).replace(/\n$/, "");
                      const inline = !className;

                      if (inline) {
                        return (
                          <code
                            className="px-1.5 py-0.5 rounded-md bg-muted/60 font-mono text-sm text-primary break-all"
                            {...props}>
                            {children}
                          </code>
                        );
                      }

                      return (
                        <CodeBlock className={className}>
                          {codeString}
                        </CodeBlock>
                      );
                    },
                    pre: ({ children }) => (
                      <div className="not-prose w-full overflow-hidden">{children}</div>
                    ),
                  }}>
                  {formattedContent}
                </ReactMarkdown>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 mt-6 pt-4 border-t border-border/30">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground bg-muted/30 hover:bg-muted rounded-lg transition-colors"
                  title="Copy answer">
                  {copied ?
                    <FiCheck className="w-3.5 h-3.5 text-green-500" />
                  : <FiCopy className="w-3.5 h-3.5" />}
                  <span>{copied ? "Copied" : "Copy"}</span>
                </button>
                <button
                  onClick={handleShare}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground bg-muted/30 hover:bg-muted rounded-lg transition-colors"
                  title="Share answer">
                  <FiShare2 className="w-3.5 h-3.5" />
                  <span>Share</span>
                </button>
              </div>

              {/* Sources Section */}
              <div className="mt-8">
                {message.sources && message.sources.length > 0 && (
                  <SourceCarousel sources={message.sources} />
                )}
              </div>
            </>
          : <ThinkingIndicator />}
        </div>
      </div>
    </div>
  );
}
