import { describe, it, expect } from 'vitest';
import { validatePdfFile, getPdfPageCount } from '../src/features/documents/pdfUtils';

describe('Safe PDF Error Handling Feature', () => {
  it('should reject non-PDF text file with clear error message', async () => {
    const textFile = new File(['Hello World'], 'readme.txt', { type: 'text/plain' });
    const result = await validatePdfFile(textFile);

    expect(result.isValid).toBe(false);
    expect(result.error).toContain('is not a PDF file');
  });

  it('should reject file with .pdf extension but invalid header bytes', async () => {
    const fakePdf = new File(['NOT A PDF FILE DATA'], 'fake.pdf', { type: 'application/pdf' });
    const result = await validatePdfFile(fakePdf);

    expect(result.isValid).toBe(false);
    expect(result.error).toContain('does not contain a valid PDF signature header');
  });

  it('should handle corrupt PDF byte inspection without throwing unhandled rejection', async () => {
    const corruptFile = new File(['%PDF-1.4 corrupt data stream without catalog'], 'corrupt.pdf', { type: 'application/pdf' });

    await expect(getPdfPageCount(corruptFile)).rejects.toThrow();
  });
});
