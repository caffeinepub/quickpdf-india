export const FILE_SIZE_LIMITS = {
  default: 20 * 1024 * 1024, // 20MB
  image: 5 * 1024 * 1024, // 5MB for image resize
  pdf: 20 * 1024 * 1024, // 20MB
  conversion: 10 * 1024 * 1024, // 10MB for Word/PDF conversions
};

export const LIMIT_MESSAGES = {
  fileTooLarge: (maxSizeMB: number) =>
    `File size exceeds ${maxSizeMB}MB limit. Please use a smaller file or try compressing it first.`,
  tooManyFiles: (maxFiles: number) =>
    `Maximum ${maxFiles} file${maxFiles > 1 ? 's' : ''} allowed at once.`,
  invalidFileType: (acceptedTypes: string) =>
    `Invalid file type. Please upload ${acceptedTypes} files only.`,
  pdfTooComplex: () =>
    'This PDF is too large or complex to process in your browser. Try using a smaller file.',
  memoryError: () =>
    'Your browser ran out of memory processing this file. Try using a smaller file or a different device.',
  conversionLimit: () =>
    'File size exceeds 10MB limit for conversion tools. Please use a smaller file.',
  imageResizeLimit: () =>
    'File size exceeds 5MB limit for image resize. Please use a smaller image.',
};
