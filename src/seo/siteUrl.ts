/** URL pública del sitio, inyectada en el build (ver vite.config.ts). */
export const SITE_URL: string =
  typeof __SITE_URL__ !== 'undefined' && __SITE_URL__ ? __SITE_URL__ : window.location.origin;
