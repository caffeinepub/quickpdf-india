import { updateProgress, loadPdfLib, validateFileSize, readFileAsArrayBuffer } from '../pdf/pdfClient';

export interface PdfToPowerpointOptions {
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
 * Render a PDF page to canvas and get image data
 */
async function renderPageToImage(page: any, scale: number = 2.0): Promise<string> {
  const viewport = page.getViewport({ scale });
  
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  
  if (!context) {
    throw new Error('Failed to get canvas context');
  }
  
  canvas.width = viewport.width;
  canvas.height = viewport.height;
  
  const renderContext = {
    canvasContext: context,
    viewport: viewport,
  };
  
  await page.render(renderContext).promise;
  
  // Convert canvas to data URL
  return canvas.toDataURL('image/png');
}

/**
 * Convert PDF to PowerPoint (client-side, pages as images)
 */
export async function pdfToPowerpointProcessor(
  file: File,
  options: PdfToPowerpointOptions
): Promise<Blob> {
  const { onProgress } = options;

  // Validate file size (10MB limit)
  validateFileSize(file, MAX_FILE_SIZE_MB);

  updateProgress(onProgress, 5);

  try {
    // Load libraries
    const [pdfLib, PptxGenJS] = await Promise.all([loadPdfLib(), loadPptxGenLib()]);
    updateProgress(onProgress, 15);

    // Read PDF file
    const arrayBuffer = await readFileAsArrayBuffer(file, (readProgress) => {
      updateProgress(onProgress, 15 + readProgress * 0.1);
    });
    updateProgress(onProgress, 25);

    // Load PDF with pdf-lib to get page count
    const pdfDoc = await pdfLib.PDFDocument.load(arrayBuffer);
    const pageCount = pdfDoc.getPageCount();

    if (pageCount === 0) {
      throw new Error('PDF has no pages');
    }

    updateProgress(onProgress, 30);

    // Load PDF.js for rendering
    if (typeof (window as any).pdfjsLib === 'undefined') {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
      
      const loadPromise = new Promise<void>((resolve, reject) => {
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('Failed to load PDF.js library'));
      });

      document.head.appendChild(script);
      await loadPromise;
      await new Promise(resolve => setTimeout(resolve, 100));

      if (typeof (window as any).pdfjsLib === 'undefined') {
        throw new Error('PDF.js library failed to initialize');
      }

      (window as any).pdfjsLib.GlobalWorkerOptions.workerSrc = 
        'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
    }

    updateProgress(onProgress, 40);

    // Load PDF with PDF.js for rendering
    const pdfjsLib = (window as any).pdfjsLib;
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdfDocument = await loadingTask.promise;

    // Create PowerPoint presentation
    const pres = new PptxGenJS();

    // Process each page
    for (let i = 1; i <= pageCount; i++) {
      const progress = 40 + ((i / pageCount) * 50);
      updateProgress(onProgress, progress);

      const page = await pdfDocument.getPage(i);
      const imageData = await renderPageToImage(page, 2.0);

      // Add slide with the page image
      const slide = pres.addSlide();
      
      // Add image to fill the slide
      slide.addImage({
        data: imageData,
        x: 0,
        y: 0,
        w: '100%',
        h: '100%',
        sizing: { type: 'contain', w: '100%', h: '100%' },
      });
    }

    updateProgress(onProgress, 95);

    // Generate PowerPoint blob
    const pptxBlob = await pres.write({ outputType: 'blob' });

    updateProgress(onProgress, 100);

    return pptxBlob as Blob;
  } catch (error: any) {
    if (error.message?.includes('exceeds')) {
      throw error;
    }
    if (error.message?.includes('Failed to load')) {
      throw error;
    }
    throw new Error(
      `PDF to PowerPoint conversion failed: ${error?.message || 'Unknown error'}. The file may be corrupted or password-protected.`
    );
  }
}
