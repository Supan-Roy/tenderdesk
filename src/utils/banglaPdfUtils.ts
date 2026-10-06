/**
 * Sanitizes and formats text strings containing Bangla unicode characters for PDF rendering.
 * Provides fallback transliteration / ASCII conversion to prevent pdf-lib WinAnsi font crashes.
 */
export function sanitizeForPdfFont(text: string): string {
  if (!text) return '';

  const wordMap: Record<string, string> = {
    'ট্রেড': 'Trade',
    'লাইসেন্স': 'License',
    'কর': 'Tax',
    'সনদপত্র': 'Certificate',
    'ভ্যাট': 'VAT',
    'ব্যাংক': 'Bank',
    'সচ্ছলতা': 'Solvency',
    'হালনাগাদ': 'Updated',
    'অনুমতিপত্র': 'Authorization',
    'ঐচ্ছিক': 'Optional',
  };

  let result = text;
  for (const [bnWord, enWord] of Object.entries(wordMap)) {
    result = result.replaceAll(bnWord, enWord);
  }

  // Strip any remaining unmapped Bangla characters to prevent WinAnsi font crashes
  return result
    .replace(/[\u0980-\u09FF]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Returns bilingual title for PDF cover/index rendering: "English Title (Bangla Safe)"
 */
export function getBilingualPdfTitle(titleEn: string, titleBn?: string): string {
  if (!titleBn || !titleBn.trim()) return titleEn;
  const safeBn = sanitizeForPdfFont(titleBn);
  return safeBn ? `${titleEn} [${safeBn}]` : titleEn;
}
