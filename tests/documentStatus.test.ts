import { describe, it, expect } from 'vitest';
import { evaluateRequirementStatus, isBlockingStatus } from '../src/features/documents/documentUtils';
import { Requirement, UploadedDocument } from '../src/types';

describe('documentStatus engine', () => {
  const submissionDeadline = '2026-10-20';

  const mockFile = new File(['dummy content'], 'document.pdf', { type: 'application/pdf' });
  const mockDoc: UploadedDocument = {
    id: 'doc-101',
    file: mockFile,
    fileName: 'document.pdf',
    size: 1024,
    pageCount: 2,
  };

  const mandatoryExpiringReq: Requirement = {
    id: 'R01',
    order: 1,
    title_en: 'Trade License',
    title_bn: 'ট্রেড লাইসেন্স',
    mandatory: true,
    has_expiry: true,
  };

  const mandatoryNonExpiringReq: Requirement = {
    id: 'R02',
    order: 2,
    title_en: 'TIN Certificate',
    title_bn: 'টিআইএন সনদপত্র',
    mandatory: true,
    has_expiry: false,
  };

  const optionalReq: Requirement = {
    id: 'R07',
    order: 7,
    title_en: "Manufacturer's Authorization",
    title_bn: 'প্রস্তুতকারকের অনুমোদনপত্র',
    mandatory: false,
    has_expiry: true,
  };

  it('Rule 1: Mandatory requirement with no matched file -> MISSING', () => {
    const status = evaluateRequirementStatus({
      requirement: mandatoryExpiringReq,
      matchedDocument: undefined,
      submissionDeadline,
    });
    expect(status).toBe('MISSING');
    expect(isBlockingStatus(status)).toBe(true);
  });

  it('Rule 2: Optional requirement with no matched file -> NOT_PROVIDED', () => {
    const status = evaluateRequirementStatus({
      requirement: optionalReq,
      matchedDocument: undefined,
      submissionDeadline,
    });
    expect(status).toBe('NOT_PROVIDED');
    expect(isBlockingStatus(status)).toBe(false);
  });

  it('Rule 3: Mandatory requirement with matched file & no expiry requirement -> OK', () => {
    const status = evaluateRequirementStatus({
      requirement: mandatoryNonExpiringReq,
      matchedDocument: mockDoc,
      submissionDeadline,
    });
    expect(status).toBe('OK');
    expect(isBlockingStatus(status)).toBe(false);
  });

  it('Rule 4: Expiry required with matched file & no expiry date entered -> EXPIRY_NEEDED', () => {
    const status = evaluateRequirementStatus({
      requirement: mandatoryExpiringReq,
      matchedDocument: mockDoc,
      expiryDate: '',
      submissionDeadline,
    });
    expect(status).toBe('EXPIRY_NEEDED');
    expect(isBlockingStatus(status)).toBe(true);
  });

  it('Rule 5: Expiry required with expiry date before submission deadline (2026-10-19 < 2026-10-20) -> EXPIRED', () => {
    const status = evaluateRequirementStatus({
      requirement: mandatoryExpiringReq,
      matchedDocument: mockDoc,
      expiryDate: '2026-10-19',
      submissionDeadline,
    });
    expect(status).toBe('EXPIRED');
    expect(isBlockingStatus(status)).toBe(true);
  });

  it('Rule 6: Expiry required with expiry date equal to submission deadline (2026-10-20 == 2026-10-20) -> OK', () => {
    const status = evaluateRequirementStatus({
      requirement: mandatoryExpiringReq,
      matchedDocument: mockDoc,
      expiryDate: '2026-10-20',
      submissionDeadline,
    });
    expect(status).toBe('OK');
    expect(isBlockingStatus(status)).toBe(false);
  });

  it('Rule 7: Expiry required with expiry date after submission deadline (2026-10-21 > 2026-10-20) -> OK', () => {
    const status = evaluateRequirementStatus({
      requirement: mandatoryExpiringReq,
      matchedDocument: mockDoc,
      expiryDate: '2026-10-21',
      submissionDeadline,
    });
    expect(status).toBe('OK');
    expect(isBlockingStatus(status)).toBe(false);
  });
});
