import { PointerHighlight } from "@/components/ui/pointer-highlight";
import { ChaiBlockComponentProps, ChaiStyles, registerChaiBlockSchema, StylesProp } from "chai-next/blocks";

type PointerHighlightProps = {
  styles: ChaiStyles;
  rectangleClassName: string;
  pointerClassName: string;
};

const PointerHighlightBlock = (props: ChaiBlockComponentProps<PointerHighlightProps>) => {
  return (
    <PointerHighlight
      styles={props.styles}
      blockProps={props.blockProps}
      rectangleClassName={props.rectangleClassName}
      pointerClassName={props.pointerClassName}>
      {props.children}
    </PointerHighlight>
  );
};

const PointerHighlightConfig = {
  type: "PointerHighlight",
  label: "Pointer Highlight",
  category: "core",
  group: "Cursor & Pointers",
  ...registerChaiBlockSchema({
    properties: {
      styles: StylesProp("relative w-fit"),
      rectangleClassName: {
        type: "string",
        default: "border-border",
        title: "Rectangle Border Style",
      },
      pointerClassName: {
        type: "string",
        default: "h-5 w-5 text-blue-500",
        title: "Pointer Icon Style",
      },
    },
  }),
  canAcceptBlock: () => true,
};

export { PointerHighlightConfig };
export default PointerHighlightBlock;
