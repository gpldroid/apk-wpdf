import { getPDFLib, readBytes } from './core.js';

export async function addPageNumbers(file, position = 'bottom-center') {
    const { PDFDocument, rgb } = getPDFLib();
    const pdf = await PDFDocument.load(await readBytes(file));
    pdf.getPages().forEach((page, index) => {
        const { width } = page.getSize();
        let x = width / 2;
        if (position === 'bottom-right') x = width - 35;
        if (position === 'bottom-left') x = 35;
        page.drawText(String(index + 1), {
            x: x - 5,
            y: 20,
            size: 12,
            color: rgb(0.2, 0.2, 0.2)
        });
    });
    return pdf.save({ useObjectStreams: true });
}
