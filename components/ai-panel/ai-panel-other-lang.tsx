"use client";

import {
  ChaiBlock,
  LanguageSwitcher,
  useI18nBlocks,
  useSelectedBlock,
  useStreamMultipleBlocksProps,
  useTranslation,
} from "chai-next";
import { Bot, InfoIcon, Plus } from "lucide-react";
import { lazy, Suspense, useEffect, useRef } from "react";
import { Message } from "./ai-panel-helper";
import { getTranslationUserPrompt } from "./prompt-helper";

const MessageBubble = lazy(() => import("./ai-panel-message-bubble"));
const TranslationPrompts = lazy(() => import("./ai-translation-prompt"));
const AiPromptInput = lazy(() => import("./ai-prompt-input"));

interface AiPanelForOtherLangProps {
  fetch: any;
  input: string;
  isLoading: boolean;
  messages: Message[];
  fallbackLang: string;
  selectedLang: string;
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

const AiPanelForOtherLang = ({
  fetch,
  input,
  messages,
  setInput,
  isLoading,
  handleStop,
  handleReset,
  setMessages,
  setIsLoading,
  selectedLang,
  currentBlock,
  fallbackLang,
  abortController,
  setAbortController,
  forceNewConversation,
  suggestNewConversation,
  selectedModel = "google/gemini-2.5-flash",
  onModelChange,
}: AiPanelForOtherLangProps) => {
  const { t } = useTranslation();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const selectedBlock = useSelectedBlock();
  const i18nBlocks = useI18nBlocks();
  const updateBlocksWithStream = useStreamMultipleBlocksProps();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleTranslationPrompt = async (prompt: string, content?: string, model?: string) => {
    const isTranslate = prompt?.toLowerCase() === "translate";
    const userMessageObj: Message = {
      id: Date.now().toString(),
      role: "user",
      content: getTranslationUserPrompt({
        fallbackLang,
        userInput: content || prompt,
        language: selectedLang,
        blocks: (isTranslate ? i18nBlocks() : i18nBlocks(selectedLang)) as ChaiBlock[],
      }),
      userMessage: content || prompt || t("Translate the content"),
    };

    setIsLoading(true);

    // Create new AbortController for this request
    const controller = new AbortController();
    setAbortController(controller);

    const streamMessage: Message = { id: Date.now().toString(), role: "assistant", content: "" };

    setMessages((prev) => [...prev, userMessageObj, streamMessage]);
    setIsLoading(true);

    try {
      const requestBody: any = {
        messages: [userMessageObj],
        initiator: isTranslate ? "TRANSLATE_CONTENT" : "UPDATE_CONTENT",
        model: model || selectedModel,
      };

      const response = await fetch({ body: { action: "ASK_AI", data: requestBody }, streamResponse: true });

      if (!response.ok) {
        throw new Error(t("Failed to get AI response"));
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let accumulatedText = "";

      if (!reader) throw new Error(t("Response body is not readable"));

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          break;
        }

        const chunk = decoder.decode(value, { stream: true });
        accumulatedText += chunk;
        setMessages((prev) => {
          prev[prev.length - 1].content = accumulatedText;
          return [...prev];
        });
      }

      const blocks = JSON.parse(accumulatedText?.replace("```json", "").replace("```", ""));
      updateBlocksWithStream(blocks);
    } catch {
      abortController?.abort();
    } finally {
      setIsLoading(false);
      setInput("");
    }
  };

  return (
    <>
      <div className="py-2">
        <Suspense fallback={<div>{t("Loading...")}</div>}>
          <TranslationPrompts
            isLoading={isLoading}
            selectedBlock={selectedBlock}
            selectedLang={selectedLang}
            onClick={handleTranslationPrompt}
          />
        </Suspense>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto py-4">
        {messages.length === 0 && (
          <div className="flex-1 space-y-3 overflow-y-auto py-4">
            <div className="mx-auto mt-8 text-center text-gray-500">
              <Bot size={48} className="mx-auto mb-4 text-gray-300" />
              <p className="mx-auto max-w-[75%] text-sm">
                {t("Start a conversation with the AI assistant to translate/edit your content")}
              </p>
            </div>
            <div className="relative rounded-lg border px-3 py-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <InfoIcon className="h-3 w-3" />
                <span className="text-xs">
                  {t(
                    "Only content can be edited in secondary languages. To edit layout, styles and more, switch to the default language.",
                  )}
                </span>
              </div>
              <div className="mt-1">
                <LanguageSwitcher showAdd={false} variant="outline" goToDefaultLang={true} />
              </div>
            </div>
          </div>
        )}

        {messages.map(
          (message, index) =>
            message.role !== "system" && (
              <Suspense key={index} fallback={<div>{t("Loading...")}</div>}>
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
                {forceNewConversation ? t("Start ") : ""} {t("New Conversation")}{" "}
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
          <Suspense fallback={<div>{t("Loading...")}</div>}>
            <AiPromptInput
              input={input}
              setInput={setInput}
              onSend={handleTranslationPrompt}
              onStop={handleStop}
              isLoading={isLoading}
              selectedLang={selectedLang}
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

export default AiPanelForOtherLang;
