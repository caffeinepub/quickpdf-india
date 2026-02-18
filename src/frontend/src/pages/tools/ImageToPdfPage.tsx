import { useState } from 'react';
import { Seo } from '@/components/seo/Seo';
import { ToolExperience } from '@/components/tools/ToolExperience';
import { RelatedToolsLinks } from '@/components/seo/RelatedToolsLinks';
import { ToolFaq } from '@/components/faq/ToolFaq';
import { ToolPageShell } from '@/components/tools/ToolPageShell';
import { useToolJob } from '@/hooks/useToolJob';
import { imageToPdfProcessor } from '@/components/tools/processors/pdf';
import { normalizeToolError } from '@/components/tools/toolError';
import { ImageToPdfOptions, ImageToPdfConfig } from '@/components/tools/pdf/ImageToPdfOptions';
import { ToolPrimaryActionButton } from '@/components/tools/ToolPrimaryActionButton';
import { FileText } from 'lucide-react';

export default function ImageToPdfPage() {
  const job = useToolJob();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [config, setConfig] = useState<ImageToPdfConfig>({
    pageSize: 'A4',
    fitMode: 'fit',
    margin: 36,
  });

  const handleFilesSelected = (files: File[]) => {
    setSelectedFiles(files);
    job.reset();
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleProcess = async () => {
    if (selectedFiles.length === 0) {
      job.setError(
        normalizeToolError(
          new Error('Please select at least one image file.'),
          'image-to-pdf',
          'validation'
        )
      );
      return;
    }

    job.startProcessing();

    try {
      const resultBlob = await imageToPdfProcessor(selectedFiles, {
        pageSize: config.pageSize,
        fitMode: config.fitMode,
        margin: config.margin,
        onProgress: (percentage) => job.updateProgress(percentage),
      });

      job.completeProcessing('images.pdf', resultBlob);
    } catch (error) {
      job.setError(normalizeToolError(error, 'image-to-pdf', 'processing'));
    }
  };

  const handleStartOver = () => {
    setSelectedFiles([]);
    job.reset();
  };

  const faqs = [
    {
      question: 'What image formats are supported?',
      answer:
        'We support JPEG and PNG image formats. You can upload multiple images and they will be converted into a single PDF document.',
    },
    {
      question: 'How are multiple images arranged in the PDF?',
      answer:
        'Each image is placed on a separate page in the PDF. You can choose the page size (A4 or Letter) and how images should fit on each page.',
    },
    {
      question: 'Will the image quality be preserved?',
      answer:
        'Yes, images are embedded in the PDF without compression or quality loss. The original image quality is maintained.',
    },
    {
      question: 'What do the fit modes mean?',
      answer:
        'Fit mode scales images to fit within the page while preserving aspect ratio. Fill mode fills the entire page (may crop). Original size keeps the image dimensions unchanged (within page bounds).',
    },
  ];

  return (
    <>
      <Seo
        title="Convert Images to PDF Online"
        description="Convert JPG, PNG images to PDF for free. Fast, secure, and easy to use. No registration required."
      />
      <ToolPageShell
        title="Convert Images to PDF Online"
        description="Convert your images (JPG, PNG) into a PDF document. Upload multiple images to create a multi-page PDF with customizable page size and layout options. All processing happens securely in your browser."
      >
        <ToolExperience
          onFilesSelected={handleFilesSelected}
          acceptedFileTypes=".jpg,.jpeg,.png"
          maxFiles={20}
          jobStatus={job.jobStatus}
          progress={job.progress}
          resultFile={job.resultFile}
          error={job.error}
          selectedFiles={selectedFiles}
          onRemoveFile={handleRemoveFile}
          onStartOver={handleStartOver}
        >
          {selectedFiles.length > 0 && (
            <div className="space-y-4">
              <ImageToPdfOptions value={config} onChange={setConfig} />
              <ToolPrimaryActionButton
                onClick={handleProcess}
                icon={FileText}
                className="w-full"
              >
                Convert {selectedFiles.length} Image{selectedFiles.length > 1 ? 's' : ''} to PDF
              </ToolPrimaryActionButton>
            </div>
          )}
        </ToolExperience>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <ToolFaq faqs={faqs} />
          </div>
          <div>
            <RelatedToolsLinks
              currentToolId="image-to-pdf"
              relatedToolIds={['merge-pdf', 'compress-pdf', 'resize-image']}
            />
          </div>
        </div>
      </ToolPageShell>
    </>
  );
}
