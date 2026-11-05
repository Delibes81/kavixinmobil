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
3. Despliega. Si cambias alguna variable después, haz **Redeploy** (Vite las incrusta en el build).

## Project Structure

- `/src/components` - Reusable UI components
- `/src/pages` - Page components
- `/src/data` - Mock data for properties
- `/src/types` - TypeScript type definitions

## License

This project is private and proprietary.