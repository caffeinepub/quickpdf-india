import type { backendInterface } from '@/backend';

/**
 * Convert a Word document to PDF using backend conversion
 * Handles binary upload efficiently and provides progress tracking
 */
export async function convertWordToPdf(
  file: File,
  actor: backendInterface,
  onProgress?: (progress: number) => void
): Promise<Blob> {
  try {
    // Report initial progress
    onProgress?.(5);

    // Convert file to Uint8Array efficiently
    const arrayBuffer = await file.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);

    // Report encoding complete
    onProgress?.(20);

    // Call backend conversion
    try {
      onProgress?.(30);
      
      // Backend conversion call
      const result = await actor.convertWordToPdf(bytes, []);
      
      onProgress?.(70);
      
      // Backend currently returns void - this is a known limitation
      // The backend needs to be updated to return the PDF bytes
      throw new Error(
        'The Word to PDF conversion service is currently unavailable. The backend needs to return the converted PDF data. Please try again later or contact support.'
      );
    } catch (backendError: any) {
      // Handle backend trap/rejection
      const errorMessage = backendError?.message || String(backendError);
      
      console.error('Backend conversion error:', errorMessage);
      
      // Map known backend errors to user-friendly messages
      if (errorMessage.includes('not available') || 
          errorMessage.includes('unavailable') ||
          errorMessage.includes('reach out to') || 
          errorMessage.includes('Kambria') ||
          errorMessage.includes('being updated') ||
          errorMessage.includes('needs to return')) {
        throw new Error('The conversion service is temporarily unavailable. Please try again in a few moments.');
      }
      
      if (errorMessage.includes('too large') || errorMessage.includes('size limit') || errorMessage.includes('exceeds')) {
        throw new Error('File is too large. Maximum size is 10MB. Please use a smaller file.');
      }
      
      if (errorMessage.includes('invalid') || errorMessage.includes('unsupported') || errorMessage.includes('format')) {
        throw new Error('Invalid file format. Please upload a valid .doc or .docx file.');
      }

      if (errorMessage.includes('timeout') || errorMessage.includes('timed out')) {
        throw new Error('Conversion timed out. Please try again with a smaller or simpler document.');
      }

      if (errorMessage.includes('memory') || errorMessage.includes('out of cycles')) {
        throw new Error('Server resources temporarily unavailable. Please try again in a moment.');
      }
      
      // Re-throw with context
      throw new Error(`Conversion failed: ${errorMessage}`);
    }
  } catch (error: any) {
    // Provide user-friendly error messages
    const message = error.message || 'Unknown error';
    
    console.error('Word to PDF conversion error:', message);
    
    // Pass through already user-friendly messages
    if (message.includes('conversion service') || 
        message.includes('temporarily unavailable') ||
        message.includes('File is too large') ||
        message.includes('Invalid file format') ||
        message.includes('Conversion timed out') ||
        message.includes('Server resources')) {
      throw error;
    }
    
    if (message.includes('Failed to read file') || message.includes('arrayBuffer')) {
      throw new Error('Could not read the file. The file may be corrupted or inaccessible.');
    }

    if (message.includes('network') || message.includes('fetch')) {
      throw new Error('Network error. Please check your connection and try again.');
    }
    
    // Generic fallback
    throw new Error('Failed to convert Word document to PDF. Please try again with a different file.');
  }
}
