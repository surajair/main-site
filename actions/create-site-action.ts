"use server";

import { getUser } from "@/lib/getter/users";
import { encodedApiKey } from "@/utils/api-key";
import { Site } from "@/utils/types";
import { Vercel } from "@vercel/sdk";
import { getSupabaseAdmin } from "chai-next/server";
import { revalidatePath } from "next/cache";
import { HOME_PAGE_BLOCKS } from "./home-page";
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;

if (!ENCRYPTION_KEY) {
  throw new Error("ENCRYPTION_KEY environment variable is required but not set");
}

const DEFAULT_THEME = {
  fontFamily: {
    heading: "Poppins",
    body: "Roboto",
  },
  borderRadius: "30px",
  colors: {
    background: ["#FFFFFF", "#09090B"],
    foreground: ["#09090B", "#FFFFFF"],
    primary: ["#2563EB", "#3B82F6"],
    "primary-foreground": ["#FFFFFF", "#FFFFFF"],
    secondary: ["#F4F4F5", "#27272A"],
    "secondary-foreground": ["#09090B", "#FFFFFF"],
    muted: ["#F4F4F5", "#27272A"],
    "muted-foreground": ["#71717A", "#A1A1AA"],
    accent: ["#F4F4F5", "#27272A"],
    "accent-foreground": ["#09090B", "#FFFFFF"],
    destructive: ["#EF4444", "#7F1D1D"],
    "destructive-foreground": ["#FFFFFF", "#FFFFFF"],
    border: ["#E4E4E7", "#27272A"],
    input: ["#E4E4E7", "#27272A"],
    ring: ["#2563EB", "#3B82F6"],
    card: ["#FFFFFF", "#09090B"],
    "card-foreground": ["#09090B", "#FFFFFF"],
    popover: ["#FFFFFF", "#09090B"],
    "popover-foreground": ["#09090B", "#FFFFFF"],
  },
};

export async function createSite(formData: Partial<Site>) {
  try {
    const user = await getUser();
    const supabaseServer = await getSupabaseAdmin();

    const websiteName = formData?.name;
    const subdomainPrefix = formData?.subdomain;
    const subdomain = subdomainPrefix + "." + process.env.NEXT_PUBLIC_SUBDOMAIN;

    if (subdomainPrefix) {
      const { data } = await supabaseServer.from("app_domains").select("id").eq("subdomain", subdomain);
      if (data && data?.length > 0) {
        throw new Error(`The subdomain "${subdomain}" is already in use. Please choose a different subdomain.`);
      }
    }

    // Create entry in apps table
    const newApp = {
      user: user.id,
      name: websiteName,
      languages: formData.languages,
      fallbackLang: formData.fallbackLang,
      theme: DEFAULT_THEME,
      data: {
        siteName: websiteName,
      },
    };

    const { data: appData, error: appError } = await supabaseServer
      .from("apps")
      .insert(newApp)
      .select("id, user, name, theme, languages, fallbackLang, data")
      .single();
    if (appError) throw appError;

    // Create entry in apps_online table
    const { error: onlineError } = await supabaseServer.from("apps_online").insert(appData);
    if (onlineError) throw onlineError;

    await createHomePage(appData.id, websiteName as string, supabaseServer);

    // Creating and adding api key
    const apiKey = encodedApiKey(appData.id, ENCRYPTION_KEY as string);

    if (subdomain) {
      if (!subdomain?.includes("localhost")) {
        const vercel = new Vercel({ bearerToken: process.env.VERCEL_TOKEN! });
        await vercel.projects.addProjectDomain({
          idOrName: process.env.VERCEL_PROJECT_ID!,
          teamId: process.env.VERCEL_TEAM_ID!,
          requestBody: { name: subdomain },
        });
      }

      await supabaseServer.from("app_domains").insert({
        app: appData.id,
        hosting: "vercel",
        subdomain: subdomain,
        domainConfigured: false,
      });
    }

    const { error: apiKeyError } = await supabaseServer.from("app_api_keys").insert({ apiKey, app: appData.id });
    if (apiKeyError) throw onlineError;

    // Create entry in libraries table
    const { error: libraryError } = await supabaseServer.from("libraries").insert({
      name: newApp.name,
      app: appData.id,
      type: "site",
    });
    if (libraryError) throw libraryError;

    await supabaseServer.from("app_users").insert({
      user: user.id,
      app: appData.id,
      role: "admin",
      status: "active",
    });

    revalidatePath("/");
    return { success: true, data: appData };
  } catch (error: any) {
    if (error?.message.includes("already exists")) {
      return { success: false, error: "Subdomain already in use. Please try another." };
    }
    return { success: false, error: error?.message || "An error occurred" };
  }
}

export async function createApiKey(appId: string) {
  try {
    const supabaseServer = await getSupabaseAdmin();
    const apiKey = encodedApiKey(appId, ENCRYPTION_KEY as string);
    const { data, error } = await supabaseServer.from("app_api_keys").insert({ apiKey, app: appId }).select().single();
    if (error) throw error;
    return { success: true, apiKey: data.apiKey };
  } catch (error: any) {
    return {
      success: false,
      error: error?.message || "Failed to create API key",
    };
  }
}

export async function createHomePage(appId: string, name: string, supabaseServer: any) {
  try {
    const { data, error } = await supabaseServer
      .from("app_pages")
      .insert({
        name: "Homepage",
        slug: "/",
        app: appId,
        pageType: "page",
        seo: {
          title: `Home - ${name}`,
          jsonLD: "",
          noIndex: false,
          ogImage: "",
          ogTitle: "",
          noFollow: "",
          description: `Build your ${name} website with Chai Builder`,
          searchTitle: "",
          cononicalUrl: "",
          ogDescription: "",
          searchDescription: "",
        },
        blocks: HOME_PAGE_BLOCKS,
        online: true,
      })
      .select("*")
      .single();

    const { data: onlineData, error: onlineError } = await supabaseServer
      .from("app_pages_online")
      .insert({
        ...data,
        partialBlocks: null,
        links: null,
      })
      .select("*")
      .single();

    if (onlineError) throw onlineError;

    return { success: true, data };
  } catch (error: any) {
    return {
      success: false,
      error: error?.message || "Failed to create home page",
    };
  }
}
