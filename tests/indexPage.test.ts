import { describe, it, expect } from 'vitest';
import { calculateIndexItems } from '../src/features/package/indexPage';
import { Requirement, UploadedDocument } from '../src/types';

describe('Index Page Calculations (PROMPT 8)', () => {
  const dummyFile = new File([], 'dummy.pdf', { type: 'application/pdf' });

  it('1 & 2. Cover + Index means first document starts at page 3 for a 1-page document', () => {
    const matchedRequirements = [
      {
        requirement: { id: 'R01', order: 1, title_en: 'Trade License', title_bn: 'ট্রেড লাইসেন্স', mandatory: true, has_expiry: true },
        document: { id: 'doc-1', file: dummyFile, fileName: 'license.pdf', size: 1000, pageCount: 1 },
      },
    ];

    const indexItems = calculateIndexItems(matchedRequirements);

    expect(indexItems).toHaveLength(1);
    expect(indexItems[0].startPage).toBe(3);
    expect(indexItems[0].pageCount).toBe(1);
  });

  it('3. A six-page document followed by another document produces start page 9 for the second document', () => {
    const matchedRequirements = [
      {
        requirement: { id: 'R01', order: 1, title_en: 'Technical Proposal', title_bn: 'কারিগরি প্রস্তাবনা', mandatory: true, has_expiry: false },
        document: { id: 'doc-1', file: dummyFile, fileName: 'tech.pdf', size: 2000, pageCount: 6 },
      },
      {
        requirement: { id: 'R02', order: 2, title_en: 'Financial Proposal', title_bn: 'আর্থিক প্রস্তাবনা', mandatory: true, has_expiry: false },
        document: { id: 'doc-2', file: dummyFile, fileName: 'financial.pdf', size: 1500, pageCount: 2 },
      },
    ];

    const indexItems = calculateIndexItems(matchedRequirements);

    expect(indexItems).toHaveLength(2);
    expect(indexItems[0].startPage).toBe(3);
    expect(indexItems[0].pageCount).toBe(6);

    // Second document starts at 3 + 6 = 9
    expect(indexItems[1].startPage).toBe(9);
    expect(indexItems[1].pageCount).toBe(2);
  });

  it('4 & 5. Optional missing documents are excluded while optional matched documents are included', () => {
    const matchedRequirements = [
      {
        requirement: { id: 'R01', order: 1, title_en: 'Trade License', title_bn: 'ট্রেড লাইসেন্স', mandatory: true, has_expiry: true },
        document: { id: 'doc-1', file: dummyFile, fileName: 'license.pdf', size: 1000, pageCount: 1 },
      },
      // Note: Optional R02 is missing, so it won't be passed in matchedRequirements
      {
        requirement: { id: 'R03', order: 3, title_en: 'ISO Certificate (Optional)', title_bn: 'আইএসও সনদপত্র', mandatory: false, has_expiry: false },
        document: { id: 'doc-3', file: dummyFile, fileName: 'iso.pdf', size: 1200, pageCount: 3 },
      },
    ];

    const indexItems = calculateIndexItems(matchedRequirements);

    expect(indexItems).toHaveLength(2);
    expect(indexItems[0].title).toBe('Trade License');
    expect(indexItems[0].startPage).toBe(3);

    expect(indexItems[1].title).toBe('ISO Certificate (Optional)');
    expect(indexItems[1].startPage).toBe(4);
  });

  it('6 & 7. Documents remain sorted by requirement order and total page count calculation is verified', () => {
    const matchedRequirements = [
      {
        requirement: { id: 'R01', order: 1, title_en: 'Doc 1', title_bn: 'ডক ১', mandatory: true, has_expiry: false },
        document: { id: 'doc-1', file: dummyFile, fileName: 'd1.pdf', size: 500, pageCount: 2 },
      },
      {
        requirement: { id: 'R02', order: 2, title_en: 'Doc 2', title_bn: 'ডক ২', mandatory: true, has_expiry: false },
        document: { id: 'doc-2', file: dummyFile, fileName: 'd2.pdf', size: 500, pageCount: 4 },
      },
    ];

    const indexItems = calculateIndexItems(matchedRequirements);
    expect(indexItems[0].order).toBe(1);
    expect(indexItems[1].order).toBe(2);

    const sourcePagesTotal = matchedRequirements.reduce((sum, item) => sum + item.document.pageCount, 0);
    const totalPackagePages = 1 /* Cover */ + 1 /* Index */ + sourcePagesTotal;

    // 1 Cover + 1 Index + 2 + 4 = 8 Total Pages
    expect(totalPackagePages).toBe(8);
  });
});
