import fs from 'node:fs';
import assert from 'node:assert/strict';

const app = fs.readFileSync('assets/js/app.js', 'utf8');

assert.match(app, /async function processMerge\(\)[\s\S]*import\('\.\/assets\/js\/pdf\/merge\.js'\)/, 'merge must use the extracted module');
assert.match(app, /async function processImages\(\)[\s\S]*import\('\.\/assets\/js\/pdf\/images\.js'\)/, 'images must use the extracted module');
assert.match(app, /async function processSplit\(\)[\s\S]*import\('\.\/assets\/js\/pdf\/split\.js'\)/, 'split must use the extracted module');
assert.match(app, /async function processEdit\(type\)[\s\S]*import\('\.\/assets\/js\/pdf\/edit\.js'\)/, 'edit operations must use the extracted module');
assert.match(app, /async function processEdit\(type\)[\s\S]*import\('\.\/assets\/js\/pdf\/numbers\.js'\)/, 'numbering must use the extracted module');

const processImagesBody = app.split('async function processImages() {')[1]?.split('async function processSplit()')[0] || '';
const processSplitBody = app.split('async function processSplit() {')[1]?.split('async function processEdit(type)')[0] || '';
assert.ok(processImagesBody, 'processImages function must exist');
assert.ok(processSplitBody, 'processSplit function must exist');
assert.doesNotMatch(processImagesBody, /PDFLib\.PDFDocument\.create\(\)/, 'legacy image conversion must not remain in processImages');
assert.doesNotMatch(processSplitBody, /out\.copyPages\(p, nums\)/, 'legacy split copyPages path must not remain in processSplit');

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
