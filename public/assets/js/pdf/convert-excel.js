import { getXLSX, getJsPDF } from './convert.js';

export async function excelToPdf(file) {
    const XLSX = getXLSX();
    const { jsPDF } = getJsPDF();
    const workbook = XLSX.read(await file.arrayBuffer(), { type: 'array' });
    const pdf = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
    workbook.SheetNames.forEach((sheetName, sheetIndex) => {
        if (sheetIndex > 0) pdf.addPage();
        const rows = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 });
        let y = 15;
        pdf.setFontSize(14);
        pdf.text(String(sheetName), 10, y);
        y += 10;
        pdf.setFontSize(9);
        rows.forEach(row => {
            pdf.text(row.map(value => String(value ?? '')).join(' | ').substring(0, 120), 10, y);
            y += 6;
            if (y > 280) { pdf.addPage(); y = 15; }
        });
    });
    return pdf.output('arraybuffer');
}
