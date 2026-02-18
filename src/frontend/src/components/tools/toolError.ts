/**
 * Structured error information for tool processing failures
 */
export interface ToolError {
  message: string;
  toolId: string;
  step?: string;
  originalError?: unknown;
}

/**
 * Normalize any thrown value into a structured ToolError
 */
export function normalizeToolError(
  error: unknown,
  toolId: string,
  step?: string
): ToolError {
  let message = 'An unknown error occurred';

  if (error instanceof Error) {
    message = error.message;
  } else if (typeof error === 'string') {
    message = error;
  }

  return {
    message,
    toolId,
    step,
    originalError: error,
  };
}

/**
 * Get user-friendly error summary based on tool and error type
 */
function getFriendlyErrorSummary(error: ToolError): string {
  const msg = error.message.toLowerCase();

  // Backend connection errors
  if (msg.includes('backend connection not available')) {
    return 'Backend connection not available. Please refresh the page and try again.';
  }

  // File validation errors
  if (msg.includes('please select')) {
    return error.message; // Already user-friendly
  }

  if (msg.includes('invalid file type') || msg.includes('unsupported file type')) {
    return error.message; // Already user-friendly
  }

  if (msg.includes('only .docx files are supported')) {
    return error.message; // Already user-friendly
  }

  // File size errors
  if (msg.includes('exceeds') && msg.includes('limit')) {
    return error.message; // Already user-friendly
  }

  if (msg.includes('too large')) {
    return error.message; // Already user-friendly
  }

  // FileReader errors
  if (msg.includes('unable to read file') || msg.includes('failed to read file')) {
    return error.message; // Already user-friendly
  }

  // Image loading errors
  if (msg.includes('failed to load image')) {
    return error.message; // Already user-friendly
  }

  // Corrupted/protected file errors
  if (msg.includes('corrupted') || msg.includes('password-protected')) {
    return 'This file cannot be processed. It may be corrupted, password-protected, or use unsupported features.';
  }

  // Tool-specific errors with actionable guidance
  if (error.toolId === 'add-watermark') {
    if (msg.includes('watermark text is required')) {
      return 'Please enter watermark text before processing.';
    }
    if (msg.includes('failed to add watermark')) {
      return 'Could not add watermark to this PDF. The file may be too complex or use unsupported features. Try a different PDF file.';
    }
  }

  if (error.toolId === 'remove-pages') {
    if (msg.includes('invalid page')) {
      return error.message; // Already user-friendly
    }
    if (msg.includes('cannot remove all pages')) {
      return 'Cannot remove all pages from the PDF. At least one page must remain.';
    }
    if (msg.includes('no pages specified')) {
      return 'Please specify which pages to remove.';
    }
  }

  if (error.toolId === 'word-to-pdf') {
    if (msg.includes('conversion failed')) {
      return 'Word to PDF conversion failed. Please check your file and try again.';
    }
    if (msg.includes('failed to convert')) {
      return 'Could not convert the Word document. The file may be corrupted or use unsupported features.';
    }
  }

  if (error.toolId === 'pdf-to-word') {
    if (msg.includes('text extraction')) {
      return 'This tool provides basic text extraction. Complex PDFs with images, tables, or special formatting may not convert accurately.';
    }
  }

  if (error.toolId === 'image-to-pdf') {
    if (msg.includes('no images provided')) {
      return 'Please select at least one image file.';
    }
    if (msg.includes('unsupported image type')) {
      return error.message; // Already user-friendly
    }
  }

  if (error.toolId === 'resize-image') {
    if (msg.includes('unsupported file type')) {
      return error.message; // Already user-friendly
    }
    if (msg.includes('failed to resize') || msg.includes('failed to create')) {
      return 'Could not resize this image. The file may be corrupted or use an unsupported format. Try a different image file.';
    }
    if (msg.includes('failed to compress to target size')) {
      return error.message; // Already user-friendly
    }
  }

  if (error.toolId === 'resize-pdf') {
    if (msg.includes('failed to resize')) {
      return 'Could not resize this PDF. The file may be too complex or use unsupported features. Try a different PDF file.';
    }
  }

  if (error.toolId === 'compress-pdf') {
    if (msg.includes('failed to compress')) {
      return 'Could not compress this PDF. The file may already be optimized or use unsupported compression. Try a different PDF file.';
    }
  }

  if (error.toolId === 'merge-pdf') {
    if (msg.includes('at least two')) {
      return 'Please select at least two PDF files to merge.';
    }
    if (msg.includes('failed to merge')) {
      return 'Could not merge these PDFs. One or more files may be corrupted or incompatible. Try different PDF files.';
    }
  }

  if (error.toolId === 'split-pdf') {
    if (msg.includes('only one page')) {
      return 'This PDF has only one page and cannot be split.';
    }
    if (msg.includes('failed to split')) {
      return 'Could not split this PDF. The file may be corrupted or use unsupported features. Try a different PDF file.';
    }
  }

  // Generic fallback with tool context
  return `Processing failed: ${error.message}. Please try again or use a different file.`;
}

/**
 * Format error for display to user
 */
export function formatToolError(error: ToolError): {
  summary: string;
  details: string;
} {
  return {
    summary: getFriendlyErrorSummary(error),
    details: error.message,
  };
}
