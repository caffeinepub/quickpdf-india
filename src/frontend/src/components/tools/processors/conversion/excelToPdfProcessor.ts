import { updateProgress, loadPdfLib, validateFileSize } from '../pdf/pdfClient';

export interface ExcelToPdfOptions {
  onProgress?: (percentage: number) => void;
}

const MAX_FILE_SIZE_MB = 10;

let xlsxCache: any = null;
let xlsxLoadPromise: Promise<any> | null = null;

/**
 * Load xlsx library from CDN
 */
async function loadXlsxLib(): Promise<any> {
  if (xlsxCache) {
    return xlsxCache;
  }

  if (xlsxLoadPromise) {
    return xlsxLoadPromise;
  }

  xlsxLoadPromise = (async () => {
    try {
      const xlsxModule = await import(/* @vite-ignore */ 'https://cdn.sheetjs.com/xlsx-0.20.0/package/xlsx.mjs' as any);
      xlsxCache = xlsxModule;
      return xlsxCache!;
    } catch (error: any) {
      xlsxLoadPromise = null;
      throw new Error(
        `Failed to load Excel processing library: ${error?.message || 'Unknown error'}. Please check your internet connection.`
      );
    }
  })();

  return xlsxLoadPromise;
}

/**
 * Convert Excel to PDF (client-side)
 */
export async function excelToPdfProcessor(
  file: File,
  options: ExcelToPdfOptions
): Promise<Blob> {
  const { onProgress } = options;

  // Validate file size (10MB limit)
  validateFileSize(file, MAX_FILE_SIZE_MB);

  updateProgress(onProgress, 5);

  try {
    // Load libraries
    const [pdfLib, XLSX] = await Promise.all([loadPdfLib(), loadXlsxLib()]);
    updateProgress(onProgress, 20);

    // Read Excel file
    const arrayBuffer = await file.arrayBuffer();
    updateProgress(onProgress, 30);

    // Parse Excel workbook
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });
    
    if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
      throw new Error('Excel file has no sheets');
    }

    updateProgress(onProgress, 40);

    // Create PDF document
    const { PDFDocument, rgb, StandardFonts } = pdfLib;
    const pdfDoc = await PDFDocument.create();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    const fontSize = 10;
    const lineHeight = 14;
    const cellPadding = 4;
    const margin = 50;

    // Process each sheet
    for (let sheetIndex = 0; sheetIndex < workbook.SheetNames.length; sheetIndex++) {
      const sheetName = workbook.SheetNames[sheetIndex];
      const worksheet = workbook.Sheets[sheetName];
      
      // Convert sheet to array of arrays
      const data: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' });
      
      if (data.length === 0) {
        continue;
      }

      // Calculate column widths
      const colWidths: number[] = [];
      for (let colIdx = 0; colIdx < (data[0]?.length || 0); colIdx++) {
        let maxWidth = 50;
        for (let rowIdx = 0; rowIdx < Math.min(data.length, 100); rowIdx++) {
          const cellValue = String(data[rowIdx]?.[colIdx] || '');
          const width = font.widthOfTextAtSize(cellValue, fontSize) + cellPadding * 2;
          maxWidth = Math.max(maxWidth, Math.min(width, 150));
        }
        colWidths.push(maxWidth);
      }

      const totalWidth = colWidths.reduce((sum, w) => sum + w, 0);
      const pageWidth = Math.max(595, totalWidth + margin * 2); // A4 width or wider
      const pageHeight = 842; // A4 height

      let page = pdfDoc.addPage([pageWidth, pageHeight]);
      let yPosition = pageHeight - margin;

      // Draw sheet name as title
      page.drawText(sheetName, {
        x: margin,
        y: yPosition,
        size: 14,
        font: boldFont,
        color: rgb(0, 0, 0),
      });
      yPosition -= 30;

      // Draw table
      for (let rowIdx = 0; rowIdx < data.length; rowIdx++) {
        const row = data[rowIdx];
        
        // Check if we need a new page
        if (yPosition < margin + lineHeight) {
          page = pdfDoc.addPage([pageWidth, pageHeight]);
          yPosition = pageHeight - margin;
        }

        let xPosition = margin;

        // Draw cells
        for (let colIdx = 0; colIdx < colWidths.length; colIdx++) {
          const cellValue = String(row[colIdx] || '');
          const cellWidth = colWidths[colIdx];

          // Draw cell border
          page.drawRectangle({
            x: xPosition,
            y: yPosition - lineHeight,
            width: cellWidth,
            height: lineHeight,
            borderColor: rgb(0.8, 0.8, 0.8),
            borderWidth: 0.5,
          });

          // Draw cell text (truncate if too long)
          const maxTextWidth = cellWidth - cellPadding * 2;
          let displayText = cellValue;
          let textWidth = font.widthOfTextAtSize(displayText, fontSize);
          
          if (textWidth > maxTextWidth) {
            while (textWidth > maxTextWidth && displayText.length > 0) {
              displayText = displayText.slice(0, -1);
              textWidth = font.widthOfTextAtSize(displayText + '...', fontSize);
            }
            displayText += '...';
          }

          page.drawText(displayText, {
            x: xPosition + cellPadding,
            y: yPosition - lineHeight + cellPadding,
            size: fontSize,
            font: rowIdx === 0 ? boldFont : font,
            color: rgb(0, 0, 0),
          });

          xPosition += cellWidth;
        }

        yPosition -= lineHeight;
      }

      const sheetProgress = 40 + ((sheetIndex + 1) / workbook.SheetNames.length) * 50;
      updateProgress(onProgress, sheetProgress);
    }

    updateProgress(onProgress, 95);

    // Generate PDF blob
    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });

    updateProgress(onProgress, 100);

    return blob;
  } catch (error: any) {
    if (error.message?.includes('exceeds')) {
      throw error;
    }
    if (error.message?.includes('Failed to load')) {
      throw error;
    }
    throw new Error(
      `Excel to PDF conversion failed: ${error?.message || 'Unknown error'}. Please ensure your file is a valid Excel document.`
    );
  }
}
