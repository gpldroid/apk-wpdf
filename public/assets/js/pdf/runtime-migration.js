// WPDF runtime adapters for the extracted PDF modules.
// Loaded by the production runtime in the next migration step.

import { extractPages, splitEachPage } from './split.js';
import { deletePages, reorderPages } from './edit.js';
import { addPageNumbers } from './numbers.js';
import { imagesToPdf } from './images.js';

export async function splitToDownload(file, range, download) {
    const bytes = await extractPages(file, range);
    download(bytes, 'split.pdf');
}

export async function deleteToDownload(file, indices, download) {
    const bytes = await deletePages(file, indices);
    download(bytes, 'delete_result.pdf');
}

export async function reorderToDownload(file, order, download) {
    const bytes = await reorderPages(file, order);
    download(bytes, 'reorder_result.pdf');
}

export async function numberToDownload(file, position, download) {
    const bytes = await addPageNumbers(file, position);
    download(bytes, 'numbers_result.pdf');
}

export async function imagesToDownload(files, download) {
    const bytes = await imagesToPdf(files);
    download(bytes, 'images_to_pdf.pdf');
}

export async function splitEachPageToDownloads(file, download) {
    const results = await splitEachPage(file);
    results.forEach(({ index, bytes }) => download(bytes, `page-${index + 1}.pdf`));
    return results.length;
}
