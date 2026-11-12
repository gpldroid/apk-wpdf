// WPDF PDF core utilities. Keeps PDF engine dependencies behind one small API.
export function getPDFLib() {
    if (!window.PDFLib) throw new Error('PDF-Lib is not available.');
    return window.PDFLib;
}

export async function readBytes(file) {
    if (file && typeof file.arrayBuffer === 'function') return new Uint8Array(await file.arrayBuffer());
    return new Uint8Array(await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(reader.error);
        reader.readAsArrayBuffer(file);
    }));
}

export async function loadDocument(file) {
    const { PDFDocument } = getPDFLib();
    return PDFDocument.load(await readBytes(file), { ignoreEncryption: false });
}

export function downloadBytes(bytes, filename, type = 'application/pdf') {
    const blob = new Blob([bytes], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function parsePageRange(value, pageCount) {
    const pages = new Set();
    String(value || '').split(',').map(s => s.trim()).filter(Boolean).forEach(part => {
        const range = part.match(/^(\d+)\s*-\s*(\d+)$/);
        if (range) {
            let start = Number(range[1]);
            let end = Number(range[2]);
            if (start > end) [start, end] = [end, start];
            for (let i = start; i <= end; i++) if (i >= 1 && i <= pageCount) pages.add(i - 1);
        } else if (/^\d+$/.test(part)) {
            const n = Number(part);
            if (n >= 1 && n <= pageCount) pages.add(n - 1);
        }
    });
    return [...pages];
}
