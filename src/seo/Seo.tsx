import { useEffect } from 'react';
import { buildHeadTags, type PageMeta } from './meta';
import { SITE_URL } from './siteUrl';
import { trackPageView } from '../lib/analytics';

const MARK = 'data-seo';

/**
 * Actualiza <title>, meta descripción, canonical, Open Graph, Twitter y JSON-LD.
 * Reemplaza las etiquetas que el build pregenera en el HTML (marcadas con data-seo),
 * así nunca hay duplicados.
 */
const Seo = (meta: PageMeta) => {
  const key = JSON.stringify(meta);

  useEffect(() => {
    const current = JSON.parse(key) as PageMeta;
    document.title = current.title;
    document.head.querySelectorAll(`[${MARK}]`).forEach((el) => el.remove());

    const fragment = document.createDocumentFragment();
    for (const { tag, attrs, content } of buildHeadTags(SITE_URL, current)) {
      const el = document.createElement(tag);
      for (const [name, value] of Object.entries(attrs)) el.setAttribute(name, value);
      if (content) el.textContent = content;
      el.setAttribute(MARK, '');
      fragment.appendChild(el);
    }
    document.head.appendChild(fragment);

    trackPageView(current.title);
  }, [key]);

  return null;
};

export default Seo;
