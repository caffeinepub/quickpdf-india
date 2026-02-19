import { Seo } from '@/components/seo/Seo';
import { ToolExperience } from '@/components/tools/ToolExperience';
import { RelatedToolsLinks } from '@/components/seo/RelatedToolsLinks';
import { ToolFaq } from '@/components/faq/ToolFaq';
import { useToolJob } from '@/hooks/useToolJob';
import { useScrollToTop } from '@/hooks/useScrollToTop';
import { pdfToJpgProcessor } from '@/components/tools/processors/conversion';

export function PdfToJpgPage() {
  useScrollToTop();
  const { jobStatus, progress, resultFile, error, startJob } = useToolJob();

  const handleFilesSelected = async (files: File[]) => {
    const file = files[0];

    await startJob(
      async (onProgress) => {
        const resultBlob = await pdfToJpgProcessor(file, { onProgress });
        
        // Determine output filename based on page count
        const baseName = file.name.replace(/\.pdf$/i, '');
        
        // Check if it's a ZIP (multiple pages) or single JPG
        const isZip = resultBlob.type === 'application/zip' || resultBlob.size > file.size;
        const outputName = isZip ? `${baseName}_pages.zip` : `${baseName}.jpg`;
        
        return { name: outputName, blob: resultBlob };
      },
      'pdf-to-jpg',
      'processing'
    );
  };

  const faqItems = [
    {
      question: 'What is PDF to JPG conversion?',
      answer:
        'PDF to JPG conversion transforms each page of your PDF document into a separate JPG image file. This is useful for sharing specific pages, creating thumbnails, or using PDF content in image-based applications.',
    },
    {
      question: 'What happens to multi-page PDFs?',
      answer:
        'For PDFs with multiple pages, each page is converted to a separate JPG image. All images are packaged into a convenient ZIP file for easy download. Single-page PDFs are converted directly to a JPG file.',
    },
    {
      question: 'What quality settings are used?',
      answer:
        'We use high-quality settings (92% quality) to ensure your converted images look sharp and clear while maintaining reasonable file sizes. The conversion renders pages at 2x scale for better detail.',
    },
    {
      question: 'Is my PDF secure during conversion?',
      answer:
        'Absolutely! All conversion happens entirely in your browser using client-side JavaScript. Your PDF never leaves your device or gets uploaded to any server, ensuring complete privacy.',
    },
    {
      question: 'What file size limits apply?',
      answer:
        'PDF files up to 10MB are supported for conversion. This limit ensures smooth processing in your browser. If you need to convert larger files, try compressing your PDF first.',
    },
  ];

  return (
    <>
      <Seo
        title="Convert PDF to JPG - Free Online PDF to Image Converter"
        description="Convert PDF documents to JPG images. Each page becomes a separate high-quality image. Fast, secure, and free. All processing happens in your browser."
      />

      <div className="container mx-auto max-w-4xl px-4 py-8">
        <header className="mb-8 text-center">
          <h1 className="mb-4 text-4xl font-bold">Convert PDF to JPG</h1>
          <p className="text-lg text-muted-foreground">
            Transform your PDF pages into high-quality JPG images. Perfect for sharing, editing, or
            using in image-based applications. All processing happens securely in your browser.
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
              currentToolId="pdf-to-jpg"
              relatedToolIds={['split-pdf', 'compress-pdf', 'image-to-pdf']}
            />
          </aside>
        </div>
      </div>
    </>
  );
}

export default PdfToJpgPage;
