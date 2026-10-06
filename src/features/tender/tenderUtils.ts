import { Requirement, RequirementsPayload } from '@/types';

/**
 * Sorts requirements by their order field ascending
 */
export function sortRequirements(requirements: Requirement[]): Requirement[] {
  return [...requirements].sort((a, b) => a.order - b.order);
}

/**
 * Validates requirements JSON structure
 */
export function validateRequirementsJson(data: unknown): data is RequirementsPayload {
  if (!data || typeof data !== 'object') return false;
  const payload = data as Partial<RequirementsPayload>;

  if (!payload.tender || typeof payload.tender !== 'object') return false;
  const { tender, requirements } = payload;

  if (
    typeof tender.tender_id !== 'string' ||
    typeof tender.title !== 'string' ||
    typeof tender.procuring_entity !== 'string' ||
    typeof tender.bidder !== 'string' ||
    typeof tender.submission_deadline !== 'string'
  ) {
    return false;
  }

  if (!Array.isArray(requirements)) return false;

  for (const req of requirements) {
    if (
      typeof req.id !== 'string' ||
      typeof req.order !== 'number' ||
      typeof req.title_en !== 'string' ||
      typeof req.title_bn !== 'string' ||
      typeof req.mandatory !== 'boolean' ||
      typeof req.has_expiry !== 'boolean'
    ) {
      return false;
    }
  }

  return true;
}
