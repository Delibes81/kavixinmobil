# Nova Hestia - Real Estate Website

A modern, responsive real estate website built with React, TypeScript, and Tailwind CSS.

## Features

- Property listings with advanced search and filtering
- Property detail pages with image galleries and maps
- Responsive design for all devices
- Admin panel for property management
- Contact forms and WhatsApp integration
- Modern UI with smooth animations

## Technologies Used

- React 19
- TypeScript 6
- Vite 8
- Tailwind CSS 4
- React Router 8
- Supabase
- Mapbox GL
- React Slick Carousel
- Lucide React Icons

## Getting Started

Requires Node.js 22.12+ and [pnpm](https://pnpm.io) 10 (`corepack enable` installs the version pinned in `package.json`).

1. Install dependencies:
```bash
pnpm install
```

2. Start the development server:
```bash
pnpm dev
```

3. Build for production:
```bash
pnpm build
```

## Deploy en Vercel

1. Importa el repositorio en Vercel (preset **Vite**; `vercel.json` ya define build, salida `dist`, rutas SPA y cabeceras de seguridad).
2. En **Settings → Environment Variables** añade:
   - `VITE_SUPABASE_URL` — Supabase → Project Settings → API → Project URL
   - `VITE_SUPABASE_ANON_KEY` — Supabase → Project Settings → API → clave `anon` `public` (nunca la `service_role`)
   - `VITE_MAPBOX_ACCESS_TOKEN` — account.mapbox.com → Access tokens (`pk.…`)
   - `VITE_SITE_URL` — tu dominio final, p. ej. `https://tudominio.com` (canonical, Open Graph y sitemap)
   - `VITE_GA_MEASUREMENT_ID` — (opcional) ID de Google Analytics 4, `G-XXXXXXXXXX`
3. Despliega. Si cambias alguna variable después, haz **Redeploy** (Vite las incrusta en el build).

## SEO

- `src/seo/meta.ts` define título, descripción y datos estructurados (JSON-LD) de cada página; `<Seo>` los aplica en el navegador.
- En el build, `vite/seo-plugin.ts` genera un HTML por ruta pública (inicio, propiedades, blog, nosotros, contacto, cada artículo y cada propiedad leída de Supabase) con sus metadatos ya incluidos, más `sitemap.xml` y `robots.txt`.
- Las propiedades nuevas aparecen en el sitemap y en las vistas previas de redes al siguiente deploy. Para automatizarlo, crea un *Deploy Hook* en Vercel y llámalo desde un webhook de Supabase al insertar o actualizar en `properties`.
- Tras publicar, da de alta el dominio en Google Search Console y envía `https://tudominio.com/sitemap.xml`.

## Analítica

- **Vercel Web Analytics y Speed Insights**: ya integrados (`@vercel/analytics`, `@vercel/speed-insights`). Actívalos en Vercel → proyecto → pestañas **Analytics** y **Speed Insights** → *Enable*.
- **Google Analytics 4**: crea una propiedad en analytics.google.com → *Flujo de datos web* y copia el ID `G-…` en `VITE_GA_MEASUREMENT_ID`. Solo se carga en producción.
- Se registran páginas vistas (sin `/admin` ni `/login`) y el evento `generate_lead` con `method` = `whatsapp`, `phone`, `email` o `form`. En GA4 márcalo como *evento clave* para medir contactos.

## Project Structure

- `/src/components` - Reusable UI components
- `/src/pages` - Page components
- `/src/data` - Mock data for properties
- `/src/types` - TypeScript type definitions

## License

This project is private and proprietary.