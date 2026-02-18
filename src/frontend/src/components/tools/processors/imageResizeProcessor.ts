export interface ImageResizeOptions {
  mode: 'pixels' | 'percentage' | 'target-size';
  width?: number;
  height?: number;
  percentage?: number;
  targetSizeKB?: number;
  maintainAspectRatio?: boolean;
  quality?: 'low' | 'medium' | 'high';
}

/**
 * Calculate dimensions maintaining aspect ratio
 */
function calculateAspectRatioDimensions(
  originalWidth: number,
  originalHeight: number,
  targetWidth?: number,
  targetHeight?: number
): { width: number; height: number } {
  const aspectRatio = originalWidth / originalHeight;

  if (targetWidth && targetHeight) {
    // Both provided - use width and calculate height to maintain ratio
    return {
      width: targetWidth,
      height: Math.round(targetWidth / aspectRatio),
    };
  } else if (targetWidth) {
    // Only width provided
    return {
      width: targetWidth,
      height: Math.round(targetWidth / aspectRatio),
    };
  } else if (targetHeight) {
    // Only height provided
    return {
      width: Math.round(targetHeight * aspectRatio),
      height: targetHeight,
    };
  }

  // Neither provided - return original
  return { width: originalWidth, height: originalHeight };
}

/**
 * Get quality value from quality setting
 */
function getQualityValue(quality?: 'low' | 'medium' | 'high'): number {
  switch (quality) {
    case 'low':
      return 0.6;
    case 'medium':
      return 0.8;
    case 'high':
      return 0.92;
    default:
      return 0.8; // Default to medium
  }
}

