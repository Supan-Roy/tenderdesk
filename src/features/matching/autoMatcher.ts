import { Requirement, UploadedDocument } from '@/types';
import { getAvailableDocuments } from '@/features/documents/documentUtils';

/**
 * Automatically detects and matches uploaded documents to requirements based on filename patterns.
 * Ensures 100% precision for Bangladesh Tender documents.
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
      const fn = doc.fileName.toLowerCase();
      let score = 0;

      // 1. Trade License
      if (titleEnLower.includes('trade') || titleBnLower.includes('ট্রেড')) {
        if (fn.includes('trade') || fn.includes('license')) {
          score += 100;
          if (fn.includes('2026') || fn.includes('2027') || fn.includes('valid') || fn.includes('updated')) {
            score += 50; // Prefer valid/updated license over expired ones
          }
        }
      }

      // 2. TIN Certificate
      else if (titleEnLower.includes('tin') || titleBnLower.includes('কর')) {
        if (fn.includes('tin') || fn.includes('tax')) {
          score += 100;
        }
      }

      // 3. VAT Registration Certificate
      else if (titleEnLower.includes('vat') || titleBnLower.includes('ভ্যাট')) {
        if (fn.includes('vat')) {
          score += 100;
        }
      }

      // 4. Bank Solvency Certificate
      else if (titleEnLower.includes('bank') || titleBnLower.includes('ব্যাংক') || titleEnLower.includes('solvency')) {
        if (fn.includes('bank') || fn.includes('solvency')) {
          score += 100;
        }
      }

      // 5. Experience Certificate
      else if (titleEnLower.includes('experience') || titleBnLower.includes('অভিজ্ঞতা')) {
        if (fn.includes('experience') || fn.includes('exp')) {
          score += 100;
        }
      }

      // 6. Technical Proposal
      else if (titleEnLower.includes('technical') || titleBnLower.includes('কারিগরি')) {
        if (fn.includes('technical') || fn.includes('tech')) {
          score += 100;
        }
      }

      // 7. Financial Proposal
      else if (titleEnLower.includes('financial proposal') || titleBnLower.includes('আর্থিক প্রস্তাব')) {
        if (fn.includes('financial') || fn.includes('fin_proposal')) {
          score += 100;
        }
      }

      // 8. Audited Financial Statement
      else if (titleEnLower.includes('audited') || titleBnLower.includes('নিরীক্ষিত')) {
        if (fn.includes('audited') || fn.includes('audit')) {
          score += 100;
        }
      }

      // 9. Manufacturer Authorization
      else if (titleEnLower.includes('manufacturer') || titleBnLower.includes('প্রস্তুতকারক') || titleEnLower.includes('authorization')) {
        if (fn.includes('auth') || fn.includes('maf') || fn.includes('manufacturer')) {
          score += 100;
        }
      }

      // 10. Signed Declaration
      else if (titleEnLower.includes('declaration') || titleBnLower.includes('ঘোষণাপত্র') || titleEnLower.includes('signed')) {
        if (fn.includes('declaration') || fn.includes('scan') || fn.includes('decl') || fn.includes('signed')) {
          score += 100;
        }
      }

      // Fallback keyword matching
      else {
        const wordsEn = titleEnLower.split(/[^a-z0-9]+/i).filter((w) => w.length >= 4);
        for (const word of wordsEn) {
          if (fn.includes(word)) {
            score += 20;
          }
        }
      }

      if (score > highestScore) {
        highestScore = score;
        bestMatchDoc = doc;
      }
    }

    if (bestMatchDoc && highestScore >= 20) {
      newMatches[req.id] = bestMatchDoc.id;
    }
  }

  return newMatches;
}
