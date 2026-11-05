/**
 * Metadatos SEO compartidos entre el navegador (componente <Seo>) y el build
 * (plugin de Vite que genera HTML por ruta, sitemap.xml y robots.txt).
 * Este archivo no debe usar APIs del DOM.
 */

export const SITE = {
  name: 'Nova Hestia',
  defaultTitle: 'Nova Hestia | Encuentra tu hogar ideal',
  description:
    'Casas, departamentos y locales en venta y renta en Ciudad de México. Asesoría inmobiliaria profesional con Nova Hestia: compra, venta, renta, avalúos y asesoría legal.',
  image: 'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=1200',
  locale: 'es_MX',
  language: 'es-MX',
  themeColor: '#0052a3',
  phone: '+52 55 4448 8414',
  email: 'contacto@novahestia.com',
  address: {
    streetAddress: 'José Azueta 29, Colonia Avante',
    addressLocality: 'Coyoacán',
    addressRegion: 'Ciudad de México',
    postalCode: '04460',
    addressCountry: 'MX',
  },
} as const;

export type JsonLd = Record<string, unknown>;

/** Imagen principal de la portada (elemento LCP), en varios tamaños. */
const HERO_BASE = 'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb';
export const HERO_IMAGE = {
  src: `${HERO_BASE}&w=1920`,
  srcSet: [768, 1280, 1920].map((w) => `${HERO_BASE}&w=${w} ${w}w`).join(', '),
  sizes: '100vw',
};

export interface PageMeta {
  /** Título completo de la página (ya incluye la marca). */
  title: string;
  description: string;
  /** Ruta absoluta desde la raíz, p. ej. "/propiedades/123". */
  path: string;
  image?: string;
  type?: 'website' | 'article';
  noindex?: boolean;
  jsonLd?: JsonLd[];
  /** Imagen a precargar (elemento LCP de la página). */
  preloadImage?: { srcSet: string; sizes: string };
  /** Solo para artículos. */
  publishedTime?: string;
  modifiedTime?: string;
}

export const absoluteUrl = (siteUrl: string, path: string) =>
  path.startsWith('http') ? path : `${siteUrl.replace(/\/$/, '')}${path === '/' ? '/' : path}`;

const truncate = (text: string, max = 160) => {
  const clean = text.replace(/[#*_>`[\]]/g, '').replace(/\s+/g, ' ').trim();
  return clean.length <= max ? clean : `${clean.slice(0, max - 1).replace(/\s+\S*$/, '')}…`;
};

const formatPrice = (precio: number) =>
  new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 }).format(precio);

// ---------------------------------------------------------------------------
// Datos estructurados (schema.org)
// ---------------------------------------------------------------------------

export const organizationJsonLd = (siteUrl: string): JsonLd => ({
  '@context': 'https://schema.org',
  '@type': 'RealEstateAgent',
  '@id': `${absoluteUrl(siteUrl, '/')}#organization`,
  name: SITE.name,
  url: absoluteUrl(siteUrl, '/'),
  logo: absoluteUrl(siteUrl, '/nova.svg'),
  image: SITE.image,
  description: SITE.description,
  telephone: SITE.phone,
  email: SITE.email,
  priceRange: '$$$',
  areaServed: { '@type': 'City', name: 'Ciudad de México' },
  address: { '@type': 'PostalAddress', ...SITE.address },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '09:00',
      closes: '19:00',
    },
    { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Saturday', opens: '10:00', closes: '14:00' },
  ],
});

export const websiteJsonLd = (siteUrl: string): JsonLd => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${absoluteUrl(siteUrl, '/')}#website`,
  name: SITE.name,
  url: absoluteUrl(siteUrl, '/'),
  inLanguage: SITE.language,
  publisher: { '@id': `${absoluteUrl(siteUrl, '/')}#organization` },
});

export const breadcrumbJsonLd = (siteUrl: string, items: { name: string; path: string }[]): JsonLd => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: absoluteUrl(siteUrl, item.path),
  })),
});

// ---------------------------------------------------------------------------
// Páginas estáticas
// ---------------------------------------------------------------------------