export async function resizeImage(
  file: File,
  options: ImageResizeOptions,
  onProgress?: (progress: number) => void
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    // Validate file input
    if (!file) {
      reject(new Error('No file provided for resizing'));
      return;
    }

    // Validate file is an image
    if (!file.type.startsWith('image/')) {
      reject(new Error('File is not a valid image'));
      return;
    }

    // Validate options based on mode
    if (options.mode === 'pixels') {
      if (!options.width && !options.height) {
        reject(new Error('Please enter at least width or height for pixel resize'));
        return;
      }
      if (options.width && options.width <= 0) {
        reject(new Error('Width must be greater than 0'));
        return;
      }
      if (options.height && options.height <= 0) {
        reject(new Error('Height must be greater than 0'));
        return;
      }
    } else if (options.mode === 'percentage') {
      if (!options.percentage || options.percentage <= 0 || options.percentage > 200) {
        reject(new Error('Percentage must be between 1 and 200'));
        return;
      }
    } else if (options.mode === 'target-size') {
      if (!options.targetSizeKB || options.targetSizeKB <= 0) {
        reject(new Error('Target size must be greater than 0 KB'));
        return;
      }
    }

    const img = new Image();
    const reader = new FileReader();

    // Handle FileReader errors
    reader.onerror = () => {
      reject(new Error('Unable to read file. Please try another image or check if the file is corrupted.'));
    };

    reader.onload = (e) => {
      // Verify result exists and is valid
      if (!e.target?.result) {
        reject(new Error('Failed to read file data. Please try again.'));
        return;
      }

      const result = e.target.result;
      
      // Ensure result is a string (data URL)
      if (typeof result !== 'string') {
        reject(new Error('Invalid file data format. Please try a different image.'));
        return;
      }

      img.src = result;
    };

    // Handle image loading errors
    img.onerror = () => {
      reject(new Error('Failed to load image. The file may be corrupted or in an unsupported format.'));
    };

    img.onload = () => {
      try {
        onProgress?.(30);

        let targetWidth = img.width;
        let targetHeight = img.height;

        // Calculate target dimensions based on mode
        if (options.mode === 'pixels') {
          if (options.maintainAspectRatio) {
            // Maintain aspect ratio
            const calculated = calculateAspectRatioDimensions(
              img.width,
              img.height,
              options.width,
              options.height
            );
            targetWidth = calculated.width;
            targetHeight = calculated.height;
          } else {
            // Use exact dimensions provided
            if (options.width) targetWidth = options.width;
            if (options.height) targetHeight = options.height;
          }
        } else if (options.mode === 'percentage' && options.percentage) {
          // Scale by percentage
          const scale = options.percentage / 100;
          targetWidth = Math.round(img.width * scale);
          targetHeight = Math.round(img.height * scale);
        } else if (options.mode === 'target-size') {
          // For target size, we'll start with original dimensions
          // and adjust quality to meet the target
          targetWidth = img.width;
          targetHeight = img.height;
        }

        // Ensure dimensions are at least 1px and integers
        targetWidth = Math.max(1, Math.round(targetWidth));
        targetHeight = Math.max(1, Math.round(targetHeight));

        onProgress?.(50);

        const canvas = document.createElement('canvas');
        canvas.width = targetWidth;
        canvas.height = targetHeight;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get canvas context. Your browser may not support this feature.'));
          return;
        }

        // Use high-quality image rendering
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

        onProgress?.(70);

        // Handle target size compression with binary search
        if (options.mode === 'target-size' && options.targetSizeKB) {
          const targetBytes = options.targetSizeKB * 1024;
          let minQuality = 0.1;
          let maxQuality = getQualityValue(options.quality);
          let bestBlob: Blob | null = null;
          let attempts = 0;
          const maxAttempts = 12;

          const tryQuality = (q: number): Promise<Blob | null> => {
            return new Promise((res) => {
              canvas.toBlob(
                (blob) => res(blob),
                'image/jpeg',
                q
              );
            });
          };

          const findQuality = async () => {
            // Try initial quality
            let currentQuality = maxQuality;
            let blob = await tryQuality(currentQuality);
            
            if (!blob) {
              throw new Error('Failed to create image blob');
            }

            // If already under target, return it
            if (blob.size <= targetBytes) {
              return blob;
            }

            // Binary search for optimal quality
            while (attempts < maxAttempts && maxQuality - minQuality > 0.01) {
              currentQuality = (minQuality + maxQuality) / 2;
              blob = await tryQuality(currentQuality);
              
              if (!blob) {
                throw new Error('Failed to create image blob during compression');
              }

              const tolerance = targetBytes * 0.05; // 5% tolerance
              
              if (Math.abs(blob.size - targetBytes) <= tolerance) {
                // Close enough to target
                return blob;
              }

              if (blob.size > targetBytes) {
                // Too large, reduce quality
                maxQuality = currentQuality;
              } else {
                // Too small, increase quality
                minQuality = currentQuality;
                bestBlob = blob; // Keep this as best so far
              }

              attempts++;
            }

            // Return best blob found
            return bestBlob || blob;
          };

          findQuality()
            .then((blob) => {
              onProgress?.(100);
              if (blob && blob.size > 0) {
                resolve(blob);
              } else {
                reject(new Error('Failed to compress to target size. Try a larger target size or different image.'));
              }
            })
            .catch((error) => {
              reject(new Error(`Failed to create compressed image: ${error.message}`));
            });
        } else {
          // Standard resize with quality setting
          const quality = getQualityValue(options.quality);
          const mimeType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
          
          canvas.toBlob(
            (blob) => {
              onProgress?.(100);
              if (blob && blob.size > 0) {
                resolve(blob);
              } else {
                reject(new Error('Failed to create resized image. Please try again.'));
              }
            },
            mimeType,
            quality
          );
        }
      } catch (error: any) {
        reject(new Error(`Image processing failed: ${error.message || 'Unknown error'}`));
      }
    };

    // Start reading the file
    try {
      reader.readAsDataURL(file);
    } catch (error: any) {
      reject(new Error(`Failed to read file: ${error.message || 'Unknown error'}`));
    }
  });
}
