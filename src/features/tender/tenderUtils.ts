import { Requirement, RequirementsPayload } from '@/types';

/**
 * Sorts requirements by their order field ascending
 */
export function sortRequirements(requirements: Requirement[]): Requirement[] {
  return [...requirements].sort((a, b) => a.order - b.order);
}

export type ParseJsonResult =
  | { success: true; data: RequirementsPayload }
  | { success: false; error: string };

/**
 * Parses and strictly validates requirements.json content against the tender specification schema.
 */
export function parseAndValidateRequirementsJson(jsonText: string): ParseJsonResult {
  let parsed: unknown;
  try {
    parsed = JSON.parse(jsonText);
  } catch {
    return {
      success: false,
      error: 'requirements.json could not be loaded. Please select a valid JSON file.',
    };
  }

  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    return {
      success: false,
      error: 'Invalid requirements.json format: Root must be a JSON object.',
    };
  }

  const payload = parsed as Partial<RequirementsPayload>;

  if (!payload.tender || typeof payload.tender !== 'object') {
    return {
      success: false,
      error: 'Invalid requirements.json: Missing "tender" information object.',
    };
  }

  const { tender, requirements } = payload;

  if (typeof tender.tender_id !== 'string' || !tender.tender_id.trim()) {
    return { success: false, error: 'Invalid requirements.json: Missing or invalid "tender_id".' };
  }
  if (typeof tender.title !== 'string' || !tender.title.trim()) {
    return { success: false, error: 'Invalid requirements.json: Missing or invalid tender "title".' };
  }
  if (typeof tender.procuring_entity !== 'string' || !tender.procuring_entity.trim()) {
    return { success: false, error: 'Invalid requirements.json: Missing or invalid "procuring_entity".' };
  }
  if (typeof tender.bidder !== 'string') {
    return { success: false, error: 'Invalid requirements.json: Missing or invalid "bidder".' };
  }
  if (typeof tender.submission_deadline !== 'string' || !tender.submission_deadline.trim()) {
    return { success: false, error: 'Invalid requirements.json: Missing or invalid "submission_deadline".' };
  }

  if (!Array.isArray(requirements)) {
    return { success: false, error: 'Invalid requirements.json: "requirements" must be an array.' };
  }

  if (requirements.length === 0) {
    return { success: false, error: 'Invalid requirements.json: "requirements" list cannot be empty.' };
  }

  for (let i = 0; i < requirements.length; i++) {
    const req = requirements[i];
    if (!req || typeof req !== 'object') {
      return { success: false, error: `Invalid requirement item at index ${i}.` };
    }
    if (typeof req.id !== 'string' || !req.id.trim()) {
      return { success: false, error: `Invalid requirement #${i + 1}: Missing "id".` };
    }
    if (typeof req.order !== 'number' || isNaN(req.order)) {
      return { success: false, error: `Invalid requirement "${req.id}": "order" must be a number.` };
    }
    if (typeof req.title_en !== 'string') {
      return { success: false, error: `Invalid requirement "${req.id}": Missing "title_en".` };
    }
    if (typeof req.title_bn !== 'string') {
      return { success: false, error: `Invalid requirement "${req.id}": Missing "title_bn".` };
    }
    if (typeof req.mandatory !== 'boolean') {
      return { success: false, error: `Invalid requirement "${req.id}": "mandatory" must be a boolean.` };
    }
    if (typeof req.has_expiry !== 'boolean') {
      return { success: false, error: `Invalid requirement "${req.id}": "has_expiry" must be a boolean.` };
    }
  }

  return {
    success: true,
    data: {
      tender: {
        tender_id: tender.tender_id,
        title: tender.title,
        procuring_entity: tender.procuring_entity,
        bidder: tender.bidder,
        submission_deadline: tender.submission_deadline,
      },
      requirements: sortRequirements(requirements as Requirement[]),
    },
  };
}