export const STATIC_PAGES: Record<string, Omit<PageMeta, 'path'> & { priority: number; changefreq: string }> = {
  '/': {
    title: SITE.defaultTitle,
    description: SITE.description,
    priority: 1.0,
    changefreq: 'daily',
  },
  '/propiedades': {
    title: 'Propiedades en venta y renta en CDMX | Nova Hestia',
    description:
      'Explora casas, departamentos, locales, oficinas y terrenos en venta y renta en Ciudad de México. Filtra por precio, recámaras, baños y ubicación.',
    priority: 0.9,
    changefreq: 'daily',
  },
  '/blog': {
    title: 'Blog inmobiliario: guías y consejos | Nova Hestia',
    description:
      'Guías para comprar tu primera casa, invertir en bienes raíces y conocer las mejores colonias de la CDMX. Consejos de expertos inmobiliarios.',
    priority: 0.7,
    changefreq: 'weekly',
  },
  '/nosotros': {
    title: 'Nosotros: tu inmobiliaria de confianza en CDMX | Nova Hestia',
    description:
      'Conoce al equipo de Nova Hestia, nuestra misión y los valores que nos guían para ayudarte a encontrar, vender o rentar tu propiedad en Ciudad de México.',
    priority: 0.6,
    changefreq: 'monthly',
  },
  '/contacto': {
    title: 'Contacto | Nova Hestia',
    description:
      'Contáctanos por teléfono, WhatsApp o correo. Oficina en Coyoacán, Ciudad de México. Lunes a viernes 9:00–19:00 y sábados 10:00–14:00.',
    priority: 0.6,
    changefreq: 'yearly',
  },
};

export const staticPageMeta = (siteUrl: string, path: keyof typeof STATIC_PAGES): PageMeta => {
  const page = STATIC_PAGES[path];
  const jsonLd: JsonLd[] =
    path === '/'
      ? [organizationJsonLd(siteUrl), websiteJsonLd(siteUrl)]
      : path === '/contacto'
        ? [organizationJsonLd(siteUrl)]
        : [];
  if (path !== '/') {
    jsonLd.push(
      breadcrumbJsonLd(siteUrl, [
        { name: 'Inicio', path: '/' },
        { name: page.title.split(/[:|]/)[0].trim(), path },
      ]),
    );
  }
  return {
    title: page.title,
    description: page.description,
    path,
    jsonLd,
    preloadImage: path === '/' ? { srcSet: HERO_IMAGE.srcSet, sizes: HERO_IMAGE.sizes } : undefined,
  };
};

export const NOINDEX_META = (title: string, path: string): PageMeta => ({
  title,
  description: SITE.description,
  path,
  noindex: true,
});

// ---------------------------------------------------------------------------
// Propiedades
// ---------------------------------------------------------------------------

export interface SeoProperty {
  id: string;
  titulo: string;
  descripcion?: string | null;
  precio?: number | null;
  operacion?: string | null;
  tipo?: string | null;
  recamaras?: number | null;
  banos?: number | null;
  metros_construccion?: number | null;
  colonia?: string | null;
  ciudad?: string | null;
  estado?: string | null;
  codigo_postal?: string | null;
  latitud?: number | null;
  longitud?: number | null;
  imagenes?: string[] | null;
  disponible?: boolean | null;
  fecha_creacion?: string | null;
  fecha_actualizacion?: string | null;
}

export const propertyPath = (id: string) => `/propiedades/${id}`;

export const propertyMeta = (siteUrl: string, p: SeoProperty): PageMeta => {
  const path = propertyPath(p.id);
  const ubicacion = [p.colonia, p.ciudad].filter(Boolean).join(', ');
  const tipo = p.tipo ? `${p.tipo.charAt(0).toUpperCase()}${p.tipo.slice(1)}` : 'Propiedad';
  const resumen = [
    `${tipo}${p.operacion ? ` en ${p.operacion}` : ''}${ubicacion ? ` en ${ubicacion}` : ''}`,
    p.precio ? formatPrice(p.precio) + (p.operacion === 'renta' ? '/mes' : '') : null,
    p.recamaras ? `${p.recamaras} rec.` : null,
    p.banos ? `${p.banos} baños` : null,
    p.metros_construccion ? `${p.metros_construccion} m²` : null,
  ]
    .filter(Boolean)
    .join(' · ');
  const description = truncate(`${resumen}. ${p.descripcion ?? ''}`);
  const images = (p.imagenes ?? []).filter(Boolean);

  const listing: JsonLd = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    name: p.titulo,
    description: truncate(p.descripcion ?? description, 500),
    url: absoluteUrl(siteUrl, path),
    image: images.length ? images : undefined,
    datePosted: p.fecha_creacion ?? undefined,
    dateModified: p.fecha_actualizacion ?? undefined,
    offers: p.precio
      ? {
          '@type': 'Offer',
          price: p.precio,
          priceCurrency: 'MXN',
          businessFunction: p.operacion === 'renta' ? 'http://purl.org/goodrelations/v1#LeaseOut' : 'http://purl.org/goodrelations/v1#Sell',
          availability: p.disponible === false ? 'https://schema.org/SoldOut' : 'https://schema.org/InStock',
          seller: { '@id': `${absoluteUrl(siteUrl, '/')}#organization` },
        }
      : undefined,
    about: {
      '@type': p.tipo === 'casa' ? 'House' : p.tipo === 'departamento' ? 'Apartment' : 'Place',
      name: p.titulo,
      numberOfRooms: p.recamaras ?? undefined,
      numberOfBathroomsTotal: p.banos ?? undefined,
      floorSize: p.metros_construccion
        ? { '@type': 'QuantitativeValue', value: p.metros_construccion, unitCode: 'MTK' }
        : undefined,
      address: {
        '@type': 'PostalAddress',
        addressLocality: p.colonia ?? undefined,
        addressRegion: p.estado ?? p.ciudad ?? undefined,
        postalCode: p.codigo_postal ?? undefined,
        addressCountry: 'MX',
      },
      geo:
        p.latitud && p.longitud
          ? { '@type': 'GeoCoordinates', latitude: p.latitud, longitude: p.longitud }
          : undefined,
    },
  };

  return {
    title: `${p.titulo} | Nova Hestia`,
    description,
    path,
    image: images[0],
    jsonLd: [
      listing,
      breadcrumbJsonLd(siteUrl, [
        { name: 'Inicio', path: '/' },
        { name: 'Propiedades', path: '/propiedades' },
        { name: p.titulo, path },
      ]),
    ],
  };
};

