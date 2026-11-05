/// <reference types="vite/client" />

/** URL pública del sitio (VITE_SITE_URL o dominio de producción de Vercel), inyectada en el build. */
declare const __SITE_URL__: string;

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL?: string;
  readonly VITE_SUPABASE_ANON_KEY?: string;
  readonly VITE_MAPBOX_ACCESS_TOKEN?: string;
  readonly VITE_SITE_URL?: string;
  readonly VITE_GA_MEASUREMENT_ID?: string;
}
