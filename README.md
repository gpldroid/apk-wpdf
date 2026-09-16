# WPDF Pro

WPDF Pro is a browser-based PDF tools application focused on client-side file processing.

## Cloudflare deployment

The `main` branch is the production source for **Cloudflare Pages**. The application is published directly from the repository root and uses Pages Functions plus a D1 database.

### Deploy

No build command is required. Use:

```bash
npx wrangler pages deploy . --project-name wpdfpro
```

Do not use `npx wrangler deploy`; that is the Workers deployment command and is not compatible with this Pages project configuration.

See `CLOUDFLARE.md` for the production D1 and Zero Trust configuration.

## Current application

The application is implemented in `index.html` with runtime logic in `assets/js/app.js` and modular PDF operations under `assets/js/pdf/`.

## Development

The `main` branch is the published version. The `develop` branch was used to complete the modernization and restructuring work before promotion to `main`.

## Architecture

The PDF runtime is organized into focused modules under `assets/js/pdf/`:

- core PDF loading, byte handling, downloads, and page-range parsing
- PDF merge
- PDF page extraction and per-page splitting
- page deletion and reordering
- page numbering
- image-to-PDF conversion
- security capability detection
- conversion-library boundaries for Word, Excel, and PowerPoint workflows
- dedicated conversion implementations for the existing browser libraries

The production runtime in `assets/js/app.js` now uses the extracted modules for merge, image-to-PDF, split/extract, page deletion, page reordering, and page numbering. Compression, security/protection, and the remaining document-conversion flows stay on their existing implementations until their browser fidelity is audited.

## Testing

A browser-based smoke test is available at `tests/pdf-modules.html`. It creates in-memory PDFs and verifies merge, split, delete, reorder, page numbering, and image-to-PDF behavior without modifying production application state.

The repository also includes a GitHub Actions validation workflow that checks JavaScript syntax, runtime module wiring, required project files, and pull requests targeting `main` or `develop`.

## SEO and PWA foundation

The project includes:

- `robots.txt`
- `sitemap.xml`
- `manifest.webmanifest`
- `sw.js` offline application-shell foundation

## Privacy and dependency policy

The application is designed around client-side processing for supported operations. Third-party libraries are currently loaded from CDNs. Conversion fidelity and browser compatibility should be audited before replacing or removing these dependencies.

## License

See `LICENSE` for the MIT License.
