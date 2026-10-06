import { describe, it, expect } from 'vitest';
import { calculateFileHash, detectDuplicates } from '../src/features/documents/duplicateDetector';
import { UploadedDocument } from '../src/types';

describe('duplicateDetector tests', () => {
  it('1. Identical byte arrays produce the same SHA-256 hash', async () => {
    const bytes = new Uint8Array([37, 80, 68, 70, 45, 49, 46, 55]); // %PDF-1.7
    const fileA = new File([bytes], 'doc1.pdf', { type: 'application/pdf' });
    const fileB = new File([bytes], 'doc2.pdf', { type: 'application/pdf' });

    const hashA = await calculateFileHash(fileA);
    const hashB = await calculateFileHash(fileB);

    expect(hashA).toBeTruthy();
    expect(hashA).toBe(hashB);
  });

  it('2. Different byte arrays produce different hashes', async () => {
    const fileA = new File(['PDF Content Alpha'], 'docA.pdf', { type: 'application/pdf' });
    const fileB = new File(['PDF Content Beta'], 'docB.pdf', { type: 'application/pdf' });

    const hashA = await calculateFileHash(fileA);
    const hashB = await calculateFileHash(fileB);

    expect(hashA).not.toBe(hashB);
  });

  it('3. Same PDF content with different filenames are detected as duplicates', () => {
    const sharedHash = 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855';

    const docs: UploadedDocument[] = [
      {
        id: 'doc-1',
        file: new File(['Same PDF Bytes'], 'trade_license_2026.pdf'),
        fileName: 'trade_license_2026.pdf',
        size: 1500,
        pageCount: 1,
        hash: sharedHash,
      },
      {
        id: 'doc-2',
        file: new File(['Same PDF Bytes'], 'trade_license_copy.pdf'),
        fileName: 'trade_license_copy.pdf',
        size: 1500,
        pageCount: 1,
        hash: sharedHash,
      },
    ];

    const result = detectDuplicates(docs);

    expect(result[0].isDuplicate).toBe(true);
    expect(result[1].isDuplicate).toBe(true);
  });

  it('4. Three identical files all belong to the same duplicate group', () => {
    const groupHash = 'hash-111222333';

    const docs: UploadedDocument[] = [
      { id: 'd1', file: new File(['X'], 'a.pdf'), fileName: 'a.pdf', size: 10, pageCount: 1, hash: groupHash },
      { id: 'd2', file: new File(['X'], 'b.pdf'), fileName: 'b.pdf', size: 10, pageCount: 1, hash: groupHash },
      { id: 'd3', file: new File(['X'], 'c.pdf'), fileName: 'c.pdf', size: 10, pageCount: 1, hash: groupHash },
    ];

    const result = detectDuplicates(docs);

    expect(result.every((d) => d.isDuplicate === true)).toBe(true);
  });

  it('5. Removing one duplicate updates the remaining duplicate state correctly', () => {
    const dupHash = 'hash-dup-xyz';

    const initialDocs: UploadedDocument[] = [
      { id: 'd1', file: new File(['X'], 'a.pdf'), fileName: 'a.pdf', size: 10, pageCount: 1, hash: dupHash },
      { id: 'd2', file: new File(['X'], 'b.pdf'), fileName: 'b.pdf', size: 10, pageCount: 1, hash: dupHash },
    ];

    const initialResult = detectDuplicates(initialDocs);
    expect(initialResult[0].isDuplicate).toBe(true);
    expect(initialResult[1].isDuplicate).toBe(true);

    // Remove d1, leaving only d2
    const remainingDocs = initialResult.filter((d) => d.id !== 'd1');
    const updatedResult = detectDuplicates(remainingDocs);

    expect(updatedResult).toHaveLength(1);
    expect(updatedResult[0].isDuplicate).toBe(false);
  });

  it('6. A unique PDF is not marked duplicate', () => {
    const docs: UploadedDocument[] = [
      { id: 'd1', file: new File(['1'], 'unique1.pdf'), fileName: 'unique1.pdf', size: 10, pageCount: 1, hash: 'h1' },
      { id: 'd2', file: new File(['2'], 'unique2.pdf'), fileName: 'unique2.pdf', size: 20, pageCount: 2, hash: 'h2' },
    ];

    const result = detectDuplicates(docs);

    expect(result[0].isDuplicate).toBe(false);
    expect(result[1].isDuplicate).toBe(false);
  });
});
