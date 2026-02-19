import { useState } from 'react';
import { Seo } from '@/components/seo/Seo';
import { ToolExperience } from '@/components/tools/ToolExperience';
import { ResizePdfOptions } from '@/components/tools/pdf/ResizePdfOptions';
import { RelatedToolsLinks } from '@/components/seo/RelatedToolsLinks';
import { ToolFaq } from '@/components/faq/ToolFaq';
import { ToolPageShell } from '@/components/tools/ToolPageShell';
import { useToolJob } from '@/hooks/useToolJob';
import { useScrollToTop } from '@/hooks/useScrollToTop';
import { resizePdfProcessor, PageSize } from '@/components/tools/processors/pdf';
import { normalizeToolError } from '@/components/tools/toolError';
import { ToolPrimaryActionButton } from '@/components/tools/ToolPrimaryActionButton';
import { Maximize2 } from 'lucide-react';

export function ResizePdfPage() {
  useScrollToTop();
  const job = useToolJob();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [targetSize, setTargetSize] = useState<PageSize>('A4');

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
          'resize-pdf',
          'validation'
        )
      );
      return;
    }

    job.startProcessing();

    try {
      const resultBlob = await resizePdfProcessor(selectedFiles[0], {
        targetSize,
        onProgress: (percentage) => job.updateProgress(percentage),
      });

      const outputName = selectedFiles[0].name.replace(/\.pdf$/i, `_${targetSize}.pdf`);
      job.completeProcessing(outputName, resultBlob);
    } catch (error) {
      job.setError(normalizeToolError(error, 'resize-pdf', 'processing'));
    }
  };

  const handleStartOver = () => {
    setSelectedFiles([]);
    job.reset();
  };

  const faqItems = [
    {
      question: 'What page sizes are supported?',
      answer:
        'We support standard page sizes including A4, Letter, Legal, A3, and A5. Your PDF content will be automatically scaled to fit the selected size while maintaining aspect ratio.',
    },
    {
      question: 'Will my content be distorted?',
      answer:
        'No, content is scaled proportionally to fit the new page size and centered on the page. The aspect ratio is preserved to prevent distortion.',
    },
    {
      question: 'How does browser-based resizing work?',
      answer:
        'All processing happens securely in your browser using the pdf-lib library. Your files never leave your device, ensuring complete privacy.',
    },
  ];

  return (
    <>
      <Seo
        title="Resize PDF Pages Online - Change PDF Page Dimensions"
        description="Change your PDF page dimensions to standard sizes like A4, Letter, or Legal. Content is automatically scaled to fit. All processing happens securely in your browser."
      />

      <ToolPageShell
        title="Resize PDF Pages Online"
        description="Change your PDF page dimensions to standard sizes like A4, Letter, or Legal. Content is automatically scaled to fit. All processing happens securely in your browser."
      >
        <ToolExperience
          onFilesSelected={handleFilesSelected}
          acceptedFileTypes=".pdf"
          maxFiles={1}
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
              <ResizePdfOptions value={targetSize} onChange={setTargetSize} />
              <ToolPrimaryActionButton
                onClick={handleProcess}
                icon={Maximize2}
                className="w-full"
              >
                Resize PDF to {targetSize}
              </ToolPrimaryActionButton>
            </div>
          )}
        </ToolExperience>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <ToolFaq faqs={faqItems} />
          </div>
          <aside>
            <RelatedToolsLinks
              currentToolId="resize-pdf"
              relatedToolIds={['compress-pdf', 'merge-pdf', 'split-pdf']}
            />
          </aside>
        </div>
      </ToolPageShell>
    </>
  );
}

export default ResizePdfPage;
