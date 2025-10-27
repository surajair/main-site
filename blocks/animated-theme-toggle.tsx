import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import { ChaiBlockComponentProps, ChaiStyles, registerChaiBlockSchema, StylesProp } from "chai-next/blocks";
import { SunIcon } from "lucide-react";

type AnimatedThemeToggleProps = {
  styles: ChaiStyles;
  duration: number;
};

const AnimatedThemeToggleBlock = (props: ChaiBlockComponentProps<AnimatedThemeToggleProps>) => {
  const { inBuilder } = props;
  if (inBuilder) {
    return <SunIcon />;
  }
  return <AnimatedThemeToggler {...props} aria-label={"Toggle theme"} />;
};

const AnimatedThemeToggleConfig = {
  type: "DarkModeToggle",
  label: "Dark Mode Toggle",
  category: "core",
  group: "interactive",
  ...registerChaiBlockSchema({
    properties: {
      styles: StylesProp(
        "inline-flex items-center justify-center rounded-md p-2 hover:bg-accent hover:text-accent-foreground transition-colors",
      ),
      duration: {
        type: "number",
        title: "Animation Duration (ms)",
        default: 400,
        minimum: 100,
        maximum: 2000,
      },
    },
  }),
  canAcceptBlock: () => false,
};

export { AnimatedThemeToggleConfig };
export default AnimatedThemeToggleBlock;
