import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import seoPlugin from './vite/seo-plugin.ts';
import { blogPosts } from './src/data/blogPosts.ts';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = { ...loadEnv(mode, process.cwd(), ''), ...process.env };

  // URL pública del sitio: VITE_SITE_URL > dominio de producción de Vercel > valor por defecto
  const siteUrl = (
    env.VITE_SITE_URL ||
    (env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${env.VERCEL_PROJECT_PRODUCTION_URL}` : '') ||
    'https://novahestia.com'
  ).replace(/\/$/, '');

  return {
    plugins: [
      react(),
      tailwindcss(),
      seoPlugin({
        siteUrl,
        blogPosts,
        supabaseUrl: env.VITE_SUPABASE_URL,
        supabaseAnonKey: env.VITE_SUPABASE_ANON_KEY,
      }),
    ],
    define: {
      __SITE_URL__: JSON.stringify(siteUrl),
    },
    build: {
      outDir: 'dist',
      sourcemap: false,
      target: 'es2022',
      chunkSizeWarningLimit: 2000, // mapbox-gl pesa ~1.9 MB y se carga de forma diferida
      reportCompressedSize: false,
      rolldownOptions: {
        output: {
          minify: {
            compress: { dropConsole: true, dropDebugger: true },
          },
          codeSplitting: {
            groups: [
              { name: 'vendor', test: /node_modules[\\/](react|react-dom|scheduler)[\\/]/ },
              { name: 'router', test: /node_modules[\\/]react-router[\\/]/ },
              { name: 'ui', test: /node_modules[\\/]lucide-react[\\/]/ },
              { name: 'slider', test: /node_modules[\\/](react-slick|slick-carousel)[\\/]/ },
              { name: 'supabase', test: /node_modules[\\/]@supabase[\\/]/ },
            ],
          },
          chunkFileNames: 'assets/[name]-[hash].js',
          entryFileNames: 'assets/[name]-[hash].js',
          assetFileNames: 'assets/[name]-[hash].[ext]',
        },
      },
    },
    server: {
      hmr: { overlay: false },
    },
  };
});
