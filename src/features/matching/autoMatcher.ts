import { Requirement, UploadedDocument } from '@/types';
import { getAvailableDocuments } from '@/features/documents/documentUtils';

/**
 * Automatically suggests and applies document-to-requirement matches based on filename similarity.
 * Returns updated matches Record<requirementId, documentId>.
 */
export function autoMatchDocuments(
  requirements: Requirement[],
  documents: UploadedDocument[],
  currentMatches: Record<string, string>
): Record<string, string> {
  const newMatches = { ...currentMatches };

  for (const req of requirements) {
    // Skip if requirement is already matched
    if (newMatches[req.id]) continue;

    // Get available (unassigned) documents
    const availableDocs = getAvailableDocuments(documents, newMatches, req.id);
    if (availableDocs.length === 0) continue;

    const titleEnLower = req.title_en.toLowerCase();
    const titleBnLower = req.title_bn.toLowerCase();

    let bestMatchDoc: UploadedDocument | null = null;
    let highestScore = 0;

    for (const doc of availableDocs) {
      const fileNameLower = doc.fileName.toLowerCase();
      let score = 0;

      // Extract words from requirement titles (min length 3)
      const wordsEn = titleEnLower.split(/[^a-z0-9]+/i).filter((w) => w.length >= 3);
      for (const word of wordsEn) {
        if (fileNameLower.includes(word)) {
          score += 10;
        }
      }

      // Check specific Bangladesh Tender keywords
      if ((titleEnLower.includes('trade') || titleBnLower.includes('ট্রেড')) && fileNameLower.includes('trade')) {
        score += 50;
      }
      if ((titleEnLower.includes('tin') || titleBnLower.includes('কর')) && (fileNameLower.includes('tin') || fileNameLower.includes('tax'))) {
        score += 50;
      }
      if ((titleEnLower.includes('vat') || titleBnLower.includes('ভ্যাট')) && fileNameLower.includes('vat')) {
        score += 50;
      }
      if ((titleEnLower.includes('bank') || titleBnLower.includes('ব্যাংক')) && (fileNameLower.includes('bank') || fileNameLower.includes('solvency'))) {
        score += 50;
      }
      if ((titleEnLower.includes('iso') || titleBnLower.includes('আইএসও')) && fileNameLower.includes('iso')) {
        score += 50;
      }
      if (titleEnLower.includes('authorization') && (fileNameLower.includes('auth') || fileNameLower.includes('maf'))) {
        score += 40;
      }

      if (score > highestScore) {
        highestScore = score;
        bestMatchDoc = doc;
      }
    }

    if (bestMatchDoc && highestScore >= 10) {
      newMatches[req.id] = bestMatchDoc.id;
    }
  }

  return newMatches;
}
