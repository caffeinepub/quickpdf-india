import { updateProgress, loadPdfLib, validateFileSize, readFileAsArrayBuffer } from './pdfClient';

export interface SplitPdfOptions {
  onProgress?: (percentage: number) => void;
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

export async function splitPdfProcessor(
  file: File,
  options: SplitPdfOptions = {}
): Promise<Blob> {
  const { onProgress } = options;

  try {
    updateProgress(onProgress, 0);

    // Validate file size
    validateFileSize(file, 20);

    // Load libraries
    updateProgress(onProgress, 5);
    const { PDFDocument } = await loadPdfLib();
    const JSZip = await loadJSZip();

    // Read the input PDF
    updateProgress(onProgress, 15);
    const arrayBuffer = await readFileAsArrayBuffer(file);
    const pdfDoc = await PDFDocument.load(arrayBuffer);

    const totalPages = pdfDoc.getPageCount();
    
    if (totalPages === 1) {
      throw new Error('PDF has only one page. Nothing to split.');
    }

    updateProgress(onProgress, 25);

    // Create ZIP file
    const zip = new JSZip();
    const baseName = file.name.replace(/\.pdf$/i, '');

    // Split each page
    for (let i = 0; i < totalPages; i++) {
      const progress = 25 + ((i / totalPages) * 65);
      updateProgress(onProgress, progress);

      // Create a new PDF with just this page
      const newPdf = await PDFDocument.create();
      const [copiedPage] = await newPdf.copyPages(pdfDoc, [i]);
      newPdf.addPage(copiedPage);

      // Save this page as PDF
      const pdfBytes = await newPdf.save();
      
      // Add to ZIP
      const pageNum = String(i + 1).padStart(3, '0');
      zip.file(`${baseName}_page_${pageNum}.pdf`, pdfBytes);
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
    throw new Error('Failed to split PDF. The file may be corrupted or password-protected.');
  }
}
