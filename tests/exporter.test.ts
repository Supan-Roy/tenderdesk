import { describe, it, expect } from 'vitest';
import { generateChecklistCsv } from '../src/features/tender/exporter';
import { TenderInfo, Requirement, UploadedDocument } from '../src/types';

describe('Checklist CSV Exporter Feature', () => {
  const dummyTender: TenderInfo = {
    tender_id: 'IFT-2026-TEST',
    title: 'Test Tender',
    procuring_entity: 'Test Entity',
    submission_deadline: '2026-12-31',
  };

  const dummyReqs: Requirement[] = [
    { id: 'R01', order: 1, title_en: 'Trade License', title_bn: 'ট্রেড লাইসেন্স', mandatory: true, has_expiry: true },
    { id: 'R02', order: 2, title_en: 'TIN Certificate', title_bn: 'টিআইএন', mandatory: false, has_expiry: false },
  ];

  const dummyFile = new File([], 'license.pdf', { type: 'application/pdf' });
  const dummyDoc: UploadedDocument = { id: 'd1', file: dummyFile, fileName: 'license.pdf', size: 100, pageCount: 2 };

  it('should generate valid CSV with headers and requirement rows', () => {
    const csv = generateChecklistCsv({
      tender: dummyTender,
      requirements: dummyReqs,
      documents: [dummyDoc],
      matches: { R01: 'd1' },
      expiryDates: { R01: '2027-01-01' },
    });

    expect(csv).toContain('IFT-2026-TEST');
    expect(csv).toContain('"Trade License"');
    expect(csv).toContain('Mandatory');
    expect(csv).toContain('"license.pdf"');
    expect(csv).toContain('2027-01-01');
    expect(csv).toContain('OK');
    expect(csv).toContain('NOT_PROVIDED');
  });
});
