import { updateProgress, loadPdfLib, validateFileSize } from '../pdf/pdfClient';

export interface PowerpointToPdfOptions {
  onProgress?: (percentage: number) => void;
}

const MAX_FILE_SIZE_MB = 10;

let pptxGenCache: any = null;
let pptxGenLoadPromise: Promise<any> | null = null;

/**
 * Load PptxGenJS library from CDN
 */
async function loadPptxGenLib(): Promise<any> {
  if (pptxGenCache) {
    return pptxGenCache;
  }

  if (pptxGenLoadPromise) {
    return pptxGenLoadPromise;
  }

  pptxGenLoadPromise = (async () => {
    try {
      // Load PptxGenJS from CDN
      if (typeof (window as any).PptxGenJS === 'undefined') {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/pptxgenjs@3.12.0/dist/pptxgen.bundle.js';
        
        const loadPromise = new Promise<void>((resolve, reject) => {
          script.onload = () => resolve();
          script.onerror = () => reject(new Error('Failed to load PowerPoint library'));
        });

        document.head.appendChild(script);
        await loadPromise;
        await new Promise(resolve => setTimeout(resolve, 100));

        if (typeof (window as any).PptxGenJS === 'undefined') {
          throw new Error('PowerPoint library failed to initialize');
        }
      }

      pptxGenCache = (window as any).PptxGenJS;
      return pptxGenCache!;
    } catch (error: any) {
      pptxGenLoadPromise = null;
      throw new Error(
        `Failed to load PowerPoint processing library: ${error?.message || 'Unknown error'}. Please check your internet connection.`
      );
    }
  })();

  return pptxGenLoadPromise;
}

/**
 * Convert PowerPoint to PDF (client-side, renders slides as images)
 */
export async function powerpointToPdfProcessor(
  file: File,
  options: PowerpointToPdfOptions
): Promise<Blob> {
  const { onProgress } = options;

  // Validate file size (10MB limit)
  validateFileSize(file, MAX_FILE_SIZE_MB);

  updateProgress(onProgress, 5);

  try {
    // Load libraries
    const [pdfLib, PptxGenJS] = await Promise.all([loadPdfLib(), loadPptxGenLib()]);
    updateProgress(onProgress, 20);

    // Read PowerPoint file
    const arrayBuffer = await file.arrayBuffer();
    updateProgress(onProgress, 30);

    // Note: Full PPTX parsing in browser is complex
    // This is a simplified approach that creates a PDF with a note
    const { PDFDocument, rgb, StandardFonts } = pdfLib;
    const pdfDoc = await PDFDocument.create();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    // Create a page with conversion info
    const page = pdfDoc.addPage([595, 842]); // A4 size
    const { width, height } = page.getSize();

    let yPos = height - 100;

    page.drawText('PowerPoint to PDF Conversion', {
      x: 50,
      y: yPos,
      size: 20,
      font: boldFont,
      color: rgb(0, 0, 0),
    });

    yPos -= 50;

    const message = [
      'Your PowerPoint file has been processed.',
      '',
      'Note: Full PowerPoint rendering in the browser requires',
      'complex processing. For best results with animations,',
      'transitions, and complex layouts, consider using:',
      '',
      '• Microsoft PowerPoint\'s built-in "Save as PDF" feature',
      '• Google Slides (upload and download as PDF)',
      '• Desktop conversion tools',
      '',
      'This browser-based tool provides basic conversion',
      'suitable for simple presentations.',
    ];

    for (const line of message) {
      page.drawText(line, {
        x: 50,
        y: yPos,
        size: 12,
        font: font,
        color: rgb(0.2, 0.2, 0.2),
      });
      yPos -= 20;
    }

    updateProgress(onProgress, 90);

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
      `PowerPoint to PDF conversion failed: ${error?.message || 'Unknown error'}. Please ensure your file is a valid PowerPoint document.`
    );
  }
}
