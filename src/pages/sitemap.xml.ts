import { tools } from '../data/tools.js';

const base = 'https://wpdf.online';
const staticPaths = ['/', '/tools/', '/privacy/', '/terms/'];
const paths = [...staticPaths, ...tools.map(tool => `/tools/${tool.slug}/`)];
export const prerender = true;

export function GET() {
  const urls = paths.map(path => `<url><loc>${base}${path}</loc></url>`).join('');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}
