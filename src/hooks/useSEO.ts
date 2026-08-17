import { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  article?: {
    publishedTime?: string;
    modifiedTime?: string;
    author?: string;
    tags?: string[];
  };
}

const SITE_NAME = 'Spiritual Journey';
const SITE_URL = 'https://spiritualjourney.vercel.app';
const DEFAULT_DESCRIPTION =
  'Spiritual Journey is a space for biblical reflections, honest conversations, teachings and resources designed to help you grow in your walk with God.';
const DEFAULT_IMAGE = `${SITE_URL}/og-image.png`;

export function useSEO({
  title,
  description = DEFAULT_DESCRIPTION,
  image = DEFAULT_IMAGE,
  url,
  type = 'website',
  article,
}: SEOProps = {}) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
  const canonicalUrl = url ? `${SITE_URL}${url}` : SITE_URL;

  useEffect(() => {
    // Title
    document.title = fullTitle;

    // Helper to upsert <meta>
    const setMeta = (selector: string, content: string) => {
      let el = document.querySelector<HTMLMetaElement>(selector);
      if (!el) {
        el = document.createElement('meta');
        const attr = selector.startsWith('meta[name')
          ? 'name'
          : selector.startsWith('meta[property')
          ? 'property'
          : 'name';
        const val = selector.match(/["']([^"']+)["']/)?.[1] ?? '';
        el.setAttribute(attr, val);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    // Helper to upsert <link>
    const setLink = (rel: string, href: string) => {
      let el = document.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
      if (!el) {
        el = document.createElement('link');
        el.rel = rel;
        document.head.appendChild(el);
      }
      el.href = href;
    };

    // Standard meta
    setMeta('meta[name="description"]', description);

    // Canonical
    setLink('canonical', canonicalUrl);

    // Open Graph
    setMeta('meta[property="og:title"]', fullTitle);
    setMeta('meta[property="og:description"]', description);
    setMeta('meta[property="og:image"]', image);
    setMeta('meta[property="og:url"]', canonicalUrl);
    setMeta('meta[property="og:type"]', type);
    setMeta('meta[property="og:site_name"]', SITE_NAME);

    // Twitter Card
    setMeta('meta[name="twitter:card"]', 'summary_large_image');
    setMeta('meta[name="twitter:title"]', fullTitle);
    setMeta('meta[name="twitter:description"]', description);
    setMeta('meta[name="twitter:image"]', image);

    // Article-specific
    if (type === 'article' && article) {
      if (article.publishedTime) setMeta('meta[property="article:published_time"]', article.publishedTime);
      if (article.modifiedTime) setMeta('meta[property="article:modified_time"]', article.modifiedTime);
      if (article.author) setMeta('meta[property="article:author"]', article.author);
      if (article.tags) {
        article.tags.forEach(tag => {
          const el = document.createElement('meta');
          el.setAttribute('property', 'article:tag');
          el.setAttribute('content', tag);
          document.head.appendChild(el);
        });
      }
    }
  }, [fullTitle, description, image, canonicalUrl, type]);
}
