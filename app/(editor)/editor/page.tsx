import QueryClientProviderWrapper from "@/components/providers/query-client-provider";
import "chai-next/builder-styles";
import ChaiBuilder from "chai-next/server";
import Editor from "./editor-client";

export default async function Page() {
  const websiteId = await ChaiBuilder.getSiteId();
  return (
    <QueryClientProviderWrapper>
      <Editor websiteId={websiteId} />
    </QueryClientProviderWrapper>
  );
}
