import QueryClientProviderWrapper from "@/components/providers/query-client-provider";
import "chai-next/builder-styles";
import ChaiBuilder from "chai-next/server";
import Editor from "./editor";

export default async function Page({
  params,
}: {
  params: Promise<{ websiteId: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const websiteId = await ChaiBuilder.getSiteId();
  return (
    <QueryClientProviderWrapper>
      <Editor websiteId={websiteId} />
    </QueryClientProviderWrapper>
  );
}
