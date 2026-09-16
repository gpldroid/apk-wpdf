import { getDocx } from './convert.js';

export async function pdfToWord(file, pdfjsLib) {
    if (!pdfjsLib) throw new Error('PDF.js is not available.');
    const docx = getDocx();
    const data = new Uint8Array(await file.arrayBuffer());
    const pdf = await pdfjsLib.getDocument({ data }).promise;
    const children = [];
    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        children.push(new docx.Paragraph({
            children: [new docx.TextRun(content.items.map(item => item.str).join(' '))]
        }));
    }
    const document = new docx.Document({ sections: [{ properties: {}, children }] });
    return (await docx.Packer.toBlob(document)).arrayBuffer();
}
