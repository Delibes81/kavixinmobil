import fs from 'node:fs/promises';
import path from 'node:path';
import type { Plugin, ResolvedConfig } from 'vite';
import {
  STATIC_PAGES,
  blogPostMeta,
  buildHeadTags,
  propertyMeta,
  staticPageMeta,
  absoluteUrl,
  type PageMeta,
  type SeoBlogPost,
  type SeoProperty,
} from '../src/seo/meta.ts';

interface SeoPluginOptions {
  siteUrl: string;
  blogPosts: SeoBlogPost[];
  supabaseUrl?: string;
  supabaseAnonKey?: string;
}

const START = '<!--seo:start-->';
const END = '<!--seo:end-->';

const escapeAttr = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const renderHead = (siteUrl: string, meta: PageMeta) =>
  buildHeadTags(siteUrl, meta)
    .map(({ tag, attrs, content }) => {
      const attributes = Object.entries(attrs)
        .map(([k, v]) => `${k}="${escapeAttr(v)}"`)
        .join(' ');
      return tag === 'script'
        ? `<script ${attributes} data-seo>${(content ?? '').replace(/</g, '\\u003c')}</script>`
        : `<${tag} ${attributes} data-seo>`;
    })
    .join('\n    ');

const applyMeta = (html: string, siteUrl: string, meta: PageMeta) => {
  const start = html.indexOf(START);
  const end = html.indexOf(END);
  if (start === -1 || end === -1) throw new Error('[seo] Faltan los marcadores <!--seo:start--> / <!--seo:end--> en index.html');
  return (
    html.slice(0, start + START.length) +
    '\n    ' +
    renderHead(siteUrl, meta) +
    '\n    ' +
    html.slice(end)
  ).replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeAttr(meta.title)}</title>`);
};

/** Lee las propiedades públicas desde la API REST de Supabase (si hay credenciales). */
const fetchProperties = async (url?: string, key?: string): Promise<SeoProperty[]> => {
  if (!url || !key || url.includes('your-project')) {
    console.warn('[seo] Supabase no configurado: no se pregeneran páginas de propiedades.');
    return [];
  }
  const fields =
    'id,titulo,descripcion,precio,operacion,tipo,recamaras,banos,metros_construccion,colonia,ciudad,estado,codigo_postal,latitud,longitud,imagenes,disponible,fecha_creacion,fecha_actualizacion';
  try {
    const res = await fetch(`${url.replace(/\/$/, '')}/rest/v1/properties?select=${fields}&order=fecha_creacion.desc`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = (await res.json()) as SeoProperty[];
    return data.filter((p) => p.disponible !== false);
  } catch (error) {
    console.warn(`[seo] No se pudieron leer las propiedades de Supabase (${(error as Error).message}).`);
    return [];
  }
};

const sitemapEntry = (loc: string, lastmod?: string | null, changefreq?: string, priority?: number) =>
  [
    '  <url>',
    `    <loc>${escapeAttr(loc)}</loc>`,
    lastmod ? `    <lastmod>${new Date(lastmod).toISOString().slice(0, 10)}</lastmod>` : null,
    changefreq ? `    <changefreq>${changefreq}</changefreq>` : null,
    priority !== undefined ? `    <priority>${priority.toFixed(1)}</priority>` : null,
    '  </url>',
  ]
    .filter(Boolean)
    .join('\n');

/**
 * - En dev y build: inyecta en index.html los metadatos de la página de inicio.
 * - En build: escribe un HTML por ruta pública (dist/<ruta>.html) con su título,
 *   descripción, Open Graph y JSON-LD, para buscadores y vistas previas en redes
 *   sociales, además de sitemap.xml y robots.txt.
 */
export default function seoPlugin(options: SeoPluginOptions): Plugin {
  const { siteUrl, blogPosts } = options;
  let config: ResolvedConfig;

  return {
    name: 'nova-hestia-seo',

    configResolved(resolved) {
      config = resolved;
    },

    transformIndexHtml(html) {
      return applyMeta(html, siteUrl, staticPageMeta(siteUrl, '/'));
    },

    async closeBundle() {
      if (config.command !== 'build') return;
      const outDir = path.resolve(config.root, config.build.outDir);
      const template = await fs.readFile(path.join(outDir, 'index.html'), 'utf8');
      const properties = await fetchProperties(options.supabaseUrl, options.supabaseAnonKey);
      const today = new Date().toISOString();

      const pages: { meta: PageMeta; lastmod?: string | null; changefreq?: string; priority?: number }[] = [
        ...Object.entries(STATIC_PAGES).map(([p, page]) => ({
          meta: staticPageMeta(siteUrl, p),
          lastmod: today,
          changefreq: page.changefreq,
          priority: page.priority,
        })),
        ...blogPosts.map((post) => ({
          meta: blogPostMeta(siteUrl, post),
          lastmod: post.publishDate,
          changefreq: 'monthly',
          priority: 0.6,
        })),
        ...properties.map((property) => ({
          meta: propertyMeta(siteUrl, property),
          lastmod: property.fecha_actualizacion ?? property.fecha_creacion,
          changefreq: 'weekly',
          priority: 0.8,
        })),
      ];

      for (const { meta } of pages) {
        if (meta.path === '/') continue; // index.html ya tiene los de inicio
        const file = path.join(outDir, `${meta.path.replace(/^\//, '')}.html`);
        await fs.mkdir(path.dirname(file), { recursive: true });
        await fs.writeFile(file, applyMeta(template, siteUrl, meta));
      }

      const sitemap = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
        ...pages.map((p) => sitemapEntry(absoluteUrl(siteUrl, p.meta.path), p.lastmod, p.changefreq, p.priority)),
        '</urlset>',
        '',
      ].join('\n');
      await fs.writeFile(path.join(outDir, 'sitemap.xml'), sitemap);

      const robots = [
        'User-agent: *',
        'Allow: /',
        'Disallow: /admin',
        'Disallow: /login',
        '',
        `Sitemap: ${absoluteUrl(siteUrl, '/sitemap.xml')}`,
        '',
      ].join('\n');
      await fs.writeFile(path.join(outDir, 'robots.txt'), robots);

      config.logger.info(
        `[seo] ${pages.length - 1} páginas pregeneradas (${properties.length} propiedades, ${blogPosts.length} artículos) + sitemap.xml y robots.txt para ${siteUrl}`,
      );
    },
  };
}
