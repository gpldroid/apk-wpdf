import { getPDFLib, readBytes } from './core.js';

export async function merge(files) {
    const { PDFDocument } = getPDFLib();
    const output = await PDFDocument.create();
    for (const file of files) {
        const source = await PDFDocument.load(await readBytes(file));
        const pages = await output.copyPages(source, source.getPageIndices());
        pages.forEach(page => output.addPage(page));
    }
    return output.save({ useObjectStreams: true });
}
