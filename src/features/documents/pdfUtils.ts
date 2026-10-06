import * as pdfjsLib from 'pdfjs-dist';

// Configure pdfjs worker dynamically from cdn matching installed version
if (typeof window !== 'undefined' && !pdfjsLib.GlobalWorkerOptions.workerSrc) {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
}

/**
 * Checks if the file starts with magic PDF header bytes (%PDF-)
 */
export async function isPdfHeader(file: File): Promise<boolean> {
  try {
    if (file.size < 5) return false;
    const slice = file.slice(0, 5);
    const buffer = await slice.arrayBuffer();
    const header = new TextDecoder('ascii').decode(buffer);
    return header.startsWith('%PDF-');
  } catch {
    return false;
  }
}

/**
 * Validates PDF file type using extension, MIME type, and magic header bytes
 */
export async function validatePdfFile(file: File): Promise<{ isValid: boolean; error?: string }> {
  const isExtensionPdf = file.name.toLowerCase().endsWith('.pdf');
  const isMimePdf = file.type === 'application/pdf' || file.type === '';
  const isMagicPdf = await isPdfHeader(file);

  if (!isExtensionPdf && !isMimePdf) {
    return {
      isValid: false,
      error: `"${file.name}" is not a PDF file and was not added.`,
    };
  }

  if (!isMagicPdf) {
    return {
      isValid: false,
      error: `"${file.name}" does not contain a valid PDF signature header and was rejected.`,
    };
  }

  return { isValid: true };
}

/**
 * Extracts page count from a PDF file using pdfjs-dist.
 * Gracefully handles damaged, corrupt, or password-protected PDFs.
 */
export async function getPdfPageCount(file: File): Promise<number> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;
    return pdf.numPages;
  } catch (error: unknown) {
    console.error(`Failed to inspect PDF "${file.name}":`, error);
    const errObj = error as { name?: string; message?: string };
    if (errObj?.name === 'PasswordException') {
      throw new Error(`"${file.name}" is password-protected and cannot be opened.`);
    } else if (errObj?.name === 'InvalidPDFException') {
      throw new Error(`"${file.name}" is damaged or corrupted.`);
    }
    throw new Error(`This PDF could not be opened: "${file.name}". It may be damaged or password-protected.`);
  }
}
