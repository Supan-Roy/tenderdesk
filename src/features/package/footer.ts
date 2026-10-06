import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

export interface FooterOptions {
  tenderId: string;
}

/**
 * Draws standard page footer "<tender_id> | Page X of Y" on all pages of the document.
 * Computes exact page bounds dynamically for A4, Letter, or any page size.
 */
export async function addPackageFooters(pdfDoc: PDFDocument, options: FooterOptions): Promise<void> {
  const totalPages = pdfDoc.getPageCount();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontSize = 8.5;
  const textColor = rgb(0.35, 0.4, 0.45); // Slate gray
  const lineColor = rgb(0.85, 0.88, 0.92); // Subtle separator line

  for (let i = 0; i < totalPages; i++) {
    const page = pdfDoc.getPage(i);
    const { width } = page.getSize();
    const pageNum = i + 1;

    const footerText = `${options.tenderId}  |  Page ${pageNum} of ${totalPages}`;
    const textWidth = font.widthOfTextAtSize(footerText, fontSize);

    const marginX = 40;
    const footerY = 22;

    // Draw subtle line above footer
    page.drawLine({
      start: { x: marginX, y: footerY + 12 },
      end: { x: width - marginX, y: footerY + 12 },
      thickness: 0.5,
      color: lineColor,
    });

    // Right-aligned footer text
    page.drawText(footerText, {
      x: width - marginX - textWidth,
      y: footerY,
      size: fontSize,
      font,
      color: textColor,
    });
  }
}
