import { useReducer, useState } from 'react';
import { initialTenderState, tenderReducer } from '@/features/tender/tenderReducer';
import { UploadedDocument, RequirementsPayload } from '@/types';
import { sampleRequirementsPayload } from '@/data/sampleData';
import { parseAndValidateRequirementsJson } from '@/features/tender/tenderUtils';
import { validatePdfFile, getPdfPageCount } from '@/features/documents/pdfUtils';
import { validateUploadLimits, evaluateRequirementStatus, isBlockingStatus } from '@/features/documents/documentUtils';
import { calculateFileHash, detectDuplicates } from '@/features/documents/duplicateDetector';
import { generatePdfPackage, downloadPdfPackage } from '@/features/package/packageGenerator';
import { autoMatchDocuments } from '@/features/matching/autoMatcher';

export function useTenderDesk() {
  const [tenderState, dispatchTender] = useReducer(tenderReducer, initialTenderState);
  const [documents, setDocuments] = useState<UploadedDocument[]>([]);
  const [matches, setMatches] = useState<Record<string, string>>({});
  const [expiryDates, setExpiryDates] = useState<Record<string, string>>({});
  
  const [isInspectingPdf, setIsInspectingPdf] = useState<boolean>(false);
  const [isGeneratingPackage, setIsGeneratingPackage] = useState<boolean>(false);
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
   * Handles user selecting multiple PDF files.
   * Computes SHA-256 hash and page count locally and detects exact duplicate content.
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

        // 3. Inspect PDF page count via pdfjs-dist & calculate SHA-256 hash via Web Crypto API
        const pageCount = await getPdfPageCount(file);
        const hash = await calculateFileHash(file);

        // 4. Create UploadedDocument entry
        const docId = `doc-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
        const docEntry: UploadedDocument = {
          id: docId,
          file,
          fileName: file.name,
          size: file.size,
          pageCount,
          hash,
        };

        newValidDocs.push(docEntry);
      } catch (err: unknown) {
        const errorText = err instanceof Error ? err.message : `Could not open "${file.name}".`;
        accumulatedErrors.push(errorText);
      }
    }

    setIsInspectingPdf(false);

    if (newValidDocs.length > 0) {
      setDocuments((prev) => detectDuplicates([...prev, ...newValidDocs]));
    }

    if (accumulatedErrors.length > 0) {
      setErrorMessage(accumulatedErrors.join(' '));
    }
  };

  /**
   * Matches a document to a requirement (1-to-1 relationship)
   */
  const handleMatchDocument = (requirementId: string, documentId: string) => {
    setMatches((prev) => {
      const updated = { ...prev };

      // Ensure no other requirement is matched to this same documentId
      for (const [reqId, docId] of Object.entries(updated)) {
        if (docId === documentId) {
          delete updated[reqId];
        }
      }

      updated[requirementId] = documentId;
      return updated;
    });

    // Reset expiry date for requirement when match changes
    setExpiryDates((prev) => {
      const updated = { ...prev };
      delete updated[requirementId];
      return updated;
    });
  };

  /**
   * Removes match for a requirement
   */
  const handleUnmatchDocument = (requirementId: string) => {
    setMatches((prev) => {
      const updated = { ...prev };
      delete updated[requirementId];
      return updated;
    });

    setExpiryDates((prev) => {
      const updated = { ...prev };
      delete updated[requirementId];
      return updated;
    });
  };

  /**
   * Sets expiry date YYYY-MM-DD for a requirement
   */
  const handleSetExpiryDate = (requirementId: string, dateString: string) => {
    setExpiryDates((prev) => ({
      ...prev,
      [requirementId]: dateString,
    }));
  };

  /**
   * Removes an uploaded document by ID & cleans up associated matches/expiry dates.
   * Re-evaluates duplicate detection on remaining files.
   */
  const handleRemoveDocument = (id: string) => {
    setDocuments((prev) => detectDuplicates(prev.filter((doc) => doc.id !== id)));

    let affectedReqId: string | null = null;
    setMatches((prev) => {
      const updated = { ...prev };
      for (const [reqId, docId] of Object.entries(updated)) {
        if (docId === id) {
          affectedReqId = reqId;
          delete updated[reqId];
        }
      }
      return updated;
    });

    if (affectedReqId) {
      setExpiryDates((prev) => {
        const updated = { ...prev };
        delete updated[affectedReqId!];
        return updated;
      });
    }
  };

  /**
   * Auto-matches unassigned documents to requirements based on filename keyword similarity
   */
  const handleAutoMatch = () => {
    if (tenderState.requirements.length === 0 || documents.length === 0) return;
    const newMatches = autoMatchDocuments(tenderState.requirements, documents, matches);
    const addedCount = Object.keys(newMatches).length - Object.keys(matches).length;
    setMatches(newMatches);
    if (addedCount > 0) {
      setInfoMessage(`Auto-matched ${addedCount} document(s) based on filenames.`);
    } else {
      setInfoMessage('Auto-match check completed. No new filename matches found.');
    }
  };
  const handleClearAllDocuments = () => {
    setDocuments([]);
    setMatches({});
    setExpiryDates({});
  };

  /**
   * Generates and downloads the final compiled PDF package
   */
  const handleGeneratePackage = async () => {
    if (!tenderState.tender) return;

    setIsGeneratingPackage(true);
    setErrorMessage(null);

    try {
      const pdfBytes = await generatePdfPackage({
        tender: tenderState.tender,
        requirements: tenderState.requirements,
        documents,
        matches,
      });

      downloadPdfPackage(pdfBytes, tenderState.tender.tender_id);
      setInfoMessage(`Successfully generated "${tenderState.tender.tender_id}_Package.pdf".`);
    } catch (err: unknown) {
      console.error('Package generation error:', err);
      const msg = err instanceof Error ? err.message : 'Failed to generate PDF package.';
      setErrorMessage(msg);
    } finally {
      setIsGeneratingPackage(false);
    }
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

  // Compute total blocking issue count
  let blockingIssueCount = 0;
  if (tenderState.requirements.length > 0) {
    for (const req of tenderState.requirements) {
      const matchedDocId = matches[req.id];
      const matchedDoc = documents.find((d) => d.id === matchedDocId);
      const expiryDate = expiryDates[req.id] || '';

      const status = evaluateRequirementStatus({
        requirement: req,
        matchedDocument: matchedDoc,
        expiryDate,
        submissionDeadline: tenderState.tender?.submission_deadline,
      });

      if (isBlockingStatus(status)) {
        blockingIssueCount++;
      }
    }
  }

  const isWorkspaceValid = tenderState.requirements.length > 0 && blockingIssueCount === 0;

  return {
    tender: tenderState.tender,
    requirements: tenderState.requirements,
    isLoading: tenderState.isLoading,
    error: tenderState.error,
    documents,
    matches,
    expiryDates,
    isInspectingPdf,
    isGeneratingPackage,
    errorMessage,
    infoMessage,
    blockingIssueCount,
    isWorkspaceValid,
    clearError,
    clearInfo,
    loadSampleData,
    handleJsonFileSelect,
    handlePdfFilesSelect,
    handleMatchDocument,
    handleUnmatchDocument,
    handleAutoMatch,
    handleSetExpiryDate,
    handleRemoveDocument,
    handleClearAllDocuments,
    handleGeneratePackage,
    resetAll,
  };
}
