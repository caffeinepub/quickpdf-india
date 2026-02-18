import { updateProgress, loadPdfLib, validateFileSize, readFileAsArrayBuffer } from './pdfClient';

export interface MergePdfOptions {
  onProgress?: (percentage: number) => void;
}

export async function mergePdfProcessor(
  files: File[],
  options: MergePdfOptions = {}
): Promise<Blob> {
  const { onProgress } = options;

  if (files.length === 0) {
    throw new Error('No files provided for merging');
  }

  if (files.length === 1) {
    throw new Error('At least two PDF files are required for merging');
  }

  try {
    updateProgress(onProgress, 0);

    // Validate all files
    files.forEach(file => validateFileSize(file, 20));

    // Load pdf-lib
    updateProgress(onProgress, 5);
    const { PDFDocument } = await loadPdfLib();

    // Create a new merged document
    const mergedPdf = await PDFDocument.create();
    updateProgress(onProgress, 10);

    // Process each file
    for (let i = 0; i < files.length; i++) {
      const progressBase = 10 + ((i / files.length) * 80);
      updateProgress(onProgress, progressBase);

      const file = files[i];
      const arrayBuffer = await readFileAsArrayBuffer(file);
      const pdf = await PDFDocument.load(arrayBuffer);

      // Copy all pages from this PDF
      const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
      copiedPages.forEach((page) => {
        mergedPdf.addPage(page);
      });

      updateProgress(onProgress, progressBase + (80 / files.length));
    }

    updateProgress(onProgress, 95);

    // Save the merged PDF
    const pdfBytes = await mergedPdf.save();
    updateProgress(onProgress, 100);

    return new Blob([pdfBytes], { type: 'application/pdf' });
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to merge PDFs. One or more files may be corrupted or password-protected.');
  }
}
