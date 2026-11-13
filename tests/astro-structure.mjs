import assert from 'node:assert/strict';
import fs from 'node:fs';
import { tools } from '../src/data/tools.js';
assert.ok(tools.length >= 10, 'The current tool catalog must contain its published tools');
assert.equal(new Set(tools.map(tool => tool.slug)).size, tools.length, 'Tool slugs must be unique');
assert.equal(new Set(tools.map(tool => tool.id)).size, tools.length, 'Runtime tool IDs must be unique');
for (const tool of tools) {
  assert.ok(tool.name && tool.desc && tool.short && tool.steps.length >= 3, `${tool.slug} must have complete page content`);
  assert.ok(fs.existsSync('src/pages/tools/[slug].astro'));
}
const layout = fs.readFileSync('src/layouts/SiteLayout.astro', 'utf8');
for (const token of ['ca-pub-6996931662051674', 'GTM-KC52SRXL', 'google-site-verification', '/assets/js/analytics.js', 'canonical', 'og:image', 'name="keywords"']) assert.ok(layout.includes(token), `Shared layout must include ${token}`);
assert.ok(fs.existsSync('src/pages/404.astro'), 'A branded Astro 404 page must exist');
const sitemap = fs.readFileSync('src/pages/sitemap.xml.ts', 'utf8');
assert.ok(sitemap.includes('tools.map'), 'Sitemap must be generated from the tool source of truth');
for (const page of ['about', 'contact', 'privacy', 'terms']) {
  assert.ok(fs.existsSync('src/pages/' + page + '.astro'), 'Core page /' + page + '/ must exist');
  assert.ok(sitemap.includes("'/" + page + "/'"), 'Sitemap must include /' + page + '/');
}
const header = fs.readFileSync('src/components/SiteHeader.astro', 'utf8');
const footer = fs.readFileSync('src/components/SiteFooter.astro', 'utf8');
const mobileNav = fs.readFileSync('src/components/MobileTabBar.astro', 'utf8');
for (const [name, source] of [['header', header], ['footer', footer], ['mobile navigation', mobileNav]]) {
  assert.ok(source.includes('/about/'), name + ' must link to About page');
  assert.ok(!source.includes('/workspace/'), name + ' must not link to removed workspace');
}
assert.ok(footer.includes('/contact/'), 'Footer must link to Contact page');
assert.ok(!footer.includes('/ads.txt'), 'ads.txt must not be linked in the footer');
assert.ok(fs.existsSync('public/ads.txt'), 'AdSense ads.txt file must be retained');
assert.ok(fs.existsSync('src/components/tools/ToolRuntime.astro'), 'A shared tool runtime component must exist');
const toolPage = fs.readFileSync('src/pages/tools/[slug].astro', 'utf8');
assert.ok(toolPage.includes('ToolRuntime') && toolPage.includes('keywords='), 'Tool pages must include runtime and target keywords');
const home = fs.readFileSync('src/pages/index.astro', 'utf8');
for (const section of ['how-it-works', 'about', 'contact', 'tools']) assert.ok(home.includes(section), `Homepage must include ${section}`);
assert.ok(!home.includes('/workspace/'), 'Homepage must not link to the removed workspace');
console.log('Astro structure, tool coverage and SEO integration checks passed.');
