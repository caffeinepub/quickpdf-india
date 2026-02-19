import { LIMIT_MESSAGES } from '@/config/toolLimits';

export interface JpgToJpegOptions {
  onProgress?: (percentage: number) => void;
  quality?: number;
}

/**
 * Convert JPG to JPEG format (essentially a file extension/MIME type change)
 * JPG and JPEG are the same format, just different extensions
 */
export async function jpgToJpegProcessor(
  files: File[],
  options: JpgToJpegOptions = {}
): Promise<File> {
  const { onProgress, quality = 0.95 } = options;
  const file = files[0];

  try {
    if (onProgress) onProgress(0);

    // Validate file type
    const fileType = file.type.toLowerCase();
    const fileName = file.name.toLowerCase();
    
    if (!fileType.includes('jpeg') && !fileType.includes('jpg') && 
        !fileName.endsWith('.jpg') && !fileName.endsWith('.jpeg')) {
      throw new Error('Please select a JPG or JPEG image file.');
    }

    // Validate file size (5MB limit for images)
    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      throw new Error(LIMIT_MESSAGES.imageResizeLimit());
    }

    if (onProgress) onProgress(10);

    // Load image
    const img = new Image();
    const imageUrl = URL.createObjectURL(file);
    
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error('Failed to load image. The file may be corrupted.'));
      img.src = imageUrl;
    });

    if (onProgress) onProgress(30);

    // Create canvas with same dimensions
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      URL.revokeObjectURL(imageUrl);
      throw new Error('Failed to create canvas context');
    }

    // Draw image to canvas
    ctx.drawImage(img, 0, 0);
    URL.revokeObjectURL(imageUrl);

    if (onProgress) onProgress(60);

    // Convert to JPEG blob
    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (result) => {
          if (result) {
            resolve(result);
          } else {
            reject(new Error('Failed to convert image to JPEG format'));
          }
        },
        'image/jpeg',
        quality
      );
    });

    if (onProgress) onProgress(90);

    // Create new filename with .jpeg extension
    const originalName = file.name.replace(/\.[^/.]+$/, '');
    const newFileName = `${originalName}.jpeg`;

    // Create File object with new name
    const resultFile = new File([blob], newFileName, {
      type: 'image/jpeg',
      lastModified: Date.now(),
    });

    if (onProgress) onProgress(100);

    return resultFile;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to convert JPG to JPEG. Please try again.');
  }
}
