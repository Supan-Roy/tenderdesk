import { TenderInfo, Requirement, UploadedDocument } from '@/types';

export interface GeneratePackageParams {
  tender: TenderInfo;
  requirements: Requirement[];
  documents: UploadedDocument[];
  matches: Record<string, string>; // requirementId -> documentId
}

/**
 * Generates the merged final PDF package with cover page and footers.
 * Returns Uint8Array of the final PDF file.
 */
export async function generatePdfPackage(_params: GeneratePackageParams): Promise<Uint8Array> {
  // Stub for PDF package generation architecture - to be implemented in feature build step
  throw new Error('Package generation will be performed in the next workflow phase.');
}
