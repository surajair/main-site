import { redirect } from "next/navigation";

export default async function ProjectPage({ params }: { params: Promise<{ websiteId: string }> }) {
  const { websiteId } = await params;
  redirect(`/websites/website/${websiteId}/new`);
}
