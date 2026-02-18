import { updateProgress, validateFileSize } from '../pdf/pdfClient';
import { loadConversionLibraries } from './wordToPdfLibraries';

export interface WordToPdfOptions {
  onProgress?: (percentage: number) => void;
}

const MAX_FILE_SIZE_MB = 10;

/**
 * Extract text content from DOCX file using JSZip
 */
async function extractDocxText(file: File, JSZip: any): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  
  try {
    const zip = await JSZip.loadAsync(arrayBuffer);
    const documentXml = await zip.file('word/document.xml')?.async('text');
    
    if (!documentXml) {
      throw new Error('Invalid DOCX file: missing document.xml. The file may be corrupted or not a valid Word document.');
    }

    // Extract text from XML (simple approach)
    const textMatches = documentXml.match(/<w:t[^>]*>([^<]+)<\/w:t>/g);
    if (!textMatches || textMatches.length === 0) {
      return '';
    }

    const text = textMatches
      .map((match) => {
        const textContent = match.replace(/<w:t[^>]*>/, '').replace(/<\/w:t>/, '');
        return textContent;
      })
      .join(' ');

    return text;
  } catch (error: any) {
    throw new Error(
      `Failed to extract text from Word document: ${error?.message || 'Unknown error'}. The file may be corrupted or use unsupported features.`
    );
  }
}

/**
 * Convert Word document to PDF (client-side, text-only)
 */
export async function wordToPdfProcessor(
  file: File,
  options: WordToPdfOptions
): Promise<Blob> {
  const { onProgress } = options;

  // Validate file size (10MB limit)
  validateFileSize(file, MAX_FILE_SIZE_MB);

  updateProgress(onProgress, 5);

  try {
    // Load libraries - pdfMake is now from local imports with proper VFS initialization
    const { pdfMake, JSZip } = await loadConversionLibraries();
    
    // Verify pdfMake is properly initialized with VFS
    if (!pdfMake || typeof pdfMake.createPdf !== 'function') {
      throw new Error('PDF library failed to initialize. Please refresh the page and try again.');
    }
    
    if (!pdfMake.vfs || typeof pdfMake.vfs !== 'object' || Object.keys(pdfMake.vfs).length === 0) {
      throw new Error('PDF library fonts (VFS) not available. Please refresh the page and try again.');
    }
    
    updateProgress(onProgress, 20);

    // Extract text from DOCX
    const text = await extractDocxText(file, JSZip);
    updateProgress(onProgress, 60);

    if (!text || text.trim().length === 0) {
      throw new Error('No text content found in the Word document. The file may be empty or contain only images/tables.');
    }

    // Create PDF using pdfmake
    const docDefinition = {
      content: [
        {
          text: text,
          fontSize: 12,
          lineHeight: 1.5,
        },
      ],
      pageSize: 'A4',
      pageMargins: [40, 60, 40, 60],
    };

    updateProgress(onProgress, 80);

    // Generate PDF
    return new Promise((resolve, reject) => {
      try {
        const pdfDocGenerator = pdfMake.createPdf(docDefinition);
        
        pdfDocGenerator.getBlob((blob: Blob) => {
          updateProgress(onProgress, 100);
          resolve(blob);
        });
      } catch (error: any) {
        reject(
          new Error(
            `Failed to generate PDF: ${error?.message || 'Unknown error'}. The document may be too complex or the library failed to initialize.`
          )
        );
      }
    });
  } catch (error: any) {
    // Preserve specific error messages
    if (error.message?.includes('exceeds')) {
      throw error;
    }
    if (error.message?.includes('No text content')) {
      throw error;
    }
    if (error.message?.includes('Failed to load')) {
      throw error;
    }
    if (error.message?.includes('Failed to extract')) {
      throw error;
    }
    if (error.message?.includes('Failed to generate')) {
      throw error;
    }
    if (error.message?.includes('PDF library failed to initialize')) {
      throw error;
    }
    if (error.message?.includes('fonts (VFS) not available')) {
      throw error;
    }
    
    // Generic fallback with context
    throw new Error(
      `Word to PDF conversion failed: ${error?.message || 'Unknown error'}. Note: This tool extracts text only; complex formatting, images, and tables are not preserved.`
    );
  }
}
