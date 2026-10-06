import { UploadedDocument, DocumentStatus, Requirement } from '@/types';

export interface DocumentState {
  documents: UploadedDocument[];
  expiryDates: Record<string, string>; // documentId or requirementId -> YYYY-MM-DD
  matches: Record<string, string>; // requirementId -> documentId
}

export interface StatusEvaluationParams {
  requirement: Requirement;
  matchedDocument?: UploadedDocument;
  expiryDate?: string;
  submissionDeadline?: string;
}

export type DocumentValidationMap = Record<string, DocumentStatus>;
