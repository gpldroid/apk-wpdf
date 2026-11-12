import { getPDFLib, readBytes, parsePageRange } from './core.js';

export async function extractPages(file, pageRange) {
    const { PDFDocument } = getPDFLib();
    const source = await PDFDocument.load(await readBytes(file));
    const output = await PDFDocument.create();
    const indices = parsePageRange(pageRange, source.getPageCount());
    if (!indices.length) throw new Error('Invalid page range');
    const pages = await output.copyPages(source, indices);
    pages.forEach(page => output.addPage(page));
    return output.save({ useObjectStreams: true });
}

export async function splitEachPage(file) {
    const { PDFDocument } = getPDFLib();
    const source = await PDFDocument.load(await readBytes(file));
    const result = [];
    for (const index of source.getPageIndices()) {
        const output = await PDFDocument.create();
        const [page] = await output.copyPages(source, [index]);
        output.addPage(page);
        result.push({ index, bytes: await output.save({ useObjectStreams: true }) });
    }
    return result;
}
