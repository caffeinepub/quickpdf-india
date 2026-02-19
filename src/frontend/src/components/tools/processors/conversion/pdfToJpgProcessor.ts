import { updateProgress, loadPdfLib, validateFileSize, readFileAsArrayBuffer } from '../pdf/pdfClient';

export interface PdfToJpgOptions {
  onProgress?: (percentage: number) => void;
  quality?: number;
}

// Dynamic import for JSZip
async function loadJSZip() {
  if (typeof (window as any).JSZip !== 'undefined') {
    return (window as any).JSZip;
  }

  const script = document.createElement('script');
  script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js';
  
  const loadPromise = new Promise<void>((resolve, reject) => {
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load ZIP library'));
  });

  document.head.appendChild(script);
  await loadPromise;
  await new Promise(resolve => setTimeout(resolve, 50));

  if (typeof (window as any).JSZip === 'undefined') {
    throw new Error('ZIP library failed to initialize');
  }

  return (window as any).JSZip;
}

/**
 * Render a PDF page to a canvas and convert to JPG
 */
async function renderPageToJpg(
  page: any,
  pageNumber: number,
  quality: number
): Promise<{ blob: Blob; name: string }> {
  // Get viewport at 2x scale for better quality
  const viewport = page.getViewport({ scale: 2.0 });
  
  // Create canvas
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  
  if (!context) {
    throw new Error('Failed to get canvas context');
  }
  
  canvas.width = viewport.width;
  canvas.height = viewport.height;
  
  // Render PDF page to canvas
  const renderContext = {
    canvasContext: context,
    viewport: viewport,
  };
  
  await page.render(renderContext).promise;
  
  // Convert canvas to JPG blob
  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (result) => {
        if (result) {
          resolve(result);
        } else {
          reject(new Error('Failed to convert canvas to JPG'));
        }
      },
      'image/jpeg',
      quality
    );
  });
  
  return {
    blob,
    name: `page-${pageNumber}.jpg`,
  };
}

export async function pdfToJpgProcessor(
  file: File,
  options: PdfToJpgOptions = {}
): Promise<Blob> {
  const { onProgress, quality = 0.92 } = options;

  try {
    updateProgress(onProgress, 0);

    // Validate file size (10MB limit for conversion tools)
    validateFileSize(file, 10);

    // Load pdf-lib
    updateProgress(onProgress, 5);
    const { PDFDocument } = await loadPdfLib();

    // Read the input PDF
    updateProgress(onProgress, 10);
    const arrayBuffer = await readFileAsArrayBuffer(file);
    const pdfDoc = await PDFDocument.load(arrayBuffer);

    const totalPages = pdfDoc.getPageCount();
    
    if (totalPages === 0) {
      throw new Error('PDF has no pages to convert.');
    }

    updateProgress(onProgress, 20);

    // We need to use PDF.js for rendering (pdf-lib doesn't support rendering)
    // Load PDF.js from CDN
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

      // Set worker path
      (window as any).pdfjsLib.GlobalWorkerOptions.workerSrc = 
        'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
    }

    updateProgress(onProgress, 30);

    // Load PDF with PDF.js for rendering
    const pdfjsLib = (window as any).pdfjsLib;
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdfDocument = await loadingTask.promise;

    const jpgFiles: { blob: Blob; name: string }[] = [];

    // Convert each page to JPG
    for (let i = 1; i <= totalPages; i++) {
      const progress = 30 + ((i / totalPages) * 60);
      updateProgress(onProgress, progress);

      const page = await pdfDocument.getPage(i);
      const jpgFile = await renderPageToJpg(page, i, quality);
      jpgFiles.push(jpgFile);
    }

    updateProgress(onProgress, 90);

    // If single page, return the JPG directly
    if (jpgFiles.length === 1) {
      updateProgress(onProgress, 100);
      return jpgFiles[0].blob;
    }

    // Multiple pages: create ZIP file
    const JSZip = await loadJSZip();
    const zip = new JSZip();
    const baseName = file.name.replace(/\.pdf$/i, '');

    for (const jpgFile of jpgFiles) {
      zip.file(`${baseName}_${jpgFile.name}`, jpgFile.blob);
    }

    updateProgress(onProgress, 95);

    // Generate ZIP file
    const zipBlob = await zip.generateAsync({ 
      type: 'blob',
      compression: 'DEFLATE',
      compressionOptions: { level: 6 }
    });

    updateProgress(onProgress, 100);

    return zipBlob;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to convert PDF to JPG. The file may be corrupted or password-protected.');
  }
}
