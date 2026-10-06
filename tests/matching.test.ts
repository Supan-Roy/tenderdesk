import { describe, it, expect } from 'vitest';
import { getAvailableDocuments } from '../src/features/documents/documentUtils';
import { UploadedDocument } from '../src/types';

describe('matching invariants', () => {
  const file1 = new File(['content 1'], 'trade_license.pdf', { type: 'application/pdf' });
  const file2 = new File(['content 2'], 'tin_certificate.pdf', { type: 'application/pdf' });
  const file3 = new File(['content 3'], 'vat_certificate.pdf', { type: 'application/pdf' });

  const doc1: UploadedDocument = { id: 'doc-1', file: file1, fileName: 'trade_license.pdf', size: 100, pageCount: 1 };
  const doc2: UploadedDocument = { id: 'doc-2', file: file2, fileName: 'tin_certificate.pdf', size: 200, pageCount: 1 };
  const doc3: UploadedDocument = { id: 'doc-3', file: file3, fileName: 'vat_certificate.pdf', size: 300, pageCount: 1 };

  const allDocs = [doc1, doc2, doc3];

  it('getAvailableDocuments should return all documents when no matches exist', () => {
    const matches: Record<string, string> = {};
    const available = getAvailableDocuments(allDocs, matches, 'R01');
    expect(available).toHaveLength(3);
    expect(available.map((d) => d.id)).toEqual(['doc-1', 'doc-2', 'doc-3']);
  });

  it('getAvailableDocuments should exclude documents matched to other requirements', () => {
    const matches: Record<string, string> = {
      R01: 'doc-1',
      R02: 'doc-2',
    };

    // Available for R03 should only be doc-3
    const availableForR03 = getAvailableDocuments(allDocs, matches, 'R03');
    expect(availableForR03.map((d) => d.id)).toEqual(['doc-3']);
  });

  it('getAvailableDocuments should include currently matched document when changing match for the same requirement', () => {
    const matches: Record<string, string> = {
      R01: 'doc-1',
      R02: 'doc-2',
    };

    // Available for R01 should include doc-1 (currently matched) and doc-3 (unmatched), but NOT doc-2 (matched to R02)
    const availableForR01 = getAvailableDocuments(allDocs, matches, 'R01');
    expect(availableForR01.map((d) => d.id)).toEqual(['doc-1', 'doc-3']);
  });

  it('matching logic invariant: 1-to-1 requirement and document relationship', () => {
    let matches: Record<string, string> = {};

    // Match doc-1 to R01
    matches['R01'] = 'doc-1';
    expect(matches['R01']).toBe('doc-1');

    // Re-assigning doc-1 to R02 must unmatch R01
    const newDocId = 'doc-1';
    const newReqId = 'R02';

    const updatedMatches: Record<string, string> = { ...matches };
    for (const [rId, dId] of Object.entries(updatedMatches)) {
      if (dId === newDocId) {
        delete updatedMatches[rId];
      }
    }
    updatedMatches[newReqId] = newDocId;

    expect(updatedMatches['R01']).toBeUndefined();
    expect(updatedMatches['R02']).toBe('doc-1');
  });

  it('unmatching logic: removing a match clears requirement association', () => {
    const matches: Record<string, string> = { R01: 'doc-1', R02: 'doc-2' };
    delete matches['R01'];

    expect(matches['R01']).toBeUndefined();
    expect(matches['R02']).toBe('doc-2');
  });
});
