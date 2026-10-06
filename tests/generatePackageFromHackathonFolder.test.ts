import { describe, it, expect } from 'vitest';
import { PDFDocument } from 'pdf-lib';
import * as fs from 'fs';
import * as path from 'path';
import { generatePdfPackage } from '../src/features/package/packageGenerator';
import { TenderInfo, Requirement, UploadedDocument } from '../src/types';

describe('Official Hackathon Sample Pack Generator Deliverable', () => {
  it('should compile output/T-2026-0417_Package.pdf from hackathon/ documents and requirements.json', async () => {
    const hackathonDir = path.resolve(process.cwd(), 'hackathon');
    const reqJsonPath = path.join(hackathonDir, 'requirements.json');
    const docsDir = path.join(hackathonDir, 'documents');

    expect(fs.existsSync(reqJsonPath)).toBe(true);
    expect(fs.existsSync(docsDir)).toBe(true);

    const reqJsonData = JSON.parse(fs.readFileSync(reqJsonPath, 'utf-8'));
    const tender: TenderInfo = reqJsonData.tender;
    const requirements: Requirement[] = reqJsonData.requirements;

    // Load actual PDF files from hackathon/documents
    const loadDocFile = async (fileName: string, id: string): Promise<UploadedDocument> => {
      const filePath = path.join(docsDir, fileName);
      const buffer = fs.readFileSync(filePath);
      const pdf = await PDFDocument.load(buffer);
      const file = new File([buffer.buffer as ArrayBuffer], fileName, { type: 'application/pdf' });

      return {
        id,
        file,
        fileName,
        size: buffer.byteLength,
        pageCount: pdf.getPageCount(),
      };
    };

    const docTradeLicense = await loadDocFile('trade_license_2026.pdf', 'doc-tl');
    const docTin = await loadDocFile('03_tin_certificate.pdf', 'doc-tin');
    const docVat = await loadDocFile('04_vat_certificate.pdf', 'doc-vat');
    const docBank = await loadDocFile('bank_solvency.pdf', 'doc-bank');
    const docExp = await loadDocFile('experience_cert.pdf', 'doc-exp');
    const docTech = await loadDocFile('02_technical_proposal.pdf', 'doc-tech');
    const docFin = await loadDocFile('01_financial_proposal.pdf', 'doc-fin');
    const docDecl = await loadDocFile('scan_0042.pdf', 'doc-decl');

    const documents: UploadedDocument[] = [
      docTradeLicense,
      docTin,
      docVat,
      docBank,
      docExp,
      docTech,
      docFin,
      docDecl,
    ];

    const matches: Record<string, string> = {
      R01: 'doc-tl',
      R02: 'doc-tin',
      R03: 'doc-vat',
      R04: 'doc-bank',
      R05: 'doc-exp',
      R08: 'doc-tech',
      R09: 'doc-fin',
      R10: 'doc-decl',
    };

    const compiledPackageBytes = await generatePdfPackage({
      tender,
      requirements,
      documents,
      matches,
    });

    const outputDir = path.resolve(process.cwd(), 'output');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const outputPath = path.join(outputDir, 'T-2026-0417_Package.pdf');
    fs.writeFileSync(outputPath, compiledPackageBytes);

    expect(fs.existsSync(outputPath)).toBe(true);

    const loadedPdf = await PDFDocument.load(compiledPackageBytes);
    const totalPages = loadedPdf.getPageCount();

    // Verify Cover (Page 1) + Index (Page 2) + all merged document pages
    expect(totalPages).toBeGreaterThan(5);
    console.log(`Generated official package at "${outputPath}" with ${totalPages} total pages.`);
  });
});
