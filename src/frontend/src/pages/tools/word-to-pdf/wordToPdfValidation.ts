const MAX_FILE_SIZE_MB = 10;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

interface ValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Validates Word file for conversion
 * Checks file type (.doc/.docx) and size limit (10MB)
 */
export function validateWordFile(file: File): ValidationResult {
  // Check if file exists
  if (!file) {
    return {
      valid: false,
      error: 'No file selected. Please choose a Word document.',
    };
  }

  // Check file size
  if (file.size === 0) {
    return {
      valid: false,
      error: 'The selected file is empty. Please choose a valid Word document.',
    };
  }

  // Check file size limit
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return {
      valid: false,
      error: `File size exceeds ${MAX_FILE_SIZE_MB}MB limit. Please use a smaller file.`,
    };
  }

  // Check file extension (case-insensitive)
  const fileName = file.name.toLowerCase();
  const isValidExtension = fileName.endsWith('.doc') || fileName.endsWith('.docx');

  if (!isValidExtension) {
    return {
      valid: false,
      error: 'Only .doc and .docx files are supported. Please select a valid Word document.',
    };
  }

  return { valid: true };
}
