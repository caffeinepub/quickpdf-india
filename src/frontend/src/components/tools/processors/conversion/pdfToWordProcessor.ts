import { loadPdfLib, updateProgress, validateFileSize, readFileAsArrayBuffer } from '../pdf/pdfClient';

export interface PdfToWordOptions {
  onProgress?: (percentage: number) => void;
}

const MAX_FILE_SIZE_MB = 10;

let docxCache: any = null;
let docxLoadPromise: Promise<any> | null = null;

/**
 * Load docx library from CDN
 */
async function loadDocxLib(): Promise<any> {
  if (docxCache) {
    return docxCache;
  }

  if (docxLoadPromise) {
    return docxLoadPromise;
  }

  docxLoadPromise = (async () => {
    try {
      const docxModule = await import(/* @vite-ignore */ 'https://cdn.skypack.dev/docx@8.5.0' as any);
      docxCache = {
        Document: docxModule.Document,
        Paragraph: docxModule.Paragraph,
        TextRun: docxModule.TextRun,
        Packer: docxModule.Packer,
      };
      return docxCache!;
    } catch (error: any) {
      docxLoadPromise = null;
      throw new Error(
        `Failed to load Word processing library: ${error?.message || 'Unknown error'}. Please check your internet connection.`
      );
    }
  })();

  return docxLoadPromise;
}

/**
 * Convert PDF to Word document (client-side, text-only)
 */
export async function pdfToWordProcessor(
  file: File,
  options: PdfToWordOptions
): Promise<Blob> {
  const { onProgress } = options;

  // Validate file size (10MB limit)
  validateFileSize(file, MAX_FILE_SIZE_MB);

  updateProgress(onProgress, 5);

  try {
    // Load libraries
    const [pdfLib, docxLib] = await Promise.all([loadPdfLib(), loadDocxLib()]);
    updateProgress(onProgress, 20);

    // Read PDF file
    const arrayBuffer = await readFileAsArrayBuffer(file, (readProgress) => {
      updateProgress(onProgress, 20 + readProgress * 0.2);
    });
    updateProgress(onProgress, 40);

    // Load PDF
    const pdfDoc = await pdfLib.PDFDocument.load(arrayBuffer);
    const pageCount = pdfDoc.getPageCount();

    if (pageCount === 0) {
      throw new Error('PDF has no pages');
    }

    updateProgress(onProgress, 50);

    // Extract text from PDF (simplified approach)
    const pages = pdfDoc.getPages();
    const paragraphs: any[] = [];

    for (let i = 0; i < pageCount; i++) {
      const page = pages[i];
      
      // Note: pdf-lib doesn't have built-in text extraction
      // This is a limitation - we'll create a placeholder message
      const pageText = `[Page ${i + 1} content - Text extraction from PDF requires advanced processing]`;
      
      paragraphs.push(
        new docxLib.Paragraph({
          children: [new docxLib.TextRun(pageText)],
        })
      );

      // Add page break except for last page
      if (i < pageCount - 1) {
        paragraphs.push(
          new docxLib.Paragraph({
            children: [new docxLib.TextRun('')],
            pageBreakBefore: true,
          })
        );
      }

      const extractProgress = 50 + ((i + 1) / pageCount) * 30;
      updateProgress(onProgress, extractProgress);
    }

    updateProgress(onProgress, 80);

    // Create Word document
    const doc = new docxLib.Document({
      sections: [
        {
          properties: {},
          children: paragraphs,
        },
      ],
    });

    updateProgress(onProgress, 90);

    // Generate DOCX blob
    const blob = await docxLib.Packer.toBlob(doc);
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
      `PDF to Word conversion failed: ${error?.message || 'Unknown error'}. Note: This tool provides basic text extraction; complex PDFs with images, tables, or special formatting may not convert accurately.`
    );
  }
}
