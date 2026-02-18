import { useState } from 'react';
import { Seo } from '@/components/seo/Seo';
import { ToolExperience } from '@/components/tools/ToolExperience';
import { RelatedToolsLinks } from '@/components/seo/RelatedToolsLinks';
import { ToolFaq } from '@/components/faq/ToolFaq';
import { ToolPageShell } from '@/components/tools/ToolPageShell';
import { useToolJob } from '@/hooks/useToolJob';
import { removePagesProcessor, parsePageRanges } from '@/components/tools/processors/pdf';
import { getPdfPageCount } from '@/components/tools/processors/pdf/pdfClient';
import { normalizeToolError } from '@/components/tools/toolError';
import { RemovePagesOptions } from '@/components/tools/pdf/RemovePagesOptions';
import { ToolPrimaryActionButton } from '@/components/tools/ToolPrimaryActionButton';
import { Scissors } from 'lucide-react';

export default function RemovePagesPage() {
  const job = useToolJob();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [pageRanges, setPageRanges] = useState('');
  const [pageCount, setPageCount] = useState<number | undefined>(undefined);

  const handleFilesSelected = async (files: File[]) => {
    setSelectedFiles(files);
    setPageRanges('');
    setPageCount(undefined);
    job.reset();

    if (files.length > 0) {
      try {
        const count = await getPdfPageCount(files[0]);
        setPageCount(count);
      } catch (error) {
        console.error('Failed to get page count:', error);
        setPageCount(undefined);
      }
    }
  };

  const handleRemoveFile = () => {
    setSelectedFiles([]);
    setPageRanges('');
    setPageCount(undefined);
  };

  const handleProcess = async () => {
    if (selectedFiles.length === 0) {
      job.setError(
        normalizeToolError(
          new Error('Please select a PDF file.'),
          'remove-pages',
          'validation'
        )
      );
      return;
    }

    if (!pageRanges.trim()) {
      job.setError(
        normalizeToolError(
          new Error('Please specify which pages to remove.'),
          'remove-pages',
          'validation'
        )
      );
      return;
    }

    job.startProcessing();

    try {
      const maxPages = pageCount || 1000; // Use actual count or fallback
      const pagesToRemove = parsePageRanges(pageRanges, maxPages);

      const resultBlob = await removePagesProcessor(selectedFiles[0], {
        pagesToRemove,
        onProgress: (percentage) => job.updateProgress(percentage),
      });

      job.completeProcessing('removed-pages.pdf', resultBlob);
    } catch (error) {
      job.setError(normalizeToolError(error, 'remove-pages', 'processing'));
    }
  };

  const handleStartOver = () => {
    setSelectedFiles([]);
    setPageRanges('');
    setPageCount(undefined);
    job.reset();
  };

  const faqs = [
    {
      question: 'How do I specify which pages to remove?',
      answer:
        'Enter page numbers separated by commas (e.g., "1,3,5") or use ranges with a hyphen (e.g., "1-5,10-15"). You can combine both formats.',
    },
    {
      question: 'Can I remove multiple page ranges?',
      answer:
        'Yes! You can specify multiple ranges and individual pages. For example, "1-3,7,10-12" will remove pages 1, 2, 3, 7, 10, 11, and 12.',
    },
    {
      question: 'What happens to the remaining pages?',
      answer:
        'All pages not specified for removal are kept in their original order. The resulting PDF will contain only the pages you want to keep, maintaining their sequence.',
    },
  ];

  return (
    <>
      <Seo
        title="Remove PDF Pages Online"
        description="Delete unwanted pages from your PDF. Fast, secure, and free. No registration required."
      />
      <ToolPageShell
        title="Remove PDF Pages Online"
        description="Delete unwanted pages from your PDF document. Specify page numbers or ranges to remove. All processing happens securely in your browser."
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
            <div className="space-y-4">
              <RemovePagesOptions
                value={pageRanges}
                onChange={setPageRanges}
                totalPages={pageCount}
              />
              <ToolPrimaryActionButton
                onClick={handleProcess}
                icon={Scissors}
                disabled={!pageRanges.trim()}
                className="w-full"
              >
                Remove Pages
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
              currentToolId="remove-pages"
              relatedToolIds={['split-pdf', 'merge-pdf', 'compress-pdf']}
            />
          </div>
        </div>
      </ToolPageShell>
    </>
  );
}
