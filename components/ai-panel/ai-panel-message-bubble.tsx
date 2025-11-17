"use client";

import { useTranslation } from "chai-next";
import { CheckCircle, Loader } from "lucide-react";
import { Message } from "./ai-panel-helper";

const MessageLoader = ({ message }: { message: Message }) => {
  const { t } = useTranslation();
  if (message?.content?.length < 10) {
    return (
      <div className="relative z-50 mb-3 flex w-full flex-col gap-2 overflow-hidden">
        <div className="flex w-max items-center justify-center gap-1 rounded-md p-1 px-2 text-xs font-medium text-blue-500">
          <Loader className="h-3 w-3 animate-spin" /> {t("Processing")}
        </div>
      </div>
    );
  }

  return (
    <div className="relative z-50 mb-3 flex w-full flex-col gap-2 overflow-hidden">
      <div className="flex w-max items-center justify-center gap-1 rounded-md p-1 px-2 text-xs font-medium text-blue-500">
        <Loader className="h-3 w-3 animate-spin" /> {t("Generating")}
      </div>
    </div>
  );
};

const MessageBubble = ({ message, isUser, isLoading }: { message: Message; isUser: boolean; isLoading: boolean }) => {
  const { t } = useTranslation();
  if (isUser) {
    return (
      <div className={`relative mb-3 flex w-full justify-end overflow-hidden`}>
        <div
          className={`flex max-w-[95%] flex-row-reverse rounded-lg rounded-br-sm bg-blue-500 px-2 py-1.5 text-xs text-white`}>
          {message.userMessage}
        </div>
      </div>
    );
  }

  if (isLoading) return <MessageLoader message={message} />;

  return (
    <div
      className={`relative mb-3 flex w-full overflow-hidden ${isUser ? "justify-end" : isLoading ? "max-h-48 min-h-24 justify-start" : "max-h-16"}`}>
      <div className="flex w-max items-center justify-center gap-1 rounded-md p-1 px-2 text-xs font-medium text-green-500">
        <CheckCircle className="h-3 w-3" /> {t("Completed")}
      </div>
    </div>
  );
};

export default MessageBubble;