// ---------------------------------------------------------------------------
// Blog
// ---------------------------------------------------------------------------

export interface SeoBlogPost {
  slug: string;
  title: string;
  excerpt: string;
  author: string;
  publishDate: string;
  imageUrl: string;
  tags: string[];
}

export const blogPath = (slug: string) => `/blog/${slug}`;

export const blogPostMeta = (siteUrl: string, post: SeoBlogPost): PageMeta => {
  const path = blogPath(post.slug);
  return {
    title: `${post.title} | Blog Nova Hestia`,
    description: truncate(post.excerpt),
    path,
    image: post.imageUrl,
    type: 'article',
    publishedTime: post.publishDate,
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: post.title,
        description: post.excerpt,
        image: post.imageUrl,
        datePublished: post.publishDate,
        dateModified: post.publishDate,
        inLanguage: SITE.language,
        keywords: post.tags.join(', '),
        author: { '@type': 'Person', name: post.author },
        publisher: { '@id': `${absoluteUrl(siteUrl, '/')}#organization` },
        mainEntityOfPage: absoluteUrl(siteUrl, path),
      },
      breadcrumbJsonLd(siteUrl, [
        { name: 'Inicio', path: '/' },
        { name: 'Blog', path: '/blog' },
        { name: post.title, path },
      ]),
    ],
  };
};

// ---------------------------------------------------------------------------
// Etiquetas <head>
// ---------------------------------------------------------------------------

export interface HeadTag {
  tag: 'meta' | 'link' | 'script';
  attrs: Record<string, string>;
  content?: string;
}

/** Lista de etiquetas para el <head>, usada tanto en el build como en el navegador. */
export const buildHeadTags = (siteUrl: string, meta: PageMeta): HeadTag[] => {
  const url = absoluteUrl(siteUrl, meta.path);
  const image = meta.image || SITE.image;
  const tags: HeadTag[] = [
    { tag: 'meta', attrs: { name: 'description', content: meta.description } },
    { tag: 'meta', attrs: { name: 'robots', content: meta.noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large' } },
    { tag: 'meta', attrs: { property: 'og:site_name', content: SITE.name } },
    { tag: 'meta', attrs: { property: 'og:locale', content: SITE.locale } },
    { tag: 'meta', attrs: { property: 'og:type', content: meta.type ?? 'website' } },
    { tag: 'meta', attrs: { property: 'og:title', content: meta.title } },
    { tag: 'meta', attrs: { property: 'og:description', content: meta.description } },
    { tag: 'meta', attrs: { property: 'og:url', content: url } },
    { tag: 'meta', attrs: { property: 'og:image', content: image } },
    { tag: 'meta', attrs: { property: 'og:image:alt', content: meta.title } },
    { tag: 'meta', attrs: { name: 'twitter:card', content: 'summary_large_image' } },
    { tag: 'meta', attrs: { name: 'twitter:title', content: meta.title } },
    { tag: 'meta', attrs: { name: 'twitter:description', content: meta.description } },
    { tag: 'meta', attrs: { name: 'twitter:image', content: image } },
  ];
  if (!meta.noindex) tags.push({ tag: 'link', attrs: { rel: 'canonical', href: url } });
  if (meta.preloadImage) {
    tags.push({
      tag: 'link',
      attrs: {
        rel: 'preload',
        as: 'image',
        imagesrcset: meta.preloadImage.srcSet,
        imagesizes: meta.preloadImage.sizes,
        fetchpriority: 'high',
      },
    });
  }
  if (meta.publishedTime) tags.push({ tag: 'meta', attrs: { property: 'article:published_time', content: meta.publishedTime } });
  if (meta.modifiedTime) tags.push({ tag: 'meta', attrs: { property: 'article:modified_time', content: meta.modifiedTime } });
  for (const data of meta.jsonLd ?? []) {
    tags.push({ tag: 'script', attrs: { type: 'application/ld+json' }, content: JSON.stringify(data) });
  }
  return tags;
};
