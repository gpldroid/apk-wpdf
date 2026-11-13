# World PDF

A static Astro website for World PDF at https://wpdf.online.

## Commands

- `npm install`
- `npm run dev`
- `npm test`
- `npm run build`
- `npm run preview`

## Architecture

- `src/pages/index.astro`: homepage and main entry point.
- `src/pages/tools/index.astro`: tools directory.
- `src/pages/tools/[slug].astro`: generated page for each PDF tool; the processing interface is embedded directly in each tool page.
- `src/pages/about.astro`, `contact.astro`, `privacy.astro`, `terms.astro`, `404.astro`, and `sitemap.xml.ts`: core information, legal, error and sitemap routes.
- `src/components/`: shared site header, footer, mobile tab bar, and `tools/ToolRuntime.astro` processing interface.
- `src/data/tools.js`: source of truth for tool names, slugs, runtime IDs, descriptions, keywords and instructions.
- `src/data/navigation.js`: shared desktop, footer and mobile navigation destinations.
- `src/layouts/SiteLayout.astro`: shared page shell, SEO metadata, Google Search Console verification, AdSense and Google Tag Manager.
- `src/styles/` and `src/scripts/`: responsive design system and lightweight navigation/theme behavior.
- `public/assets/js/app.js` and `public/assets/js/pdf/`: client-side processing runtime and PDF modules, loaded when a tool is used.
- `public/assets/js/analytics.js`: site and tool interaction analytics.
- `public/pdf-editor.html`: standalone PDF editor.
- `public/ads.txt`, `robots.txt`, `sitemap.xml` output, domain, verification and PWA assets: crawler and publishing configuration.

There is no separate `/workspace/` route or `public/workspace/` directory. Users open a dedicated tool page and run that tool there. PDF processing remains browser-side; the original PDF modules and standalone editor are retained. The admin dashboard is intentionally excluded. Astro source lives in `src/`; deployable static assets live in `public/`.
