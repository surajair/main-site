"use server";
import { getSupabaseAdmin } from "chai-next/server";
interface FormSubmissionData {
  formData: Record<string, string | boolean | number | null>;
  additionalData: Record<string, string | boolean | number | null>;
  domain: string;
}

export async function formSubmit(data: FormSubmissionData) {
  try {
    const { formData, additionalData, domain } = data;
    const supabaseServer = await getSupabaseAdmin();
    const { data: appData } = await supabaseServer
      .from("app_domains")
      .select("*")
      .or(`domain.eq.${domain},subdomain.eq.${domain}`)
      .single();
    const app = appData?.app;

    if (!app) return { success: false };

    const formSubmission = {
      app: app,
      formName: formData.formName,
      formData: formData,
      additionalData: additionalData,
    };
    await supabaseServer.from("app_form_submissions").insert(formSubmission);
    return { success: true };
  } catch {
    return { success: false };
  }
}
