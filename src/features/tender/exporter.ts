import { Requirement, UploadedDocument, TenderInfo } from '@/types';
import { evaluateRequirementStatus } from '@/features/documents/documentUtils';

export interface ExportChecklistParams {
  tender: TenderInfo;
  requirements: Requirement[];
  documents: UploadedDocument[];
  matches: Record<string, string>;
  expiryDates: Record<string, string>;
}

/**
 * Generates CSV content string representing the document requirement checklist.
 */
export function generateChecklistCsv(params: ExportChecklistParams): string {
  const { tender, requirements, documents, matches, expiryDates } = params;

  const headers = ['Order', 'Requirement (English)', 'Requirement (Bangla)', 'Mandatory', 'Matched File', 'Pages', 'Expiry Date', 'Status'];
  const rows: string[][] = [
    [`Tender ID: ${tender.tender_id}`, `Title: ${tender.title}`],
    [], // Blank line separator
    headers,
  ];

  const sortedReqs = [...requirements].sort((a, b) => a.order - b.order);

  for (const req of sortedReqs) {
    const docId = matches[req.id];
    const doc = documents.find((d) => d.id === docId);
    const expiry = expiryDates[req.id] || '';

    const status = evaluateRequirementStatus({
      requirement: req,
      matchedDocument: doc,
      expiryDate: expiry,
      submissionDeadline: tender.submission_deadline,
    });

    rows.push([
      String(req.order),
      `"${req.title_en.replace(/"/g, '""')}"`,
      `"${req.title_bn.replace(/"/g, '""')}"`,
      req.mandatory ? 'Mandatory' : 'Optional',
      doc ? `"${doc.fileName.replace(/"/g, '""')}"` : 'None',
      doc ? String(doc.pageCount) : '0',
      expiry || 'N/A',
      status,
    ]);
  }

  return rows.map((r) => r.join(',')).join('\n');
}

/**
 * Downloads CSV file in browser as <tender_id>_Checklist.csv
 */
export function downloadChecklistCsv(params: ExportChecklistParams): void {
  const csvContent = generateChecklistCsv(params);
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' }); // UTF-8 BOM for Excel compatibility
  const url = URL.createObjectURL(blob);

  const sanitizedId = params.tender.tender_id.replace(/[^a-zA-Z0-9_-]/g, '_');
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `${sanitizedId}_Checklist.csv`);
  document.body.appendChild(link);
  link.click();

  setTimeout(() => {
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, 100);
}
