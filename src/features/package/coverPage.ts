import { PDFDocument, rgb, StandardFonts, PageSizes } from 'pdf-lib';
import { TenderInfo, Requirement, UploadedDocument } from '@/types';
import { formatDate } from '@/utils/formatters';

export interface CoverPageParams {
  pdfDoc: PDFDocument;
  tender: TenderInfo;
  matchedRequirements: { requirement: Requirement; document: UploadedDocument }[];
  generatedDate: string;
}

/**
 * Adds an English cover page as Page 1 of the PDF package.
 */
export async function addCoverPage(params: CoverPageParams): Promise<void> {
  const { pdfDoc, tender, matchedRequirements, generatedDate } = params;

  // Insert A4 cover page at beginning (index 0)
  const page = pdfDoc.insertPage(0, PageSizes.A4);
  const { width, height } = page.getSize();

  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const primaryColor = rgb(0.09, 0.25, 0.47); // Slate/Blue
  const darkColor = rgb(0.15, 0.15, 0.18);
  const lightGray = rgb(0.94, 0.95, 0.96);
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
    size: 20,
    font: fontBold,
    color: rgb(1, 1, 1),
  });

  page.drawText('Official Submission Package', {
    x: 55,
    y: currentY - 42,
    size: 9,
    font: fontRegular,
    color: rgb(0.85, 0.9, 0.98),
  });

  currentY -= 80;

  // Tender Info Table Box
  const boxHeight = 135;
  page.drawRectangle({
    x: 40,
    y: currentY - boxHeight,
    width: width - 80,
    height: boxHeight,
    color: lightGray,
    borderColor: borderGray,
    borderWidth: 1,
  });

  const labelX = 55;
  const valueX = 180;
  let infoY = currentY - 22;

  const renderInfoRow = (label: string, value: string, isBoldValue = false) => {
    page.drawText(label, {
      x: labelX,
      y: infoY,
      size: 9,
      font: fontBold,
      color: primaryColor,
    });
    page.drawText(value || '-', {
      x: valueX,
      y: infoY,
      size: 9,
      font: isBoldValue ? fontBold : fontRegular,
      color: darkColor,
    });
    infoY -= 18;
  };

  renderInfoRow('Tender ID:', tender.tender_id, true);
  renderInfoRow('Tender Title:', tender.title.length > 55 ? tender.title.substring(0, 52) + '...' : tender.title, true);
  renderInfoRow('Procuring Entity:', tender.procuring_entity);
  renderInfoRow('Bidder Name:', tender.bidder || '-');
  renderInfoRow('Submission Deadline:', formatDate(tender.submission_deadline));
  renderInfoRow('Package Created:', generatedDate);

  currentY -= boxHeight + 30;

  // Included Documents Table Section
  page.drawText('INCLUDED DOCUMENTS CHECKLIST', {
    x: 40,
    y: currentY,
    size: 11,
    font: fontBold,
    color: primaryColor,
  });

  currentY -= 15;

  // Table Header
  page.drawRectangle({
    x: 40,
    y: currentY - 20,
    width: width - 80,
    height: 20,
    color: primaryColor,
  });

  page.drawText('#', { x: 48, y: currentY - 14, size: 9, font: fontBold, color: rgb(1, 1, 1) });
  page.drawText('Document Title (Requirement)', { x: 75, y: currentY - 14, size: 9, font: fontBold, color: rgb(1, 1, 1) });
  page.drawText('Filename', { x: 330, y: currentY - 14, size: 9, font: fontBold, color: rgb(1, 1, 1) });
  page.drawText('Pages', { x: 505, y: currentY - 14, size: 9, font: fontBold, color: rgb(1, 1, 1) });

  currentY -= 20;

  // Render document checklist rows
  matchedRequirements.forEach((item, index) => {
    if (currentY < 80) return; // Prevent overflow off cover page bottom

    const rowBg = index % 2 === 0 ? rgb(1, 1, 1) : rgb(0.97, 0.98, 0.99);
    page.drawRectangle({
      x: 40,
      y: currentY - 20,
      width: width - 80,
      height: 20,
      color: rowBg,
      borderColor: borderGray,
      borderWidth: 0.5,
    });

    const titleStr = item.requirement.title_en.length > 40
      ? item.requirement.title_en.substring(0, 37) + '...'
      : item.requirement.title_en;

    const fileStr = item.document.fileName.length > 30
      ? item.document.fileName.substring(0, 27) + '...'
      : item.document.fileName;

    page.drawText(String(item.requirement.order), { x: 48, y: currentY - 14, size: 8.5, font: fontBold, color: darkColor });
    page.drawText(titleStr, { x: 75, y: currentY - 14, size: 8.5, font: fontRegular, color: darkColor });
    page.drawText(fileStr, { x: 330, y: currentY - 14, size: 8.5, font: fontRegular, color: primaryColor });
    page.drawText(String(item.document.pageCount), { x: 515, y: currentY - 14, size: 8.5, font: fontBold, color: darkColor });

    currentY -= 20;
  });
}
