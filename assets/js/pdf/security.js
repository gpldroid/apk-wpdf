import { getPDFLib, readBytes } from './core.js';

// pdf-lib does not provide native PDF password encryption. Keep this boundary explicit
// so encryption can later be implemented with a dedicated browser-compatible engine.
export async function validateReadablePdf(file) {
    const { PDFDocument } = getPDFLib();
    return PDFDocument.load(await readBytes(file));
}

export const supportsNativeEncryption = false;
