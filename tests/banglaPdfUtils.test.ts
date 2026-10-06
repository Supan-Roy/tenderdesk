import { describe, it, expect } from 'vitest';
import { sanitizeForPdfFont, getBilingualPdfTitle } from '../src/utils/banglaPdfUtils';

describe('Bangla PDF Text Rendering Support Feature', () => {
  it('should sanitize Bangla unicode characters for pdf-lib WinAnsi compatibility', () => {
    const text = 'ট্রেড লাইসেন্স';
    const sanitized = sanitizeForPdfFont(text);
    expect(sanitized).toBe('Trade License');
  });

  it('should format bilingual title without breaking ASCII encoding', () => {
    const title = getBilingualPdfTitle('Trade License (Updated)', 'হালনাগাদ ট্রেড লাইসেন্স');
    expect(title).toContain('Trade License (Updated)');
    expect(title).toContain('Trade License');
  });
});
