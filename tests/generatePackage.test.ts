import { describe, it, expect } from 'vitest';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import * as fs from 'fs';
import * as path from 'path';
import { generatePdfPackage } from '../src/features/package/packageGenerator';
import { TenderInfo, Requirement, UploadedDocument } from '../src/types';

async function createSampleDocumentPdf(title: string, pagesCount: number = 1): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const textFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

  for (let i = 1; i <= pagesCount; i++) {
    const page = pdfDoc.addPage([595, 842]); // A4
    page.drawText(title, {
      x: 50,
      y: 780,
      size: 18,
      font,
      color: rgb(0.1, 0.2, 0.5),
    });

    page.drawText(`Official Document Attachment - Page ${i} of ${pagesCount}`, {
      x: 50,
      y: 750,
      size: 12,
      font: textFont,
      color: rgb(0.3, 0.3, 0.3),
    });

    page.drawRectangle({
      x: 50,
      y: 100,
      width: 495,
      height: 620,
      borderColor: rgb(0.8, 0.8, 0.8),
      borderWidth: 1,
    });
  }

  return await pdfDoc.save();
}

describe('Sample Package Generator Deliverable', () => {
  it('should generate output/T-2026-0417_Package.pdf using actual app logic', async () => {
    const sampleTender: TenderInfo = {
      tender_id: 'T-2026-0417',
      title: 'Supply and Installation of Enterprise Network Infrastructure',
      procuring_entity: 'Bangladesh Computer Council',
      bidder: 'Apex Technical Solutions Ltd.',
      submission_deadline: '2026-11-15',
    };

    const sampleRequirements: Requirement[] = [
      {
        id: 'REQ-001',
        order: 1,
        title_en: 'Trade License (Updated)',
        title_bn: 'হালনাগাদ ট্রেড লাইসেন্স',
        mandatory: true,
        has_expiry: true,
      },
      {
        id: 'REQ-002',
        order: 2,
        title_en: 'Tax Identification Number (TIN) Certificate',
        title_bn: 'কর শনাক্তকরণ নম্বর (টিআইএন) সনদপত্র',
        mandatory: true,
        has_expiry: false,
      },
      {
        id: 'REQ-003',
        order: 3,
        title_en: 'VAT Registration Certificate',
        title_bn: 'ভ্যাট নিবন্ধন সনদপত্র',
        mandatory: true,
        has_expiry: false,
      },
      {
        id: 'REQ-004',
        order: 4,
        title_en: 'Bank Solvency Certificate',
        title_bn: 'ব্যাংক সচ্ছলতা সনদপত্র',
        mandatory: true,
        has_expiry: true,
      },
      {
        id: 'REQ-005',
        order: 5,
        title_en: 'Manufacturer Authorization Letter (Optional)',
        title_bn: 'প্রস্তুতকারক প্রতিষ্ঠানের অনুমতিপত্র (ঐচ্ছিক)',
        mandatory: false,
        has_expiry: false,
      },
    ];

    const bytes1 = await createSampleDocumentPdf('Trade License (Valid until 2027)', 1);
    const bytes2 = await createSampleDocumentPdf('TIN Certificate', 1);
    const bytes3 = await createSampleDocumentPdf('VAT Registration Certificate', 1);
    const bytes4 = await createSampleDocumentPdf('Bank Solvency Certificate', 2);

    const file1 = new File([bytes1.buffer as ArrayBuffer], 'Trade_License_Valid.pdf', { type: 'application/pdf' });
    const file2 = new File([bytes2.buffer as ArrayBuffer], 'TIN_Certificate.pdf', { type: 'application/pdf' });
    const file3 = new File([bytes3.buffer as ArrayBuffer], 'VAT_Registration.pdf', { type: 'application/pdf' });
    const file4 = new File([bytes4.buffer as ArrayBuffer], 'Bank_Solvency_Certificate.pdf', { type: 'application/pdf' });

    const doc1: UploadedDocument = { id: 'doc-1', file: file1, fileName: 'Trade_License_Valid.pdf', size: bytes1.byteLength, pageCount: 1 };
    const doc2: UploadedDocument = { id: 'doc-2', file: file2, fileName: 'TIN_Certificate.pdf', size: bytes2.byteLength, pageCount: 1 };
    const doc3: UploadedDocument = { id: 'doc-3', file: file3, fileName: 'VAT_Registration.pdf', size: bytes3.byteLength, pageCount: 1 };
    const doc4: UploadedDocument = { id: 'doc-4', file: file4, fileName: 'Bank_Solvency_Certificate.pdf', size: bytes4.byteLength, pageCount: 2 };

    const matches: Record<string, string> = {
      'REQ-001': 'doc-1',
      'REQ-002': 'doc-2',
      'REQ-003': 'doc-3',
      'REQ-004': 'doc-4',
    };

    const packageBytes = await generatePdfPackage({
      tender: sampleTender,
      requirements: sampleRequirements,
      documents: [doc1, doc2, doc3, doc4],
      matches,
    });

    const outputDir = path.resolve(process.cwd(), 'output');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const outputPath = path.join(outputDir, 'T-2026-0417_Package.pdf');
    fs.writeFileSync(outputPath, packageBytes);

    expect(fs.existsSync(outputPath)).toBe(true);

    // Verify PDF structure
    const loadedPdf = await PDFDocument.load(packageBytes);
    // 1 Cover Page + 1 Index Page + 1 Trade License + 1 TIN + 1 VAT + 2 Bank Solvency = 7 Total Pages
    expect(loadedPdf.getPageCount()).toBe(7);
  });
});
