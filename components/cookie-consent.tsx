"use client";

import { useEffect, useState } from "react";
import "vanilla-cookieconsent/dist/cookieconsent.css";
import { CookieConsentSettings } from "./cookie-consent-wrapper";


export function CookieConsent({ lang = "en", settings }: { lang?: string; settings?: CookieConsentSettings }) {
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    const handleInteraction = () => {
      setHasInteracted(true);
      window.removeEventListener("scroll", handleInteraction);
      window.removeEventListener("mousemove", handleInteraction);
      window.removeEventListener("touchstart", handleInteraction);
    };
    window.addEventListener("scroll", handleInteraction, { passive: true });
    window.addEventListener("mousemove", handleInteraction, { passive: true });
    window.addEventListener("touchstart", handleInteraction, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleInteraction);
      window.removeEventListener("mousemove", handleInteraction);
      window.removeEventListener("touchstart", handleInteraction);
    };
  }, []);

  useEffect(() => {
    if (!hasInteracted || typeof window === "undefined") return;

    let isMounted = true;

    const initCookieConsent = async () => {
      try {
        const CookieConsent = await import("vanilla-cookieconsent");

        if (!isMounted) return;

        const normalizedLang = lang.split("-")[0].toLowerCase();
        const supportedLanguages = ["en", "es", "fr"];
        const selectedLang = supportedLanguages.includes(normalizedLang) ? normalizedLang : "en";

        const defaultSettings: CookieConsentSettings = {
          consentModal: {
            layout: "box",
            position: "bottom right",
            equalWeightButtons: true,
            flipButtons: false,
          },
          preferencesModal: {
            layout: "box",
            position: "right",
            equalWeightButtons: true,
            flipButtons: false,
          },
        };

        const guiSettings = settings || defaultSettings;
        
        CookieConsent.run({
          disablePageInteraction: true,
          hideFromBots: true,
          cookie: {
            name: "cc_cookie",
            domain: window.location.hostname,
            path: "/",
            sameSite: "Lax",
            expiresAfterDays: 365,
          },
          guiOptions: {
            consentModal: {
              layout: guiSettings.consentModal.layout,
              position: guiSettings.consentModal.position,
              equalWeightButtons: guiSettings.consentModal.equalWeightButtons,
              flipButtons: guiSettings.consentModal.flipButtons,
            },
            preferencesModal: {
              layout: guiSettings.preferencesModal.layout,
              position: guiSettings.preferencesModal.position,
              equalWeightButtons: guiSettings.preferencesModal.equalWeightButtons,
              flipButtons: guiSettings.preferencesModal.flipButtons,
            },
          },
          categories: {
            necessary: {
              enabled: true,
              readOnly: true,
            },
            analytics: {
              enabled: false,
              readOnly: false,
              autoClear: {
                cookies: [
                  {
                    name: /^(_ga|_gid)/,
                  },
                ],
              },
            },
            targeting: {
              enabled: false,
              readOnly: false,
            },
          },
          language: {
            default: selectedLang,
            autoDetect: "document",
            translations: {
              en: async () => {
                const response = await fetch("/cookie-consent/translations/en.json");
                return await response.json();
              },
              es: async () => {
                const response = await fetch("/cookie-consent/translations/es.json");
                return await response.json();
              },
              fr: async () => {
                const response = await fetch("/cookie-consent/translations/fr.json");
                return await response.json();
              },
            },
          },
          onFirstConsent: ({ cookie }) => {
            console.log("Cookie consent initialized:", cookie);
            if (cookie.categories.includes("analytics")) {
              console.log("Analytics enabled");
            }
          },

          onChange: ({ changedCategories, changedServices }) => {
            console.log("Consent preferences changed:", {
              categories: changedCategories,
              services: changedServices,
            });
            if (changedCategories.includes("analytics")) {
              console.log("Analytics preference changed");
            }
          },
        });
      } catch (error) {
        console.error("Failed to initialize cookie consent:", error);
      }
    };

    initCookieConsent();

    return () => {
      isMounted = false;
    };
  }, [hasInteracted, lang, settings]);
  return null;
}
