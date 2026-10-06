import { PDFDocument } from 'pdf-lib';

export interface SealStampOptions {
  pdfDoc: PDFDocument;
  pngImageBytes: Uint8Array | ArrayBuffer;
  pageIndices?: number[]; // default: stamp on Cover page (index 0)
  x?: number;
  y?: number;
  width?: number;
  height?: number;
}

/**
 * Stamps an uploaded PNG official seal or signature image onto specified PDF pages.
 */
export async function stampSealImage(options: SealStampOptions): Promise<void> {
  const { pdfDoc, pngImageBytes, pageIndices = [0], x = 420, y = 50, width = 120, height = 60 } = options;

  try {
    const pngImage = await pdfDoc.embedPng(pngImageBytes);
    const pages = pdfDoc.getPages();

    for (const pageIdx of pageIndices) {
      if (pageIdx >= 0 && pageIdx < pages.length) {
        const page = pages[pageIdx];
        page.drawImage(pngImage, {
          x,
          y,
          width,
          height,
        });
      }
    }
  } catch (err) {
    console.error('Failed to embed seal PNG image into PDF:', err);
    throw new Error('Failed to embed official seal/signature PNG image into PDF package.');
  }
}
