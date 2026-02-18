import { loadPdfLib, updateProgress, validateFileSize, readFileAsArrayBuffer } from './pdfClient';

export type WatermarkPosition = 'center' | 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight';
export type FontStyle = 'Helvetica' | 'Times' | 'Courier';

export interface AddWatermarkOptions {
  text: string;
  opacity?: number;
  fontSize?: number;
  rotation?: number;
  position?: WatermarkPosition;
  fontStyle?: FontStyle;
  onProgress?: (percentage: number) => void;
}

const MAX_FILE_SIZE_MB = 10;

export async function addWatermarkProcessor(
  file: File,
  options: AddWatermarkOptions
): Promise<Blob> {
  const {
    text,
    opacity = 0.3,
    fontSize = 48,
    rotation = -45,
    position = 'center',
    fontStyle = 'Helvetica',
    onProgress,
  } = options;

  if (!text || text.trim().length === 0) {
    throw new Error('Watermark text is required');
  }

  // Validate file size (10MB limit)
  validateFileSize(file, MAX_FILE_SIZE_MB);

  updateProgress(onProgress, 5);

  try {
    // Load pdf-lib
    const { PDFDocument, rgb, degrees, StandardFonts } = await loadPdfLib();
    updateProgress(onProgress, 15);

    // Read file
    const arrayBuffer = await readFileAsArrayBuffer(file, (readProgress) => {
      updateProgress(onProgress, 15 + readProgress * 0.2);
    });
    updateProgress(onProgress, 35);

    // Load PDF
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    const pages = pdfDoc.getPages();
    const totalPages = pages.length;

    if (totalPages === 0) {
      throw new Error('PDF has no pages');
    }

    updateProgress(onProgress, 40);

    // Embed font based on selection
    let fontKey;
    switch (fontStyle) {
      case 'Times':
        fontKey = StandardFonts.TimesRoman;
        break;
      case 'Courier':
        fontKey = StandardFonts.Courier;
        break;
      case 'Helvetica':
      default:
        fontKey = StandardFonts.Helvetica;
        break;
    }
    const font = await pdfDoc.embedFont(fontKey);
    updateProgress(onProgress, 45);

    // Add watermark to each page
    for (let i = 0; i < totalPages; i++) {
      const page = pages[i];
      const { width, height } = page.getSize();

      // Calculate position based on selection
      const textWidth = font.widthOfTextAtSize(text, fontSize);
      const textHeight = fontSize;
      const margin = 50;

      let x: number;
      let y: number;

      switch (position) {
        case 'topLeft':
          x = margin;
          y = height - margin;
          break;
        case 'topRight':
          x = width - margin - textWidth;
          y = height - margin;
          break;
        case 'bottomLeft':
          x = margin;
          y = margin + textHeight;
          break;
        case 'bottomRight':
          x = width - margin - textWidth;
          y = margin + textHeight;
          break;
        case 'center':
        default:
          x = width / 2 - textWidth / 2;
          y = height / 2;
          break;
      }

      // Draw watermark
      page.drawText(text, {
        x: x,
        y: y,
        size: fontSize,
        font: font,
        color: rgb(0.5, 0.5, 0.5),
        opacity: opacity,
        rotate: degrees(rotation),
      });

      // Update progress
      const pageProgress = 45 + ((i + 1) / totalPages) * 45;
      updateProgress(onProgress, pageProgress);
    }

    updateProgress(onProgress, 90);

    // Save PDF
    const pdfBytes = await pdfDoc.save();
    updateProgress(onProgress, 95);

    // Create blob
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    updateProgress(onProgress, 100);

    return blob;
  } catch (error: any) {
    if (error.message?.includes('Watermark text is required')) {
      throw error;
    }
    if (error.message?.includes('exceeds')) {
      throw error;
    }
    if (error.message?.includes('load PDF processing library')) {
      throw error;
    }
    throw new Error(
      `Failed to add watermark: ${error.message || 'The PDF may be corrupted or use unsupported features.'}`
    );
  }
}
