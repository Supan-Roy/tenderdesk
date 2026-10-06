import { describe, it, expect } from 'vitest';
import { sortRequirements, parseAndValidateRequirementsJson } from '../src/features/tender/tenderUtils';
import { Requirement } from '../src/types';

describe('tenderUtils', () => {
  describe('sortRequirements', () => {
    it('should sort requirements in ascending order by order field', () => {
      const unsorted: Requirement[] = [
        { id: 'R03', order: 3, title_en: 'VAT', title_bn: 'ভ্যাট', mandatory: true, has_expiry: false },
        { id: 'R01', order: 1, title_en: 'Trade License', title_bn: 'ট্রেড লাইসেন্স', mandatory: true, has_expiry: true },
        { id: 'R02', order: 2, title_en: 'TIN', title_bn: 'টিআইএন', mandatory: true, has_expiry: false },
      ];

      const sorted = sortRequirements(unsorted);

      expect(sorted.map((r) => r.id)).toEqual(['R01', 'R02', 'R03']);
      expect(sorted.map((r) => r.order)).toEqual([1, 2, 3]);
    });

    it('should preserve original requirement IDs and properties after sorting', () => {
      const unsorted: Requirement[] = [
        { id: 'REQ-B', order: 2, title_en: 'Title B', title_bn: 'শিরোনাম বি', mandatory: false, has_expiry: true },
        { id: 'REQ-A', order: 1, title_en: 'Title A', title_bn: 'শিরোনাম এ', mandatory: true, has_expiry: false },
      ];

      const sorted = sortRequirements(unsorted);

      expect(sorted[0]).toEqual({
        id: 'REQ-A',
        order: 1,
        title_en: 'Title A',
        title_bn: 'শিরোনাম এ',
        mandatory: true,
        has_expiry: false,
      });
      expect(sorted[1]).toEqual({
        id: 'REQ-B',
        order: 2,
        title_en: 'Title B',
        title_bn: 'শিরোনাম বি',
        mandatory: false,
        has_expiry: true,
      });
    });
  });

  describe('parseAndValidateRequirementsJson', () => {
    it('should accept valid tender JSON payload and sort requirements', () => {
      const validJson = JSON.stringify({
        tender: {
          tender_id: 'T-2026-TEST',
          title: 'Test Procurement',
          procuring_entity: 'Test Directorate',
          bidder: 'Test Company Ltd.',
          submission_deadline: '2026-10-20',
        },
        requirements: [
          { id: 'R02', order: 2, title_en: 'TIN', title_bn: 'টিআইএন', mandatory: true, has_expiry: false },
          { id: 'R01', order: 1, title_en: 'Trade License', title_bn: 'ট্রেড লাইসেন্স', mandatory: true, has_expiry: true },
        ],
      });

      const result = parseAndValidateRequirementsJson(validJson);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.tender.tender_id).toBe('T-2026-TEST');
        expect(result.data.requirements[0].id).toBe('R01');
        expect(result.data.requirements[1].id).toBe('R02');
      }
    });

    it('should reject invalid JSON strings', () => {
      const invalidJson = '{ tender: broken json...';
      const result = parseAndValidateRequirementsJson(invalidJson);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toContain('could not be loaded');
      }
    });

    it('should reject payload missing tender object or required fields', () => {
      const missingTenderId = JSON.stringify({
        tender: {
          title: 'Test Procurement',
          procuring_entity: 'Test Directorate',
          bidder: 'Test Company',
          submission_deadline: '2026-10-20',
        },
        requirements: [],
      });

      const result = parseAndValidateRequirementsJson(missingTenderId);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toContain('tender_id');
      }
    });

    it('should reject payload with invalid requirement item fields', () => {
      const invalidReq = JSON.stringify({
        tender: {
          tender_id: 'T-001',
          title: 'Test',
          procuring_entity: 'Entity',
          bidder: 'Bidder',
          submission_deadline: '2026-10-20',
        },
        requirements: [
          { id: 'R01', order: 'invalid-number', title_en: 'Trade License', title_bn: 'ট্রেড লাইসেন্স' },
        ],
      });

      const result = parseAndValidateRequirementsJson(invalidReq);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toContain('order');
      }
    });

    it('should preserve English and Bangla titles for requirements', () => {
      const json = JSON.stringify({
        tender: {
          tender_id: 'T-BN-01',
          title: 'Bilingual Tender',
          procuring_entity: 'Entity',
          bidder: 'Bidder',
          submission_deadline: '2026-10-20',
        },
        requirements: [
          {
            id: 'R01',
            order: 1,
            title_en: 'Bank Solvency Certificate',
            title_bn: 'ব্যাংক সচ্ছলতা সনদপত্র',
            mandatory: true,
            has_expiry: true,
          },
        ],
      });

      const result = parseAndValidateRequirementsJson(json);

      expect(result.success).toBe(true);
      if (result.success) {
        const req = result.data.requirements[0];
        expect(req.title_en).toBe('Bank Solvency Certificate');
        expect(req.title_bn).toBe('ব্যাংক সচ্ছলতা সনদপত্র');
      }
    });
  });
});
