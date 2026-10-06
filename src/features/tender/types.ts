import { TenderInfo, Requirement } from '@/types';

export interface TenderState {
  tender: TenderInfo | null;
  requirements: Requirement[];
  isLoading: boolean;
  error: string | null;
}

export type TenderAction =
  | { type: 'LOAD_TENDER_SUCCESS'; payload: { tender: TenderInfo; requirements: Requirement[] } }
  | { type: 'LOAD_TENDER_ERROR'; payload: string }
  | { type: 'UPDATE_BIDDER'; payload: string }
  | { type: 'RESET_TENDER' };
