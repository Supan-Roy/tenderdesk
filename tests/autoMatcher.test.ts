import { describe, it, expect } from 'vitest';
import { autoMatchDocuments } from '../src/features/matching/autoMatcher';
import { Requirement, UploadedDocument } from '../src/types';

describe('Auto Matcher Feature', () => {
  const dummyFile = new File([], 'dummy.pdf', { type: 'application/pdf' });

  const sampleReqs: Requirement[] = [
    { id: 'R01', order: 1, title_en: 'Trade License (Updated)', title_bn: 'ট্রেড লাইসেন্স', mandatory: true, has_expiry: true },
    { id: 'R02', order: 2, title_en: 'Tax Identification Number (TIN) Certificate', title_bn: 'কর শনাক্তকরণ নম্বর', mandatory: true, has_expiry: false },
    { id: 'R03', order: 3, title_en: 'VAT Registration Certificate', title_bn: 'ভ্যাট নিবন্ধন সনদপত্র', mandatory: true, has_expiry: false },
  ];

  const sampleDocs: UploadedDocument[] = [
    { id: 'd1', file: dummyFile, fileName: 'trade_license_2027.pdf', size: 100, pageCount: 1 },
    { id: 'd2', file: dummyFile, fileName: 'TIN_Certificate_Official.pdf', size: 100, pageCount: 1 },
    { id: 'd3', file: dummyFile, fileName: 'VAT_Registration.pdf', size: 100, pageCount: 1 },
  ];

  it('should auto-match documents based on filename keywords', () => {
    const matches = autoMatchDocuments(sampleReqs, sampleDocs, {});
    expect(matches['R01']).toBe('d1');
    expect(matches['R02']).toBe('d2');
    expect(matches['R03']).toBe('d3');
  });

  it('should not overwrite existing matches', () => {
    const current = { R01: 'd2' }; // R01 manually matched to d2
    const matches = autoMatchDocuments(sampleReqs, sampleDocs, current);
    expect(matches['R01']).toBe('d2');
  });
});
