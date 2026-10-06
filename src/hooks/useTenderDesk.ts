import { useReducer, useState } from 'react';
import { initialTenderState, tenderReducer } from '@/features/tender/tenderReducer';
import { UploadedDocument, RequirementsPayload } from '@/types';
import { sampleRequirementsPayload } from '@/data/sampleData';
import { parseAndValidateRequirementsJson } from '@/features/tender/tenderUtils';
import { validatePdfFile, getPdfPageCount } from '@/features/documents/pdfUtils';
import { validateUploadLimits } from '@/features/documents/documentUtils';

export function useTenderDesk() {
  const [tenderState, dispatchTender] = useReducer(tenderReducer, initialTenderState);
  const [documents, setDocuments] = useState<UploadedDocument[]>([]);
  const [matches, setMatches] = useState<Record<string, string>>({});
  const [expiryDates, setExpiryDates] = useState<Record<string, string>>({});
  
  const [isInspectingPdf, setIsInspectingPdf] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);

  const clearError = () => setErrorMessage(null);
  const clearInfo = () => setInfoMessage(null);

  /**
   * Loads default sample requirements JSON
   */
  const loadSampleData = () => {
    dispatchTender({
      type: 'LOAD_TENDER_SUCCESS',
      payload: {
        tender: sampleRequirementsPayload.tender,
        requirements: sampleRequirementsPayload.requirements,
      },
    });
    setInfoMessage('Loaded sample tender specification requirements.');
  };

  /**
   * Loads requirements from parsed RequirementsPayload
   */
  const loadRequirementsPayload = (payload: RequirementsPayload) => {
    dispatchTender({
      type: 'LOAD_TENDER_SUCCESS',
      payload: {
        tender: payload.tender,
        requirements: payload.requirements,
      },
    });
    setErrorMessage(null);
  };

  /**
   * Handles user uploading a requirements.json file
   */
  const handleJsonFileSelect = async (file: File) => {
    setErrorMessage(null);
    try {
      const text = await file.text();
      const result = parseAndValidateRequirementsJson(text);

      if (!result.success) {
        setErrorMessage(result.error);
        return;
      }

      loadRequirementsPayload(result.data);
      setInfoMessage(`Successfully loaded requirements for Tender "${result.data.tender.tender_id}".`);
    } catch (err) {
      console.error('Failed to read JSON file:', err);
      setErrorMessage('requirements.json could not be loaded. Please select a valid requirements file.');
    }
  };

  /**
   * Handles user selecting multiple PDF files
   */
  const handlePdfFilesSelect = async (selectedFiles: FileList | File[]) => {
    setErrorMessage(null);
    const filesArray = Array.from(selectedFiles);
    if (filesArray.length === 0) return;

    // 1. Validate Upload Limits (max 30 files, max 50 MB total)
    const limitCheck = validateUploadLimits(documents, filesArray);
    const accumulatedErrors: string[] = [...limitCheck.errors];

    if (limitCheck.allowedFiles.length === 0) {
      if (accumulatedErrors.length > 0) {
        setErrorMessage(accumulatedErrors.join(' '));
      }
      return;
    }

    setIsInspectingPdf(true);
    const newValidDocs: UploadedDocument[] = [];

    for (const file of limitCheck.allowedFiles) {
      try {
        // 2. Validate PDF type (MIME + %PDF- magic bytes)
        const pdfValidation = await validatePdfFile(file);
        if (!pdfValidation.isValid) {
          accumulatedErrors.push(pdfValidation.error || `"${file.name}" is not a valid PDF file.`);
          continue;
        }

        // 3. Inspect PDF page count via pdfjs-dist
        const pageCount = await getPdfPageCount(file);

        // 4. Create UploadedDocument entry
        const docId = `doc-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
        const docEntry: UploadedDocument = {
          id: docId,
          file,
          fileName: file.name,
          size: file.size,
          pageCount,
        };

        newValidDocs.push(docEntry);
      } catch (err: unknown) {
        const errorText = err instanceof Error ? err.message : `Could not open "${file.name}".`;
        accumulatedErrors.push(errorText);
      }
    }

    setIsInspectingPdf(false);

    if (newValidDocs.length > 0) {
      setDocuments((prev) => [...prev, ...newValidDocs]);
    }

    if (accumulatedErrors.length > 0) {
      setErrorMessage(accumulatedErrors.join(' '));
    }
  };

  /**
   * Removes an uploaded document by ID
   */
  const handleRemoveDocument = (id: string) => {
    setDocuments((prev) => prev.filter((doc) => doc.id !== id));

    // Cleanup matches if any match pointed to this document ID
    setMatches((prev) => {
      const updated = { ...prev };
      for (const [reqId, docId] of Object.entries(updated)) {
        if (docId === id) {
          delete updated[reqId];
        }
      }
      return updated;
    });
  };

  /**
   * Clears all uploaded documents
   */
  const handleClearAllDocuments = () => {
    setDocuments([]);
    setMatches({});
  };

  /**
   * Resets tender workspace state
   */
  const resetAll = () => {
    dispatchTender({ type: 'RESET_TENDER' });
    setDocuments([]);
    setMatches({});
    setExpiryDates({});
    setErrorMessage(null);
    setInfoMessage(null);
  };

  return {
    tender: tenderState.tender,
    requirements: tenderState.requirements,
    isLoading: tenderState.isLoading,
    error: tenderState.error,
    documents,
    matches,
    expiryDates,
    isInspectingPdf,
    errorMessage,
    infoMessage,
    clearError,
    clearInfo,
    loadSampleData,
    handleJsonFileSelect,
    handlePdfFilesSelect,
    handleRemoveDocument,
    handleClearAllDocuments,
    resetAll,
  };
}
