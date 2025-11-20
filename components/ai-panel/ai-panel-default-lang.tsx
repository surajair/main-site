"use client";

import { useQueryClient } from "@tanstack/react-query";
import {
  ChaiBlock,
  useAddBlock,
  useBlocksHtmlForAi,
  useHtmlToBlocks,
  useReplaceBlock,
  useSelectedBlock,
} from "chai-next";
import { Bot, Plus } from "lucide-react";
import { lazy, Suspense, useEffect, useRef } from "react";
import { toast } from "sonner";
import { cleanHtmlResponse, getBlockElement, Message } from "./ai-panel-helper";
import { getUserPrompt } from "./prompt-helper";

const MessageBubble = lazy(() => import("./ai-panel-message-bubble"));
const AiPromptInput = lazy(() => import("./ai-prompt-input"));

interface AiPanelForDefaultLangProps {
  t: any;
  fetch: any;
  input: string;
  isLoading: boolean;
  messages: Message[];
  fallbackLang: string;
  handleStop: () => void;
  handleReset: () => void;
  forceNewConversation: boolean;
  currentBlock: ChaiBlock | null;
  suggestNewConversation: boolean;
  setInput: (value: string) => void;
  abortController: AbortController | null;
  setIsLoading: (loading: boolean) => void;
  setCurrentBlock: (block: ChaiBlock | null) => void;
  setAbortController: (controller: AbortController | null) => void;
  setMessages: (messages: Message[] | ((prev: Message[]) => Message[])) => void;
  selectedModel?: string;
  onModelChange?: (model: string) => void;
}

