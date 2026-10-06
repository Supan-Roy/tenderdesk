import { DocumentStatus } from '@/types';
import { StatusEvaluationParams } from './types';

/**
 * Determines the document status based on requirement rules and expiry dates.
 */
export function evaluateRequirementStatus(params: StatusEvaluationParams): DocumentStatus {
  const { requirement, matchedDocument, expiryDate, submissionDeadline } = params;

  // No matched document
  if (!matchedDocument) {
    return requirement.mandatory ? 'MISSING' : 'NOT_PROVIDED';
  }

  // File is matched
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
