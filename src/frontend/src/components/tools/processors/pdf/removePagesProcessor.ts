import { loadPdfLib, updateProgress, validateFileSize, readFileAsArrayBuffer } from './pdfClient';

export interface RemovePagesOptions {
  pagesToRemove: number[];
  onProgress?: (percentage: number) => void;
}

const MAX_FILE_SIZE_MB = 10;

export function parsePageRanges(input: string, maxPages: number): number[] {
  const pages = new Set<number>();
  const parts = input.split(',').map((p) => p.trim());

  for (const part of parts) {
    if (part.includes('-')) {
      // Range like "1-3"
      const [start, end] = part.split('-').map((s) => parseInt(s.trim(), 10));
      if (isNaN(start) || isNaN(end) || start < 1 || end > maxPages || start > end) {
        throw new Error(`Invalid page range: ${part}`);
      }
      for (let i = start; i <= end; i++) {
        pages.add(i);
      }
    } else {
      // Single page
      const page = parseInt(part, 10);
      if (isNaN(page) || page < 1 || page > maxPages) {
        throw new Error(`Invalid page number: ${part}`);
      }
      pages.add(page);
    }
  }

  return Array.from(pages).sort((a, b) => a - b);
}

export async function removePagesProcessor(
  file: File,
  options: RemovePagesOptions
): Promise<Blob> {
  const { pagesToRemove, onProgress } = options;

  if (pagesToRemove.length === 0) {
    throw new Error('No pages specified for removal');
  }

  // Validate file size (10MB limit)
  validateFileSize(file, MAX_FILE_SIZE_MB);

  updateProgress(onProgress, 5);

  try {
    // Load pdf-lib
    const { PDFDocument } = await loadPdfLib();
    updateProgress(onProgress, 15);

    // Read file
    const arrayBuffer = await readFileAsArrayBuffer(file, (readProgress) => {
      updateProgress(onProgress, 15 + readProgress * 0.2);
    });
    updateProgress(onProgress, 35);

    // Load source PDF
    const srcDoc = await PDFDocument.load(arrayBuffer);
    const totalPages = srcDoc.getPageCount();

    if (totalPages === 0) {
      throw new Error('PDF has no pages');
    }

    updateProgress(onProgress, 40);

    // Validate page numbers
    const invalidPages = pagesToRemove.filter((p) => p < 1 || p > totalPages);
    if (invalidPages.length > 0) {
      throw new Error(
        `Invalid page numbers: ${invalidPages.join(', ')}. PDF has ${totalPages} pages.`
      );
    }

    // Check if all pages would be removed
    if (pagesToRemove.length >= totalPages) {
      throw new Error('Cannot remove all pages from the PDF');
    }

    // Create new PDF with remaining pages
    const newDoc = await PDFDocument.create();
    updateProgress(onProgress, 45);

    const pagesToRemoveSet = new Set(pagesToRemove);
    let copiedCount = 0;
    const pagesToCopy = totalPages - pagesToRemove.length;

    for (let i = 0; i < totalPages; i++) {
      const pageNum = i + 1; // 1-indexed

      if (!pagesToRemoveSet.has(pageNum)) {
        // Copy this page
        const [copiedPage] = await newDoc.copyPages(srcDoc, [i]);
        newDoc.addPage(copiedPage);
        copiedCount++;

        // Update progress
        const copyProgress = 45 + (copiedCount / pagesToCopy) * 45;
        updateProgress(onProgress, copyProgress);
      }
    }

    updateProgress(onProgress, 90);

    // Save PDF
    const pdfBytes = await newDoc.save();
    updateProgress(onProgress, 95);

    // Create blob
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    updateProgress(onProgress, 100);

    return blob;
  } catch (error: any) {
    if (error.message?.includes('Invalid page')) {
      throw error;
    }
    if (error.message?.includes('Cannot remove all pages')) {
      throw error;
    }
    if (error.message?.includes('No pages specified')) {
      throw error;
    }
    if (error.message?.includes('exceeds')) {
      throw error;
    }
    if (error.message?.includes('load PDF processing library')) {
      throw error;
    }
    throw new Error(
      `Failed to remove pages: ${error.message || 'The PDF may be corrupted or use unsupported features.'}`
    );
  }
}
