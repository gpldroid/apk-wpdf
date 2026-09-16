import fs from 'node:fs';
import assert from 'node:assert/strict';

const app = fs.readFileSync('assets/js/app.js', 'utf8');

assert.match(app, /async function processMerge\(\)[\s\S]*import\('\.\/assets\/js\/pdf\/merge\.js'\)/, 'merge must use the extracted module');
assert.match(app, /async function processImages\(\)[\s\S]*import\('\.\/assets\/js\/pdf\/images\.js'\)/, 'images must use the extracted module');
assert.match(app, /async function processSplit\(\)[\s\S]*import\('\.\/assets\/js\/pdf\/split\.js'\)/, 'split must use the extracted module');
assert.match(app, /async function processEdit\(type\)[\s\S]*import\('\.\/assets\/js\/pdf\/edit\.js'\)/, 'edit operations must use the extracted module');
assert.match(app, /async function processEdit\(type\)[\s\S]*import\('\.\/assets\/js\/pdf\/numbers\.js'\)/, 'numbering must use the extracted module');

const legacyImages = /async function processImages\(\)[\s\S]*PDFLib\.PDFDocument\.create\(\)/;
const legacySplit = /async function processSplit\(\)[\s\S]*out\.copyPages\(p, nums\)/;
assert.doesNotMatch(app, legacyImages, 'legacy image conversion must not remain in processImages');
assert.doesNotMatch(app, legacySplit, 'legacy split copyPages path must not remain in processSplit');

const requiredModules = [
  'assets/js/pdf/core.js',
  'assets/js/pdf/merge.js',
  'assets/js/pdf/split.js',
  'assets/js/pdf/edit.js',
  'assets/js/pdf/numbers.js',
  'assets/js/pdf/images.js',
  'assets/js/pdf/runtime-migration.js'
];
for (const file of requiredModules) assert.ok(fs.existsSync(file), `${file} must exist`);

console.log('Runtime integration wiring checks passed.');
// Keep this check deterministic and dependency-free for CI.
