import { useState, useEffect } from 'react';
import { Seo } from '@/components/seo/Seo';
import { ToolExperience } from '@/components/tools/ToolExperience';
import { RelatedToolsLinks } from '@/components/seo/RelatedToolsLinks';
import { ToolFaq } from '@/components/faq/ToolFaq';
import { useToolJob } from '@/hooks/useToolJob';
import { wordToPdfProcessor } from '@/components/tools/processors/conversion/wordToPdfProcessor';
import { normalizeToolError } from '@/components/tools/toolError';
import { ToolPrimaryActionButton } from '@/components/tools/ToolPrimaryActionButton';
import { FileText } from 'lucide-react';

export default function WordToPdfPage() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const job = useToolJob();

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

    try {
      job.startProcessing();

      const resultBlob = await wordToPdfProcessor(selectedFiles[0], {
        onProgress: (progress) => {
          job.updateProgress(progress);
        },
      });

      const fileName = selectedFiles[0].name.replace(/\.(docx?|doc)$/i, '.pdf');
      job.completeProcessing(fileName, resultBlob);
    } catch (error) {
      job.setError(normalizeToolError(error, 'word-to-pdf', 'processing'));
    }
  };

  const handleStartOver = () => {
    setSelectedFiles([]);
    job.reset();
  };

  const faqs = [
    {
      question: 'What Word formats are supported?',
      answer: 'We support .docx (Word 2007 and later) files. Older .doc files may not work correctly.',
    },
    {
      question: 'Will my formatting be preserved?',
      answer:
        'This tool extracts text content only. Complex formatting, images, tables, and special elements may not be preserved in the PDF. For best results, use simple text documents.',
    },
    {
      question: 'What is the maximum file size?',
      answer: 'The maximum file size is 10MB for Word to PDF conversion.',
    },
    {
      question: 'Is my document secure?',
      answer:
        'Yes! All conversion happens in your browser. Your files never leave your device and are not uploaded to any server.',
    },
  ];

  const isProcessing = job.jobStatus === 'processing' || job.jobStatus === 'uploading';
  const canConvert = selectedFiles.length > 0 && job.jobStatus === 'idle';

  return (
    <>
      <Seo
        title="Word to PDF Converter"
        description="Convert Word documents to PDF online for free. Fast, secure, and works in your browser. No upload required."
      />
      <div className="container py-12">
        <div className="mx-auto max-w-4xl space-y-12">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold">Word to PDF Converter</h1>
            <p className="text-lg text-muted-foreground">
              Convert your Word documents (.docx) to PDF format instantly. All processing happens
              securely in your browser - no upload required.
            </p>
          </div>

          <ToolExperience
            onFilesSelected={handleFilesSelected}
            acceptedFileTypes=".docx,.doc"
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
            {canConvert && (
              <div className="space-y-4 rounded-lg border border-border bg-card p-6">
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">Ready to Convert</h3>
                  <p className="text-sm text-muted-foreground">
                    Click the button below to convert your Word document to PDF. Note: This tool
                    extracts text content only. Complex formatting may not be preserved.
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
