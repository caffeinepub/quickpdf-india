import { useState } from 'react';
import { Seo } from '@/components/seo/Seo';
import { ToolExperience } from '@/components/tools/ToolExperience';
import { RelatedToolsLinks } from '@/components/seo/RelatedToolsLinks';
import { ToolFaq } from '@/components/faq/ToolFaq';
import { ToolPageShell } from '@/components/tools/ToolPageShell';
import { useToolJob } from '@/hooks/useToolJob';
import { useScrollToTop } from '@/hooks/useScrollToTop';
import { pdfToPowerpointProcessor } from '@/components/tools/processors/conversion/pdfToPowerpointProcessor';
import { normalizeToolError } from '@/components/tools/toolError';
import { ToolPrimaryActionButton } from '@/components/tools/ToolPrimaryActionButton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info, Presentation } from 'lucide-react';

export default function PdfToPowerpointPage() {
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
          new Error('Please select a PDF file.'),
          'pdf-to-powerpoint',
          'validation'
        )
      );
      return;
    }

    job.startProcessing();

    try {
      const resultBlob = await pdfToPowerpointProcessor(selectedFiles[0], {
        onProgress: (percentage) => job.updateProgress(percentage),
      });

      const fileName = selectedFiles[0].name.replace(/\.pdf$/i, '.pptx');
      job.completeProcessing(fileName, resultBlob);
    } catch (error) {
      job.setError(normalizeToolError(error, 'pdf-to-powerpoint', 'processing'));
    }
  };

  const handleStartOver = () => {
    setSelectedFiles([]);
    job.reset();
  };

  const faqs = [
    {
      question: 'How does the conversion work?',
      answer:
        'Each page of your PDF is converted into a separate PowerPoint slide. The page is rendered as a high-quality image and placed on the slide.',
    },
    {
      question: 'Will the content be editable?',
      answer:
        'The slides will contain images of the PDF pages. Text and other elements are not directly editable, but you can add new text boxes, shapes, and annotations in PowerPoint.',
    },
    {
      question: 'Is the page layout preserved?',
      answer:
        'Yes! Each PDF page is converted to maintain its original aspect ratio and appearance on the PowerPoint slide.',
    },
    {
      question: 'Can I edit the resulting presentation?',
      answer:
        'Yes! The resulting .pptx file can be opened and edited in PowerPoint. You can add new slides, annotations, and make any changes you need.',
    },
    {
      question: 'Is there a file size limit?',
      answer: 'You can convert PDF files up to 10MB in size for optimal browser performance.',
    },
    {
      question: 'Is my document secure?',
      answer:
        'Yes! All conversion happens entirely in your browser. Your document never leaves your device, ensuring complete privacy and security.',
    },
  ];

  return (
    <>
      <Seo
        title="Convert PDF to PowerPoint Online Free"
        description="Convert PDF files to PowerPoint presentations online for free. Turn PDF pages into editable .pptx slides instantly."
      />
      <ToolPageShell
        title="PDF to PowerPoint Converter"
        description="Convert PDF documents to PowerPoint presentations. Transform your PDF pages into editable PowerPoint slides. All processing happens securely in your browser."
      >
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            Each PDF page becomes a slide with the page rendered as an image. You can then edit and enhance the presentation in PowerPoint.
          </AlertDescription>
        </Alert>

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
            <ToolPrimaryActionButton
              onClick={handleProcess}
              icon={Presentation}
              className="w-full"
            >
              Convert to PowerPoint
            </ToolPrimaryActionButton>
          )}
        </ToolExperience>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <ToolFaq faqs={faqs} />
          </div>
          <div>
            <RelatedToolsLinks
              currentToolId="pdf-to-powerpoint"
              relatedToolIds={['powerpoint-to-pdf', 'pdf-to-word', 'pdf-to-excel']}
            />
          </div>
        </div>
      </ToolPageShell>
    </>
  );
}
