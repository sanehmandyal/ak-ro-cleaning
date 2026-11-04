import Service from '../models/Service.js';
import { asyncHandler } from '../utils/helpers.js';

const siteUrl = () => (process.env.SITE_URL || '').replace(/\/$/, '');

export const sitemap = asyncHandler(async (_req, res) => {
  const base = siteUrl();
  const services = await Service.find({ isAvailable: true }).select('slug updatedAt');
  const staticPages = [
    '',
    '/about',
    '/services',
    '/water-tank-cleaning',
    '/ro-water-purifier-cleaning',
    '/bathroom-kitchen-cleaning',
    '/glass-window-cleaning',
    '/gallery',
    '/contact',
    '/booking',
    '/locations',
  ];
  const urls = [
    ...staticPages.map((p) => ({ loc: `${base}${p}`, lastmod: new Date().toISOString(), priority: p === '' ? '1.0' : '0.8' })),
    ...services.map((s) => ({ loc: `${base}/services/${s.slug}`, lastmod: s.updatedAt.toISOString(), priority: '0.9' })),
  ];
  const xml =
    '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    urls.map((u) => `  <url><loc>${u.loc}</loc><lastmod>${u.lastmod}</lastmod><priority>${u.priority}</priority></url>`).join('\n') +
    '\n</urlset>';
  res.type('application/xml').send(xml);
});

export const robots = (_req, res) => {
  res.type('text/plain').send(
    `User-agent: *\nAllow: /\nDisallow: /admin\n\nSitemap: ${siteUrl()}/sitemap.xml\n`
  );
};
