import { TenderState, TenderAction } from './types';
import { sortRequirements } from './tenderUtils';

export const initialTenderState: TenderState = {
  tender: null,
  requirements: [],
  isLoading: false,
  error: null,
};

export function tenderReducer(state: TenderState, action: TenderAction): TenderState {
  switch (action.type) {
    case 'LOAD_TENDER_SUCCESS':
      return {
        ...state,
        tender: action.payload.tender,
        requirements: sortRequirements(action.payload.requirements),
        isLoading: false,
        error: null,
      };

    case 'LOAD_TENDER_ERROR':
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };

    case 'UPDATE_BIDDER':
      if (!state.tender) return state;
      return {
        ...state,
        tender: {
          ...state.tender,
          bidder: action.payload,
        },
      };

    case 'RESET_TENDER':
      return initialTenderState;

    default:
      return state;
  }
}
