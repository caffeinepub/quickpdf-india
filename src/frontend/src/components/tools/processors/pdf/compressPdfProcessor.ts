import { updateProgress, loadPdfLib, validateFileSize, readFileAsArrayBuffer } from './pdfClient';

export interface CompressPdfOptions {
  onProgress?: (percentage: number) => void;
}

export async function compressPdfProcessor(
  file: File,
  options: CompressPdfOptions = {}
): Promise<Blob> {
  const { onProgress } = options;

  try {
    updateProgress(onProgress, 0);

    // Validate file size
    validateFileSize(file, 20);

    // Load pdf-lib
    updateProgress(onProgress, 10);
    const { PDFDocument } = await loadPdfLib();

    // Read the input PDF
    updateProgress(onProgress, 30);
    const arrayBuffer = await readFileAsArrayBuffer(file);
    const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });

    updateProgress(onProgress, 60);

    // Save with compression options
    // Note: pdf-lib's compression is limited, but we can optimize the save
    const pdfBytes = await pdfDoc.save({
      useObjectStreams: true,
      addDefaultPage: false,
    });

    updateProgress(onProgress, 100);

    const resultBlob = new Blob([pdfBytes], { type: 'application/pdf' });

    // Check if we actually reduced the size
    const originalSizeMB = (file.size / 1024 / 1024).toFixed(2);
    const newSizeMB = (resultBlob.size / 1024 / 1024).toFixed(2);
    
    console.log(`PDF compression: ${originalSizeMB}MB → ${newSizeMB}MB`);

    return resultBlob;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to compress PDF. The file may be corrupted or password-protected.');
  }
}
