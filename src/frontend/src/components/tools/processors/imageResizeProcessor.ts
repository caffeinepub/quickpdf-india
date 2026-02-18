export interface ImageResizeOptions {
  mode: 'pixels' | 'percentage' | 'target-size';
  width?: number;
  height?: number;
  percentage?: number;
  targetSizeKB?: number;
  maintainAspectRatio?: boolean;
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

        if (options.mode === 'pixels') {
          if (options.width) targetWidth = options.width;
          if (options.height) targetHeight = options.height;
          if (options.maintainAspectRatio && options.width && !options.height) {
            targetHeight = (img.height * options.width) / img.width;
          } else if (options.maintainAspectRatio && options.height && !options.width) {
            targetWidth = (img.width * options.height) / img.height;
          }
        } else if (options.mode === 'percentage' && options.percentage) {
          const scale = options.percentage / 100;
          targetWidth = img.width * scale;
          targetHeight = img.height * scale;
        }

        onProgress?.(50);

        const canvas = document.createElement('canvas');
        canvas.width = targetWidth;
        canvas.height = targetHeight;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get canvas context. Your browser may not support this feature.'));
          return;
        }

        ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

        onProgress?.(70);

        if (options.mode === 'target-size' && options.targetSizeKB) {
          // Binary search for quality to meet target size
          let quality = 0.9;
          let attempts = 0;
          const maxAttempts = 10;

          const tryQuality = (q: number) => {
            return new Promise<Blob | null>((res) => {
              canvas.toBlob(
                (blob) => res(blob),
                'image/jpeg',
                q
              );
            });
          };

          const findQuality = async () => {
            while (attempts < maxAttempts) {
              const blob = await tryQuality(quality);
              if (!blob) break;

              const sizeKB = blob.size / 1024;
              if (Math.abs(sizeKB - options.targetSizeKB!) < options.targetSizeKB! * 0.1) {
                return blob;
              }

              if (sizeKB > options.targetSizeKB!) {
                quality -= 0.1;
              } else {
                quality += 0.05;
              }

              attempts++;
            }
            return await tryQuality(quality);
          };

          findQuality().then((blob) => {
            onProgress?.(100);
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Failed to compress to target size. Try a different target size or image.'));
            }
          }).catch((error) => {
            reject(new Error(`Failed to create compressed image: ${error.message}`));
          });
        } else {
          canvas.toBlob(
            (blob) => {
              onProgress?.(100);
              if (blob) {
                resolve(blob);
              } else {
                reject(new Error('Failed to create resized image. Please try again.'));
              }
            },
            file.type,
            0.9
          );
        }
      } catch (error) {
        reject(error instanceof Error ? error : new Error('Failed to resize image. Please try again.'));
      }
    };

    // Start reading the file
    try {
      reader.readAsDataURL(file);
    } catch (error) {
      reject(new Error('Failed to start reading file. Please try again.'));
    }
  });
}
