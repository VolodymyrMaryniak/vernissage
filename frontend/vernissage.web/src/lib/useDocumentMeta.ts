import { useEffect } from 'react';

interface DocumentMeta {
  title: string;
  description?: string;
  /** Adds <meta name="robots" content="noindex"> while the route is mounted. */
  noIndex?: boolean;
}

function setMeta(selector: string, attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

/**
 * Sets the document <title> and description/OG meta tags for a route.
 * Each page calls this so entries are titled and shareable without a
 * server render. The title is suffixed with the site name.
 */
export function useDocumentMeta({ title, description, noIndex }: DocumentMeta): void {
  useEffect(() => {
    const fullTitle = title ? `${title} · Vernissage` : 'Vernissage · archive';
    document.title = fullTitle;

    if (description) {
      setMeta('meta[name="description"]', 'name', 'description', description);
      setMeta('meta[property="og:description"]', 'property', 'og:description', description);
    }
    setMeta('meta[property="og:title"]', 'property', 'og:title', fullTitle);

    if (!noIndex) return;
    // Removed on unmount so the tag doesn't leak into the next route.
    setMeta('meta[name="robots"]', 'name', 'robots', 'noindex');
    return () => {
      document.head.querySelector('meta[name="robots"]')?.remove();
    };
  }, [title, description, noIndex]);
}
