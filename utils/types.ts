export interface Site {
  id: string;
  name: string;
  createdAt: string;
  fallbackLang?: string;
  languages?: string[];
  apiKey?: string;
  domain?: string;
  subdomain?: string;
  hosting?: string;
  domainConfigured: boolean;
  settings: any;
}

export type SiteData = {
  id: string;
  name: string;
  createdAt: string;
  settings: {
    email: string;
    phone: string;
    address: string;
    logoURL: string;
    language: string;
    siteName: string;
    termsURL: string;
    timezone: string;
    faviconURL: string;
    metaPixelId: string;
    siteTagline: string;
    socialLinks: Record<string, string>;
    contactEmail: string;
    contactPhone: string;
    contactAddress: string;
    privacyPolicyURL: string;
    recaptchaSiteKey: string;
    googleAnalyticsId: string;
    googleTagManagerId: string;
    recaptchaSecretKey: string;
    cookieConsentEnabled: boolean;
    customTrackingScripts: string[];
    headHTML?: string;
    footerHTML?: string;
  };
  languages: string[];
  fallbackLang: string;
  domainConfigured: boolean;
  domain: string;
  subdomain: string;
  hosting: string;
};