const AiPanelForDefaultLang = ({
  t,
  fetch,
  input,
  messages,
  setInput,
  isLoading,
  setMessages,
  handleReset,
  handleStop,
  setIsLoading,
  currentBlock,
  fallbackLang,
  setCurrentBlock,
  setAbortController,
  forceNewConversation,
  suggestNewConversation,
  selectedModel = "google/gemini-2.5-flash",
  onModelChange,
}: AiPanelForDefaultLangProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { addPredefinedBlock } = useAddBlock();
  const replaceBlock = useReplaceBlock();
  const selectedBlock = useSelectedBlock();
  const blocksHtmlForAi = useBlocksHtmlForAi();
  const htmlToBlocks = useHtmlToBlocks();
  const queryClient = useQueryClient();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (prompt: string, content?: string, image?: string, model?: string) => {
    if (!prompt || isLoading) return;

    const editingBlock: ChaiBlock | null = selectedBlock;
    setCurrentBlock(selectedBlock);
    const html = blocksHtmlForAi();

    if (selectedBlock && !html) {
      toast.error(t("Something went wrong. Please try again."));
      return;
    }

    const userMessageObj: Message = {
      id: Date.now().toString(),
      role: "user",
      content: getUserPrompt({
        language: fallbackLang,
        userInput: content || prompt,
        currentHtml: selectedBlock ? html : "",
      }),
      userMessage: prompt,
    };

    const streamMessage: Message = { id: Date.now().toString(), role: "assistant", content: "" };

    setMessages((prev) => [...prev, userMessageObj, streamMessage]);
    setIsLoading(true);

    // Create new AbortController for this request
    const controller = new AbortController();
    setAbortController(controller);

    try {
      const requestBody: any = {
        messages: [...messages, userMessageObj].map((m) => ({
          role: m.role,
          content: m.content,
        })),
        model: model || selectedModel,
      };

      // Add image to request if provided
      if (image) {
        requestBody.image = image;
      }

      const response = await fetch({ body: { action: "ASK_AI", data: requestBody }, streamResponse: true });

      if (!response.ok) {
        throw new Error(t("Failed to get AI response"));
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let accumulatedText = "";

      if (!reader) throw new Error(t("Response body is not readable"));

      const element = getBlockElement(editingBlock ? editingBlock?._id : "canvas");

      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          if (element && !editingBlock) element.remove();
          break;
        }

        const chunk = decoder.decode(value, { stream: true });
        accumulatedText += chunk;

        if (element) {
          element.innerHTML = accumulatedText;
          const rect = element.getBoundingClientRect();
          const iframeDoc = document.getElementById("canvas-iframe") as HTMLIFrameElement;
          const iframeWindow = iframeDoc?.contentWindow;
          if (iframeWindow) {
            const isInViewport = rect.top >= 0 && rect.bottom <= iframeWindow.innerHeight;
            if (!isInViewport) {
              element.scrollIntoView({ behavior: "smooth", block: "nearest" });
            }
          }
        }

        setMessages((prev) =>
          prev.map((msg) => (msg.id === streamMessage.id ? { ...msg, content: accumulatedText } : msg)),
        );
      }

      // Extract and clean HTML from the response
      const html = cleanHtmlResponse(accumulatedText);
      const finalBlocks = htmlToBlocks(html);
      if (editingBlock?._id) {
        console.log("Editing block", editingBlock?._id, finalBlocks);
        replaceBlock(editingBlock?._id, finalBlocks);
      } else {
        addPredefinedBlock([...finalBlocks], editingBlock?._parent, -1);
      }
      setTimeout(() => {
        console.log("## 100");
        queryClient.invalidateQueries({ queryKey: ["ai-usage"] });
      }, 4000);
    } catch (error: any) {
      // Don't show error message if request was aborted
      if (error.name !== "AbortError") {
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: t("Sorry, I encountered an error. Please try again."),
        };
        setMessages((prev) => [...prev, errorMessage]);
      }
    } finally {
      setInput("");
      setIsLoading(false);
      setCurrentBlock(null);
      setAbortController(null);
    }
  };

  return (
    <>
      <div className="flex-1 space-y-3 overflow-y-auto py-4">
        {messages.length === 0 && (
          <div className="flex-1 space-y-3 overflow-y-auto py-4">
            <div className="mx-auto mt-8 text-center text-gray-500">
              <Bot size={48} className="mx-auto mb-4 text-gray-300" />
              <p className="mx-auto max-w-[75%] text-sm">
                {t("Start a conversation with the AI assistant to generate and update your sections")}
              </p>
            </div>
          </div>
        )}

        {messages.map(
          (message, index) =>
            message.role !== "system" && (
              <Suspense key={index} fallback={<div>Loading...</div>}>
                <MessageBubble
                  message={message}
                  isUser={message.role === "user"}
                  isLoading={message.role === "assistant" && isLoading && index === messages.length - 1}
                />
              </Suspense>
            ),
        )}

        {suggestNewConversation && !isLoading && (
          <button
            onClick={handleReset}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-blue-200 bg-blue-50 p-1.5 text-left transition-colors hover:bg-blue-100">
            <div className="flex flex-col">
              <span className="flex items-center gap-1 text-xs font-medium text-blue-700">
                <Plus className="h-4 w-4 capitalize text-blue-600" />
                {forceNewConversation ? t("Start") : t("New")} {t("Conversation")}{" "}
                {!forceNewConversation && (
                  <span className="text-[10px] font-extralight text-blue-600">{t("For best results")}</span>
                )}
              </span>
            </div>
          </button>
        )}
        <div ref={messagesEndRef} />
      </div>

      {!forceNewConversation && (
        <div className={`border-gray-200 pb-2`}>
          <Suspense fallback={<div>Loading...</div>}>
            <AiPromptInput
              input={input}
              setInput={setInput}
              onSend={handleSend}
              onStop={handleStop}
              isLoading={isLoading}
              selectedLang=""
              currentBlock={(selectedBlock || currentBlock) as ChaiBlock}
              disabled={input?.length === 0}
              selectedModel={selectedModel}
              onModelChange={onModelChange}
            />
          </Suspense>
        </div>
      )}
    </>
  );
};

export default AiPanelForDefaultLang;
