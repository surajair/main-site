"use client";

import {
  PromptInput,
  PromptInputActionAddAttachments,
  PromptInputActionMenu,
  PromptInputActionMenuContent,
  PromptInputActionMenuTrigger,
  PromptInputAttachment,
  PromptInputAttachments,
  PromptInputBody,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputToolbar,
  PromptInputTools,
  type PromptInputMessage,
} from "@/components/ai-elements/prompt-input";
import { Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const WithGenAIPanel = () => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSubmit = async (message: PromptInputMessage, event: React.FormEvent) => {
    event.preventDefault();

    if (!message.text?.trim()) {
      toast.error("Please enter a prompt");
      return;
    }

    setIsGenerating(true);
    try {
      console.log("Generating with AI:", message.text);
      console.log("Attachments:", message.files);

      // Simulate AI generation
      await new Promise((resolve) => setTimeout(resolve, 2000));

      toast.success("AI content generated successfully!");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to generate content");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <PromptInput onSubmit={handleSubmit} className="mt-4 relative">
        <PromptInputBody>
          <PromptInputAttachments>
            {(attachment) => <PromptInputAttachment key={attachment.id} data={attachment} />}
          </PromptInputAttachments>
          <PromptInputTextarea placeholder="Describe what you want to create..." disabled={isGenerating} />
        </PromptInputBody>
        <PromptInputToolbar>
          <PromptInputTools>
            <PromptInputActionMenu>
              <PromptInputActionMenuTrigger />
              <PromptInputActionMenuContent>
                <PromptInputActionAddAttachments />
              </PromptInputActionMenuContent>
            </PromptInputActionMenu>
          </PromptInputTools>
          <PromptInputSubmit disabled={isGenerating} status={isGenerating ? "streaming" : "ready"} />
        </PromptInputToolbar>
      </PromptInput>
    </div>
  );
};

// Tab component
const WithGenAITab = () => (
  <div className="flex items-center gap-2">
    <Sparkles className="h-4 w-4" />
    With GenAI
  </div>
);

// Tab content component
const WithGenAITabContent = () => <WithGenAIPanel />;

// Export the panel configuration
export const withGenAIPanel = {
  id: "with-genai",
  tab: WithGenAITab,
  tabContent: WithGenAITabContent,
};
