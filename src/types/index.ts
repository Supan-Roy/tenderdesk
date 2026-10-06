/**
 * Core Domain Types for TenderDesk
 */

export type Language = 'en' | 'bn';

export interface TenderInfo {
  tender_id: string;
  title: string;
  procuring_entity: string;
  bidder: string;
  submission_deadline: string; // YYYY-MM-DD
}

export interface Requirement {
  id: string;
  order: number;
  title_en: string;
  title_bn: string;
  mandatory: boolean;
  has_expiry: boolean;
}

export interface RequirementsPayload {
  tender: TenderInfo;
  requirements: Requirement[];
}

export type DocumentStatus = 'MISSING' | 'EXPIRY_NEEDED' | 'EXPIRED' | 'NOT_PROVIDED' | 'OK';

export interface UploadedDocument {
  id: string;
  file: File;
  fileName: string;
  size: number;
  pageCount: number;
  hash?: string;
  isDuplicate?: boolean;
  matchedRequirementId?: string | null;
  expiryDate?: string | null;
}

export interface DocumentMatch {
  requirementId: string;
  documentId: string;
}

export interface RequirementValidationResult {
  requirementId: string;
  status: DocumentStatus;
  messageKey: string;
}

export interface PackageConfiguration {
  tenderId: string;
  includeCoverPage: boolean;
  includeIndexPage: boolean;
  footerFormat: string; // e.g. "{tender_id} | Page {X} of {Y}"
  language: Language;
}
