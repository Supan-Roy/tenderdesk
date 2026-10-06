import { describe, it, expect } from 'vitest';
import { generatePdfPackage } from '../src/features/package/packageGenerator';
import { PDFDocument } from 'pdf-lib';
import { TenderInfo, Requirement, UploadedDocument } from '../src/types';

describe('packageGenerator', () => {
  const sampleTender: TenderInfo = {
    tender_id: 'IFT-TEST-2026',
    title: 'Supply of Networking Hardware',
    procuring_entity: 'Directorate of Tech',
    bidder: 'Acme Corp',
    submission_deadline: '2026-10-20',
  };

  const sampleRequirements: Requirement[] = [
    { id: 'R01', order: 1, title_en: 'Trade License', title_bn: 'ট্রেড লাইসেন্স', mandatory: true, has_expiry: true },
    { id: 'R02', order: 2, title_en: 'TIN Certificate', title_bn: 'টিআইএন সনদপত্র', mandatory: true, has_expiry: false },
  ];

  it('should throw error if no matched documents are provided', async () => {
    await expect(
      generatePdfPackage({
        tender: sampleTender,
        requirements: sampleRequirements,
        documents: [],
        matches: {},
      })
    ).rejects.toThrow('No matched documents available');
  });

  it('should compile PDF package with cover page and footers for matched documents', async () => {
    // Create minimal valid 1-page PDF using pdf-lib
    const pdf1 = await PDFDocument.create();
    pdf1.addPage([595, 842]);
    const pdf1Bytes = await pdf1.save();
    const file1 = new File([pdf1Bytes], 'license.pdf', { type: 'application/pdf' });

    const doc1: UploadedDocument = {
      id: 'doc-1',
      file: file1,
      fileName: 'license.pdf',
      size: pdf1Bytes.byteLength,
      pageCount: 1,
    };

    const matches = { R01: 'doc-1' };

    const packageBytes = await generatePdfPackage({
      tender: sampleTender,
      requirements: sampleRequirements,
      documents: [doc1],
      matches,
    });

    expect(packageBytes).toBeInstanceOf(Uint8Array);
    expect(packageBytes.length).toBeGreaterThan(0);

    // Verify generated package can be parsed by pdf-lib
    const resultPdf = await PDFDocument.load(packageBytes);
    // 1 Cover Page + 1 Document Page = 2 Total Pages
    expect(resultPdf.getPageCount()).toBe(2);
  });
});
