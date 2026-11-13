import assert from 'node:assert/strict';
import fs from 'node:fs';
import { tools } from '../src/data/tools.js';

assert.equal(tools.length, 12, 'All 12 requested PDF tools must have dedicated pages');
assert.equal(new Set(tools.map(tool => tool.slug)).size, tools.length, 'Tool slugs must be unique');
assert.equal(new Set(tools.map(tool => tool.id)).size, tools.length, 'Runtime tool IDs must be unique');
for (const tool of tools) {
  assert.ok(tool.name && tool.desc && tool.short && tool.steps.length >= 3, `${tool.slug} must have complete page content`);
  assert.ok(fs.existsSync(`src/pages/tools/[slug].astro`));
}
const layout = fs.readFileSync('src/layouts/SiteLayout.astro', 'utf8');
for (const token of ['ca-pub-6996931662051674', 'GTM-KC52SRXL', 'google-site-verification', '/assets/js/analytics.js', 'canonical', 'og:image']) {
  assert.ok(layout.includes(token), `Shared layout must include ${token}`);
}
assert.ok(fs.existsSync('src/pages/404.astro'), 'A branded Astro 404 page must exist');
const sitemap = fs.readFileSync('src/pages/sitemap.xml.ts', 'utf8');
assert.ok(sitemap.includes('tools.map'), 'Sitemap must be generated from the tool source of truth');
const home = fs.readFileSync('src/pages/index.astro', 'utf8');
for (const section of ['how-it-works', 'about', 'contact', 'tools']) assert.ok(home.includes(section), `Homepage must include ${section}`);
console.log('Astro structure, tool coverage and SEO integration checks passed.');

for (const page of ['about.astro', 'contact.astro']) assert.ok(fs.existsSync(`src/pages/${page}`), `Core page ${page} must exist`);
const footer = fs.readFileSync('src/components/SiteFooter.astro', 'utf8');
assert.ok(!footer.includes('ads.txt'), 'ads.txt must not be promoted as a visitor navigation link');
assert.ok(!footer.includes('/#contact') && footer.includes('/contact/'), 'Footer contact link must resolve to a real page');
assert.ok(footer.includes('/about/'), 'Footer about link must resolve to a real page');
const workspace = fs.readFileSync('public/workspace/index.html', 'utf8');
assert.ok(!workspace.includes('ملفاتك تبقى آمنة ومحلية على جهازك'), 'Remove the unwanted local-file claim from workspace');
assert.ok(!workspace.includes('href="#"'), 'Workspace must not contain placeholder hash links');
assert.ok(!workspace.includes('javascript:void(0)'), 'Workspace navigation must use real page URLs');
const sitemapRoutes = fs.readFileSync('src/pages/sitemap.xml.ts', 'utf8');
assert.ok(sitemapRoutes.includes("'/about/'") && sitemapRoutes.includes("'/contact/'"), 'Sitemap must include all core pages');
