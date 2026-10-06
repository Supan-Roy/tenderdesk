import { PDFDocument, rgb, StandardFonts, PageSizes } from 'pdf-lib';
import { Requirement, UploadedDocument } from '@/types';

export interface IndexItem {
  order: number;
  title: string;
  startPage: number;
  pageCount: number;
}

export interface IndexPageParams {
  pdfDoc: PDFDocument;
  matchedRequirements: { requirement: Requirement; document: UploadedDocument }[];
}

/**
 * Calculates start page numbers for included documents.
 * Page 1 = Cover, Page 2 = Index, Page 3+ = Matched Documents.
 */
export function calculateIndexItems(
  matchedRequirements: { requirement: Requirement; document: UploadedDocument }[]
): IndexItem[] {
  const items: IndexItem[] = [];
  let currentStartPage = 3; // Cover (p.1) + Index (p.2)

  for (const item of matchedRequirements) {
    items.push({
      order: item.requirement.order,
      title: item.requirement.title_en,
      startPage: currentStartPage,
      pageCount: item.document.pageCount,
    });
    currentStartPage += item.document.pageCount;
  }

  return items;
}

/**
 * Adds an English Index / Table of Contents page as Page 2 of the PDF package.
 */
export async function addIndexPage(params: IndexPageParams): Promise<IndexItem[]> {
  const { pdfDoc, matchedRequirements } = params;

  // Calculate starting page numbers
  const indexItems = calculateIndexItems(matchedRequirements);

  // Insert A4 index page at index 1 (Page 2)
  const page = pdfDoc.insertPage(1, PageSizes.A4);
  const { width, height } = page.getSize();

  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const primaryColor = rgb(0.09, 0.25, 0.47); // Slate/Blue
  const darkColor = rgb(0.15, 0.15, 0.18);
  const grayColor = rgb(0.4, 0.45, 0.5);
  const lightGray = rgb(0.95, 0.96, 0.98);
  const borderGray = rgb(0.8, 0.83, 0.88);

  let currentY = height - 50;

  // Header Title Banner
  page.drawRectangle({
    x: 40,
    y: currentY - 50,
    width: width - 80,
    height: 60,
    color: primaryColor,
  });

  page.drawText('TENDER DOCUMENT PACKAGE', {
    x: 55,
    y: currentY - 28,
    size: 18,
    font: fontBold,
    color: rgb(1, 1, 1),
  });

  page.drawText('DOCUMENT INDEX & TABLE OF CONTENTS', {
    x: 55,
    y: currentY - 42,
    size: 10,
    font: fontBold,
    color: rgb(0.85, 0.9, 0.98),
  });

  page.drawText('Included Documents and Starting Pages', {
    x: 55,
    y: currentY - 54,
    size: 8,
    font: fontRegular,
    color: rgb(0.75, 0.82, 0.92),
  });

  currentY -= 85;

  // Table Header Box
  page.drawRectangle({
    x: 40,
    y: currentY - 22,
    width: width - 80,
    height: 22,
    color: lightGray,
    borderColor: borderGray,
    borderWidth: 1,
  });

  page.drawText('#', { x: 50, y: currentY - 15, size: 9, font: fontBold, color: primaryColor });
  page.drawText('Document Title (Requirement)', { x: 80, y: currentY - 15, size: 9, font: fontBold, color: primaryColor });
  page.drawText('Start Page', { x: width - 105, y: currentY - 15, size: 9, font: fontBold, color: primaryColor });

  currentY -= 40;

  // Render Index Rows with dot leaders
  const dotCharWidth = fontRegular.widthOfTextAtSize('.', 9);
  const titleX = 80;
  const pageNumX = width - 65;

  indexItems.forEach((item) => {
    if (currentY < 60) return; // Prevent page overflow

    const orderStr = `${item.order}.`;
    const titleStr = item.title.length > 55 ? item.title.substring(0, 52) + '...' : item.title;
    const pageStr = String(item.startPage);

    // Draw order & title
    page.drawText(orderStr, { x: 50, y: currentY, size: 9.5, font: fontBold, color: darkColor });
    page.drawText(titleStr, { x: titleX, y: currentY, size: 9.5, font: fontRegular, color: darkColor });

    // Calculate dot leader span
    const titleWidth = fontRegular.widthOfTextAtSize(titleStr, 9.5);
    const dotsStartX = titleX + titleWidth + 10;
    const dotsEndX = pageNumX - fontBold.widthOfTextAtSize(pageStr, 9.5) - 15;

    if (dotsEndX > dotsStartX) {
      const availableWidth = dotsEndX - dotsStartX;
      const numDots = Math.floor(availableWidth / (dotCharWidth * 2));
      const dotsStr = '. '.repeat(Math.max(0, numDots));

      page.drawText(dotsStr, {
        x: dotsStartX,
        y: currentY,
        size: 9,
        font: fontRegular,
        color: grayColor,
      });
    }

    // Draw right-aligned starting page number
    const pageNumWidth = fontBold.widthOfTextAtSize(pageStr, 10);
    page.drawText(pageStr, {
      x: pageNumX - pageNumWidth,
      y: currentY,
      size: 10,
      font: fontBold,
      color: primaryColor,
    });

    // Subtle line divider
    page.drawLine({
      start: { x: 40, y: currentY - 10 },
      end: { x: width - 40, y: currentY - 10 },
      thickness: 0.5,
      color: rgb(0.9, 0.92, 0.95),
    });

    currentY -= 32;
  });

  return indexItems;
}
