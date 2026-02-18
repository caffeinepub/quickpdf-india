/**
 * Format file size in bytes to human-readable string
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Get user-friendly file type label from MIME type or extension
 */
export function getFileTypeLabel(file: File): string {
  const mimeType = file.type.toLowerCase();
  const extension = file.name.split('.').pop()?.toLowerCase() || '';
  
  // PDF
  if (mimeType.includes('pdf') || extension === 'pdf') {
    return 'PDF Document';
  }
  
  // Images
  if (mimeType.includes('jpeg') || mimeType.includes('jpg') || extension === 'jpg' || extension === 'jpeg') {
    return 'JPEG Image';
  }
  if (mimeType.includes('png') || extension === 'png') {
    return 'PNG Image';
  }
  if (mimeType.includes('gif') || extension === 'gif') {
    return 'GIF Image';
  }
  if (mimeType.includes('webp') || extension === 'webp') {
    return 'WebP Image';
  }
  
  // Word documents
  if (mimeType.includes('wordprocessingml') || extension === 'docx') {
    return 'Word Document (DOCX)';
  }
  if (mimeType.includes('msword') || extension === 'doc') {
    return 'Word Document (DOC)';
  }
  
  // Fallback
  if (extension) {
    return extension.toUpperCase() + ' File';
  }
  
  return 'Unknown File';
}
