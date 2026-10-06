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
 * Determines the document status based on requirement rules and expiry dates.
 */
export function evaluateRequirementStatus(params: StatusEvaluationParams): DocumentStatus {
  const { requirement, matchedDocument, expiryDate, submissionDeadline } = params;

  if (!matchedDocument) {
    return requirement.mandatory ? 'MISSING' : 'NOT_PROVIDED';
  }

  if (requirement.has_expiry) {
    if (!expiryDate || expiryDate.trim() === '') {
      return 'EXPIRY_NEEDED';
    }

    if (submissionDeadline && expiryDate < submissionDeadline) {
      return 'EXPIRED';
    }
  }

  return 'OK';
}

/**
 * Returns true if the status blocks final package generation.
 */
export function isBlockingStatus(status: DocumentStatus): boolean {
  return status === 'MISSING' || status === 'EXPIRY_NEEDED' || status === 'EXPIRED';
}

/**
 * Checks if a file has a valid .pdf extension / mime type
 */
export function isPdfFile(file: File): boolean {
  return file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
}
