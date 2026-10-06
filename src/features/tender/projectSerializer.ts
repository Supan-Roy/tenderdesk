import { TenderInfo, Requirement, UploadedDocument } from '@/types';

export interface TenderDeskProjectState {
  version: string;
  savedAt: string;
  tender: TenderInfo | null;
  requirements: Requirement[];
  documentMetadata: Omit<UploadedDocument, 'file'>[];
  matches: Record<string, string>;
  expiryDates: Record<string, string>;
}

const STORAGE_KEY = 'tenderdesk_project_save';

/**
 * Serializes current TenderDesk session state to JSON string
 */
export function exportProjectState(params: {
  tender: TenderInfo | null;
  requirements: Requirement[];
  documents: UploadedDocument[];
  matches: Record<string, string>;
  expiryDates: Record<string, string>;
}): string {
  const project: TenderDeskProjectState = {
    version: '1.0.0',
    savedAt: new Date().toISOString(),
    tender: params.tender,
    requirements: params.requirements,
    documentMetadata: params.documents.map(({ file, ...meta }) => meta),
    matches: params.matches,
    expiryDates: params.expiryDates,
  };

  return JSON.stringify(project, null, 2);
}

/**
 * Saves project state to browser localStorage
 */
export function saveToLocalStorage(params: {
  tender: TenderInfo | null;
  requirements: Requirement[];
  documents: UploadedDocument[];
  matches: Record<string, string>;
  expiryDates: Record<string, string>;
}): void {
  try {
    const jsonStr = exportProjectState(params);
    localStorage.setItem(STORAGE_KEY, jsonStr);
  } catch (err) {
    console.error('Failed to save to localStorage:', err);
  }
}

/**
 * Loads project state from browser localStorage
 */
export function loadFromLocalStorage(): TenderDeskProjectState | null {
  try {
    const jsonStr = localStorage.getItem(STORAGE_KEY);
    if (!jsonStr) return null;
    return JSON.parse(jsonStr) as TenderDeskProjectState;
  } catch (err) {
    console.error('Failed to load from localStorage:', err);
    return null;
  }
}

/**
 * Parses and validates an imported project file string
 */
export function parseProjectState(jsonString: string): { success: true; data: TenderDeskProjectState } | { success: false; error: string } {
  try {
    const parsed = JSON.parse(jsonString);
    if (!parsed || typeof parsed !== 'object') {
      return { success: false, error: 'Invalid project file format.' };
    }
    if (!parsed.requirements || !Array.isArray(parsed.requirements)) {
      return { success: false, error: 'Missing requirements array in project file.' };
    }
    return { success: true, data: parsed as TenderDeskProjectState };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Invalid JSON file.';
    return { success: false, error: msg };
  }
}
