import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const [layout,manifestText,sw,favicon,icon,brand,og,robots,editor,ads]=await Promise.all([
 readFile(new URL('../src/layouts/SiteLayout.astro',import.meta.url),'utf8'),
 readFile(new URL('../public/manifest.webmanifest',import.meta.url),'utf8'),
 readFile(new URL('../public/sw.js',import.meta.url),'utf8'),
 readFile(new URL('../public/favicon.svg',import.meta.url),'utf8'),
 readFile(new URL('../public/assets/icons/icon.svg',import.meta.url),'utf8'),
 readFile(new URL('../public/assets/icons/brand.svg',import.meta.url),'utf8'),
 readFile(new URL('../public/assets/icons/og-image.svg',import.meta.url),'utf8'),
 readFile(new URL('../public/robots.txt',import.meta.url),'utf8'),
 readFile(new URL('../public/pdf-editor.html',import.meta.url),'utf8'),
 readFile(new URL('../public/ads.txt',import.meta.url),'utf8')
]);
const manifest=JSON.parse(manifestText);
assert.ok(layout.includes('https://wpdf.online'));
assert.ok(layout.includes('href="/favicon.svg"'));
assert.ok(layout.includes('href="/manifest.webmanifest"'));
assert.ok(layout.includes('GTM-KC52SRXL'));
assert.ok(layout.includes('ca-pub-6996931662051674'));
assert.ok(layout.includes('google-site-verification'));
assert.ok(layout.includes('/assets/js/analytics.js'));
assert.ok(layout.includes('name="keywords"'));
assert.equal(manifest.name,'World PDF');assert.equal(manifest.start_url,'/');assert.equal(manifest.theme_color,'#dc2626');assert.equal(manifest.icons[0].src,'/assets/icons/icon.svg');
assert.ok(sw.includes('wpdf-astro-v2')&&sw.includes('/manifest.webmanifest'));
assert.ok(favicon.includes('#dc2626')&&icon.includes('#dc2626'));assert.ok(brand.includes('World PDF'));assert.ok(og.includes('wpdf.online'));
assert.ok(robots.includes('Sitemap: https://wpdf.online/sitemap.xml'));
assert.ok(ads.includes('google.com, pub-6996931662051674, DIRECT, f08c47fec0942fa0'));
assert.ok(editor.includes('<footer'), 'Standalone editor must have the shared footer pattern');
assert.ok(editor.includes('class="wpdf-mobile-tabbar"'), 'Standalone editor must have mobile navigation');
assert.ok(editor.includes('/assets/js/analytics.js'));
assert.ok(!editor.includes('/workspace/'), 'Standalone editor must not link to removed workspace');
console.log('Astro metadata, AdSense, brand assets, PWA and verification checks passed.');
