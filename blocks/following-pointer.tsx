import { FollowerPointerCard } from "@/components/ui/following-pointer";
import { ChaiBlockComponentProps, registerChaiBlockSchema, StylesProp } from "chai-next/blocks";

export default function FollowerPointerCardBlock(props: ChaiBlockComponentProps<{}>) {
  return <FollowerPointerCard {...props}>{props.children}</FollowerPointerCard>;
}

export const FollowingPointerConfig = {
  type: "FollowingPointer",
  label: "Following Pointer",
  category: "core",
  group: "Cursor & Pointers",
  ...registerChaiBlockSchema({
    properties: {
      styles: StylesProp("text-4xl font-bold"),
      title: {
        type: "string",
        default: "",
        label: "Cursor Title",
      },
    },
  }),
  i18nProps: ["title"],
  canAcceptBlock: () => true,
};
