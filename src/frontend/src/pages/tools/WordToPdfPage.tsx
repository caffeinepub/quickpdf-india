import { useState, useEffect } from 'react';
import { Seo } from '@/components/seo/Seo';
import { ToolExperience } from '@/components/tools/ToolExperience';
import { RelatedToolsLinks } from '@/components/seo/RelatedToolsLinks';
import { ToolFaq } from '@/components/faq/ToolFaq';
import { useToolJob } from '@/hooks/useToolJob';
import { normalizeToolError } from '@/components/tools/toolError';
import { ToolPrimaryActionButton } from '@/components/tools/ToolPrimaryActionButton';
import { FileText } from 'lucide-react';
import { useActor } from '@/hooks/useActor';
import { fileToBase64 } from '@/lib/base64';

const MAX_FILE_SIZE_MB = 10;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

export default function WordToPdfPage() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const job = useToolJob();
  const { actor } = useActor();

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleFilesSelected = (files: File[]) => {
    setSelectedFiles(files);
    job.reset();
  };

  const handleRemoveFile = () => {
    setSelectedFiles([]);
    job.reset();
  };

  const handleConvert = async () => {
    if (selectedFiles.length === 0) {
      job.setError(
        normalizeToolError(
          new Error('Please select a Word document to convert.'),
          'word-to-pdf',
          'validation'
        )
      );
      return;
    }

    const file = selectedFiles[0];

    // Validate file type
    if (!file.name.toLowerCase().endsWith('.docx')) {
      job.setError(
        normalizeToolError(
          new Error('Only .docx files are supported. Please select a valid Word document.'),
          'word-to-pdf',
          'validation'
        )
      );
      return;
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE_BYTES) {
      job.setError(
        normalizeToolError(
          new Error(`File size exceeds ${MAX_FILE_SIZE_MB}MB limit. Please use a smaller file.`),
          'word-to-pdf',
          'validation'
        )
      );
      return;
    }

    if (!actor) {
      job.setError(
        normalizeToolError(
          new Error('Backend connection not available. Please refresh the page and try again.'),
          'word-to-pdf',
          'processing'
        )
      );
      return;
    }

    try {
      job.startProcessing();
      job.updateProgress(10);

      // Convert file to base64
      const base64Data = await fileToBase64(file);
      job.updateProgress(30);

      // Call backend conversion
      const pdfBase64 = await actor.convertWordToPdf(base64Data);
      job.updateProgress(80);

      // Convert base64 response to blob
      const binaryString = atob(pdfBase64);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      const pdfBlob = new Blob([bytes], { type: 'application/pdf' });

      job.updateProgress(100);

      // Generate output filename
      const fileName = file.name.replace(/\.docx$/i, '.pdf');
      job.completeProcessing(fileName, pdfBlob);
    } catch (error: any) {
      console.error('Word to PDF conversion error:', error);
      job.setError(
        normalizeToolError(
          error?.message || error || 'Conversion failed',
          'word-to-pdf',
          'processing'
        )
      );
    }
  };

  const handleStartOver = () => {
    setSelectedFiles([]);
    job.reset();
  };

  const faqs = [
    {
      question: 'What Word formats are supported?',
      answer: 'We support .docx (Word 2007 and later) files.',
    },
    {
      question: 'What is the maximum file size?',
      answer: 'The maximum file size is 10MB for Word to PDF conversion.',
    },
    {
      question: 'How long does conversion take?',
      answer:
        'Conversion typically takes a few seconds depending on the file size and complexity of your document.',
    },
    {
      question: 'Is my document secure?',
      answer:
        'Yes! Your document is processed securely and is not stored on our servers after conversion.',
    },
  ];

  const isProcessing = job.jobStatus === 'processing' || job.jobStatus === 'uploading';
  const canConvert = selectedFiles.length > 0 && job.jobStatus === 'idle';

  return (
    <>
      <Seo
        title="Word to PDF Converter"
        description="Convert Word documents to PDF online for free. Fast, secure, and easy to use."
      />
      <div className="container py-12">
        <div className="mx-auto max-w-4xl space-y-12">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold">Word to PDF Converter</h1>
            <p className="text-lg text-muted-foreground">
              Convert your Word documents (.docx) to PDF format quickly and securely.
            </p>
          </div>

          <ToolExperience
            onFilesSelected={handleFilesSelected}
            acceptedFileTypes=".docx"
            maxFiles={1}
            fileType="conversion"
            maxFileSizeBytes={MAX_FILE_SIZE_BYTES}
            jobStatus={job.jobStatus}
            progress={job.progress}
            resultFile={job.resultFile}
            error={job.error}
            selectedFiles={selectedFiles}
            onRemoveFile={handleRemoveFile}
            onStartOver={handleStartOver}
          >
            {canConvert && (
              <div className="space-y-4 rounded-lg border border-border bg-card p-6">
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">Ready to Convert</h3>
                  <p className="text-sm text-muted-foreground">
                    Click the button below to convert your Word document to PDF.
                  </p>
                </div>
                <ToolPrimaryActionButton
                  onClick={handleConvert}
                  disabled={isProcessing}
                  loading={isProcessing}
                  icon={FileText}
                  size="lg"
                  className="w-full"
                >
                  {isProcessing ? 'Converting...' : 'Convert to PDF'}
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
                currentToolId="word-to-pdf"
                relatedToolIds={['pdf-to-word', 'compress-pdf', 'merge-pdf']}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
