/**
 * Trigger a file download in the browser with mobile-friendly handling
 */
export function downloadBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  
  // Important: Add to DOM before clicking (required for some mobile browsers)
  link.style.display = 'none';
  document.body.appendChild(link);
  
  // Trigger download
  link.click();
  
  // Clean up after a longer delay to ensure download starts on mobile
  // Mobile browsers (especially Chrome Android) need more time before URL revocation
  setTimeout(() => {
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, 1000);
}
