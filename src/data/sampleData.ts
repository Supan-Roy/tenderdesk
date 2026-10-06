import { RequirementsPayload } from '@/types';

export const sampleRequirementsPayload: RequirementsPayload = {
  tender: {
    tender_id: 'IFT-2026-APP-0941',
    title: 'Supply and Installation of Enterprise Network Infrastructure',
    procuring_entity: 'Department of Information Technology & Telecommunications',
    bidder: 'Apex Technical Solutions Ltd.',
    submission_deadline: '2026-11-15',
  },
  requirements: [
    {
      id: 'REQ-001',
      order: 1,
      title_en: 'Trade License (Updated)',
      title_bn: 'হালনাগাদ ট্রেড লাইসেন্স',
      mandatory: true,
      has_expiry: true,
    },
    {
      id: 'REQ-002',
      order: 2,
      title_en: 'Tax Identification Number (TIN) Certificate',
      title_bn: 'কর শনাক্তকরণ নম্বর (টিআইএন) সনদপত্র',
      mandatory: true,
      has_expiry: false,
    },
    {
      id: 'REQ-003',
      order: 3,
      title_en: 'VAT Registration Certificate',
      title_bn: 'ভ্যাট নিবন্ধন সনদপত্র',
      mandatory: true,
      has_expiry: false,
    },
    {
      id: 'REQ-004',
      order: 4,
      title_en: 'Bank Solvency Certificate',
      title_bn: 'ব্যাংক সচ্ছলতা সনদপত্র',
      mandatory: true,
      has_expiry: true,
    },
    {
      id: 'REQ-005',
      order: 5,
      title_en: 'Manufacturer Authorization Letter (Optional)',
      title_bn: 'প্রস্তুতকারক প্রতিষ্ঠানের অনুমতিপত্র (ঐচ্ছিক)',
      mandatory: false,
      has_expiry: false,
    },
  ],
};
