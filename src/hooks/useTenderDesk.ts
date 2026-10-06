import { useReducer, useState } from 'react';
import { initialTenderState, tenderReducer } from '@/features/tender/tenderReducer';
import { UploadedDocument, RequirementsPayload } from '@/types';
import { sampleRequirementsPayload } from '@/data/sampleData';

export function useTenderDesk() {
  const [tenderState, dispatchTender] = useReducer(tenderReducer, initialTenderState);
  const [documents, setDocuments] = useState<UploadedDocument[]>([]);
  const [matches, setMatches] = useState<Record<string, string>>({});
  const [expiryDates, setExpiryDates] = useState<Record<string, string>>({});

  const loadSampleData = () => {
    dispatchTender({
      type: 'LOAD_TENDER_SUCCESS',
      payload: {
        tender: sampleRequirementsPayload.tender,
        requirements: sampleRequirementsPayload.requirements,
      },
    });
  };

  const loadRequirementsJson = (payload: RequirementsPayload) => {
    dispatchTender({
      type: 'LOAD_TENDER_SUCCESS',
      payload: {
        tender: payload.tender,
        requirements: payload.requirements,
      },
    });
  };

  const resetAll = () => {
    dispatchTender({ type: 'RESET_TENDER' });
    setDocuments([]);
    setMatches({});
    setExpiryDates({});
  };

  return {
    tender: tenderState.tender,
    requirements: tenderState.requirements,
    isLoading: tenderState.isLoading,
    error: tenderState.error,
    documents,
    matches,
    expiryDates,
    loadSampleData,
    loadRequirementsJson,
    resetAll,
  };
}
