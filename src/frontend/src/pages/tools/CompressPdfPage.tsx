import { Seo } from '@/components/seo/Seo';
import { ToolExperience } from '@/components/tools/ToolExperience';
import { RelatedToolsLinks } from '@/components/seo/RelatedToolsLinks';
import { ToolFaq } from '@/components/faq/ToolFaq';
import { useToolJob } from '@/hooks/useToolJob';
import { compressPdfProcessor } from '@/components/tools/processors/pdf';

export function CompressPdfPage() {
  const { jobStatus, progress, resultFile, error, startJob } = useToolJob();

  const handleFilesSelected = async (files: File[]) => {
    const file = files[0];

    await startJob(
      async (onProgress) => {
        const resultBlob = await compressPdfProcessor(file, { onProgress });
        const outputName = file.name.replace(/\.pdf$/i, '_compressed.pdf');
        return { name: outputName, blob: resultBlob };
      },
      'compress-pdf',
      'processing'
    );
  };

  const faqItems = [
    {
      question: 'How much can I compress my PDF?',
      answer:
        'Compression results vary depending on your PDF content. PDFs with many images typically compress more than text-only documents. Some PDFs may already be optimized and show minimal size reduction.',
    },
    {
      question: 'Will compression affect PDF quality?',
      answer:
        'Our compression uses lossless optimization techniques that preserve document quality while reducing file size. Text and vector graphics remain sharp.',
    },
    {
      question: 'Is my data secure?',
      answer:
        'Yes! All processing happens securely in your browser using client-side JavaScript. Your files never leave your device or get uploaded to any server.',
    },
  ];

  return (
    <>
      <Seo
        title="Compress PDF Online - Reduce PDF File Size"
        description="Reduce your PDF file size while maintaining quality. Perfect for email attachments, web uploads, and saving storage space. All processing happens securely in your browser."
      />

      <div className="container mx-auto max-w-4xl px-4 py-8">
        <header className="mb-8 text-center">
          <h1 className="mb-4 text-4xl font-bold">Compress PDF Online</h1>
          <p className="text-lg text-muted-foreground">
            Reduce your PDF file size while maintaining quality. Perfect for email attachments, web
            uploads, and saving storage space. All processing happens securely in your browser.
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
              currentToolId="compress-pdf"
              relatedToolIds={['merge-pdf', 'split-pdf', 'resize-pdf']}
            />
          </aside>
        </div>
      </div>
    </>
  );
}

export default CompressPdfPage;
