import { PDFDocument } from 'pdf-lib';
import { TenderInfo, Requirement, UploadedDocument } from '@/types';
import { sortRequirements } from '@/features/tender/tenderUtils';
import { addCoverPage } from './coverPage';
import { addIndexPage } from './indexPage';
import { addPackageFooters } from './footer';

export interface GeneratePackageParams {
  tender: TenderInfo;
  requirements: Requirement[];
  documents: UploadedDocument[];
  matches: Record<string, string>; // requirementId -> documentId
}

/**
 * Generates the merged final PDF package with cover page, index page, and page footers.
 * Structure: Page 1 = Cover, Page 2 = Index, Page 3+ = Matched Documents.
 * Returns Uint8Array of the compiled PDF file.
 */
export async function generatePdfPackage(params: GeneratePackageParams): Promise<Uint8Array> {
  const { tender, requirements, documents, matches } = params;

  // 1. Sort requirements by ascending order
  const sortedRequirements = sortRequirements(requirements);

  // 2. Identify matched requirements in requirement order
  const matchedRequirements: { requirement: Requirement; document: UploadedDocument }[] = [];

  for (const req of sortedRequirements) {
    const docId = matches[req.id];
    if (docId) {
      const doc = documents.find((d) => d.id === docId);
      if (doc) {
        matchedRequirements.push({ requirement: req, document: doc });
      }
    }
  }

  if (matchedRequirements.length === 0) {
    throw new Error('No matched documents available to generate package.');
  }

  // 3. Create target PDF document
  const pdfDoc = await PDFDocument.create();

  // 4. Merge original document pages in requirement order
  for (const item of matchedRequirements) {
    try {
      const arrayBuffer = await item.document.file.arrayBuffer();
      const srcDoc = await PDFDocument.load(arrayBuffer);
      const pageIndices = srcDoc.getPageIndices();
      const copiedPages = await pdfDoc.copyPages(srcDoc, pageIndices);

      for (const page of copiedPages) {
        pdfDoc.addPage(page);
      }
    } catch (err) {
      console.error(`Failed to merge PDF "${item.document.fileName}":`, err);
      throw new Error(`Could not process document "${item.document.fileName}" during PDF merging.`);
    }
  }

  // 5. Insert English cover page at Page 1 (index 0)
  const todayStr = new Date().toISOString().split('T')[0];
  await addCoverPage({
    pdfDoc,
    tender,
    matchedRequirements,
    generatedDate: todayStr,
  });

  // 6. Insert English Index / Table of Contents page at Page 2 (index 1)
  await addIndexPage({
    pdfDoc,
    matchedRequirements,
  });

  // 7. Add standard page footers "<tender_id> | Page X of Y" to all pages
  await addPackageFooters(pdfDoc, { tenderId: tender.tender_id });

  // 8. Save and return PDF byte array
  return await pdfDoc.save();
}

/**
 * Helper to download PDF Uint8Array in browser as <tender_id>_Package.pdf
 */
export function downloadPdfPackage(pdfBytes: Uint8Array, tenderId: string): void {
  const sanitizedId = tenderId.replace(/[^a-zA-Z0-9_-]/g, '_');
  const filename = `${sanitizedId}_Package.pdf`;

  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();

  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 100);
}
