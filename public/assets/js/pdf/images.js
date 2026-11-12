import { getPDFLib, readBytes } from './core.js';

export async function imagesToPdf(files) {
    const { PDFDocument } = getPDFLib();
    const output = await PDFDocument.create();
    for (const file of files) {
        const bytes = await readBytes(file);
        const image = file.type === 'image/png' ? await output.embedPng(bytes) : await output.embedJpg(bytes);
        const dimensions = image.scale(1);
        const page = output.addPage([dimensions.width, dimensions.height]);
        page.drawImage(image, { x: 0, y: 0, width: dimensions.width, height: dimensions.height });
    }
    return output.save({ useObjectStreams: true });
}
