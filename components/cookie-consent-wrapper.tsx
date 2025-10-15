'use client';
import dynamic from 'next/dynamic';

type ConsentModalPosition = 'top left' | 'top center' | 'top right' | 'middle left' | 'middle center' | 'middle right' | 'bottom left' | 'bottom center' | 'bottom right';
type ConsentModalLayout = 'box' | 'box wide' | 'box inline' | 'cloud' | 'cloud inline' | 'bar' | 'bar inline';

export interface CookieConsentSettings {
  consentModal: {
    layout: ConsentModalLayout;
    position: ConsentModalPosition;
    equalWeightButtons: boolean;
    flipButtons: boolean;
  };
  preferencesModal: {
    layout: 'box' | 'bar';
    position: 'left' | 'right';
    equalWeightButtons: boolean;
    flipButtons: boolean;
  };
}

const CookieConsentDynamic = dynamic(
  () => import('./cookie-consent').then((mod) => mod.CookieConsent),
  { 
    ssr: false,
    loading: () => null,
  }
);

export function CookieConsentWrapper({ lang, settings }: { lang?: string; settings?: CookieConsentSettings }) {
  return <CookieConsentDynamic lang={lang} settings={settings} />;
}
