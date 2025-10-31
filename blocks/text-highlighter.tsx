import { Highlighter } from "@/components/ui/highlighter";
import { ChaiBlockComponentProps, registerChaiBlockSchema } from "chai-next/blocks";

type TextHighlighterProps = {
  action: "highlight" | "underline" | "box" | "circle" | "strike-through" | "crossed-off" | "bracket";
  color: string;
  strokeWidth: number;
  animationDuration: number;
  iterations: number;
  padding: number;
  multiline: boolean;
  isView: boolean;
  content: string;
};

const TextHighlighterBlock = (props: ChaiBlockComponentProps<TextHighlighterProps>) => {
  return (
    <Highlighter
      blockProps={props.blockProps}
      action={props.action}
      color={props.color}
      strokeWidth={props.strokeWidth}
      animationDuration={props.animationDuration}
      iterations={props.iterations}
      padding={props.padding}>
      {props.content}
    </Highlighter>
  );
};

const TextHighlighterConfig = {
  type: "TextHighlighter",
  label: "Text Highlighter",
  category: "core",
  group: "text",
  ...registerChaiBlockSchema({
    properties: {
      content: {
        type: "string",
        default: "Word",
        title: "Text",
      },
      action: {
        type: "string",
        enum: ["highlight", "underline", "box", "circle", "strike-through", "crossed-off", "bracket"],
        default: "highlight",
        title: "Highlight Action",
      },
      color: {
        type: "string",
        default: "#ffd1dc",
        title: "Highlight Color",
        ui: { "ui:widget": "color" },
      },
      strokeWidth: {
        type: "number",
        default: 1.5,
        title: "Stroke Width",
      },
      animationDuration: {
        type: "number",
        default: 600,
        title: "Animation Duration (ms)",
      },
      iterations: {
        type: "number",
        default: 2,
        title: "Animation Iterations",
      },
      padding: {
        type: "number",
        default: 2,
        title: "Padding",
      },
    },
  }),
  i18nProps: ["content"],
};

export { TextHighlighterConfig };
export default TextHighlighterBlock;
