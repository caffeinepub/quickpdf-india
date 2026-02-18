/**
 * Shared PDF processing utilities using pdf-lib
 * Loads pdf-lib dynamically from CDN for client-side PDF processing
 */

// Type definitions for pdf-lib (loaded from CDN)
export interface PDFLibType {
  PDFDocument: any;
  StandardFonts: any;
  rgb: any;
  degrees: any;
  PageSizes: any;
}

let pdfLibCache: PDFLibType | null = null;
let pdfLibLoadPromise: Promise<PDFLibType> | null = null;

/**
 * Load pdf-lib from CDN with caching
 */
export async function loadPdfLib(): Promise<PDFLibType> {
  if (pdfLibCache) {
    return pdfLibCache;
  }

  if (pdfLibLoadPromise) {
    return pdfLibLoadPromise;
  }

  pdfLibLoadPromise = (async () => {
    try {
      // Check if already loaded globally
      if (typeof (window as any).PDFLib !== 'undefined') {
        const lib = (window as any).PDFLib;
        pdfLibCache = {
          PDFDocument: lib.PDFDocument,
          StandardFonts: lib.StandardFonts,
          rgb: lib.rgb,
          degrees: lib.degrees,
          PageSizes: lib.PageSizes,
        };
        return pdfLibCache!;
      }

      // Load from CDN
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/pdf-lib@1.17.1/dist/pdf-lib.min.js';
      
      const loadPromise = new Promise<void>((resolve, reject) => {
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('Failed to load PDF library from CDN'));
      });

      document.head.appendChild(script);
      await loadPromise;

      // Wait a bit for the library to initialize
      await new Promise(resolve => setTimeout(resolve, 100));

      if (typeof (window as any).PDFLib === 'undefined') {
        throw new Error('PDF library failed to initialize after loading');
      }

      const lib = (window as any).PDFLib;
      pdfLibCache = {
        PDFDocument: lib.PDFDocument,
        StandardFonts: lib.StandardFonts,
        rgb: lib.rgb,
        degrees: lib.degrees,
        PageSizes: lib.PageSizes,
      };

      return pdfLibCache!;
    } catch (error: any) {
      pdfLibLoadPromise = null;
      const errorMsg = error?.message || 'Unknown error';
      throw new Error(
        `Unable to load PDF processing library: ${errorMsg}. Please check your internet connection and try again.`
      );
    }
  })();

  return pdfLibLoadPromise;
}

/**
 * Get the number of pages in a PDF file
 */
export async function getPdfPageCount(file: File): Promise<number> {
  try {
    const { PDFDocument } = await loadPdfLib();
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    return pdfDoc.getPageCount();
  } catch (error: any) {
    const errorMsg = error?.message || 'Unknown error';
    throw new Error(`Failed to read PDF file: ${errorMsg}. The file may be corrupted or password-protected.`);
  }
}

/**
 * Helper to update progress with validation
 */
export function updateProgress(
  onProgress: ((percentage: number) => void) | undefined,
  percentage: number
): void {
  if (onProgress) {
    onProgress(Math.min(100, Math.max(0, Math.round(percentage))));
  }
}

/**
 * Validate file size against limits
 */
export function validateFileSize(file: File, maxSizeMB: number = 20): void {
  const maxBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxBytes) {
    throw new Error(
      `File size (${(file.size / 1024 / 1024).toFixed(1)}MB) exceeds the ${maxSizeMB}MB limit. Please use a smaller file.`
    );
  }
}

/**
 * Read file as ArrayBuffer with progress
 */
export async function readFileAsArrayBuffer(
  file: File,
  onProgress?: (percentage: number) => void
): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onprogress = (event) => {
      if (event.lengthComputable && onProgress) {
        const progress = (event.loaded / event.total) * 100;
        onProgress(progress);
      }
    };
    
    reader.onload = () => {
      if (reader.result instanceof ArrayBuffer) {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to read file as ArrayBuffer'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file: File may be corrupted or inaccessible'));
    };
    
    reader.readAsArrayBuffer(file);
  });
}
