import { convertWordToPdf } from '@/lib/wordToPdfApi';
import type { backendInterface } from '@/backend';

export interface WordToPdfProcessorOptions {
  file: File;
  actor: backendInterface;
  onProgress?: (progress: number) => void;
}

export interface WordToPdfProcessorResult {
  name: string;
  blob: Blob;
}

export async function wordToPdfProcessor({
  file,
  actor,
  onProgress,
}: WordToPdfProcessorOptions): Promise<WordToPdfProcessorResult> {
  // Validate file exists and has content
  if (!file || file.size === 0) {
    throw new Error('Invalid file. Please select a valid Word document.');
  }

  // Validate file extension (case-insensitive)
  const fileName = file.name.toLowerCase();
  if (!fileName.endsWith('.doc') && !fileName.endsWith('.docx')) {
    throw new Error('Only .doc and .docx files are supported. Please select a valid Word document.');
  }

  // Report initial progress
  onProgress?.(5);

  try {
    // Convert using backend API
    const pdfBlob = await convertWordToPdf(file, actor, onProgress);

    // Generate output filename - handle both .doc and .docx extensions
    const baseName = file.name.replace(/\.(docx?|DOCX?)$/i, '');
    const outputFileName = `${baseName}.pdf`;

    // Final progress
    onProgress?.(100);

    return {
      name: outputFileName,
      blob: pdfBlob,
    };
  } catch (error: any) {
    // Provide clear error messages
    const errorMessage = error.message || 'Failed to convert Word document to PDF';
    throw new Error(errorMessage);
  }
}
