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
