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
  const job = useToolJob();

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Create preview URL when file is selected
  useEffect(() => {
    if (selectedFiles.length > 0) {
      // Revoke previous URL to prevent memory leaks
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      
      const url = URL.createObjectURL(selectedFiles[0]);
      setPreviewUrl(url);
      
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
    }
  }, [selectedFiles]);

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
    job.reset();
  };

  const handleRemoveFile = () => {
    // Revoke object URL to prevent memory leak
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFiles([]);
    setPreviewUrl(null);
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

      const extension = selectedFiles[0].name.split('.').pop();
      job.completeProcessing(`resized.${extension}`, resultBlob);
    } catch (error) {
      job.setError(
        normalizeToolError(error, 'resize-image', 'processing')
      );
    }
  };

  const handleStartOver = () => {
    // Revoke object URL to prevent memory leak
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFiles([]);
    setPreviewUrl(null);
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
        'Use the "Target Size" option and enter your desired file size in KB. Our tool will automatically compress the image to meet that size.',
    },
    {
      question: 'Will resizing affect image quality?',
      answer:
        'Some quality loss may occur when significantly reducing size. We use smart compression to maintain the best quality possible.',
    },
    {
      question: 'Can I resize multiple images at once?',
      answer: 'Currently, you can resize one image at a time for the best results.',
    },
  ];

  const isProcessing = job.jobStatus === 'processing' || job.jobStatus === 'uploading';

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
                {/* Image Preview */}
                {previewUrl && (
                  <div className="rounded-lg border border-border bg-muted/30 p-4">
                    <h3 className="mb-3 text-sm font-semibold">Preview</h3>
                    <div className="flex justify-center">
                      <img
                        src={previewUrl}
                        alt="Selected image preview"
                        className="max-h-64 rounded-lg object-contain"
                      />
                    </div>
                    <p className="mt-3 text-center text-xs text-muted-foreground">
                      {selectedFiles[0].name} • {(selectedFiles[0].size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                )}

                {/* Resize Options */}
                <ImageResizeOptions
                  onProcess={handleProcess}
                  disabled={isProcessing}
                  isLoading={isProcessing}
                />
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
