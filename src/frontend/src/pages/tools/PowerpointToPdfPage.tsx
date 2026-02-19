import { useState } from 'react';
import { Seo } from '@/components/seo/Seo';
import { ToolExperience } from '@/components/tools/ToolExperience';
import { RelatedToolsLinks } from '@/components/seo/RelatedToolsLinks';
import { ToolFaq } from '@/components/faq/ToolFaq';
import { ToolPageShell } from '@/components/tools/ToolPageShell';
import { useToolJob } from '@/hooks/useToolJob';
import { useScrollToTop } from '@/hooks/useScrollToTop';
import { powerpointToPdfProcessor } from '@/components/tools/processors/conversion/powerpointToPdfProcessor';
import { normalizeToolError } from '@/components/tools/toolError';
import { ToolPrimaryActionButton } from '@/components/tools/ToolPrimaryActionButton';
import { Presentation } from 'lucide-react';

export default function PowerpointToPdfPage() {
  useScrollToTop();
  const job = useToolJob();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

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
          new Error('Please select a PowerPoint file.'),
          'powerpoint-to-pdf',
          'validation'
        )
      );
      return;
    }

    job.startProcessing();

    try {
      const resultBlob = await powerpointToPdfProcessor(selectedFiles[0], {
        onProgress: (percentage) => job.updateProgress(percentage),
      });

      const fileName = selectedFiles[0].name.replace(/\.(pptx?|PPTX?)$/i, '.pdf');
      job.completeProcessing(fileName, resultBlob);
    } catch (error) {
      job.setError(normalizeToolError(error, 'powerpoint-to-pdf', 'processing'));
    }
  };

  const handleStartOver = () => {
    setSelectedFiles([]);
    job.reset();
  };

  const faqs = [
    {
      question: 'What PowerPoint versions are supported?',
      answer:
        'This tool supports both .pptx (PowerPoint 2007 and later) and .ppt (PowerPoint 97-2003) file formats.',
    },
    {
      question: 'Will slide quality be maintained?',
      answer:
        'Yes! Each slide is rendered at high resolution to ensure your presentation looks professional in PDF format.',
    },
    {
      question: 'What happens to animations and transitions?',
      answer:
        'Animations and transitions are not included in the PDF. The PDF will show the final state of each slide with all content visible.',
    },
    {
      question: 'Are embedded media files included?',
      answer:
        'Static images are preserved in the PDF. Videos and audio files cannot be embedded in PDFs and will appear as static frames or placeholders.',
    },
    {
      question: 'Is there a file size limit?',
      answer: 'You can convert PowerPoint files up to 10MB in size for optimal browser performance.',
    },
    {
      question: 'Is my presentation secure?',
      answer:
        'Yes! All conversion happens entirely in your browser. Your presentation never leaves your device, ensuring complete privacy and security.',
    },
  ];

  return (
    <>
      <Seo
        title="Convert PowerPoint to PDF Online Free"
        description="Convert PowerPoint presentations to PDF format online for free. Turn .pptx and .ppt files into PDF documents instantly."
      />
      <ToolPageShell
        title="PowerPoint to PDF Converter"
        description="Convert PowerPoint presentations to PDF documents. Transform your .pptx and .ppt files into shareable PDF format. All processing happens securely in your browser."
      >
        <ToolExperience
          onFilesSelected={handleFilesSelected}
          acceptedFileTypes=".pptx,.ppt"
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
            <ToolPrimaryActionButton
              onClick={handleProcess}
              icon={Presentation}
              className="w-full"
            >
              Convert to PDF
            </ToolPrimaryActionButton>
          )}
        </ToolExperience>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <ToolFaq faqs={faqs} />
          </div>
          <div>
            <RelatedToolsLinks
              currentToolId="powerpoint-to-pdf"
              relatedToolIds={['pdf-to-powerpoint', 'word-to-pdf', 'excel-to-pdf']}
            />
          </div>
        </div>
      </ToolPageShell>
    </>
  );
}
