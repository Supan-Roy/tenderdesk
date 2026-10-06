import { describe, it, expect } from 'vitest';
import { exportProjectState, parseProjectState } from '../src/features/tender/projectSerializer';
import { TenderInfo, Requirement, UploadedDocument } from '../src/types';

describe('Save and Reopen Project Feature', () => {
  const dummyTender: TenderInfo = {
    tender_id: 'IFT-SAVE-2026',
    title: 'Project Save Test',
    procuring_entity: 'Test Org',
    submission_deadline: '2026-11-30',
  };

  const dummyReqs: Requirement[] = [
    { id: 'R01', order: 1, title_en: 'Trade License', title_bn: 'ট্রেড লাইসেন্স', mandatory: true, has_expiry: true },
  ];

  const dummyFile = new File([], 'license.pdf', { type: 'application/pdf' });
  const dummyDoc: UploadedDocument = { id: 'd1', file: dummyFile, fileName: 'license.pdf', size: 500, pageCount: 1, hash: 'abc123hash' };

  it('should serialize project state to valid JSON string', () => {
    const jsonStr = exportProjectState({
      tender: dummyTender,
      requirements: dummyReqs,
      documents: [dummyDoc],
      matches: { R01: 'd1' },
      expiryDates: { R01: '2027-01-01' },
    });

    expect(jsonStr).toContain('IFT-SAVE-2026');
    expect(jsonStr).toContain('license.pdf');
    expect(jsonStr).toContain('2027-01-01');
  });

  it('should parse and restore saved project state correctly', () => {
    const jsonStr = exportProjectState({
      tender: dummyTender,
      requirements: dummyReqs,
      documents: [dummyDoc],
      matches: { R01: 'd1' },
      expiryDates: { R01: '2027-01-01' },
    });

    const parseResult = parseProjectState(jsonStr);
    expect(parseResult.success).toBe(true);
    if (parseResult.success) {
      expect(parseResult.data.tender?.tender_id).toBe('IFT-SAVE-2026');
      expect(parseResult.data.requirements).toHaveLength(1);
      expect(parseResult.data.matches['R01']).toBe('d1');
      expect(parseResult.data.expiryDates['R01']).toBe('2027-01-01');
    }
  });
});
