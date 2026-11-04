import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { get } from '../services/api';
import { useSite } from '../context/SiteContext';

// Renders <title>/<meta>/<link> (hoisted to <head> by React 19). Page-level overrides come from the admin SEO panel.
export default function Seo({ page, title, description, keywords, image, canonical, jsonLd, noindex = false }) {
  const { pathname } = useLocation();
  const { settings } = useSite();
  const [override, setOverride] = useState(null);

  useEffect(() => {
    let active = true;
    if (!page) return undefined;
    get(`/seo/${page}`)
      .then((r) => active && setOverride(r.data))
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [page]);

  const name = settings?.businessName || 'Aqua Ak Enterprises';
  const t = override?.title || title || name;
  const d = override?.description || description || '';
  const k = override?.keywords || keywords || '';
  const url = override?.canonicalUrl || canonical || `${window.location.origin}${pathname}`;
  const ogTitle = override?.ogTitle || t;
  const ogDesc = override?.ogDescription || d;
  const ogImage = override?.ogImage || image || '';

  return (
    <>
      <title>{t}</title>
      {d && <meta name="description" content={d} />}
      {k && <meta name="keywords" content={k} />}
      <meta name="robots" content={noindex ? 'noindex,nofollow' : 'index,follow'} />
      <link rel="canonical" href={url} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={name} />
      <meta property="og:title" content={ogTitle} />
      {ogDesc && <meta property="og:description" content={ogDesc} />}
      <meta property="og:url" content={url} />
      {ogImage && <meta property="og:image" content={ogImage} />}
      <meta name="twitter:card" content={ogImage ? 'summary_large_image' : 'summary'} />
      <meta name="twitter:title" content={ogTitle} />
      {ogDesc && <meta name="twitter:description" content={ogDesc} />}
      {ogImage && <meta name="twitter:image" content={ogImage} />}
      {jsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />}
    </>
  );
}

export function localBusinessJsonLd(settings, extra = {}) {
  if (!settings) return null;
  const c = settings.contact || {};
  const sameAs = Object.values(settings.social || {}).filter(Boolean);
  if (c.googleBusinessUrl) sameAs.push(c.googleBusinessUrl);
  return {
    '@context': 'https://schema.org',
    '@type': 'HomeAndConstructionBusiness',
    '@id': `${window.location.origin}/#business`,
    name: settings.businessName,
    url: window.location.origin,
    ...(settings.logo?.url ? { logo: settings.logo.url, image: settings.logo.url } : {}),
    ...(c.phone ? { telephone: c.phone } : {}),
    ...(c.email ? { email: c.email } : {}),
    ...(c.address
      ? {
          address: {
            '@type': 'PostalAddress',
            streetAddress: c.address,
            addressLocality: c.city || undefined,
            addressRegion: c.state || undefined,
            postalCode: c.postalCode || undefined,
            addressCountry: c.country || 'IN',
          },
        }
      : {}),
    ...(c.latitude && c.longitude
      ? { geo: { '@type': 'GeoCoordinates', latitude: c.latitude, longitude: c.longitude } }
      : {}),
    ...(settings.serviceAreas?.length
      ? { areaServed: settings.serviceAreas.map((a) => ({ '@type': 'Place', name: a.name })) }
      : {}),
    ...(sameAs.length ? { sameAs } : {}),
    ...extra,
  };
}
