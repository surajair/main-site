import { FeatureFlagProvider } from "@/lib/openfeature/feature-flag-provider";
import "chai-next/builder-styles";
import { getSupabaseAdmin } from "chai-next/server";
import { get } from "lodash";
import dynamic from "next/dynamic";
import Editor from "./editor";

const PaymentConfirmation = dynamic(() => import("@/components/upgrade/payment-confirmation"), { ssr: true });

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ websiteId: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const queryParams = await searchParams;
  const paymentId = get(queryParams, "subscription_id") || get(queryParams, "transaction_id");
  if (paymentId) return <PaymentConfirmation />;

  const { websiteId } = await params;
  const supabaseServer = await getSupabaseAdmin();
  const { data } = await supabaseServer.from("app_domains").select("subdomain,domain").eq("app", websiteId).single();
  return (
    <FeatureFlagProvider>
      <Editor domain={data?.domain || data?.subdomain} websiteId={websiteId} />
    </FeatureFlagProvider>
  );
}
