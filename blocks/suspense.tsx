import { ChaiBlockComponentProps, registerChaiBlockSchema } from "chai-next/blocks";
import * as React from "react";
import { Suspense as ReactSuspense } from "react";

type SuspenseProps = {
  children: React.ReactNode;
};

const SuspenseBlock = (props: ChaiBlockComponentProps<SuspenseProps>) => {
  const { children } = props;
  return <ReactSuspense fallback={null}>{children}</ReactSuspense>;
};

const SuspenseConfig = {
  type: "SuspenseBlock",
  label: "Suspense Block",
  category: "core",
  group: "layout",
  canAcceptBlock: () => true,
  ...registerChaiBlockSchema({
    properties: {},
  }),
};

export { SuspenseBlock, SuspenseConfig };
