import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const [html, manifestText, sw] = await Promise.all([
  readFile(new URL('../index.html', import.meta.url), 'utf8'),
  readFile(new URL('../manifest.webmanifest', import.meta.url), 'utf8'),
  readFile(new URL('../sw.js', import.meta.url), 'utf8')
]);
const manifest = JSON.parse(manifestText);
for (const path of ['/favicon.svg', '/manifest.webmanifest', '/assets/icons/icon.svg', '/assets/icons/brand.svg', '/assets/icons/og-image.svg']) {
  assert.ok(html.includes(path) || sw.includes(path) || manifestText.includes(path), `Missing brand asset reference: ${path}`);
}
assert.match(html, /rel="canonical" href="https:\/\/www\.wpdf\.online\//);
assert.match(html, /GTM-KC52SRXL/);
assert.equal(manifest.name, 'World PDF — Free PDF Tools');
assert.equal(manifest.start_url, '/');
assert.equal(manifest.icons[0].src, '/assets/icons/icon.svg');
assert.match(sw, /wpdf-shell-v5/);
console.log('Brand assets, metadata, manifest and service-worker references passed.');
