import * as pdfjsLib from 'pdfjs-dist';

// Configure pdfjs worker if available in browser runtime environment
if (typeof window !== 'undefined' && !pdfjsLib.GlobalWorkerOptions.workerSrc) {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
}

/**
 * Extracts page count from a PDF file using pdfjs-dist
 */
export async function getPdfPageCount(file: File): Promise<number> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;
    return pdf.numPages;
  } catch (error) {
    console.error('Failed to read PDF page count:', error);
    throw new Error('Could not parse PDF file structure.');
  }
}
