import { useState } from 'react';
import { Seo } from '@/components/seo/Seo';
import { ToolExperience } from '@/components/tools/ToolExperience';
import { RelatedToolsLinks } from '@/components/seo/RelatedToolsLinks';
import { ToolFaq } from '@/components/faq/ToolFaq';
import { ToolPageShell } from '@/components/tools/ToolPageShell';
import { useToolJob } from '@/hooks/useToolJob';
import { addWatermarkProcessor } from '@/components/tools/processors/pdf';
import { normalizeToolError } from '@/components/tools/toolError';
import { WatermarkOptions, WatermarkConfig } from '@/components/tools/pdf/WatermarkOptions';
import { WatermarkPreview } from '@/components/tools/pdf/WatermarkPreview';
import { ToolPrimaryActionButton } from '@/components/tools/ToolPrimaryActionButton';
import { Droplet } from 'lucide-react';

export default function AddWatermarkPage() {
  const job = useToolJob();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [watermarkConfig, setWatermarkConfig] = useState<WatermarkConfig>({
    text: '',
    opacity: 0.3,
    fontSize: 48,
    rotation: -45,
    position: 'center',
    fontStyle: 'Helvetica',
  });

  const handleFilesSelected = (files: File[]) => {
    setSelectedFiles(files);
    job.reset();
  };

  const handleRemoveFile = () => {
    setSelectedFiles([]);
  };

  const handleProcess = async () => {
    if (selectedFiles.length === 0) {
      job.setError(
        normalizeToolError(
          new Error('Please select a PDF file.'),
          'add-watermark',
          'validation'
        )
      );
      return;
    }

    if (!watermarkConfig.text.trim()) {
      job.setError(
        normalizeToolError(
          new Error('Please enter watermark text.'),
          'add-watermark',
          'validation'
        )
      );
      return;
    }

    job.startProcessing();

    try {
      const resultBlob = await addWatermarkProcessor(selectedFiles[0], {
        text: watermarkConfig.text,
        opacity: watermarkConfig.opacity,
        fontSize: watermarkConfig.fontSize,
        rotation: watermarkConfig.rotation,
        position: watermarkConfig.position,
        fontStyle: watermarkConfig.fontStyle,
        onProgress: (percentage) => job.updateProgress(percentage),
      });

      job.completeProcessing('watermarked.pdf', resultBlob);
    } catch (error) {
      job.setError(normalizeToolError(error, 'add-watermark', 'processing'));
    }
  };

  const handleStartOver = () => {
    setSelectedFiles([]);
    job.reset();
  };

  const faqs = [
    {
      question: 'How do I add a watermark to my PDF?',
      answer:
        'Upload your PDF, enter your watermark text, and customize the appearance using the opacity, font size, rotation, position, and font style controls. The watermark will be applied to all pages.',
    },
    {
      question: 'Can I customize the watermark appearance?',
      answer:
        'Yes! You can adjust the opacity (0-100%), font size (12-120pt), rotation angle (-180° to 180°), position (center, corners), and font style (Helvetica, Times, Courier). A live preview shows how it will look.',
    },
    {
      question: 'Will the watermark affect my PDF quality?',
      answer:
        'No, the watermark is added as a text layer without affecting the original content quality. All processing happens in your browser for maximum privacy.',
    },
    {
      question: 'Can I position the watermark in different locations?',
      answer:
        'Yes, you can choose from center, top-left, top-right, bottom-left, or bottom-right positions for your watermark.',
    },
  ];

  return (
    <>
      <Seo
        title="Add Watermark to PDF Online"
        description="Add text watermarks to your PDF documents. Fast, secure, and free. No registration required."
      />
      <ToolPageShell
        title="Add Watermark to PDF Online"
        description="Add custom text watermarks to your PDF documents. Perfect for branding, copyright protection, or marking drafts. All processing happens securely in your browser."
      >
        <ToolExperience
          onFilesSelected={handleFilesSelected}
          acceptedFileTypes=".pdf"
          maxFiles={1}
          fileType="conversion"
          jobStatus={job.jobStatus}
          progress={job.progress}
          resultFile={job.resultFile}
          error={job.error}
          selectedFiles={selectedFiles}
          onRemoveFile={handleRemoveFile}
          onStartOver={handleStartOver}
        >
          {selectedFiles.length > 0 && (
            <div className="space-y-6">
              <div className="grid gap-6 lg:grid-cols-2">
                <WatermarkOptions value={watermarkConfig} onChange={setWatermarkConfig} />
                <WatermarkPreview config={watermarkConfig} />
              </div>
              <ToolPrimaryActionButton
                onClick={handleProcess}
                icon={Droplet}
                disabled={!watermarkConfig.text.trim()}
                className="w-full"
              >
                Add Watermark
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
              currentToolId="add-watermark"
              relatedToolIds={['merge-pdf', 'compress-pdf', 'resize-pdf']}
            />
          </div>
        </div>
      </ToolPageShell>
    </>
  );
}
