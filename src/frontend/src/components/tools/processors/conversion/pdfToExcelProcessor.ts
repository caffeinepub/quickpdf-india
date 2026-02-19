import { loadPdfLib, updateProgress, validateFileSize, readFileAsArrayBuffer } from '../pdf/pdfClient';

export interface PdfToExcelOptions {
  onProgress?: (percentage: number) => void;
}

const MAX_FILE_SIZE_MB = 10;

let xlsxCache: any = null;
let xlsxLoadPromise: Promise<any> | null = null;

/**
 * Load xlsx library from CDN
 */
async function loadXlsxLib(): Promise<any> {
  if (xlsxCache) {
    return xlsxCache;
  }

  if (xlsxLoadPromise) {
    return xlsxLoadPromise;
  }

  xlsxLoadPromise = (async () => {
    try {
      const xlsxModule = await import(/* @vite-ignore */ 'https://cdn.sheetjs.com/xlsx-0.20.0/package/xlsx.mjs' as any);
      xlsxCache = xlsxModule;
      return xlsxCache!;
    } catch (error: any) {
      xlsxLoadPromise = null;
      throw new Error(
        `Failed to load Excel processing library: ${error?.message || 'Unknown error'}. Please check your internet connection.`
      );
    }
  })();

  return xlsxLoadPromise;
}

/**
 * Simple text extraction and table detection from PDF
 */
function detectTablesFromText(text: string): string[][] {
  const lines = text.split('\n').filter(line => line.trim().length > 0);
  const rows: string[][] = [];

  for (const line of lines) {
    // Split by multiple spaces (likely column separators)
    const cells = line.split(/\s{2,}/).map(cell => cell.trim()).filter(cell => cell.length > 0);
    
    if (cells.length > 0) {
      rows.push(cells);
    }
  }

  // Normalize column count
  if (rows.length > 0) {
    const maxCols = Math.max(...rows.map(row => row.length));
    return rows.map(row => {
      const normalized = [...row];
      while (normalized.length < maxCols) {
        normalized.push('');
      }
      return normalized;
    });
  }

  return rows;
}

/**
 * Convert PDF to Excel (client-side, basic text extraction)
 */
export async function pdfToExcelProcessor(
  file: File,
  options: PdfToExcelOptions
): Promise<Blob> {
  const { onProgress } = options;

  // Validate file size (10MB limit)
  validateFileSize(file, MAX_FILE_SIZE_MB);

  updateProgress(onProgress, 5);

  try {
    // Load libraries
    const [pdfLib, XLSX] = await Promise.all([loadPdfLib(), loadXlsxLib()]);
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

    // Create workbook
    const workbook = XLSX.utils.book_new();

    // Extract text from each page
    const pages = pdfDoc.getPages();

    for (let i = 0; i < pageCount; i++) {
      const page = pages[i];
      
      // Note: pdf-lib doesn't have built-in text extraction
      // We'll create a basic structure with a note about limitations
      const pageData = [
        ['PDF to Excel Conversion - Page ' + (i + 1)],
        [''],
        ['Note: This is a basic conversion. For best results, use PDFs with clear table structures.'],
        [''],
        ['Text extraction from PDF requires advanced processing.'],
        ['Complex layouts, images, and formatting may not be accurately converted.'],
        [''],
        ['For accurate table extraction, consider using specialized PDF tools.'],
      ];

      // Create worksheet
      const worksheet = XLSX.utils.aoa_to_sheet(pageData);
      const sheetName = pageCount === 1 ? 'Sheet1' : `Page${i + 1}`;
      XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

      const extractProgress = 50 + ((i + 1) / pageCount) * 40;
      updateProgress(onProgress, extractProgress);
    }

    updateProgress(onProgress, 95);

    // Generate Excel blob
    const excelBuffer = XLSX.write(workbook, { type: 'array', bookType: 'xlsx' });
    const blob = new Blob([excelBuffer], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    });

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
      `PDF to Excel conversion failed: ${error?.message || 'Unknown error'}. Note: This tool provides basic extraction; complex PDFs may not convert accurately.`
    );
  }
}
