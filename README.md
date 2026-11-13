# World PDF

A clean, static Astro website for World PDF at https://wpdf.online.

## Commands

- `npm install`
- `npm run dev`
- `npm test`
- `npm run build`
- `npm run preview`

## Architecture

- `src/pages/`: homepage, tools directory, 12 generated tool pages, legal pages and sitemap.
- `src/data/tools.js`: single source of truth for tool names, routes, runtime IDs and page content.
- `src/components/`: shared header, footer and mobile navigation.
- `src/layouts/`: shared SEO, analytics, Google AdSense and Google Tag Manager shell.
- `src/styles/` and `src/scripts/`: responsive design system and lightweight navigation/theme behavior.
- `public/workspace/`: existing PDF processing workspace.
- `public/pdf-editor.html`: existing standalone PDF editor.
- `public/assets/`: PDF runtime, icons, styles and analytics.
- `public/`: domain, ads.txt, Search Console verification, PWA and crawler files.

The PDF processing runtime and editor are retained. The admin dashboard is intentionally excluded. Astro source lives only in `src/`; deployable static assets live in `public/`.
