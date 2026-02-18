import { useState, useEffect } from 'react';
import { Seo } from '@/components/seo/Seo';
import { ToolExperience } from '@/components/tools/ToolExperience';
import { RelatedToolsLinks } from '@/components/seo/RelatedToolsLinks';
import { ToolFaq } from '@/components/faq/ToolFaq';
import { useToolJob } from '@/hooks/useToolJob';
import { ImageResizeOptions } from '@/components/tools/image/ImageResizeOptions';
import { resizeImage, ImageResizeOptions as ResizeOptions } from '@/components/tools/processors/imageResizeProcessor';
import { normalizeToolError } from '@/components/tools/toolError';

const MAX_FILE_SIZE_MB = 5;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'];

export default function ResizeImagePage() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [outputPreviewUrl, setOutputPreviewUrl] = useState<string | null>(null);
  const [originalDimensions, setOriginalDimensions] = useState<{ width: number; height: number } | null>(null);
  const [outputDimensions, setOutputDimensions] = useState<{ width: number; height: number; size: number } | null>(null);
  const job = useToolJob();

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

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

  const faqs = [
    {
      question: 'What image formats are supported?',
      answer: 'We support JPEG, PNG, and WEBP image formats for the best quality and compatibility.',
    },
    {
      question: 'What is the maximum file size?',
      answer: `The maximum file size is ${MAX_FILE_SIZE_MB}MB. If your image is larger, please compress it first or use a smaller image.`,
    },
    {
      question: 'How do I resize an image to a specific KB size?',
      answer:
        'Use the "Target Size" option and enter your desired file size in KB or MB. Our tool will automatically compress the image to meet that size with a ±5% tolerance.',
    },
    {
      question: 'Will resizing affect image quality?',
      answer:
        'Some quality loss may occur when significantly reducing size. Use the quality selector (Low/Medium/High) to control the balance between file size and quality.',
    },
    {
      question: 'Can I resize multiple images at once?',
      answer: 'Currently, you can resize one image at a time for the best results.',
    },
    {
      question: 'What does "maintain aspect ratio" mean?',
      answer: 'When enabled, the image proportions stay the same, preventing distortion. If you enter a width, the height is calculated automatically to keep the original shape.',
    },
  ];

  const isProcessing = job.jobStatus === 'processing' || job.jobStatus === 'uploading';

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <>
      <Seo
        title="Resize Image Online"
        description="Resize and compress images online for free. Change dimensions by pixels, percentage, or target file size. Perfect for web and mobile."
      />
      <div className="container py-12">
        <div className="mx-auto max-w-4xl space-y-12">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold">Resize Image Online</h1>
            <p className="text-lg text-muted-foreground">
              Resize images by pixels, percentage, or compress to a specific file size. Perfect for
              profile pictures, website images, and meeting file size requirements.
            </p>
          </div>

          <ToolExperience
            onFilesSelected={handleFilesSelected}
            acceptedFileTypes={ALLOWED_EXTENSIONS.join(',')}
            maxFiles={1}
            fileType="image"
            maxFileSizeBytes={MAX_FILE_SIZE_BYTES}
            jobStatus={job.jobStatus}
            progress={job.progress}
            resultFile={job.resultFile}
            error={job.error}
            selectedFiles={selectedFiles}
            onRemoveFile={handleRemoveFile}
            onStartOver={handleStartOver}
          >
            {selectedFiles.length > 0 && job.jobStatus === 'idle' && (
              <div className="space-y-6">
                {/* Original Image Preview */}
                {previewUrl && originalDimensions && (
                  <div className="rounded-lg border border-border bg-muted/30 p-4">
                    <h3 className="mb-3 text-sm font-semibold">Original Image</h3>
                    <div className="flex justify-center">
                      <img
                        src={previewUrl}
                        alt="Original image preview"
                        className="max-h-64 rounded-lg object-contain"
                      />
                    </div>
                    <div className="mt-3 text-center space-y-1">
                      <p className="text-sm font-medium">
                        {originalDimensions.width} × {originalDimensions.height} px
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {selectedFiles[0].name} • {formatFileSize(selectedFiles[0].size)}
                      </p>
                    </div>
                  </div>
                )}

                {/* Resize Options */}
                <ImageResizeOptions
                  onProcess={handleProcess}
                  disabled={isProcessing}
                  isLoading={isProcessing}
                  originalWidth={originalDimensions?.width}
                  originalHeight={originalDimensions?.height}
                />
              </div>
            )}

            {/* Output Preview - shown after processing */}
            {job.jobStatus === 'done' && outputPreviewUrl && outputDimensions && (
              <div className="rounded-lg border border-primary/30 bg-primary/5 p-4">
                <h3 className="mb-3 text-sm font-semibold text-primary">Resized Image</h3>
                <div className="flex justify-center">
                  <img
                    src={outputPreviewUrl}
                    alt="Resized image preview"
                    className="max-h-64 rounded-lg object-contain"
                  />
                </div>
                <div className="mt-3 text-center space-y-1">
                  <p className="text-sm font-medium">
                    {outputDimensions.width} × {outputDimensions.height} px
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(outputDimensions.size)}
                  </p>
                  {originalDimensions && (
                    <p className="text-xs text-primary font-medium">
                      Size reduced by {(((selectedFiles[0].size - outputDimensions.size) / selectedFiles[0].size) * 100).toFixed(1)}%
                    </p>
                  )}
                </div>
              </div>
            )}
          </ToolExperience>

          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <ToolFaq faqs={faqs} />
            </div>
            <div>
              <RelatedToolsLinks
                currentToolId="resize-image"
                relatedToolIds={['image-to-pdf', 'compress-pdf']}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
