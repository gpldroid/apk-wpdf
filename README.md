# World PDF

Static Astro website with an individual SEO-friendly page for each PDF tool. The existing browser-side PDF processing engine remains in `assets/js` and is served through `/workspace/`.

## Commands
- `npm install`
- `npm run dev`
- `npm test`
- `npm run build`

## Structure
- `src/pages`: homepage, individual tool pages, legal pages, and sitemap endpoint.
- `src/components`: shared header, footer, and mobile tab bar.
- `src/layouts`: shared page shell and metadata.
- `src/data/tools.js`: central tool registry.
- `public/workspace`: existing processing interface retained to protect PDF operations.
- `assets/js/pdf`: existing modular PDF processing engine.

The former admin dashboard and Express mock analytics server are excluded from the static deployment. Existing Google Tag Manager, AdSense publisher metadata, Search Console verification, ads.txt, PWA files, and custom domain are retained.
