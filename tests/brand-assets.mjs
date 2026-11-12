import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const [html, manifestText, sw, favicon, icon, brand, og] = await Promise.all([
  readFile(new URL('../index.html', import.meta.url), 'utf8'),
  readFile(new URL('../manifest.webmanifest', import.meta.url), 'utf8'),
  readFile(new URL('../sw.js', import.meta.url), 'utf8'),
  readFile(new URL('../favicon.svg', import.meta.url), 'utf8'),
  readFile(new URL('../assets/icons/icon.svg', import.meta.url), 'utf8'),
  readFile(new URL('../assets/icons/brand.svg', import.meta.url), 'utf8'),
  readFile(new URL('../assets/icons/og-image.svg', import.meta.url), 'utf8')
]);
const manifest = JSON.parse(manifestText);
assert.match(html, /rel="canonical" href="https:\/\/www\.wpdf\.online\//);
assert.match(html, /rel="icon" href="\/favicon\.svg"/);
assert.match(html, /rel="manifest" href="\/manifest\.webmanifest"/);
assert.match(html, /GTM-KC52SRXL/);
assert.match(html, /navigator\.serviceWorker\.register\('\/sw\.js'\)/);
assert.match(html, /\/assets\/icons\/icon\.svg/);
const tailwindConfigAt = html.indexOf('window.tailwind.config');
const tailwindRuntimeAt = html.indexOf('https://cdn.tailwindcss.com');
assert.ok(tailwindConfigAt >= 0 && tailwindRuntimeAt > tailwindConfigAt, 'Tailwind config must be declared before its CDN runtime');
assert.doesNotMatch(html.slice(tailwindRuntimeAt - 100, tailwindRuntimeAt + 100), /defer/, 'Tailwind CDN must not be deferred past inline configuration');
assert.equal(manifest.name, 'World PDF');
assert.equal(manifest.start_url, '/');
assert.equal(manifest.theme_color, '#dc2626');
assert.equal(manifest.icons[0].src, '/assets/icons/icon.svg');
assert.match(sw, /wpdf-shell-v5/);
assert.match(sw, /\/manifest\.webmanifest/);
assert.match(favicon, /#dc2626/);
assert.match(icon, /#dc2626/);
assert.match(brand, /World PDF/);
assert.match(og, /www\.wpdf\.online/);
console.log('Brand assets, metadata, PWA and Tailwind load-order checks passed.');
