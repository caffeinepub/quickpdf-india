import { Seo } from '@/components/seo/Seo';
import { ToolExperience } from '@/components/tools/ToolExperience';
import { RelatedToolsLinks } from '@/components/seo/RelatedToolsLinks';
import { ToolFaq } from '@/components/faq/ToolFaq';
import { useToolJob } from '@/hooks/useToolJob';
import { mergePdfProcessor } from '@/components/tools/processors/pdf';

export function MergePdfPage() {
  const { jobStatus, progress, resultFile, error, startJob } = useToolJob();

  const handleFilesSelected = async (files: File[]) => {
    await startJob(
      async (onProgress) => {
        const resultBlob = await mergePdfProcessor(files, { onProgress });
        return { name: 'merged.pdf', blob: resultBlob };
      },
      'merge-pdf',
      'processing'
    );
  };

  const faqItems = [
    {
      question: 'How many PDFs can I merge at once?',
      answer:
        'You can merge multiple PDF files in a single operation. The combined file size should stay within browser memory limits (typically under 100MB total).',
    },
    {
      question: 'Will the page order be preserved?',
      answer:
        'Yes, pages are merged in the order you select the files. The first file you select will appear first in the merged PDF, followed by the second file, and so on.',
    },
    {
      question: 'Is my data secure?',
      answer:
        'Absolutely! All merging happens securely in your browser using client-side JavaScript. Your files never leave your device or get uploaded to any server.',
    },
  ];

  return (
    <>
      <Seo
        title="Merge PDF Files Online - Combine Multiple PDFs"
        description="Combine multiple PDF files into one document. Simple, fast, and secure. All processing happens in your browser - no uploads required."
      />

      <div className="container mx-auto max-w-4xl px-4 py-8">
        <header className="mb-8 text-center">
          <h1 className="mb-4 text-4xl font-bold">Merge PDF Files Online</h1>
          <p className="text-lg text-muted-foreground">
            Combine multiple PDF files into one document. Simple, fast, and secure. All processing
            happens in your browser - no uploads required.
          </p>
        </header>

        <ToolExperience
          onFilesSelected={handleFilesSelected}
          acceptedFileTypes=".pdf"
          maxFiles={10}
          jobStatus={jobStatus}
          progress={progress}
          resultFile={resultFile}
          error={error}
        />

        <div className="mt-12 grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <ToolFaq faqs={faqItems} />
          </div>
          <aside>
            <RelatedToolsLinks
              currentToolId="merge-pdf"
              relatedToolIds={['split-pdf', 'compress-pdf', 'resize-pdf']}
            />
          </aside>
        </div>
      </div>
    </>
  );
}

export default MergePdfPage;
