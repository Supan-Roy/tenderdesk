import { PDFDocument } from 'pdf-lib';

export interface FooterOptions {
  tenderId: string;
  totalPages: number;
}

/**
 * Draws standard page footer "<tender_id> | Page X of Y" on all pages of the document
 */
export async function addPackageFooters(_pdfDoc: PDFDocument, _options: FooterOptions): Promise<void> {
  // Stub for footer generation setup - to be implemented in feature build step
  console.log('addPackageFooters stub initialized');
}
