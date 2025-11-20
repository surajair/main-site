import { ChaiBlock, mergeClasses, useTranslation } from "chai-next";
import { ChevronsUpDown } from "lucide-react";
import { useState } from "react";
import { ADD_NEW_SECTIONS, LANGUAGE_CONTENT_ACTIONS, UPDATE_ACTIONS } from "./prompt-helper";

const QuickPrompts: React.FC<{
  currentBlock?: ChaiBlock;
  selectedLang?: string;
  onSelect: (prompt: string, label: string) => void;
}> = ({ onSelect, currentBlock, selectedLang }) => {
  const { t } = useTranslation();
  const [show, setShow] = useState(false);
  const quickPrompts = selectedLang ? LANGUAGE_CONTENT_ACTIONS : currentBlock ? UPDATE_ACTIONS : ADD_NEW_SECTIONS;

  return (
    <>
      <div
        onClick={() => setShow(!show)}
        className={mergeClasses(
          "flex h-6 w-full cursor-pointer items-center justify-between gap-2 px-2",
          currentBlock
            ? "bg-green-50/80 text-green-500 hover:bg-green-50"
            : "bg-primary/5 text-primary hover:bg-primary/10",
        )}>
        <span className="truncate whitespace-nowrap text-xs font-medium leading-none">
          {currentBlock ? (
            <span>
              <span className="font-extralight">{selectedLang ? t("Edit Content:") : t("Edit:")}</span>{" "}
              {currentBlock._name || currentBlock._type}
            </span>
          ) : (
            t("Quick Prompts")
          )}
        </span>
        <ChevronsUpDown className="h-3 w-3" />
      </div>
      {show && (
        <div className="max-h-60 w-full overflow-y-auto bg-white px-1 pb-1">
          {quickPrompts.map((item, index) => (
            <div
              key={index}
              className="flex cursor-pointer items-center gap-x-1 p-1 text-xs leading-none hover:text-blue-700"
              onClick={() => {
                onSelect(
                  `${selectedLang ? t("Update") : currentBlock ? t("Update") : t("Add New")} ${item.label}`,
                  item.prompt,
                );
                setShow(false);
              }}>
              <span className="truncate whitespace-nowrap">
                {currentBlock ? null : <span className="font-thin text-muted-foreground">{t("Add New")}</span>}{" "}
                {item.label}
              </span>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default QuickPrompts;
