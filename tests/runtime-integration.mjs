import fs from 'node:fs';
import assert from 'node:assert/strict';
const app = fs.readFileSync('public/assets/js/app.js', 'utf8');
for (const module of ['merge','images','split','edit','numbers']) assert.ok(app.includes(`import('/assets/js/pdf/${module}.js')`), `${module} module path must be rooted at the site origin`);
for (const file of ['core.js','merge.js','split.js','edit.js','numbers.js','images.js','runtime-migration.js','security.js']) assert.ok(fs.existsSync(`public/assets/js/pdf/${file}`), `${file} must exist in public assets`);
const workspace = fs.readFileSync('public/workspace/index.html','utf8');
assert.ok(workspace.includes('<script src="/assets/js/app.js" defer>'), 'Workspace must load the PDF runtime');
assert.ok(workspace.includes('/assets/js/analytics.js'), 'Workspace must load analytics');
console.log('Runtime integration wiring checks passed.');
