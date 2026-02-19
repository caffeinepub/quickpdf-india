import { useState } from 'react';
import { Seo } from '@/components/seo/Seo';
import { ToolExperience } from '@/components/tools/ToolExperience';
import { RelatedToolsLinks } from '@/components/seo/RelatedToolsLinks';
import { ToolFaq } from '@/components/faq/ToolFaq';
import { ToolPageShell } from '@/components/tools/ToolPageShell';
import { useToolJob } from '@/hooks/useToolJob';
import { useScrollToTop } from '@/hooks/useScrollToTop';
import { pdfToWordProcessor } from '@/components/tools/processors/conversion';
import { normalizeToolError } from '@/components/tools/toolError';
import { ToolPrimaryActionButton } from '@/components/tools/ToolPrimaryActionButton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info, FileText } from 'lucide-react';

export default function PdfToWordPage() {
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
          'pdf-to-word',
          'validation'
        )
      );
      return;
    }

    job.startProcessing();

    try {
      const resultBlob = await pdfToWordProcessor(selectedFiles[0], {
        onProgress: (percentage) => job.updateProgress(percentage),
      });

      const fileName = selectedFiles[0].name.replace(/\.pdf$/i, '.docx');
      job.completeProcessing(fileName, resultBlob);
    } catch (error) {
      job.setError(normalizeToolError(error, 'pdf-to-word', 'processing'));
    }
  };

  const handleStartOver = () => {
    setSelectedFiles([]);
    job.reset();
  };

  const faqs = [
    {
      question: 'What types of PDFs can be converted?',
      answer:
        'This tool works best with text-based PDFs. Scanned PDFs (images) and PDFs with complex layouts may not convert accurately.',
    },
    {
      question: 'Will the formatting be preserved?',
      answer:
        'This tool provides basic text extraction. Simple text formatting is preserved, but complex layouts, images, tables, and special formatting may not be accurately converted.',
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
        title="Convert PDF to Word Online"
        description="Convert PDF files to Word documents online for free. Turn PDFs into editable DOCX files instantly."
      />
      <ToolPageShell
        title="Convert PDF to Word"
        description="Convert PDF files to editable Word documents. Extract text from your PDFs and create DOCX files. All processing happens securely in your browser."
      >
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            This tool provides basic text extraction from PDFs. Complex layouts, images, and tables may not be accurately converted.
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
              icon={FileText}
              className="w-full"
            >
              Convert to Word
            </ToolPrimaryActionButton>
          )}
        </ToolExperience>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <ToolFaq faqs={faqs} />
          </div>
          <div>
            <RelatedToolsLinks
              currentToolId="pdf-to-word"
              relatedToolIds={['word-to-pdf', 'compress-pdf', 'split-pdf']}
            />
          </div>
        </div>
      </ToolPageShell>
    </>
  );
}
