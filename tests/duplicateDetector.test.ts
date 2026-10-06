import { describe, it, expect } from 'vitest';
import { calculateFileHash, detectDuplicates } from '../src/features/documents/duplicateDetector';
import { UploadedDocument } from '../src/types';

describe('duplicateDetector', () => {
  it('calculateFileHash should generate consistent SHA-256 hash for identical file contents', async () => {
    const fileA = new File(['Hello World PDF Content'], 'license_copy_1.pdf', { type: 'application/pdf' });
    const fileB = new File(['Hello World PDF Content'], 'license_copy_2.pdf', { type: 'application/pdf' });

    const hashA = await calculateFileHash(fileA);
    const hashB = await calculateFileHash(fileB);

    expect(hashA).toBeTruthy();
    expect(hashA).toBe(hashB);
  });

  it('calculateFileHash should generate different hashes for different file contents', async () => {
    const fileA = new File(['Content A'], 'docA.pdf', { type: 'application/pdf' });
    const fileB = new File(['Content B'], 'docB.pdf', { type: 'application/pdf' });

    const hashA = await calculateFileHash(fileA);
    const hashB = await calculateFileHash(fileB);

    expect(hashA).not.toBe(hashB);
  });

  it('detectDuplicates should mark documents with identical content hashes as duplicates', () => {
    const sharedHash = 'abc123def456';

    const docs: UploadedDocument[] = [
      {
        id: 'doc-1',
        file: new File(['A'], 'file1.pdf'),
        fileName: 'file1.pdf',
        size: 100,
        pageCount: 1,
        hash: sharedHash,
      },
      {
        id: 'doc-2',
        file: new File(['A'], 'renamed_file1.pdf'),
        fileName: 'renamed_file1.pdf',
        size: 100,
        pageCount: 1,
        hash: sharedHash,
      },
      {
        id: 'doc-3',
        file: new File(['B'], 'unique.pdf'),
        fileName: 'unique.pdf',
        size: 200,
        pageCount: 2,
        hash: 'unique789',
      },
    ];

    const processed = detectDuplicates(docs);

    expect(processed[0].isDuplicate).toBe(true);
    expect(processed[1].isDuplicate).toBe(true);
    expect(processed[2].isDuplicate).toBe(false);
  });
});
