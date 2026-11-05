import { track as vercelTrack } from '@vercel/analytics/react';

/**
 * Google Analytics 4 (gtag.js). Solo se carga en producción y si existe
 * VITE_GA_MEASUREMENT_ID (formato G-XXXXXXXXXX). Las páginas vistas se envían
 * desde <Seo> cuando cada página ya tiene su título final.
 */
const GA_ID = import.meta.env.VITE_GA_MEASUREMENT_ID?.trim();
const GA_ENABLED = Boolean(GA_ID) && import.meta.env.PROD;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

/** Rutas privadas que nunca se registran. */
export const isPrivatePath = (pathname: string) => /^\/(admin|login)(\/|$)/.test(pathname);

export const initGoogleAnalytics = () => {
  if (!GA_ENABLED || window.gtag) return;

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    // gtag.js necesita el objeto `arguments`, no un array
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer!.push(arguments);
  };
  window.gtag('js', new Date());
  window.gtag('config', GA_ID, { send_page_view: false });

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_ID!)}`;
  document.head.appendChild(script);

  initLeadTracking();
};

let lastTrackedPath = '';

export const trackPageView = (title: string) => {
  if (!window.gtag) return;
  const path = window.location.pathname + window.location.search;
  if (path === lastTrackedPath || isPrivatePath(window.location.pathname)) return;
  lastTrackedPath = path;
  window.gtag('event', 'page_view', {
    page_title: title,
    page_location: window.location.href,
    page_path: path,
  });
};

type LeadMethod = 'whatsapp' | 'phone' | 'email' | 'form';

/**
 * Registra un contacto (lead) en GA4 como `generate_lead` y en Vercel Analytics
 * como evento personalizado (los eventos personalizados de Vercel requieren plan Pro).
 * Nunca se envían datos personales.
 */
export const trackLead = (method: LeadMethod, extra: Record<string, string> = {}) => {
  const params = { method, page_path: window.location.pathname, ...extra };
  window.gtag?.('event', 'generate_lead', params);
  vercelTrack('Lead', params);
};

/** Detecta clics en enlaces de WhatsApp, teléfono y correo en todo el sitio. */
const initLeadTracking = () => {
  document.addEventListener(
    'click',
    (event) => {
      const link = (event.target as Element | null)?.closest?.('a[href]');
      if (!link) return;
      const href = link.getAttribute('href') ?? '';
      if (/^https:\/\/(wa\.me|api\.whatsapp\.com)\//.test(href)) trackLead('whatsapp');
      else if (href.startsWith('tel:')) trackLead('phone');
      else if (href.startsWith('mailto:')) trackLead('email');
    },
    { capture: true },
  );
};
