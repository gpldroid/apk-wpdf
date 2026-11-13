# World PDF

Static Astro website with dedicated SEO pages for every PDF tool. The browser-side PDF workspace is preserved under `public/workspace/`.

## Commands
- `npm install`
- `npm run dev`
- `npm test`
- `npm run build`

## Structure
- `src/pages/`: homepage, tool directory, generated tool detail pages, legal pages and sitemap.
- `src/components/`: shared header, footer and mobile navigation.
- `src/layouts/`: shared document shell, metadata, AdSense and Google Tag Manager.
- `src/data/tools.js`: single source of truth for tool routes.
- `src/styles/` and `src/scripts/`: bundled site styles and navigation/theme behavior.
- `public/workspace/`: existing PDF processing interface.
- `public/assets/`: runtime JavaScript, PDF modules, icons and workspace styles.
- `public/`: static verification, PWA, robots, ads and editor assets.

Astro source belongs in `src/`; deployable static assets belong in `public/`. Duplicate legacy website files from the repository root have been removed. The admin dashboard is intentionally excluded.
