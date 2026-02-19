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

/**
 * Word to PDF processor with comprehensive validation and error handling
 * Supports both .doc and .docx formats with proper formatting preservation
 */
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

  // Validate file size (10MB limit)
  const MAX_SIZE = 10 * 1024 * 1024; // 10MB
  if (file.size > MAX_SIZE) {
    throw new Error('File size exceeds 10MB limit. Please use a smaller file.');
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
    console.error('Word to PDF processor error:', errorMessage);
    throw new Error(errorMessage);
  }
}
