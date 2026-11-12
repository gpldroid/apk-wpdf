// Conversion boundaries for non-PDF inputs/outputs.
// Implementations remain in app.js until their dependencies and output fidelity are audited.
export function assertLibrary(name, globalName) {
    if (!window[globalName]) throw new Error(`${name} is not available.`);
    return window[globalName];
}

export function getXLSX() { return assertLibrary('XLSX', 'XLSX'); }
export function getJsPDF() { return assertLibrary('jsPDF', 'jspdf'); }
export function getDocx() { return assertLibrary('docx', 'docx'); }
export function getPptxGenJS() { return assertLibrary('PptxGenJS', 'PptxGenJS'); }
