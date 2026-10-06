import { DocumentStatus, UploadedDocument } from '@/types';
import { StatusEvaluationParams } from './types';

export const MAX_FILE_COUNT = 30;
export const MAX_TOTAL_SIZE_BYTES = 50 * 1024 * 1024; // 50 MB

/**
 * Calculates total bytes across uploaded documents
 */
export function calculateTotalBytes(documents: UploadedDocument[]): number {
  return documents.reduce((acc, doc) => acc + doc.size, 0);
}

export interface ValidationUploadResult {
  allowedFiles: File[];
  errors: string[];
}

/**
 * Validates new file uploads against max 30 file count and max 50 MB total size limits.
 */
export function validateUploadLimits(
  existingDocs: UploadedDocument[],
  newFiles: File[]
): ValidationUploadResult {
  const errors: string[] = [];
  const currentCount = existingDocs.length;
  const currentTotalBytes = calculateTotalBytes(existingDocs);

  if (currentCount >= MAX_FILE_COUNT) {
    return {
      allowedFiles: [],
      errors: [`You can upload up to ${MAX_FILE_COUNT} PDF files. The maximum file limit has already been reached.`],
    };
  }

  const potentialCount = currentCount + newFiles.length;
  let maxNewFilesToTake = newFiles.length;

  if (potentialCount > MAX_FILE_COUNT) {
    maxNewFilesToTake = MAX_FILE_COUNT - currentCount;
    errors.push(
      `You can upload up to ${MAX_FILE_COUNT} PDF files. Only the first ${maxNewFilesToTake} file(s) were selected.`
    );
  }

  const candidateFiles = newFiles.slice(0, maxNewFilesToTake);
  const allowedFiles: File[] = [];
  let addedBytes = 0;

  for (const file of candidateFiles) {
    if (currentTotalBytes + addedBytes + file.size > MAX_TOTAL_SIZE_BYTES) {
      errors.push(
        `The total PDF size cannot exceed 50 MB. "${file.name}" was skipped as it exceeds the remaining storage limit.`
      );
      break;
    }
    addedBytes += file.size;
    allowedFiles.push(file);
  }

  return { allowedFiles, errors };
}

/**
 * Determines the deterministic document status for a requirement based on prompt rules:
 * 1. If mandatory and no file matched → MISSING
 * 2. Else if optional and no file matched → NOT_PROVIDED
 * 3. Else if expiry required and no expiry date → EXPIRY_NEEDED
 * 4. Else if expiry required and expiry date < submission_deadline → EXPIRED
 * 5. Else → OK
 */
export function evaluateRequirementStatus(params: StatusEvaluationParams): DocumentStatus {
  const { requirement, matchedDocument, expiryDate, submissionDeadline } = params;

  // Rule 1 & 2: No file matched
  if (!matchedDocument) {
    return requirement.mandatory ? 'MISSING' : 'NOT_PROVIDED';
  }

  // File is matched
  if (requirement.has_expiry) {
    // Rule 3: Expiry required but no expiry date entered
    if (!expiryDate || !expiryDate.trim()) {
      return 'EXPIRY_NEEDED';
    }

    // Rule 4: Expiry required and expiry date < submission_deadline
    if (submissionDeadline && expiryDate.trim() < submissionDeadline.trim()) {
      return 'EXPIRED';
    }
  }

  // Rule 5: Matched file and, where applicable, expiry date >= submission_deadline
  return 'OK';
}

/**
 * Returns true if the status blocks final package generation.
 */
export function isBlockingStatus(status: DocumentStatus): boolean {
  return status === 'MISSING' || status === 'EXPIRY_NEEDED' || status === 'EXPIRED';
}

/**
 * Returns list of uploaded documents that are available to be matched to a given requirement.
 * Enforces both 1-to-1 document matching AND SHA-256 duplicate content safety
 * (a duplicate file content group cannot satisfy two different requirements).
 */
export function getAvailableDocuments(
  allDocuments: UploadedDocument[],
  matches: Record<string, string>,
  currentRequirementId: string
): UploadedDocument[] {
  // Collect IDs of documents matched to OTHER requirements
  const matchedEntries = Object.entries(matches).filter(([reqId]) => reqId !== currentRequirementId);
  const matchedDocIds = new Set(matchedEntries.map(([, docId]) => docId));

  // Collect SHA-256 hashes of documents matched to OTHER requirements
  const matchedHashes = new Set<string>();
  for (const docId of matchedDocIds) {
    const doc = allDocuments.find((d) => d.id === docId);
    if (doc?.hash) {
      matchedHashes.add(doc.hash);
    }
  }

  // Filter out documents whose ID is matched elsewhere OR whose hash is already matched elsewhere
  return allDocuments.filter((doc) => {
    if (matchedDocIds.has(doc.id)) return false;
    if (doc.hash && matchedHashes.has(doc.hash)) return false;
    return true;
  });
}
