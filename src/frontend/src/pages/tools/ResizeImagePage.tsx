import { useState, useEffect } from 'react';
import { Seo } from '@/components/seo/Seo';
import { ToolExperience } from '@/components/tools/ToolExperience';
import { RelatedToolsLinks } from '@/components/seo/RelatedToolsLinks';
import { ToolFaq } from '@/components/faq/ToolFaq';
import { useToolJob } from '@/hooks/useToolJob';
import { useScrollToTop } from '@/hooks/useScrollToTop';
import { ImageResizeOptions } from '@/components/tools/image/ImageResizeOptions';
import { resizeImage, ImageResizeOptions as ResizeOptions } from '@/components/tools/processors/imageResizeProcessor';
import { normalizeToolError } from '@/components/tools/toolError';

const MAX_FILE_SIZE_MB = 5;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'];

export default function ResizeImagePage() {
  useScrollToTop();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [outputPreviewUrl, setOutputPreviewUrl] = useState<string | null>(null);
  const [originalDimensions, setOriginalDimensions] = useState<{ width: number; height: number } | null>(null);
  const [outputDimensions, setOutputDimensions] = useState<{ width: number; height: number; size: number } | null>(null);
  const job = useToolJob();

  // Create preview URL and get dimensions when file is selected
  useEffect(() => {
    if (selectedFiles.length > 0) {
      // Revoke previous URL to prevent memory leaks
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      
      const url = URL.createObjectURL(selectedFiles[0]);
      setPreviewUrl(url);
      
      // Load image to get dimensions
      const img = new Image();
      img.onload = () => {
        setOriginalDimensions({ width: img.width, height: img.height });
      };
      img.src = url;
      
      // Cleanup on unmount or when file changes
      return () => {
        URL.revokeObjectURL(url);
      };
    } else {
      // Clear preview when no files
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      setPreviewUrl(null);
      setOriginalDimensions(null);
    }
  }, [selectedFiles]);

  // Create output preview when processing completes
  useEffect(() => {
    if (job.resultFile) {
      // Revoke previous output URL
      if (outputPreviewUrl) {
        URL.revokeObjectURL(outputPreviewUrl);
      }
      
      const url = URL.createObjectURL(job.resultFile.blob);
      setOutputPreviewUrl(url);
      
      // Load image to get output dimensions
      const img = new Image();
      img.onload = () => {
        setOutputDimensions({ 
          width: img.width, 
          height: img.height,
          size: job.resultFile!.blob.size 
        });
      };
      img.src = url;
      
      return () => {
        URL.revokeObjectURL(url);
      };
    } else {
      if (outputPreviewUrl) {
        URL.revokeObjectURL(outputPreviewUrl);
      }
      setOutputPreviewUrl(null);
      setOutputDimensions(null);
    }
  }, [job.resultFile]);

  const validateFile = (file: File): string | null => {
    // Check if file exists
    if (!file) {
      return 'No file selected. Please choose an image file.';
    }

    // Check file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return `Unsupported file type. Please select a JPEG, PNG, or WEBP image. Selected type: ${file.type || 'unknown'}`;
    }

    // Check file size (5MB limit)
    if (file.size > MAX_FILE_SIZE_BYTES) {
      const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
      return `File size (${fileSizeMB}MB) exceeds the ${MAX_FILE_SIZE_MB}MB limit. Please use a smaller image.`;
    }

    return null;
  };

  const handleFilesSelected = (files: File[]) => {
    const file = files[0];
    
    // Validate file
    const validationError = validateFile(file);
    if (validationError) {
      job.setError(
        normalizeToolError(
          new Error(validationError),
          'resize-image',
          'validation'
        )
      );
      return;
    }

    setSelectedFiles(files);
    setOutputPreviewUrl(null);
    setOutputDimensions(null);
    job.reset();
  };

  const handleRemoveFile = () => {
    // Revoke object URLs to prevent memory leak
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    if (outputPreviewUrl) {
      URL.revokeObjectURL(outputPreviewUrl);
    }
    setSelectedFiles([]);
    setPreviewUrl(null);
    setOutputPreviewUrl(null);
    setOriginalDimensions(null);
    setOutputDimensions(null);
    job.reset();
  };

  const handleProcess = async (options: ResizeOptions) => {
    if (selectedFiles.length === 0) {
      job.setError(
        normalizeToolError(
          new Error('Please select an image file to resize.'),
          'resize-image',
          'validation'
        )
      );
      return;
    }

    // Re-validate before processing
    const validationError = validateFile(selectedFiles[0]);
    if (validationError) {
      job.setError(
        normalizeToolError(
          new Error(validationError),
          'resize-image',
          'validation'
        )
      );
      return;
    }

    try {
      job.startProcessing();

      const resultBlob = await resizeImage(selectedFiles[0], options, (progress) => {
        job.updateProgress(progress);
      });

      // Determine output extension based on mode and format
      let extension = selectedFiles[0].name.split('.').pop() || 'jpg';
      if (options.mode === 'target-size') {
        // Target size mode uses JPEG for better compression
        extension = 'jpg';
      }
      
      const baseName = selectedFiles[0].name.replace(/\.[^/.]+$/, '');
      const outputFileName = `${baseName}_resized.${extension}`;

      job.completeProcessing(outputFileName, resultBlob);
    } catch (error) {
      job.setError(
        normalizeToolError(error, 'resize-image', 'processing')
      );
    }
  };

  const handleStartOver = () => {
    // Revoke object URLs to prevent memory leak
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    if (outputPreviewUrl) {
      URL.revokeObjectURL(outputPreviewUrl);
    }
    setSelectedFiles([]);
    setPreviewUrl(null);
    setOutputPreviewUrl(null);
    setOriginalDimensions(null);
    setOutputDimensions(null);
    job.reset();
  };

  const faqItems = [
    {
      question: 'What image formats are supported?',
      answer:
        'We support JPEG, PNG, and WEBP image formats. You can upload images up to 5MB in size.',
    },
    {
      question: 'How does the target size mode work?',
      answer:
        'Target size mode automatically adjusts the image quality to reach your desired file size (in KB or MB). It uses an intelligent compression algorithm to find the optimal balance between quality and file size.',
    },
    {
      question: 'Will resizing affect image quality?',
      answer:
        'When resizing by pixels or percentage, quality is preserved as much as possible. Target size mode may reduce quality to achieve the desired file size. You can control the quality level (low, medium, high) for all modes.',
    },
    {
      question: 'Is my image secure?',
      answer:
        'Yes! All processing happens entirely in your browser. Your image never leaves your device, ensuring complete privacy and security.',
    },
  ];

  return (
    <>
      <Seo
        title="Resize Image Online - Change Image Dimensions"
        description="Resize images by pixels, percentage, or target file size. Fast, secure, and free. Supports JPEG, PNG, and WEBP formats."
      />

      <div className="container mx-auto max-w-4xl px-4 py-8">
        <header className="mb-8 text-center">
          <h1 className="mb-4 text-4xl font-bold">Resize Image Online</h1>
          <p className="text-lg text-muted-foreground">
            Resize your images by pixels, percentage, or target file size. All processing happens
            securely in your browser - no uploads required.
          </p>
        </header>

        <ToolExperience
          onFilesSelected={handleFilesSelected}
          acceptedFileTypes={ALLOWED_EXTENSIONS.join(',')}
          maxFiles={1}
          jobStatus={job.jobStatus}
          progress={job.progress}
          resultFile={job.resultFile}
          error={job.error}
          selectedFiles={selectedFiles}
          onRemoveFile={handleRemoveFile}
          onStartOver={handleStartOver}
        >
          {selectedFiles.length > 0 && previewUrl && (
            <div className="space-y-6">
              {/* Original Image Preview */}
              <div className="rounded-lg border border-border bg-card p-4">
                <h3 className="mb-3 text-sm font-medium">Original Image</h3>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                  <img
                    src={previewUrl}
                    alt="Original"
                    className="max-h-48 rounded border border-border object-contain"
                  />
                  {originalDimensions && (
                    <div className="text-sm text-muted-foreground">
                      <p>
                        <strong>Dimensions:</strong> {originalDimensions.width} × {originalDimensions.height}px
                      </p>
                      <p>
                        <strong>Size:</strong> {(selectedFiles[0].size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Resize Options */}
              <ImageResizeOptions
                onProcess={handleProcess}
                originalWidth={originalDimensions?.width}
                originalHeight={originalDimensions?.height}
              />

              {/* Output Preview (after processing) */}
              {outputPreviewUrl && outputDimensions && (
                <div className="rounded-lg border border-border bg-card p-4">
                  <h3 className="mb-3 text-sm font-medium text-green-600">Resized Image</h3>
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                    <img
                      src={outputPreviewUrl}
                      alt="Resized"
                      className="max-h-48 rounded border border-border object-contain"
                    />
                    <div className="text-sm text-muted-foreground">
                      <p>
                        <strong>Dimensions:</strong> {outputDimensions.width} × {outputDimensions.height}px
                      </p>
                      <p>
                        <strong>Size:</strong> {(outputDimensions.size / 1024).toFixed(2)} KB
                      </p>
                      {selectedFiles[0] && (
                        <p className="text-green-600">
                          <strong>Reduction:</strong>{' '}
                          {(((selectedFiles[0].size - outputDimensions.size) / selectedFiles[0].size) * 100).toFixed(1)}%
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </ToolExperience>

        <div className="mt-12 grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <ToolFaq faqs={faqItems} />
          </div>
          <aside>
            <RelatedToolsLinks
              currentToolId="resize-image"
              relatedToolIds={['image-to-pdf', 'compress-pdf']}
            />
          </aside>
        </div>
      </div>
    </>
  );
}
