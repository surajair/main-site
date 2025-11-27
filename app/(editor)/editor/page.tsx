import { FeatureFlagProvider } from "@/lib/openfeature/feature-flag-provider";
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
    <FeatureFlagProvider>
      <Editor websiteId={websiteId} />
    </FeatureFlagProvider>
  );
}
