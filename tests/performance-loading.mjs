import fs from 'node:fs';
import assert from 'node:assert/strict';

const html = fs.readFileSync('index.html', 'utf8');
const app = fs.readFileSync('assets/js/app.js', 'utf8');
const sw = fs.readFileSync('sw.js', 'utf8');

const heavyLibraries = [
  'pdf-lib', 'pdf.min.js', 'xlsx.full.min.js', 'jspdf.umd.min.js',
  'docx', 'pptxgen.min.js', 'jszip'
];
for (const library of heavyLibraries) {
  assert.ok(!html.includes('<script src="') || !html.split('<script src="').some(tag => tag.includes(library)),
    `${library} must not load in the initial document`);
}
assert.match(html, /cdn\.tailwindcss\.com" defer/, 'Tailwind runtime must not block HTML parsing');
assert.match(html, /fonts\\.googleapis\\.com[^>]*media="print"/, 'Google Fonts stylesheet must load asynchronously');
assert.match(html, /font-awesome[^>]*media="print"/, 'Icon stylesheet must load asynchronously');
for (const loader of ['ensurePdfLib', 'ensurePdfJs', 'processWord', 'processExcel', 'processPPT']) {
  assert.ok(app.includes(loader), `${loader} lazy-loading path must exist`);
}
assert.match(app, /SCRIPT_LOADS = new Map\(\)/, 'concurrent library requests must be deduplicated');
assert.ok(!sw.includes('/assets/js/pdf/'), 'PDF feature modules must not be precached at first install');
console.log('Performance loading checks passed.');
