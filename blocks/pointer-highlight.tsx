import { PointerHighlight } from "@/components/ui/pointer-highlight";
import { ChaiBlockComponentProps, ChaiStyles, registerChaiBlockSchema, StylesProp } from "chai-next/blocks";

type PointerHighlightProps = {
  styles: ChaiStyles;
  rectangleStyles: ChaiStyles;
  pointerStyles: ChaiStyles;
};

const PointerHighlightBlock = (props: ChaiBlockComponentProps<PointerHighlightProps>) => {
  return (
    <PointerHighlight
      styles={props.styles}
      blockProps={props.blockProps}
      rectangleStyles={props.rectangleStyles}
      pointerStyles={props.pointerStyles}>
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
      rectangleStyles: StylesProp("absolute inset-0 border border-border"),
      pointerStyles: StylesProp("h-5 w-5 text-blue-500"),
    },
  }),
  canAcceptBlock: () => true,
};

export { PointerHighlightConfig };
export default PointerHighlightBlock;
