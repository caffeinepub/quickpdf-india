import { Seo } from '@/components/seo/Seo';
import { ToolExperience } from '@/components/tools/ToolExperience';
import { RelatedToolsLinks } from '@/components/seo/RelatedToolsLinks';
import { ToolFaq } from '@/components/faq/ToolFaq';
import { useToolJob } from '@/hooks/useToolJob';
import { useScrollToTop } from '@/hooks/useScrollToTop';
import { splitPdfProcessor } from '@/components/tools/processors/pdf';

export function SplitPdfPage() {
  useScrollToTop();
  const { jobStatus, progress, resultFile, error, startJob } = useToolJob();

  const handleFilesSelected = async (files: File[]) => {
    const file = files[0];

    await startJob(
      async (onProgress) => {
        const resultBlob = await splitPdfProcessor(file, { onProgress });
        const baseName = file.name.replace(/\.pdf$/i, '');
        return { name: `${baseName}_split.zip`, blob: resultBlob };
      },
      'split-pdf',
      'processing'
    );
  };

  const faqItems = [
    {
      question: 'How are the pages split?',
      answer:
        'Each page of your PDF is extracted into a separate PDF file. All files are packaged into a convenient ZIP archive for easy download.',
    },
    {
      question: 'What if my PDF has many pages?',
      answer:
        'The tool can handle PDFs with many pages, but processing time increases with page count. Very large PDFs (100+ pages) may take longer or require more browser memory.',
    },
    {
      question: 'Is my data secure?',
      answer:
        'Yes! All splitting happens securely in your browser using client-side JavaScript. Your files never leave your device or get uploaded to any server.',
    },
  ];

  return (
    <>
      <Seo
        title="Split PDF Online - Extract Pages from PDF"
        description="Extract pages from your PDF document. Each page becomes a separate PDF file, packaged in a ZIP archive. All processing happens securely in your browser."
      />

      <div className="container mx-auto max-w-4xl px-4 py-8">
        <header className="mb-8 text-center">
          <h1 className="mb-4 text-4xl font-bold">Split PDF Online</h1>
          <p className="text-lg text-muted-foreground">
            Extract pages from your PDF document. Each page becomes a separate PDF file, packaged
            in a ZIP archive. All processing happens securely in your browser.
          </p>
        </header>

        <ToolExperience
          onFilesSelected={handleFilesSelected}
          acceptedFileTypes=".pdf"
          maxFiles={1}
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
              currentToolId="split-pdf"
              relatedToolIds={['merge-pdf', 'compress-pdf', 'remove-pages']}
            />
          </aside>
        </div>
      </div>
    </>
  );
}

export default SplitPdfPage;
