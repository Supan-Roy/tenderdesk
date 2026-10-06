import { describe, it, expect } from 'vitest';
import { PDFDocument } from 'pdf-lib';
import { stampSealImage } from '../src/features/package/sealStamper';

describe('Official Seal & Signature PNG Stamper Feature', () => {
  // Minimal valid 1x1 transparent PNG byte array
  const minimalPngBytes = new Uint8Array([
    137, 80, 78, 71, 13, 10, 26, 10, 0, 0, 0, 13, 73, 72, 68, 82, 0, 0, 0, 1, 0, 0, 0, 1, 8, 6, 0, 0, 0, 31, 213, 196,
    203, 0, 0, 0, 13, 73, 68, 65, 84, 120, 156, 99, 96, 248, 15, 0, 1, 5, 1, 2, 210, 222, 188, 121, 0, 0, 0, 0, 73, 69, 78, 68, 174, 66, 96, 130
  ]);

  it('should embed PNG seal image onto target PDF pages', async () => {
    const pdfDoc = await PDFDocument.create();
    pdfDoc.addPage([595, 842]);
    pdfDoc.addPage([595, 842]);

    await stampSealImage({
      pdfDoc,
      pngImageBytes: minimalPngBytes,
      pageIndices: [0, 1],
      x: 100,
      y: 100,
      width: 50,
      height: 50,
    });

    const savedBytes = await pdfDoc.save();
    expect(savedBytes).toBeInstanceOf(Uint8Array);
    expect(savedBytes.length).toBeGreaterThan(0);

    const reloaded = await PDFDocument.load(savedBytes);
    expect(reloaded.getPageCount()).toBe(2);
  });
});
