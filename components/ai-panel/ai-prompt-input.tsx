"use client";

import { useAiUsage } from "@/hooks/use-ai-usage";
import { ChaiBlock, useTranslation } from "chai-next";
import { Info, Paperclip, Send, Square, X } from "lucide-react";
import React, { lazy, useEffect, useRef, useState } from "react";
import { AiModelSelector } from "./ai-model-selector";

const QuickPrompts = lazy(() => import("./ai-panel-quick-prompts"));

const MODEL_STORAGE_KEY = "chai-ai-selected-model";

interface AiPromptInputProps {
  input: string;
  setInput: (value: string) => void;
  onSend: (prompt: string, label?: string, image?: string, model?: string) => void;
  onStop: () => void;
  isLoading: boolean;
  disabled?: boolean;
  currentBlock?: ChaiBlock;
  selectedLang?: string;
  selectedModel?: string;
  onModelChange?: (model: string) => void;
}

// AI Prompt Input Component
const AiPromptInput = ({
  input,
  setInput,
  onSend,
  onStop,
  isLoading,
  disabled,
  currentBlock,
  selectedLang,
  selectedModel: propSelectedModel = "google/gemini-2.5-flash",
  onModelChange,
}: AiPromptInputProps) => {
  const { t } = useTranslation();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState(propSelectedModel);
  const { isCreditLeft } = useAiUsage();

  // Load saved model from localStorage on mount
  useEffect(() => {
    if (!selectedLang) {
      const savedModel = localStorage.getItem(MODEL_STORAGE_KEY);
      if (savedModel) {
        setSelectedModel(savedModel);
        onModelChange?.(savedModel);
      }
    }
  }, [selectedLang, onModelChange]);

  // Save model to localStorage when it changes
  const handleModelChange = (model: string) => {
    setSelectedModel(model);
    onModelChange?.(model);
    if (!selectedLang) {
      localStorage.setItem(MODEL_STORAGE_KEY, model);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (input.trim() && !isLoading) {
        onSend(input?.trim(), undefined, selectedImage || undefined, selectedModel);
        setSelectedImage(null);
      }
    }
  };

  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = Math.min(textarea.scrollHeight, 120) + "px";
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64String = event.target?.result as string;
        setSelectedImage(base64String);
        setInput(t("Generate UI based on given image "));
        textareaRef.current?.focus();
      };
      reader.readAsDataURL(file);
    }

    // Reset the file input value to allow selecting the same file again
    e.target.value = "";
  };

  const handleAttachmentClick = () => {
    fileInputRef.current?.click();
  };

  const handleSendClick = () => {
    onSend(input?.trim(), undefined, selectedImage || undefined, selectedModel);
    setSelectedImage(null);
  };

  useEffect(() => {
    adjustHeight();
  }, [input]);

  return (
    <div className="relative">
      {!selectedImage && !(selectedLang && !currentBlock) && isCreditLeft && (
        <div
          className={`mx-auto flex w-full max-w-[95%] flex-col items-center overflow-hidden rounded-t-md border-x border-t border-gray-200 ${isLoading ? "pointer-events-none opacity-50" : ""}`}>
          <QuickPrompts
            currentBlock={currentBlock}
            selectedLang={selectedLang}
            onSelect={(_, prompt) => {
              setInput(prompt + " ");
              textareaRef.current?.focus();
            }}
          />
        </div>
      )}
      {!isCreditLeft && (
        <div
          className={`mx-auto flex w-full max-w-[95%] justify-center gap-x-1 items-center overflow-hidden rounded-t-md border-x border-t py-2 border-red-200 text-xs bg-red-600/10 text-red-600 font-medium`}>
          <Info className="w-4 h-4" /> You are out of AI credit balance
        </div>
      )}

      <div className={`rounded-lg border border-gray-200 bg-white`}>
        {selectedImage && (
          <div className="relative flex w-max items-center justify-start gap-x-2 px-2 pt-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={selectedImage} alt="Selected attachment" className="max-h-16 max-w-full rounded-md border" />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -right-0 -top-0 flex items-center rounded-full bg-red-400 p-1 text-xs text-white hover:bg-red-500"
              title={t("Remove image")}>
              <X className="h-2 w-2" />
            </button>
          </div>
        )}
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={selectedLang ? t("Ask to update content") : t("Ask me anything...")}
          className={`max-h-[200px] min-h-[60px] w-full resize-none rounded-lg border-none px-3 py-2 text-sm outline-none ${isLoading || !isCreditLeft ? "cursor-not-allowed opacity-50" : ""}`}
          rows={3}
          disabled={isLoading || !isCreditLeft}
        />
        <div className="flex items-center justify-between p-2">
          {!selectedLang ? (
            <div className="flex items-center gap-2">
              <button
                disabled={isLoading || !isCreditLeft}
                onClick={handleAttachmentClick}
                className={`p-1.5 text-gray-400 hover:text-gray-500 ${isLoading || Boolean(selectedLang) || !isCreditLeft ? "cursor-not-allowed opacity-50" : ""}`}
                title={t("Attach Image")}>
                <Paperclip size={16} />
              </button>
              <AiModelSelector selectedModel={selectedModel} onModelChange={handleModelChange} disabled={isLoading} />
            </div>
          ) : (
            <div />
          )}

          <input
            disabled={isLoading || !isCreditLeft}
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />

          {isLoading ? (
            <button
              onClick={onStop}
              className="z-50 flex items-center gap-x-1 rounded-md bg-red-500 p-1.5 text-white transition-colors hover:bg-red-600"
              title={t("Stop generation")}>
              <Square size={16} /> <span className="text-xs">{t("Stop")}</span>
            </button>
          ) : (
            <button
              onClick={handleSendClick}
              disabled={!input.trim() || disabled || !isCreditLeft}
              className={`rounded-md bg-blue-500 p-1.5 text-white ${
                !input.trim() || disabled || !isCreditLeft
                  ? "cursor-not-allowed opacity-50"
                  : "transition-colors hover:bg-blue-600"
              }`}>
              <Send size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AiPromptInput;
