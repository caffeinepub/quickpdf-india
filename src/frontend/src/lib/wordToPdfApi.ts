import type { backendInterface } from '@/backend';

/**
 * Convert a Word document to PDF using backend conversion
 * Handles binary upload efficiently and provides progress tracking
 * 
 * Note: Backend currently returns void - this is a known limitation.
 * The conversion happens server-side but PDF bytes are not yet returned.
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
      
      // Backend conversion call - currently returns void
      // This is a backend limitation that needs to be addressed
      await actor.convertWordToPdf(bytes, []);
      
      onProgress?.(70);
      
      // Backend does not return PDF bytes yet
      // Throw a clear error explaining the limitation
      throw new Error(
        'Word to PDF conversion is currently being updated. The backend service needs to be enhanced to return PDF data. Please contact support or try again later.'
      );
    } catch (backendError: any) {
      // Handle backend trap/rejection
      const errorMessage = backendError?.message || String(backendError);
      
      // Map known backend errors to user-friendly messages
      if (errorMessage.includes('not available') || 
          errorMessage.includes('reach out to') || 
          errorMessage.includes('Kambria') ||
          errorMessage.includes('being updated')) {
        throw new Error('Conversion service is being updated. Please try again in a moment.');
      }
      
      if (errorMessage.includes('too large') || errorMessage.includes('size limit')) {
        throw new Error('File is too large. Maximum size is 10MB.');
      }
      
      if (errorMessage.includes('invalid') || errorMessage.includes('unsupported')) {
        throw new Error('Invalid file format. Please upload a valid .doc or .docx file.');
      }
      
      // Re-throw with context
      throw new Error(`Conversion failed: ${errorMessage}`);
    }
  } catch (error: any) {
    // Provide user-friendly error messages
    const message = error.message || 'Unknown error';
    
    if (message.includes('service is being updated') || message.includes('backend service needs')) {
      throw error; // Already user-friendly
    }
    
    if (message.includes('File is too large')) {
      throw error; // Already user-friendly
    }
    
    if (message.includes('Invalid file format')) {
      throw error; // Already user-friendly
    }
    
    if (message.includes('Failed to read file') || message.includes('arrayBuffer')) {
      throw new Error('Could not read the file. The file may be corrupted or inaccessible.');
    }
    
    // Generic fallback
    throw new Error('Failed to convert Word document to PDF. Please try again with a different file.');
  }
}
