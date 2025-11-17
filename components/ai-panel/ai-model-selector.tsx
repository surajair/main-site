"use client";

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "chai-next";
import { Zap } from "lucide-react";

export interface AIModel {
  id: string;
  name: string;
  creditsPer1000Tokens: number;
}

const AI_MODELS: AIModel[] = [
  {
    id: "google/gemini-2.5-flash",
    name: "Gemini 2.5 Flash",
    creditsPer1000Tokens: 1,
  },
  {
    id: "openai/gpt-5",
    name: "GPT-5",
    creditsPer1000Tokens: 3,
  },
  {
    id: "openai/gpt-4o",
    name: "GPT-4o",
    creditsPer1000Tokens: 2.5,
  },
  {
    id: "anthropic/claude-3-5-haiku-20241022",
    name: "Haiku 4.5",
    creditsPer1000Tokens: 1.5,
  },
  {
    id: "anthropic/claude-3-5-sonnet-20241022",
    name: "Sonnet 4.5",
    creditsPer1000Tokens: 2.8,
  },
  {
    id: "anthropic/claude-3-5-sonnet-20240620",
    name: "Sonnet 4",
    creditsPer1000Tokens: 2.5,
  },
  {
    id: "google/gemini-pro",
    name: "Gemini Pro",
    creditsPer1000Tokens: 1.2,
  },
  {
    id: "xai/grok-4",
    name: "Grok 4",
    creditsPer1000Tokens: 2.2,
  },
];

const formatMultiplier = (credits: number): string => {
  const rounded = Math.ceil(credits);
  return `${rounded}x`;
};

interface AiModelSelectorProps {
  selectedModel: string;
  onModelChange: (modelId: string) => void;
  disabled?: boolean;
}

export const AiModelSelector = ({ selectedModel, onModelChange, disabled }: AiModelSelectorProps) => {
  const currentModel = AI_MODELS.find((model) => model.id === selectedModel) || AI_MODELS[0];

  const handleModelSelect = (modelId: string) => {
    onModelChange(modelId);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          disabled={disabled}
          className={`flex !hidden items-center gap-1 rounded border border-gray-200 bg-white px-2 py-1 text-xs transition-colors ${
            disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:border-gray-300"
          }`}>
          <Zap className="h-3 w-3 text-blue-500" />
          <span className="max-w-20 truncate font-medium">{currentModel.name}</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64" align="start">
        {AI_MODELS.map((model) => (
          <DropdownMenuItem
            key={model.id}
            onClick={() => handleModelSelect(model.id)}
            className={`flex items-center justify-between ${selectedModel === model.id ? "bg-blue-50" : ""}`}>
            <span className="text-sm font-medium">{model.name}</span>
            <div className="flex items-center gap-1">
              <Zap className="h-3 w-3 text-blue-500" />
              <span className="text-xs font-medium text-gray-700">{formatMultiplier(model.creditsPer1000Tokens)}</span>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export { AI_MODELS };
