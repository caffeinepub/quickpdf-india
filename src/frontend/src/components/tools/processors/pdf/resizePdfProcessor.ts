import { updateProgress, loadPdfLib, validateFileSize, readFileAsArrayBuffer } from './pdfClient';
import { getPageDimensions } from './pageSizes';

export type PageSize = 'A4' | 'Letter' | 'Legal' | 'A3' | 'A5';

export interface ResizePdfOptions {
  targetSize?: PageSize;
  onProgress?: (percentage: number) => void;
}

export async function resizePdfProcessor(
  file: File,
  options: ResizePdfOptions = {}
): Promise<Blob> {
  const { targetSize = 'A4', onProgress } = options;

  try {
    updateProgress(onProgress, 0);

    // Validate file size
    validateFileSize(file, 20);

    // Load pdf-lib
    updateProgress(onProgress, 10);
    const { PDFDocument } = await loadPdfLib();

    // Read the input PDF
    updateProgress(onProgress, 20);
    const arrayBuffer = await readFileAsArrayBuffer(file);
    const pdfDoc = await PDFDocument.load(arrayBuffer);

    // Get target dimensions
    const targetDims = getPageDimensions(targetSize);
    const pages = pdfDoc.getPages();
    const totalPages = pages.length;

    updateProgress(onProgress, 30);

    // Create a new PDF document
    const newPdfDoc = await PDFDocument.create();

    // Process each page
    for (let i = 0; i < totalPages; i++) {
      const progress = 30 + ((i / totalPages) * 60);
      updateProgress(onProgress, progress);

      const originalPage = pages[i];
      const { width: origWidth, height: origHeight } = originalPage.getSize();

      // Create new page with target size
      const newPage = newPdfDoc.addPage([targetDims.width, targetDims.height]);

      // Calculate scale to fit content proportionally
      const scaleX = targetDims.width / origWidth;
      const scaleY = targetDims.height / origHeight;
      const scale = Math.min(scaleX, scaleY);

      // Calculate centered position
      const scaledWidth = origWidth * scale;
      const scaledHeight = origHeight * scale;
      const x = (targetDims.width - scaledWidth) / 2;
      const y = (targetDims.height - scaledHeight) / 2;

      // Embed the original page
      const [embeddedPage] = await newPdfDoc.embedPdf(pdfDoc, [i]);

      // Draw the embedded page scaled and centered
      newPage.drawPage(embeddedPage, {
        x,
        y,
        width: scaledWidth,
        height: scaledHeight,
      });
    }

    updateProgress(onProgress, 95);

    // Save the new PDF
    const pdfBytes = await newPdfDoc.save();
    updateProgress(onProgress, 100);

    return new Blob([pdfBytes], { type: 'application/pdf' });
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to resize PDF. Please try again with a different file.');
  }
}
