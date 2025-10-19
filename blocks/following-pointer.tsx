import { FollowerPointerCard } from "@/components/ui/following-pointer";
import { ChaiBlockComponentProps, ChaiStyles, registerChaiBlockSchema, StylesProp } from "chai-next/blocks";

export default function FollowerPointerCardBlock(
  props: ChaiBlockComponentProps<{ styles: ChaiStyles; title: string; cursorIcon: string }>,
) {
  return <FollowerPointerCard {...props}>{props.children}</FollowerPointerCard>;
}

export const FollowingPointerConfig = {
  type: "FollowingPointer",
  label: "Following Pointer",
  category: "core",
  hidden: true,
  group: "Cursor & Pointers",
  ...registerChaiBlockSchema({
    properties: {
      styles: StylesProp("text-4xl font-bold"),
      title: {
        type: "string",
        default: "",
        title: "Cursor Title",
      },
      cursorIcon: {
        type: "string",
        default: "",
        title: "Cursor Icon",
        ui: { "ui:widget": "icon" },
      },
    },
  }),
  i18nProps: ["title"],
  canAcceptBlock: () => true,
};
