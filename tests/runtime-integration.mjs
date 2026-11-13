import fs from 'node:fs';
import assert from 'node:assert/strict';
const app=fs.readFileSync('public/assets/js/app.js','utf8');
for(const module of ['merge','images','split','edit','numbers']) assert.ok(app.includes(`import('/assets/js/pdf/${module}.js')`),`${module} module path must be rooted at the site origin`);
for(const file of ['core.js','merge.js','split.js','edit.js','numbers.js','images.js','runtime-migration.js']) assert.ok(fs.existsSync(`public/assets/js/pdf/${file}`),`${file} must exist in public assets`);
console.log('Runtime integration wiring checks passed.');
