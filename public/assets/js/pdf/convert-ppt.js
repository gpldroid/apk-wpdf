import { getPptxGenJS } from './convert.js';

export async function pdfToPowerPoint(file, pdfjsLib) {
    if (!pdfjsLib) throw new Error('PDF.js is not available.');
    const PptxGenJS = getPptxGenJS();
    const data = new Uint8Array(await file.arrayBuffer());
    const pdf = await pdfjsLib.getDocument({ data }).promise;
    const ppt = new PptxGenJS();
    ppt.layout = 'LAYOUT_WIDE';
    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 1.5 });
        const canvas = document.createElement('canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        await page.render({ canvasContext: canvas.getContext('2d'), viewport }).promise;
        ppt.addSlide().addImage({
            data: canvas.toDataURL('image/jpeg', 0.85),
            x: 0,
            y: 0,
            w: '100%',
            h: '100%'
        });
    }
    return ppt.write({ outputType: 'arraybuffer' });
}
