import { updateProgress, loadPdfLib, validateFileSize, readFileAsArrayBuffer } from './pdfClient';

export type PageSize = 'A4' | 'Letter';
export type FitMode = 'fit' | 'fill' | 'original';

export interface ImageToPdfOptions {
  pageSize?: PageSize;
  fitMode?: FitMode;
  margin?: number;
  onProgress?: (percentage: number) => void;
}

// Page dimensions in points (1 point = 1/72 inch)
const PAGE_SIZES = {
  A4: { width: 595.28, height: 841.89 },
  Letter: { width: 612, height: 792 },
};

export async function imageToPdfProcessor(
  files: File[],
  options: ImageToPdfOptions = {}
): Promise<Blob> {
  const { pageSize = 'A4', fitMode = 'fit', margin = 36, onProgress } = options;

  if (files.length === 0) {
    throw new Error('No images provided');
  }

  try {
    updateProgress(onProgress, 0);

    // Validate all files
    files.forEach(file => validateFileSize(file, 20));

    // Load pdf-lib
    updateProgress(onProgress, 5);
    const { PDFDocument } = await loadPdfLib();

    // Create a new PDF document
    const pdfDoc = await PDFDocument.create();
    updateProgress(onProgress, 10);

    const pageDimensions = PAGE_SIZES[pageSize];

    // Process each image
    for (let i = 0; i < files.length; i++) {
      const progressBase = 10 + ((i / files.length) * 80);
      updateProgress(onProgress, progressBase);

      const file = files[i];
      const arrayBuffer = await readFileAsArrayBuffer(file);
      const fileType = file.type.toLowerCase();

      let image;
      if (fileType.includes('jpeg') || fileType.includes('jpg')) {
        image = await pdfDoc.embedJpg(arrayBuffer);
      } else if (fileType.includes('png')) {
        image = await pdfDoc.embedPng(arrayBuffer);
      } else {
        throw new Error(`Unsupported image type: ${file.type}. Please use JPG or PNG images.`);
      }

      // Create a page with the selected size
      const page = pdfDoc.addPage([pageDimensions.width, pageDimensions.height]);
      
      const availableWidth = pageDimensions.width - (margin * 2);
      const availableHeight = pageDimensions.height - (margin * 2);

      let drawWidth: number;
      let drawHeight: number;
      let drawX: number;
      let drawY: number;

      if (fitMode === 'original') {
        // Use original size, but don't exceed page bounds
        drawWidth = Math.min(image.width, availableWidth);
        drawHeight = Math.min(image.height, availableHeight);
        
        // Maintain aspect ratio if scaled down
        if (drawWidth < image.width || drawHeight < image.height) {
          const scale = Math.min(drawWidth / image.width, drawHeight / image.height);
          drawWidth = image.width * scale;
          drawHeight = image.height * scale;
        }
      } else if (fitMode === 'fill') {
        // Fill the entire available space (may crop)
        const scaleX = availableWidth / image.width;
        const scaleY = availableHeight / image.height;
        const scale = Math.max(scaleX, scaleY);
        
        drawWidth = image.width * scale;
        drawHeight = image.height * scale;
      } else {
        // Fit mode: scale to fit within available space, preserve aspect ratio
        const scaleX = availableWidth / image.width;
        const scaleY = availableHeight / image.height;
        const scale = Math.min(scaleX, scaleY);
        
        drawWidth = image.width * scale;
        drawHeight = image.height * scale;
      }

      // Center the image on the page
      drawX = margin + (availableWidth - drawWidth) / 2;
      drawY = margin + (availableHeight - drawHeight) / 2;

      // Draw the image
      page.drawImage(image, {
        x: drawX,
        y: drawY,
        width: drawWidth,
        height: drawHeight,
      });

      updateProgress(onProgress, progressBase + (80 / files.length));
    }

    updateProgress(onProgress, 95);

    // Save the PDF
    const pdfBytes = await pdfDoc.save();
    updateProgress(onProgress, 100);

    return new Blob([pdfBytes], { type: 'application/pdf' });
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to convert images to PDF. Please try again with different files.');
  }
}
